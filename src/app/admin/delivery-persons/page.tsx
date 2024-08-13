'use client'

import { Button } from '@/components/ui/button'
import React from 'react'
import { columns } from './columns'
import { getAllDeliveryPerson } from '@/http/api'
import { useQuery } from '@tanstack/react-query';
import  { DeliveryPersons } from '@/types' 
import { Loader2 } from 'lucide-react';
import { useNewDeliveryPerson } from '@/store/deliveryPerson/deliveryPersonStore';
import { DataTable } from '../products/data-table'
import DeliveryPersonSheets from './deliveryPersonSheet'



const DeliveryPerson = () => {
    const {onOpen} =useNewDeliveryPerson()
    const {data:DeliveryPerson,isError,isLoading} = useQuery<DeliveryPersons[]>({
      queryKey:["delivery-persons"],
      queryFn:getAllDeliveryPerson,
    })
  
  return (
    <>
    <div className='flex items-center justify-between'>
      <h3 className='text-2xl  font-bold tracking-tight'>
        Delivery Person
      </h3>
      <Button onClick={onOpen} size={'sm'}>Add Delivery Person</Button>
      <DeliveryPersonSheets/>
    </div> 

    {isError && (<span className='text-red-500'>
      Something went wrong.
    </span>)}

    {
        isLoading ?( <div className='flex items-center justify-center'>
          <Loader2 className='size-10 animate-spin'/>
        </div> ): (<DataTable columns={columns} data={DeliveryPerson || []} />)
      }
    </>
  )
}

export default DeliveryPerson
