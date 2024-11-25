import fastify from 'fastify';
import { serializerCompiler, validatorCompiler, type ZodTypeProvider } from "fastify-type-provider-zod";
import { createGoalRoute } from './routes/create-goal';
import { createCompletionRoute } from './routes/create-completion';
import { getPendingGoalsRoute } from './routes/get-pending-goals';
import { getWeekSummaryRoute } from './routes/get-week-summary';
import fastifyCors from '@fastify/cors';
import { createUserRoute } from './routes/create-user';
import { getAllUsers, login, } from './routes/get-users';
import { protectedRoute } from './routes/authenticate';
import { deleteGoalRoute } from './routes/delete-goal';

const app = fastify().withTypeProvider<ZodTypeProvider>()

app.register(fastifyCors, {
    origin: '*',
    methods: ['GET', 'POST', 'DELETE'],
});

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(createGoalRoute)
app.register(createCompletionRoute)
app.register(getPendingGoalsRoute)
app.register(getWeekSummaryRoute)
app.register(createUserRoute)
app.register(getAllUsers)
app.register(login)
app.register(protectedRoute)
app.register(deleteGoalRoute)

app.listen({
    port: 3333,
}).then(() => {
    console.log("HTTP server running on port 3333")
    console.log("Ctrl+C to stop")
})