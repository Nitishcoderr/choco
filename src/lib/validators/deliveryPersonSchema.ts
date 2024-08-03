import { z } from "zod";

export const deliveryPersonSchema  = z.object({
    name: z.string({message: "Delivery Person name should be a string"}),
    phone:z.string({message: "Delivery person Phone should be a 13 char long"}).length(13),
    warehouseId:z.number({message: "Warehouse id should be a number"}),
})