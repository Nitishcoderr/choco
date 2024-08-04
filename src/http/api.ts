import { api } from "./client";

export const getAllProducts = async()=>{
   try {
     const response = await api.get('/products');
     console.log(response.data);
     return response.data;
   } catch (error) {
        console.log(error);
        
   }
    
    
}