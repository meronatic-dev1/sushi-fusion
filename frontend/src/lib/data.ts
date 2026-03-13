export interface Product {
    id?: string | number;
    name: string;
    desc: string;
    price: number;
    oldPrice?: number;
    emoji: string;
    tag?: string;
    vip?: boolean;
    imgSrc?: string;
    dietary?: string[];
    allergens?: string[];
}

export const MENU: { [key: string]: Product[] } = {};
export const CATEGORIES: { id: string; name: string; icon: string }[] = [];

export const DELIVERY_FEE = 15;
