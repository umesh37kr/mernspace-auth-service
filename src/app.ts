import 'reflect-metadata';
import express, {
    Request,
    Response,
    NextFunction,
    RequestHandler,
} from 'express';
import logger from './config/logger';
import { HttpError } from 'http-errors';
import authRouter from './routes/auth';
import cookieParser from 'cookie-parser';
import tenantsRouter from './routes/tenants';
import userRouter from './routes/user';
import cors from 'cors';
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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: HttpError, req: Request, res: Response, next: NextFunction) => {
    logger.error(err.message);
    const statusCode = err.statusCode || err.status || 500;
    res.status(statusCode).json({
        errors: [
            {
                statusCode: statusCode,
                type: err.name,
                message: err.message,
                path: '',
                location: '',
            },
        ],
    });
});
export default app;
