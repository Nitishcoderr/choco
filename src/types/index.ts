export interface Product {
    id:number,
    name: string,
    description:string,
    image:string,
    price: number,
}

export interface WareHouse{
    id:number,
    name: string,
    pincode:string
}


export interface DeliveryPersons{
    id:number,
    name: string,
    phone:string,
    warehouse:string
}


export interface Inventory{
    id:number,
    sku: string,
    warehouse:string,
    product:string
}

export interface InventoryData{
    sku: string,
    warehouseId:number,
    productId:number
}


    export interface OrderData{
        productId: number,
        qty:number,
        pincode:string,
        address:String
    }


    export interface RazorpayOptions {
        key: string;
        amount: number;
        currency: string;
        name: string;
        description: string;
        order_id: string;
        handler: (response: { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string }) => void;
        prefill: { name: string; email: string; contact: string };
        theme: { color: string };
      }