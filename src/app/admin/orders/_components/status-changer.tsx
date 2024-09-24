import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { changeOrderStatus } from '@/http/api';
import { OrderStatusData } from '@/types';
import { SelectValue } from '@radix-ui/react-select';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import React from 'react'
type CustomError = {
  message: string;
};

const StatusChanger = ({orderId,currentStatus}:{orderId:number;currentStatus:string}) => {
  const {toast} = useToast();
  const queryClient = useQueryClient()
  const {mutate} = useMutation({
    mutationKey: ['order-status'],
    mutationFn:(data:OrderStatusData)=>{
      return changeOrderStatus(data)
    },
    onSuccess:()=>{
      queryClient.invalidateQueries({queryKey:['orders']})
      toast({
        title: "Status changed successfully",
        color: 'green',
    });
    },
    onError: (err: AxiosError) => {
      if (err.response?.data) {
          const customErr = err.response.data as CustomError;
          console.error(customErr.message);
          toast({
              title: customErr.message,
              color: 'red',
          });
      } else {
          console.error(err);
          toast({ title: 'Unknown error' });
      }
  },
  })
  return (
    <Select defaultValue={currentStatus} onValueChange={(value)=>{
      mutate({orderId,status:value})
    }} >
      <SelectTrigger>
        <SelectValue placeholder={currentStatus} ></SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value='received'>Received</SelectItem>
        <SelectItem value='reserved'>Reserved</SelectItem>
        <SelectItem value='paid'>Paid</SelectItem>
        <SelectItem value='completed'>Completed</SelectItem>
      </SelectContent>
    </Select>
  )
}

export default StatusChanger
