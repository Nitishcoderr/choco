import { db } from "@/lib/db/db";
import { warehouses } from "@/lib/db/schema";
import { warehouseSchema } from "@/lib/validators/warehouseSchema";

export async function POST(request:Request){
    // TODO Auth check
    const requestData = await request.json();
    
    let validateData;
    try {
        validateData = await warehouseSchema.parse(requestData)
        
    } catch (error) {
        return Response.json({message:error},{status:400})
    }

    try {
        await db.insert(warehouses).values(validateData)
        return Response.json({message:"OK"},{status:201})
    } catch (error) {
        return Response.json({message:"Failed to store the warehouse"},{status:400})
    }

}

export async function GET(request:Request){
    try {
        const allWarehouses = await db.select().from(warehouses);
        return Response.json(allWarehouses);
    } catch (error) {
        return Response.json({message:"Failed to fetch all warehouse"},{status:500})
    }
}