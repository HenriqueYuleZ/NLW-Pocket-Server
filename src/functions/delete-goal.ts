import { and, eq } from "drizzle-orm";
import { db } from "../db";
import { goalCompletions, goals, users } from "../db/schema";

export async function deleteGoal(goalId: string, userId: string) {

    const goalExists = await db.select().from(goals).where(and(
        eq(goals.id, goalId),
        eq(goals.userId, userId)
    )).limit(1)

    if (goalExists.length === 0) {
        throw new Error('Goal not found')
    }

    const goalCompletion = await db.delete(goalCompletions).where(and(
        eq(goalCompletions.goalId, goalId),
        eq(goalCompletions.userId, userId)
    )).returning()

    const result = await db.delete(goals).where(eq(goals.id, goalId)).returning()

    const goal = result

    return {
        goal
    }
}