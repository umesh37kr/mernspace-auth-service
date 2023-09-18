import app from './app';
import { Config } from './config/index';
import logger from './config/logger';
const PORT = Config.PORT;

const startServer = () => {
    try {
        app.listen(PORT, () => {
            logger.info(`server is listeing on port ${PORT}`);
        });
    } catch (error) {
        logger.error(error);
        process.exit(1);
    }
};

startServer();
