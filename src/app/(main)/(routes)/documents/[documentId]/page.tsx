
"use client"
import React from "react";
import Cover from "@/app/(main)/_components/cover";
import { DragEvent, useState } from 'react';
import Image from "next/image";
import Navbar from "@/app/(main)/_components/navbar";
import { DynamoDB, DynamoDBClient, UpdateItemCommand, UpdateItemInput, UpdateTableInput, QueryCommand, QueryCommandInput } from "@aws-sdk/client-dynamodb";
import "@blocknote/core/style.css";
import { Document,getDocument } from "@/app/requests";
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';
import { useEffect } from "react";
import Editor from "@/app/(main)/_components/editor";
import { AIMenu } from "@/app/(main)/_components/aimenu";
import { HeaderView } from "@/app/(main)/_components/headerview";
import { favorite } from "@/app/requests";
import Skeleton from "@/app/(main)/_components/skeleton";
const DocumentView = ({ params }: { params: { documentId: string } }) => {
    const [doc, setDoc] = useState<Document>()
    const client = new DynamoDBClient({ region: "us-east-1", credentials: {
      accessKeyId: "AKIA5YXVFGAJSRG4BHFB", secretAccessKey:"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"
    } });
   
   

    const [loading, setLoading] = useState(true)

    useEffect(() => {
      const fetch = async () => {
     const paramsGet : QueryCommandInput = {
      TableName: "NotifyNew",
      KeyConditionExpression: "userId = :id AND documentId = :docId",
      ExpressionAttributeValues: {
        ":id": {"S": "1"},
        ":docId": {"S": params.documentId}
    },
    ConsistentRead: true
    }
      const query = new QueryCommand(paramsGet);
        const response =  await client.send(query)
        setLoading(false)
        if (response.Items && response.Items.length > 0) {
          const unmarshalledData = unmarshall( response.Items![0])
          const typedDocument: Document = {
           userId: unmarshalledData.userId,
           documentId: unmarshalledData.documentId,
           documentName: unmarshalledData.documentName,
           documents: unmarshalledData.documents,
           documentImageURL: unmarshalledData.documentImageURL,
           content: unmarshalledData.content,
           starred: unmarshalledData.starred
         };
         setDoc(typedDocument)
        }
   
     
       

      }
      fetch()

     

    },[]) 



    return (
      <div className="dark:bg-[#191919] flex relative flex-col h-full w-full overflow-hidden "
    >  


    <Navbar 
    loading={loading}
    title={doc ? doc.documentName : ""}>
           {doc && (
             <div className="flex justify-center items-center gap-x-2">
             <button>
         <Image 
          onClick={() => {
           favorite(doc!.documentId)
          
       }}
         alt={"menu"} width={20} height={20} src={doc.starred ? "/star.svg" : "/fillstar.svg"}></Image>
         </button>
         <button>
         <Image alt={"menu"} width={20} height={20} src={"/more.svg"}></Image>
         </button>
             </div>
           )}
      
        </Navbar> 


        
        

      <div className="  overflow-auto w-full h-full">
   
       <HeaderView loading={loading} showCoverThumbPrint={true} {...doc!}></HeaderView>
      

  {doc == undefined ? <Skeleton style="ml-[54px] rounded-[5px] w-[300px] h-[30px]"></Skeleton>
:<Editor doc={doc}></Editor>
  }
 {doc && (
  <AIMenu></AIMenu>
 )
 }
      </div>

      
    </div>
    )

}


export default DocumentView;