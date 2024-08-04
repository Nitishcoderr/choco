import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import Sidebar from './_components/sidebar';
import React from 'react';
import {
  Blocks,
  HomeIcon,
  Layers,
  ShoppingCart,
  Users,
  Warehouse,
  CircleUser,
  Menu,
} from 'lucide-react';

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const navItems = [
    { label: 'Dashboard', href: '/admin', icon: HomeIcon },
    { label: 'Products', href: '/admin/products', icon: Layers },
    { label: 'Warehouses', href: '/admin/warehouse', icon: Warehouse },
    { label: 'Delivery Persons', href: '/admin/delivery-persons', icon: Users },
    { label: 'Orders', href: '/admin/orders', icon: ShoppingCart },
    { label: 'Inventories', href: '/admin/inventories', icon: Blocks },
  ];
  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <Sidebar />
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="flex flex-col">
              <nav className="grid gap-2 text-lg font-medium">
                {navItems.map((item) => (
                  <Link
                    href={item.href}
                    className="flex items-center gap-2 text-lg font-semibold">
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
          <div className="w-full flex-1">
            <Badge variant="outline">Admin</Badge>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="secondary"
                size="icon"
                className="rounded-full">
                <CircleUser className="h-5 w-5" />
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Support</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
