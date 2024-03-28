import 'reflect-metadata';
import express, { RequestHandler } from 'express';
import authRouter from './routes/auth';
import cookieParser from 'cookie-parser';
import tenantsRouter from './routes/tenants';
import userRouter from './routes/user';
import cors from 'cors';
import { globalErrorHandler } from './middlewares/globalErrorHandler';
const app = express();

app.use(
    cors({
        origin: ['http://localhost:5173'],
        credentials: true,
    }),
);
app.use(express.static('public'));
app.use(cookieParser());
app.use(express.json());
app.get('/', (async (req, res) => {
    res.send('app is working ..');
}) as RequestHandler);

app.use('/auth', authRouter);
app.use('/tenants', tenantsRouter);
app.use('/users', userRouter);
app.use(globalErrorHandler);

export default app;
