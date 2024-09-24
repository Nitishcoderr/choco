import { db } from "@/lib/db/db";
import { orders } from "@/lib/db/schema";
import { orderStateSchema } from "@/lib/validators/orderStatusSchema";
import { eq } from "drizzle-orm";

export async function PATCH(request:Request){
    // TODO verify if user is admin
    // validate request
    const requestData = await request.json()
    let validatedData;
    try {
        validatedData = orderStateSchema.parse(requestData)
    } catch (error) {
        return Response.json({message:error},{status:400})
    }
    // update the order
    try {
        await db.update(orders).set({status:validatedData.status}).where(eq(orders.id,validatedData.orderId));

        return Response.json({message:validatedData.status},{status:200})
    } catch (error) {
        return Response.json({message:"Failed to update the order"},{status:500})
    }
    // return response
}