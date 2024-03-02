import express from 'express';
import { Routes } from './routes';
import { Calculator } from './calculator';
import path from 'path';
import { JsonRepo } from './repository/json_repo';

const DISCOUNT_ELIGIBLE_QUANTITY = 2;
const DISCOUNT_ELIGIBLE_PERCENTAGE = 5;
const DISCOUNT_ELIGIBLE_PERCENTAGE_FOR_MEMBER = 10;
const DB_PATH = path.join(__dirname, '/repository/items.json');

export class Service {

    static async start() {
        this.startExpressServer();
    }

    static startExpressServer(): Promise<void> {
        return new Promise(resolve => {
            try {

                const dbRepo = new JsonRepo(DB_PATH);

                const calculator = new Calculator(dbRepo, DISCOUNT_ELIGIBLE_QUANTITY,
                    DISCOUNT_ELIGIBLE_PERCENTAGE,
                    DISCOUNT_ELIGIBLE_PERCENTAGE_FOR_MEMBER);

                const app = express();
                app.use(express.json());
                app.use(express.urlencoded({ extended: true }));

                const routes = new Routes(calculator);
                app.use(express.static(path.join(__dirname, 'public')));
                app.use('/', routes.Router);

                const PORT = process.env.PORT ?? 12000;
                app.listen(PORT, () => {
                    console.log(`Server is running on port http://localhost:${PORT}/`);
                    resolve();
                });
            }
            catch (error: any) {
                throw error;
            }

        })
    }
}