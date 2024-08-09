import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Loader2 } from 'lucide-react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import {zodResolver} from '@hookform/resolvers/zod'
import { deliveryPersonSchema } from '@/lib/validators/deliveryPersonSchema'

export type FormValues = z.input<typeof deliveryPersonSchema>

const CreateDeliveryPersonForm = ({onSubmit,disabled}:{onSubmit:(formValue:FormValues)=>void,disabled:boolean}) => {

  const form = useForm<z.infer<typeof deliveryPersonSchema>>({
    resolver:zodResolver(deliveryPersonSchema),
    defaultValues:{
      name: '',
      phone: '',
      warehouseId:0
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
              <Input placeholder="e.g. Denny" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="phone"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Phone</FormLabel>
            <FormControl>
              <Textarea  placeholder="e.g. +917565069987" {...field}/>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="warehouseId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Ware House Id</FormLabel>
            <FormControl>
            <Input type='number' {...field} onChange={(e)=>{
              const value = parseFloat(e.target.value);
              field.onChange(value)
            }} />
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

export default CreateDeliveryPersonForm
