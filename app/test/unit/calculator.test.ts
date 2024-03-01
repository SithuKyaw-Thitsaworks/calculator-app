import { Calculator } from '../../src/calculator';
import { JsonRepo } from '../../src/repository/json_repo';
import fs from 'fs';

// Mocking fs module
jest.mock('fs');


describe('Calculator', () => {
    let calculator: Calculator;

    beforeEach(() => {
        jest.spyOn(fs, 'readFileSync').mockReturnValue(JSON.stringify([
            { id: "1", name: "Red set", price: 50, isDiscountedItem: false },
            { id: "2", name: "Green set", price: 40, isDiscountedItem: true },
            { id: "3", name: "Blue set", price: 30, isDiscountedItem: false },
            { id: "4", name: "Yellow set", price: 50, isDiscountedItem: false },
            { id: "5", name: "Pink set", price: 80, isDiscountedItem: true },
            { id: "6", name: "Purple set", price: 90, isDiscountedItem: false },
            { id: "7", name: "Orange set", price: 120, isDiscountedItem: true }
        ]));

        const dbRepo = new JsonRepo('fake_path.json');
        const discountEligibleQuantity = 2;
        const discountEligiblePercentage = 5;
        const discountEligiblePercentageForMember = 10;

        calculator = new Calculator(
            dbRepo,
            discountEligibleQuantity,
            discountEligiblePercentage, 
            discountEligiblePercentageForMember
        );
    });

    afterEach(()=> {
        jest.resetAllMocks();
    })

    it('Total price should be (90) when a customer without the member card and ordered 1 Red set and 1 Green set.', async () => {
        const orderItems = [{ itemid: "1", qty: 1 }, { itemid: "2", qty: 1 }];
        const hasMemberCard = false;
        const totalPrice = await calculator.calculateTotalPrice(orderItems, hasMemberCard);
        expect(totalPrice).toEqual(90);
    });

    it('Total price should be (81) when a customer with the member card and ordered 1 Red set and 1 Green set.', async () => {
        const orderItems = [{ itemid: "1", qty: 1 }, { itemid: "2", qty: 1 }];
        const hasMemberCard = true;
        const totalPrice = await calculator.calculateTotalPrice(orderItems, hasMemberCard);
        expect(totalPrice).toEqual(81);
    });

    it('Total price should be (576) when a customer without the member card ordered 5 Orange sets.', async () => {
        const orderItems = [{ itemid: "7", qty: 5 }];
        const hasMemberCard = false;
        const totalPrice = await calculator.calculateTotalPrice(orderItems, hasMemberCard);
        expect(totalPrice).toEqual(576);
    });

    it('Total price should be (518.4) when a customer with the member card ordered 5 Orange sets.', async () => {
        const orderItems = [{ itemid: "7", qty: 5 }];
        const hasMemberCard = true;
        const totalPrice = await calculator.calculateTotalPrice(orderItems, hasMemberCard);
        expect(totalPrice).toEqual(518.4);
    });

    it('Total price should be (266) when a customer without the member card ordered 3 Red sets and 3 Green sets.', async () => {
        const orderItems = [{ itemid: "1", qty: 3 }, { itemid: "2", qty: 3 }];
        const hasMemberCard = false;
        const totalPrice = await calculator.calculateTotalPrice(orderItems, hasMemberCard);
        expect(totalPrice).toEqual(266);
    });

    it('Total price should be (239.4) when a customer with the member card ordered 3 Red sets and 3 Green sets.', async () => {
        const orderItems = [{ itemid: "1", qty: 3 }, { itemid: "2", qty: 3 }];
        const hasMemberCard = true;
        const totalPrice = await calculator.calculateTotalPrice(orderItems, hasMemberCard);
        expect(totalPrice).toEqual(239.4);
    });
});
