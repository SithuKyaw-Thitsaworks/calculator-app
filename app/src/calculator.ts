import { JsonRepo } from "./repository/json_repo";
import { ICalculator } from "./types/interfaces/ICalculator";
import { Item } from "./types/Item";
import { OrderItem } from "./types/OrderItem";

export class Calculator implements ICalculator {
    private _discountEligibleQuantity: number;
    private _discountEligiblePercentage: number;
    private _discountEligiblePercentageForMember: number;

    private _dbItems: Item[];
    private _totalPrice: number;
    private _dbRepo : JsonRepo;

    constructor(
        dbRepo: JsonRepo,
        discountEligibleQuantity: number,
        discountEligiblePercentage: number,
        discountEligiblePercentageForMember: number) {

        this._discountEligibleQuantity = discountEligibleQuantity;
        this._discountEligiblePercentage = discountEligiblePercentage;
        this._discountEligiblePercentageForMember = discountEligiblePercentageForMember;
        this._dbRepo = dbRepo;
        this._dbItems = [];
        this._totalPrice = 0;

        this.init();
        
    }

    async init():Promise<void>{
        this._dbItems = await this._dbRepo.getAllItems();
    }

    async calculateTotalPrice(orderItems: OrderItem[], hasMemberCard: boolean = false): Promise<number> {
        try {
            this._totalPrice = 0;

            orderItems.forEach((orderItem) => {
                const matchedItem = this._dbItems.find(item => item.id === orderItem.itemid);
                if (matchedItem) {
                    const itemPrice = matchedItem.price;

                    if (matchedItem.isDiscountedItem && orderItem.qty >= this._discountEligibleQuantity) {
                        const totalBundles = Math.floor(orderItem.qty / 2);
                        const totalBundledItemsPrice = (totalBundles * itemPrice) * 2;
                        const remainingItemPrice = (orderItem.qty % 2) * matchedItem.price;
                        const discountAmount = (totalBundledItemsPrice * this._discountEligiblePercentage) / 100;
                        this._totalPrice += (totalBundledItemsPrice + remainingItemPrice) - discountAmount;
                    } else {
                        this._totalPrice += orderItem.qty * itemPrice;
                    }
                }
            });

            if (hasMemberCard) {
                this._totalPrice = this._totalPrice - (this._totalPrice * this._discountEligiblePercentageForMember) / 100;
            }

            return this._totalPrice;
        } catch (error) {
            console.error("Error occurred while calculating the total price:", error);
            throw new Error("Error occurred while calculating the total price.");
        }
    }
}