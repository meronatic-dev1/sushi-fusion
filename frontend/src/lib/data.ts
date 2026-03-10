export interface Product {
    name: string;
    desc: string;
    price: number;
    oldPrice?: number;
    emoji: string;
    tag?: string;
    vip?: boolean;
    imgSrc?: string;
}

export const MENU: { [key: string]: Product[] } = {};

export const CATEGORIES: { id: string; name: string; icon: string }[] = [];
