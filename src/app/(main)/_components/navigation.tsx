import React, { useEffect } from "react";
import { NavItem } from "./navitem";
import {DocumentItem} from "./documentitem";

import { useRouter } from 'next/navigation'
import { useAppDispatch } from "@/app/hooks/store";
import { openModal } from "@/app/hooks/store";
import Navbar from "./navbar";
import Image from "next/image";
import { useState } from "react";
import { useRef, ElementRef } from "react";
import { collapse } from "@/app/hooks/store";
import { useAppSelector, isNavOpen } from "@/app/hooks/store";
import { addDocument } from "@/app/requests";
import { getDocuments } from "@/app/requests";
import { Document } from "@/app/requests";

const Navigation = () => {
    const router = useRouter()
    const dispatch = useAppDispatch()
   

    
    const [documents, setDocuments] = useState<Document[]>([])
    useEffect(() => {

        getDocuments<{Items: Document[]}>().then((res) => {
            setDocuments(res.Items)
        
        })
    

    
    },[]);

    const isOpen = useAppSelector(isNavOpen)


    const handleCollapse = () => {
        
            dispatch(collapse())
            
           
            
        

    }


    

    return <nav className={`h-full dark:bg-[#1F1F1F] overflow-y-auto flex ${isOpen ? 'w-60' : 'w-0'} flex-col relative pl-1`}>
    
    { isOpen && (
        <>
         


   
    <div  className="flex flex-col dark:bg-[#1F1F1F] h-full items-start  gap-y-5 pt-4" >
    <div>
    <NavItem icon={"/home.svg"}  text={"Home"} action={() => router.push('/documents')}></NavItem>
            <button  onClick={() => {handleCollapse()}} className= "rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600 absolute top-4 right-2 opacity-100 group-hover/sidebar:opacity-100 transition">
          <Image alt={"left"} width={30} height={30} src={"/chevleft.svg"}></Image>
    </button>
        <NavItem icon={"/search.svg"}  text={"Search"} action={() =>  dispatch(openModal())}></NavItem>
        <NavItem icon={"/add.svg"}  text={"New page"} action={() => {
            addDocument<{documentId: String}>().then((res) => {
                router.push(`/documents/${res.documentId}`)
            })
        }}></NavItem>
    </div>

    <div className="w-full ">

        {documents.map((doc,index) => (
             <DocumentItem key={doc.documentId} {...doc} ></DocumentItem>
        ))

        }
       
    </div>

    </div>
        </>

    )

    }



    </nav>
}

export default Navigation;