import app from './app';
import { Config } from './config/index';
const PORT = Config.PORT;

const startServer = () => {
    try {
        app.listen(PORT, () => {
            // eslint-disable-next-line no-console
            console.log(`server is listeing on ${PORT}`);
        });
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
        process.exit(1);
    }
};

startServer();
