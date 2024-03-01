import { OrderItem } from "../OrderItem";

export interface ICalculator {
    init():Promise<void>;
    calculateTotalPrice(orderItems:OrderItem[], hasMemberCard: boolean): Promise<number>;
}