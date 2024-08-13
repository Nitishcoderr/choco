'use client';

import { Button } from '@/components/ui/button';
import React from 'react';
import { columns } from './_components/columns';
import { getAllInventories } from '@/http/api';
import { useQuery } from '@tanstack/react-query';
import {  Inventory } from '@/types';
import { Loader2 } from 'lucide-react';
import { DataTable } from '../_components/data-table';
import { useNewInventory } from '@/store/inventory/inventory-store';
import InventorySheets from './_components/inventory-sheet';

const InventoriesPage = () => {
  const { onOpen } = useNewInventory();
  const {
    data: inventories,
    isError,
    isLoading,
  } = useQuery<Inventory[]>({
    queryKey: ['inventories'],
    queryFn: getAllInventories,
  });

  return (
    <>
      <div className="flex items-center justify-between">
        <h3 className="text-2xl  font-bold tracking-tight">Inventories</h3>
        <Button
          onClick={onOpen}
          size={'sm'}>
          Add Inventory
        </Button>
        <InventorySheets />
      </div>

      {isError && <span className="text-red-500">Something went wrong.</span>}

      {isLoading ? (
        <div className="flex items-center justify-center">
          <Loader2 className="size-10 animate-spin" />
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={inventories || []}
        />
      )}
    </>
  );
};

export default InventoriesPage;
