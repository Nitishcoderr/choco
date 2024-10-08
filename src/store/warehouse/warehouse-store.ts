import {create} from 'zustand'

type NewWareHouseState={
    isOpen:boolean,
    onOpen:()=>void;
    onClose:()=>void;
}

export const useNewWarehouses = create<NewWareHouseState>((set)=>{
    return{
        isOpen: false,
        onOpen: () => set({isOpen: true}),
        onClose: () => set({isOpen: false})
    }
})