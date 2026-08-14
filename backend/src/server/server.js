// here we will start our server

import app from './index.js';
import config from '../config/config.js';
import { connectDB } from '../database/connection.js';

const PORT = config.PORT || 5000;

const startServer = async () => {
    try {
        await connectDB();
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Failed to start server:", error);
        throw error;
    }
};

startServer();