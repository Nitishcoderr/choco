import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { useToast } from '@/components/ui/use-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createInventory } from '@/http/api';
import { useNewInventory } from '@/store/inventory/inventory-store';
import {  InventoryData } from '@/types';
import   CreateInventoryForm, { FormValues } from './create-inventory-Form';




const InventorySheets = () => {
  const { toast } = useToast();
  const { isOpen, onClose } = useNewInventory();
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationKey: ['create-inventory'],
    mutationFn:(data:InventoryData)=> createInventory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['inventories'],
      });
      toast({
        title: 'Inventories created successfully'
      });
      onClose();
    },
    onError: (error: any) => {
      if (error.response?.status === 400 && error.response?.data?.message === 'Inventory already exists') {
        toast({
          title: 'Error',
          description: 'SKU already exists. Please use a different SKU.',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Error',
          description: 'Failed to create inventory. Please try again later.',
          variant: 'destructive',
        });
      }
    }
  });

  const onSubmit = (values: FormValues) => {
    console.log('Value', values);
    mutate(values);
  };

  return (
    <Sheet
      open={isOpen}
      onOpenChange={onClose}>
      <SheetContent className="min-w-[28rem] space-y-4">
        <SheetHeader>
          <SheetTitle>Create Inventory</SheetTitle>
          <SheetDescription>Create a new Inventory</SheetDescription>
        </SheetHeader>
        <CreateInventoryForm
          onSubmit={onSubmit}
          disabled={isPending}
        />
      </SheetContent>
    </Sheet>
  );
};

export default InventorySheets;
