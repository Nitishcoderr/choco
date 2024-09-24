import { z } from "zod";

export const orderStateSchema  = z.object({
    orderId: z.number({message: "Order id should be a number"}),
    status: z.enum(["received", "paid", "reserved", "completed"], {
        message: "Status should be one of 'received', 'paid', 'reserved', 'completed'",
      }),
})