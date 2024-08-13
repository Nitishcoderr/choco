import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
  } from "@/components/ui/sheet"
  import { useToast } from "@/components/ui/use-toast"
import { useNewWarehouses } from "@/store/warehouse/warehouse-store"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import CreateWarehousesForm, { FormValues } from "./create-warehouses-form"
import { createWarehouses } from "@/http/api"

const WareHousesSheets = () => {
  const {toast} =useToast()
  const {isOpen,onClose} = useNewWarehouses()
  const queryClient = useQueryClient()

  const {mutate,isPending } = useMutation({
    mutationKey:["create-warehouse"],
    mutationFn: createWarehouses, 
    onSuccess:()=>{
      queryClient.invalidateQueries({
        queryKey: ["warehouses"],
      })
     toast({
      title: "Warehouse created successfully",
     })
      onClose();
    }
  })

  const onSubmit = (values:FormValues )=>{
    console.log('Value',values);
    mutate (values)
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
    <SheetContent className="min-w-[28rem] space-y-4">
   <SheetHeader>
     <SheetTitle>Create Product</SheetTitle>
     <SheetDescription>
       Create a new product
     </SheetDescription>
   </SheetHeader>
   <CreateWarehousesForm onSubmit={onSubmit} disabled={isPending} />
 </SheetContent>
</Sheet>
  )
}

export default WareHousesSheets
