import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
  } from "@/components/ui/sheet"
  import { useToast } from "@/components/ui/use-toast"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createDeliveryPerson } from "@/http/api"
import { useNewDeliveryPerson } from "@/store/deliveryPerson/deliveryPersonStore"
import CreateDeliveryPersonForm, { FormValues } from "./create-deliveryPersonForm"

const DeliveryPersonSheets = () => {
  const {toast} =useToast()
  const {isOpen,onClose} = useNewDeliveryPerson()
  const queryClient = useQueryClient()

  const {mutate,isPending } = useMutation({
    mutationKey:["create-warehouse"],
    mutationFn: createDeliveryPerson, 
    onSuccess:()=>{
      queryClient.invalidateQueries({
        queryKey: ["delivery-persons"],
      })
     toast({
      title: "Delivery Person created successfully",
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
     <SheetTitle>Create Delivery Person</SheetTitle>
     <SheetDescription>
       Create a new Delivery Person
     </SheetDescription>
   </SheetHeader>
   <CreateDeliveryPersonForm onSubmit={onSubmit} disabled={isPending} />
 </SheetContent>
</Sheet>
  )
}

export default DeliveryPersonSheets
