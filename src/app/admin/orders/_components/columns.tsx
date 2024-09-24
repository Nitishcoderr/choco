'use client';

import {  Order } from '@/types'
import {ColumnDef} from '@tanstack/react-table'
import StatusBadge from './status-badge';
import StatusChanger from './status-changer';

export const columns:ColumnDef<Order>[] = [
    {
        accessorKey: 'product',
        header: 'Product Name',
    },
    {
        accessorKey: 'qty',
        header: 'Qty',
    },
    {
        accessorKey: 'user',
        header: 'Customer Name',
    },
    {
        accessorKey: 'type',
        header: 'Order Type',
    },
    {
        accessorKey: 'address',
        header: 'Address',
    },
    {
        accessorKey: 'order_id',
        header: 'Order Id',
    },
    {
        id:"status",
        header:"Status",
        cell: ({ row }) => {
          {
            return <StatusBadge status={row.original.status} />
          }
        }
      },
    {
      id:"status",
      header:"Action",
      cell: ({ row }) => {
        {
          return <StatusChanger orderId={row.original.id} currentStatus={row.original.status} />
        }
      }
    },
]

