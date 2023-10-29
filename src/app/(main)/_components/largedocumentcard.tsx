

"use client"
import React from "react";

import { useState } from 'react';

import "@blocknote/core/style.css";
import { Document,getDocument } from "@/app/requests";
import Editor from "./editor";

const DocumentLargeCard = ({documentId, documentName, documentImageURL, content, userId, style, starred} : Document & {style?: string}) => {

    const [doc, setDoc] = useState<Document>({documentId: documentId, documentImageURL: documentImageURL, userId: userId, documentName: documentName, content: content, starred: starred})
   
  

    return (doc && (
   
     


        
    
        <Editor doc={doc}  ></Editor>
      
      
  
    ))

}
export default DocumentLargeCard