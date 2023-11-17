import app from './app';
import { AppDataSource } from './config/data-source';
import { Config } from './config/index';
import logger from './config/logger';
const PORT = Config.PORT;

const startServer = async () => {
    try {
        await AppDataSource.initialize();
        logger.info('Database connected successfully');
        app.listen(PORT, () => {
            logger.info(`server is listeing on port ${PORT}`);
        });
    } catch (error) {
        logger.error(error);
        process.exit(1);
    }
};

void startServer();
