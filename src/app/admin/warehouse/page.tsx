'use client'

import { Button } from '@/components/ui/button'
import { getAllWarehouses } from '@/http/api';
import { useNewWarehouses } from '@/store/warehouse/warehouse-store';
import { WareHouse } from '@/types';
import { useQuery } from '@tanstack/react-query';
import WareHousesSheets from './warehouses-sheets';
import { Loader2 } from 'lucide-react';
import { DataTable } from './data-table';
import { columns } from './columns'



const WarehousesPage = () => {
  const {onOpen} =useNewWarehouses()
  const {data:WareHouse,isError,isLoading} = useQuery<WareHouse[]>({
    queryKey:["warehouses"],
    queryFn:getAllWarehouses,
  })

  return (
    <>
        <div className='flex items-center justify-between'>
      <h3 className='text-2xl  font-bold tracking-tight'>
        Warehouses
      </h3>
      <Button onClick={onOpen} size={'sm'}>Add Warehouse</Button>
      <WareHousesSheets/>
    </div> 
    {isError && (<span className='text-red-500'>
      Something went wrong.
    </span>)}
    {
        isLoading ?( <div className='flex items-center justify-center'>
          <Loader2 className='size-10 animate-spin'/>
        </div> ): (<DataTable columns={columns} data={WareHouse || []} />)
      }
    </>
  )
}

export default WarehousesPage
