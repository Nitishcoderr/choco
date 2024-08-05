import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
  } from "@/components/ui/sheet"
import CreateProductForm, { FormValues } from "./create-product-form"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createProduct } from "@/http/api"
import { useNewProduct } from "@/store/product/product-store"
  

const ProductSheet = () => {
  const {isOpen,onClose} = useNewProduct()
  const queryClient = useQueryClient()

  const {mutate } = useMutation({
    mutationKey:["create-product"],
    mutationFn:(data:FormData)=> createProduct(data),
    onSuccess:()=>{
      queryClient.invalidateQueries({
        queryKey: ["products"],
      })
      alert("Product created")
    }
  })

  const onSubmit = (values:FormValues)=>{
    console.log('Value',values);
    const formData = new FormData()
    formData.append('name',values.name)
    formData.append('price',String(values.price))
    formData.append('description',values.description)
    formData.append('image',(values.image as FileList )[0])

    mutate (formData)
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
      <CreateProductForm onSubmit={onSubmit} />
    </SheetContent>
  </Sheet>
  
  )
}

export default ProductSheet