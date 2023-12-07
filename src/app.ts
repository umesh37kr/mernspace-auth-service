import 'reflect-metadata';
import express, { Request, Response, NextFunction } from 'express';
import logger from './config/logger';
import { HttpError } from 'http-errors';
import authRouter from './routes/auth';
import cookieParser from 'cookie-parser';

const app = express();
app.use(express.static('public'));
app.use(cookieParser());
app.use(express.json());
app.get('/', async (req, res) => {
    res.send('app is working ..');
});

app.use('/auth', authRouter);
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
