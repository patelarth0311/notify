import { DynamoDB, DynamoDBClient, UpdateItemCommand, UpdateItemInput, UpdateTableInput, QueryCommand, QueryCommandInput } from "@aws-sdk/client-dynamodb";
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { memo } from "react";
import { useRef } from "react";
import { LegacyRef } from "react";
interface CoverOption {
   documentId: string
    type: "Change cover" | "Add cover"
  }

  
export const CoverOption = memo(({ documentId, type}:  CoverOption) => {
    const client = new DynamoDBClient({ region: "us-east-1", credentials: {
      accessKeyId: "AKIA5YXVFGAJSRG4BHFB", secretAccessKey:"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"
    } });

    const s3client = new S3Client({ region: "us-east-1", credentials: {
      accessKeyId: "AKIA5YXVFGAJSRG4BHFB", secretAccessKey:"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"
    } });


    const fileInputRef = useRef<HTMLInputElement | null>(null)



  
    const handleUpload = async (file : File ) => {
      console.log(documentId)
      const args : UpdateItemInput =
      {"TableName": "NotifyNew",
         "Key": {
             "userId": {"S": "1"},
             "documentId": {"S": documentId}
         },
        "UpdateExpression": 'SET documentImageURL = :value',
        "ExpressionAttributeValues": {
          ':value': {"S": `https://${'notifydocuments'}.s3.${'us-east-1'}.amazonaws.com/${file.name}`}
        },
           
         "ReturnValues": "ALL_NEW"
     };
      const command = new PutObjectCommand({
        Bucket: 'notifydocuments',
        Key: file.name,
        Body: file,
      });
  
      try {
        let response = await s3client.send(command);
       
              
      } catch (err) {
        console.error(err);
      }
  
      try {
  
    const updating = new UpdateItemCommand(args)
   
    let res = await  client.send(updating)
      } catch (err) {
      }
    }


    return <div 
     
    className="relative w-auto">
    

<button 
  onClick={(e) => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }}
>{type}</button>
<input type="file"
ref={fileInputRef}
 onChange={(e) => {
  console.log(documentId)
  if (e.target.files) {
   handleUpload(e.target.files[0])
  }
}}
    style={{ display: "none" }}  multiple />
    </div>
  })
