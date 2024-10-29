import { count, and, gte, lte, eq, sql } from "drizzle-orm";
import { db } from "../db";
import { goalCompletions, goals } from "../db/schema";
import dayjs from "dayjs";

interface CreateGoalCompletionRequest {
	goalId: string;
	userId: string;
}

export async function CreateGoalCompletion({ goalId, userId }: CreateGoalCompletionRequest) {

	const firstDayOfWeek = dayjs().startOf('week').toDate();
	const lastDayOfWeek = dayjs().endOf('week').toDate();

	const goalCompletionCounts = db.$with('goal_completion_counts').as(
		db.select({
			goalId: goalCompletions.goalId,
			completionCount: count(goalCompletions.id).as('completionCount'),
		})
			.from(goalCompletions)
			.where(and(
				eq(goalCompletions.userId, userId),
				gte(goalCompletions.createdAt, firstDayOfWeek),
				lte(goalCompletions.createdAt, lastDayOfWeek),
				eq(goalCompletions.goalId, goalId)
			))
			.groupBy(goalCompletions.goalId)
	)

	const result = await db.with(goalCompletionCounts)
		.select({
			desiredWeeklyFrequency: goals.desiredWeeklyFrequency,
			completionCount: sql/*sql*/`
					COALESCE(${goalCompletionCounts.completionCount}, 0)
			`.mapWith(Number), // convertendo para número e 0 em vez de null
		})
		.from(goals)
		.leftJoin(goalCompletionCounts, eq(goalCompletionCounts.goalId, goals.id))
		.where(and(eq(goals.id, goalId), eq(goals.userId, userId)))
		.limit(1)

	const { completionCount, desiredWeeklyFrequency } = result[0]

	if (completionCount >= desiredWeeklyFrequency) {
		throw new Error('Goal already completed this week!')
	}

	const insertResult = await db
		.insert(goalCompletions)
		.values({ goalId, userId })
		.returning()
	const goalCompletion = insertResult[0]

	return {
		goalCompletion,
	}
}