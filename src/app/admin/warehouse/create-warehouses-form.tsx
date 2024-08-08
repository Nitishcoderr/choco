import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Loader2 } from 'lucide-react'
import { warehouseSchema } from '@/lib/validators/warehouseSchema'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import {zodResolver} from '@hookform/resolvers/zod'

export type FormValues = z.input<typeof warehouseSchema>

const CreateWarehousesForm = ({onSubmit,disabled}:{onSubmit:(formValue:FormValues)=>void,disabled:boolean}) => {

  const form = useForm<z.infer<typeof warehouseSchema>>({
    resolver:zodResolver(warehouseSchema),
    defaultValues:{
      name: '',
      pincode: '',
    }
  })


  const handleSubmit= (values:FormValues)=>{
    // Will submit form
    onSubmit(values)
    
  }
  
  return (
    <Form {...form}>
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Name</FormLabel>
            <FormControl>
              <Input placeholder="e.g. Chocobar" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="pincode"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Pincode</FormLabel>
            <FormControl>
              <Textarea  placeholder="e.g. 273154" {...field}/>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    
     <Button type="submit" className='w-full' disabled={disabled} >
    {  disabled ? <Loader2 className='size-4 animate-spin' /> : "Create"}
     </Button>
    </form>
  </Form>
  )
}

export default CreateWarehousesForm
