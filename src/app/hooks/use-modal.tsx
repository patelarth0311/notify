import { useEffect } from "react"
import { useRef } from "react"
import { useState } from "react";
import { closeModal, useAppDispatch, useAppSelector, isModalOpennable } from "../hooks/store";
import { useSelector, useDispatch } from 'react-redux'

const useModal = (action: () => void) => {

    const ref = useRef<HTMLDivElement>(null);
  




    useEffect(() => {

        var handleClickOutside = (e: MouseEvent) => {
            if ( ref.current && !ref.current.contains(e.target as Node)) {
             action()
            
             
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