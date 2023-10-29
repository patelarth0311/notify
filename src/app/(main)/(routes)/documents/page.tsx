"use client"

import React, { useCallback, useState } from "react";
import {DocumentCard} from "../../_components/documentcard";;
import Image from "next/image";


import Navbar from "../../_components/navbar";
import { getDocuments, Document, getSummary } from "@/app/requests"
import { useEffect } from "react";
import DocumentLargeCard from "../../_components/largedocumentcard";
import { memo } from 'react';
import { useRef } from "react";
import { Modal } from "@/app/_components/search";
import Skeleton from "../../_components/skeleton";
import useModal from "@/app/hooks/use-modal";
import { useAppDispatch, useAppSelector, isModalOpennable } from "@/app/hooks/store";
import { Alert } from "../../_components/alert";
import { Edits } from "../../_components/edits";
interface ViewingOptionProps {
    icon: string
    action: () => void
}

const Option = memo(function Option({icon, action} : ViewingOptionProps)  {
    return <button onClick={action}>
        <Image alt={icon} width={20} height={20} src={icon}></Image>
    </button>
})



const DocumentsLayer = () => {
    
    const {ref} = useModal()
    const docContainerRef = useRef<HTMLDivElement>(null);
    const [loading, setLoading] = useState(true);
    const [documents, setDocuments] = useState<Document[]>([])
    const show = useAppSelector(isModalOpennable)

    useEffect(() => {

        getDocuments<{Items: [Document]}>().then((res) => {
            setDocuments(res.Items)
            setLoading(false)
        })
      

    
    },[]);

    const [showAll, setShowAll] = useState(false)
    const [showEdits, setShowEdits] = useState(false)
   
    

    const viewalloption = useCallback(() => {
        setShowAll(prev => !prev)
    },[])

    const viewedits = useCallback(() => {
        setShowEdits(prev => !prev)
    },[])


    return <div className=" flex relative flex-col h-full w-full overflow-hidden">
         <Navbar loading={loading} title={"Home"}>
                <Option icon={"/bell.svg"} action={() => {viewedits()}}></Option>
                <Option icon={"/grid.svg"} action={() => {viewalloption()}}></Option>
        </Navbar>
      

        <main className=" flex flex-col items-start justify-start  overflow-auto">
            <div className=" flex h-full w-full flex-col  justify-start    overflow-auto">

        
        <div className="w-full h-full flex items-center flex-col p-3">

        <div className="w-full flex justify-start">
            <div className="text-[40px]  font-bold flex items-center ">
          <br></br>
          <br></br>
          {loading ?  <Skeleton  style="w-[250px] h-[40px] rounded-[5px] mt-5 mb-5"></Skeleton> :  <p>Recents</p>}
        </div>
            </div>

           <div className="w-full  flex justify-start ">
           <div className="flex  gap-x-5   overflow-scroll rounded-[20px]">
            
            {loading ? <Skeleton style={"dark:bg-[#191919]  relative 	shadow-lg rounded-[20px] aspect-square   w-[329px]   overflow-x-hidden"}></Skeleton>:

         <div className="flex flex-row gap-x-5  relative"> { documents.map((item,key) => (
                
            
         
                <DocumentCard loading={loading} showSmallTitle={false} style={`dark:bg-[#191919] w-[329px] aspect-square  relative  h-full	shadow-lg rounded-[20px]      overflow-x-hidden`} key = {item.documentId} {...item}>
                <DocumentLargeCard  {...item}></DocumentLargeCard>
               </DocumentCard>
          
               
            ))

            }</div>

            }
               </div>
       
            </div>
        
       
            <div className="w-full flex justify-start">
            <div className="text-[40px]  font-bold flex items-center ">
          <br></br>
          <br></br>

          {loading ?  <Skeleton  style="w-[250px] h-[40px] rounded-[5px] mt-5 mb-5"></Skeleton> :  <p>All</p>}
               
        </div>
            </div>

        <div className="w-full flex justify-center pb-5 ">

        {loading ?  <Skeleton style={"dark:bg-[#191919]  relative 	shadow-lg rounded-[20px] relative flex-1  min-h-[600px]  overflow-x-hidden"}></Skeleton> : 
          <div ref={docContainerRef} className="gap-x-5  flex flex-col   justify-center  w-full   gap-y-5   ">
            
            {documents.map((item,key) => (
                
                    
                <DocumentCard loading={loading} showSmallTitle={false} style={"dark:bg-[#191919]   relative flex-1  min-h-[600px]	shadow-lg rounded-[20px]  overflow-x-hidden"} key = {item.documentId} {...item}>
                      
                      <DocumentLargeCard  {...item}></DocumentLargeCard>
                      </DocumentCard>
            ))

            }
              
</div>
        }

        
            </div>
            </div>
        </div>
      
       

            <DocGrid loading={loading} documents={documents} showAll={showAll}></DocGrid>
           {showEdits && (
             <Edits documents={documents}></Edits>
           )

           }
       
       
        </main>


       
    </div>
}

const DocGrid = ({documents, showAll, loading} : {documents: Document[], showAll: boolean, loading: boolean}) => {

    const [query, setQuery] = useState("")

    return      (showAll ) && (
        <Modal zindex={9000}>  
        <div className="flex justify-start flex-col items-center w-full h-full content-center gap-y-5  ">
        <div className="flex w-full dark:bg-[#1F1F1F] rounded-[10px] max-w-[500px] p-[_0px_16px_0px_12px] items-center justify-center min-h-[50px]">
        <Image className="mr-3" alt={"mg"} width={19} height={19} src={"/search.svg"}></Image>
            <div className="w-full relative">
                <input value={query} onChange={((e) => {
                    setQuery(e.target.value)
                 
                })} className="p-0 bg-inherit w-full" placeholder="Search "></input>
            </div>
            
        </div>
     

<div className="w-auto h-auto flex flex-wrap pb-10 gap-y-5 gap-x-5 justify-center  items-center content-center">
{documents.filter(doc => doc.documentName.toLowerCase().includes(query.toLowerCase())).map((item,key) => (

    
  
<DocumentCard loading={loading} showSmallTitle={true} style={"relative  align rounded-[20px]  dark:bg-[#191919]  overflow-hidden shadow-lg aspect-square w-[200px] h-[200px]"} key = {item.documentId} {...item}
   >
   </DocumentCard>
   

))

} 

</div>
        </div>

        
         </Modal>
  )

  
}


export default DocumentsLayer;