import express from 'express';
import { Calculator } from './calculator';
import { OrderItem } from './types/OrderItem';

export class Routes {
    private _router = express.Router();
    private _calculator: Calculator;

    constructor(
        calculator: Calculator
    ) {
        this._calculator = calculator;
        this._router.post("/calculateTotalPrice", this._handleTotalPriceRequest.bind(this));
    }

    private _handleTotalPriceRequest(req: express.Request, res: express.Response): void {
        const hasMemberCard = req.body.hasMemberCard as boolean;
        const orderItems = req.body.orderItems as OrderItem[];

        if (typeof hasMemberCard !== 'boolean' || !Array.isArray(orderItems)) {
            res.status(400).json({ error: 'Invalid input data' });
            return;
        }

        this._calculator.calculateTotalPrice(orderItems, hasMemberCard)
            .then(totalPrice => {
                res.send({ totalPrice });
            })
            .catch(error => {
                res.status(500).json({ error: error.message || 'Internal server error' });
            });
    }

    get Router(): express.Router {
        return this._router;
    }

}



