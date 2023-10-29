import { useEffect } from "react"
import { useRef } from "react"
import { useState } from "react";
import { closeModal, useAppDispatch, useAppSelector, isModalOpennable } from "../hooks/store";
import { useSelector, useDispatch } from 'react-redux'

const useModal = () => {

    const ref = useRef<HTMLDivElement>(null);
  
    const dispatch = useAppDispatch()



    useEffect(() => {

        var handleClickOutside = (e: MouseEvent) => {
            if ( ref.current && !ref.current.contains(e.target as Node)) {
              dispatch(closeModal())
             
            } 
        }
      
    
        
        document.addEventListener('mousedown', handleClickOutside);
        
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        
        }
    },[])

    
    return {ref}

}

export default useModal;