import { AnyAction, ThunkMiddleware, configureStore, } from '@reduxjs/toolkit'
import { ToolkitStore } from '@reduxjs/toolkit/dist/configureStore'
import { createSlice } from '@reduxjs/toolkit'
import { create } from 'domain'
import {TypedUseSelectorHook, useDispatch, useSelector} from "react-redux"







export const aiSlice = createSlice({
    name: 'aiHandler',
    initialState: {} as { [key: string]: {prompt: string, output: string} },
    reducers: {
        setPrompts: (state,action) => {
            
            return {...state, [action.payload.key] : {prompt: action.payload.prompt, output: "..."}}
        },
        setOutputs: (state,action) => {
                return  {...state, [action.payload.key] : {prompt: state[action.payload.key].prompt , output: action.payload.output}}
            }
        
    }

})

export const navSlice = createSlice({
    name: 'navHandler',
    initialState: true,
    reducers: {
        collapse: state => {
          
            return false
        },
        expand: state => {
            
            return true;
        }
    }
})


export const modalSlice = createSlice({
    name: 'modalHandler',
    initialState: false,
    reducers: {
        closeModal: (state) => {
            
            return false
        },
        openModal: state => {
            
            return true;
        }
    }
})

export const {closeModal, openModal} = modalSlice.actions
export const {collapse, expand} = navSlice.actions
export const {setOutputs, setPrompts} = aiSlice.actions



export const store = configureStore({
    reducer: {
      modalHandler: modalSlice.reducer,
      navHandler: navSlice.reducer,
      aiHandler: aiSlice.reducer,
    }
  })


export type RootState = ReturnType<typeof store.getState>
export const isModalOpennable = (state: RootState) => state.modalHandler
export const isNavOpen = (state: RootState) => state.navHandler
export const conversations  = (state: RootState) => state.aiHandler
export type AppDispatch = typeof store.dispatch
export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector


const documentsThunk = () => {
    return (dispatch : () => AppDispatch, getState : TypedUseSelectorHook<RootState>) => {
        
    }
}