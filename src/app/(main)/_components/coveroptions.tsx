import {
  DynamoDB,
  DynamoDBClient,
  UpdateItemCommand,
  UpdateItemInput,
  UpdateTableInput,
  QueryCommand,
  QueryCommandInput,
} from "@aws-sdk/client-dynamodb";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { useSearchParams } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { memo } from "react";
import { useRef } from "react";
import { LegacyRef } from "react";

import { Document } from "@/app/requests";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import { useAppDispatch, setADocument } from "@/app/hooks/store";
import { useToast } from "@/app/hooks/useToast";
import { UserContext } from "@/app/context";
interface CoverOptionProps {
  documentId: string;
  type: "Change cover" | "Add cover";
}

const CoverOption = memo(({ documentId, type }: CoverOptionProps) => {
 

  const { makeToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const dispatch = useAppDispatch();

  const context = useContext(UserContext)

  const client = new DynamoDBClient({
    region: "us-east-1",
    credentials: {
      accessKeyId: process.env.ACCESSKEYID ? process.env.ACCESSKEYID : "", secretAccessKey: process.env.SECRETKEY ? process.env.SECRETKEY  : ""
    },
  });

  const s3client = new S3Client({
    region: "us-east-1",
    credentials: {
      accessKeyId: process.env.ACCESSKEYID ? process.env.ACCESSKEYID : "", secretAccessKey: process.env.SECRETKEY ? process.env.SECRETKEY  : ""
    },
  });
  

  const handleUpload = async (file: File) => {
    if (context) {
      console.log(JSON.stringify(file))
      fetch(`/api/edit?userId=${context.user.userId}&documentId=${documentId}`,{
         
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(file),
      
  }).then((res) => res.json()).then(res => {
    console.log(res)
  })

/*      const args: UpdateItemInput = {
        TableName: "NotifyNew",
        Key: {
          userId: { S: context.user.userId },
          documentId: { S: documentId },
        },
        UpdateExpression: "SET documentImageURL = :value",
        ExpressionAttributeValues: {
          ":value": {
            S: `https://${"notifydocuments"}.s3.${"us-east-1"}.amazonaws.com/${
              file.name
            }`,
          },
        },
  
        ReturnValues: "ALL_NEW",
      };
      const command = new PutObjectCommand({
        Bucket: "notifydocuments",
        Key: file.name,
        Body: file,
      });
      const updating = new UpdateItemCommand(args);
  
      try {
        await s3client.send(command);
        const res = await client.send(updating);
        const unmarshalledData = unmarshall(res.Attributes!) as Document;
  
        dispatch(setADocument({ updatedDocument: unmarshalledData }));
        makeToast({ ...unmarshalledData, editMessage: `Changed cover letter` });
      } catch (err) {
        console.error(err);
      }
    } */
  };
  }
  return (
    <div className="relative w-auto">
      <button
        onClick={(e) => {
          if (fileInputRef.current) {
            fileInputRef.current.click();
          }
        }}
      >
        {type}
      </button>
      <input
        type="file"
        ref={fileInputRef}
        onChange={(e) => {
          if (e.target.files) {
            handleUpload(e.target.files[0]);
          }
        }}
        style={{ display: "none" }}
        multiple
      />
    </div>
  );
});

CoverOption.displayName = "CoverOption"

export default CoverOption;