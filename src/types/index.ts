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