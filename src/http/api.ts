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

export const createProduct = async (data:FormData)=>{
  const response = await api.post('products',data,{
    headers:{
      "Content-Type":'multipart/form-data'
    }
  });
  return response.data;
}


export const getAllWarehouses = async()=>{
 try {
   const response =  await api.get('/warehouses');
   console.log(response.data);
   return response.data;
 } catch (error) {
  console.log(error);
 }
}


export const createWarehouses = async (data: { name: string; pincode: string })=>{
  const response = await api.post('/warehouses',data);
  return response.data;
}