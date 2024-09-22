import {  InventoryData, OrderData } from "@/types";
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

export const getAllDeliveryPerson = async()=>{
  try {
    const response =  await api.get('/delivery-persons');
    console.log(response.data);
    return response.data;
  } catch (error) {
   console.log(error);
  }
 }


 export const createDeliveryPerson = async (data: { name: string; phone: string,warehouseId:number })=>{
  const response = await api.post('/delivery-persons',data);
  return response.data;
}


export const getAllInventories = async()=>{
  try {
    const response =  await api.get('/inventories');
    console.log(response.data);
    return response.data;
  } catch (error) {
   console.log(error);
  }
 }

 export const createInventory = async (data: InventoryData)=>{
  const response = await api.post('/inventories',data);
  return response.data;
}


export const getSingleProduct = async(id:string)=>{
  try {
    const response =  await api.get(`/products/${id}`);
    console.log(response.data);
    return response.data;
  } catch (error) {
   console.log(error);
  }
 }

 export const placeOrder = async (data:OrderData)=>{
  const response = await api.post(`/orders`,data);
  return response.data;
}