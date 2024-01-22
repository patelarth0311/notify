
"use client"
import { useContext, useEffect, useState } from "react";
import {
    useAppSelector,
    docsState,
    useAppDispatch,
    setADocument,
  } from "@/app/hooks/store";
import { UserContext } from "@/app/context";
import { favorite, getDocument } from "@/app/requests";
import Image from "next/image";
import Navbar from "./navbar";
import { HeaderView } from "./headerview";
import Skeleton from "./skeleton";
import Editor from "./editor";
import { Document } from "@/app/requests";


export const DocumentView = ({ documentId }:  { documentId: string } ) => {
    const [doc, setDoc] = useState<Document>();
  
    const { documents } = useAppSelector(docsState);
    const [loading, setLoading] = useState(true);
    const dispatch = useAppDispatch();
    const context = useContext(UserContext)
  
    useEffect(() => {
 
        if (context) {
          getDocument<{ Items: Document[] }>(documentId, context.user.userId).then((res) => {
            setDoc(res.Items[0]);
            setLoading(false);
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
      </div>
    );
  };
  