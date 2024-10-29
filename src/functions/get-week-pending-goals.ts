import dayjs from "dayjs";
import { db } from "../db";
import { goalCompletions, goals } from "../db/schema";
import { and, count, eq, gte, lte, sql } from "drizzle-orm";

interface GetWeekPendingGoalsRequest {
    userId: string;
}

export async function getWeekPendingGoals({ userId }: GetWeekPendingGoalsRequest) {
    const firstDayOfWeek = dayjs().startOf('week').toDate();
    const lastDayOfWeek = dayjs().endOf('week').toDate();

    const goalsCreatedUpToWeek = db.$with('goals_created_up_to_week').as(
        db.select({
            id: goals.id,
            userId: goals.userId,
            title: goals.title,
            desiredWeeklyFrequency: goals.desiredWeeklyFrequency,
            createdAt: goals.createdAt,
        })
            .from(goals)
            .where(and(lte(goals.createdAt, lastDayOfWeek), eq(goals.userId, userId)))
    );

    const goalCompletionCounts = db.$with('goal_completion_counts').as(
        db.select({
            goalId: goalCompletions.goalId,
            completionCount: count(goalCompletions.id).as('completionCount'),
        })
            .from(goalCompletions)
            .where(and(
                gte(goalCompletions.createdAt, firstDayOfWeek),
                lte(goalCompletions.createdAt, lastDayOfWeek),
                eq(goalCompletions.userId, userId)
            ))
            .groupBy(goalCompletions.goalId)
    )

    const pendingGoals = await db
        .with(goalsCreatedUpToWeek, goalCompletionCounts)
        .select({
            id: goalsCreatedUpToWeek.id,
            userId: goalsCreatedUpToWeek.userId,
            title: goalsCreatedUpToWeek.title,
            desiredWeeklyFrequency: goalsCreatedUpToWeek.desiredWeeklyFrequency,
            completitionCount: sql/*sql*/`
                COALESCE(${goalCompletionCounts.completionCount}, 0)
            `.mapWith(Number), // convertendo para número e 0 em vez de null
        })
        .from(goalsCreatedUpToWeek)
        .leftJoin(goalCompletionCounts, eq(goalCompletionCounts.goalId, goalsCreatedUpToWeek.id))

    return {
        pendingGoals: { pendingGoals }
    }
}