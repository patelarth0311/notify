
"use client"
import { useContext, useEffect, useState } from "react";
import {
    useAppSelector,
    docsState,
  } from "@/app/hooks/store";
import { UserContext } from "@/app/context";
import { getDocument } from "@/app/requests";
import Image from "next/image";
import Navbar from "./navbar";
import { HeaderView } from "./headerview";
import Skeleton from "./skeleton";
import Editor from "./editor";
import { Document } from "@/app/requests";
import { useRouter } from "next/navigation";
import { Modal } from "@/app/_components/search";
import { useLayoutEffect } from "react";

export const DocumentView = ({ documentId }:  { documentId: string } ) => {
    const [doc, setDoc] = useState<Document>();
  
    const { documents } = useAppSelector(docsState);
    const [loading, setLoading] = useState(true);
    const [errored, setErrored] = useState(false)
    const context = useContext(UserContext)


  

    useEffect(() => {
        if (context) {
          getDocument<{ Items: Document[] }>(documentId, context.user.userId).then((res) => {
            setDoc(res.Items[0]);
          
            if (res.Items[0]) {
              setLoading(false);
            } else {
              setErrored(true)
            }
            
            
        });
      }
      
    }, [documents]);
  
    return (
      <div className="dark:bg-[#191919] flex relative flex-col h-full w-full overflow-hidden ">
       
                  <Navbar loading={loading} title={doc ? doc.documentName : ""}>
         <div></div>
        </Navbar>
  
        <div className="  overflow-auto w-full h-full">
          <HeaderView
            editable={false}
            loading={loading}
            showCoverThumbPrint={true}
            {...doc!}
          ></HeaderView>
  
          {loading ? (
            <Skeleton style="ml-[54px] rounded-[5px] w-[300px] h-[30px]"></Skeleton>
          ) : (
            <>{doc && <Editor editable={true} doc={doc}></Editor>}</>
          )}
        </div>

        { errored && doc === undefined && (
          <DocumentNotFoundView></DocumentNotFoundView>
        )
        }
       
      </div>
    );
  };
  

  const DocumentNotFoundView = () => {

    const router = useRouter()


    return <Modal zindex={30}>
    <div  className="max-w-[359px]  p-[15px] relative w-full dark:bg-[#1f1f1fe6] shadow-lg  h-auto  backdrop-blur-lg rounded-[16px] ">
   
   <div className="h-full items-center p-2.5 gap-x-2 gap-y-[10px]  w-full flex flex-col justify-between  ">
   <Image alt="close" width={50} height={50} src="/warning.svg"></Image>
    <div className="p-[10px]">
    <p className="text-xl">Note does not exist</p>
   <button 
    className="flex items-center gap-x-2 "
   onClick={() => {
     router.back()
   }}>
    <Image alt="close" width={20} height={20} src="/back.svg"></Image>
     <p>Navigate back</p>
   </button>
    </div>
   </div>
    </div>
   </Modal>
  }