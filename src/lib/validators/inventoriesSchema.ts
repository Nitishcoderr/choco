import { z } from "zod";

export const inventorySchema  = z.object({
    sku: z.string({message: "Sku should be a string"}).length(8,"SKU should be 8 char long"),
    warehouseId:z.number({message: "Warehouse id should be a number"}),
    productId:z.number({message: "Product id should be a number"}),
})