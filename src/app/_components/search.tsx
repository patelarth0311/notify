

import useModal from "../hooks/use-modal";
import { useAppDispatch, useAppSelector } from "../hooks/store";
import { isModalOpennable } from "../hooks/store";
import { useEffect, useRef } from "react";
import Image from "next/image";
import { useState } from "react";
import { getDocuments } from "../requests";
import { DocumentItem } from "../(main)/_components/documentitem";
import { Document } from "../requests";
import {  docsState } from "../hooks/store";
import { closeModal } from "../hooks/store";

export const Modal = ({ children, zindex} : { children: React.ReactNode} & {zindex: number}) => {

 


    return <div 
    className={`absolute  h-full flex-col overflow-scroll bg-[rgba(0,0,0,0.15)] w-full flex justify-center items-center backdrop-blur-sm z-[${zindex}] `}>
        {children}
        
    </div>
}


const Search = () => {

    const show = useAppSelector(isModalOpennable)

    
    

    return  ( show &&  (
        <SearchContent></SearchContent>
    )
    )
        
  

}

const SearchContent = () => {
    const dispatch = useAppDispatch()
    const {ref} = useModal(() => dispatch(closeModal()))

    const {documents, loading} = useAppSelector(docsState)
    const [query, setQuery] = useState("")

    return <Modal zindex={9000}>
    <div ref = {ref} className="dark:bg-[#1F1F1F]  w-[calc(100%-23px)] flex-1 max-w-[660px]  h-full min-h-[50px] max-h-[80vh] rounded-[12px] m-[5px]">
    <div className="flex flex-col min-w-[180x] max-w-[calc(100vw-42px)] h-full p-[_0px_16px_0px_12px] overflow-y-auto">
        <div className="flex w-full items-center h-[50px]">
        <Image style={{width: 19, height: 19}}  className="mr-3" alt={"mg"} width={19} height={19} src={"/search.svg"}></Image>
            <div className="w-full relative">
                <input value={query} onChange={((e) => {
                    setQuery(e.target.value)
                 
                })} className="p-0 bg-inherit w-full" placeholder="Search "></input>
            </div>
            
        </div>
        <div className="pt-2 flex w-full h-full  items-start flex-col">
           {documents.filter(item =>  item.documentImageURL.toString().toLowerCase().includes(query.toLowerCase())).map((item, key) => (
            <DocumentItem key={key} {...item}></DocumentItem>
           ))

           }
        </div>
    </div>
</div>
    </Modal>

}


export default Search;

