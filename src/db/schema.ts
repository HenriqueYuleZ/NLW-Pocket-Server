import { pgTable, text, integer, timestamp } from 'drizzle-orm/pg-core'
import { createId } from '@paralleldrive/cuid2'

export const goals = pgTable('goals', {
    id: text('id').primaryKey().$defaultFn(() => createId()),
    userId: text('user_id').notNull().references(() => users.id),
    title: text('title').notNull(),
    desiredWeeklyFrequency: integer('desired_weekly_frequency').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow().$defaultFn(() => new Date(Date.now())),
})

export const goalCompletions = pgTable('goal_completions', {
    id: text('id').primaryKey().$defaultFn(() => createId()),
    userId: text('user_id').notNull().references(() => users.id),
    goalId: text('goal_id').notNull().references(() => goals.id),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow().$defaultFn(() => new Date(Date.now())),
})

export const users = pgTable('users', {
    id: text('id').primaryKey().$defaultFn(() => createId()),
    username: text('username').notNull(),
    password: text('password').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow().$defaultFn(() => new Date(Date.now())),
})