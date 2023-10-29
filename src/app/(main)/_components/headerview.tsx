import { DynamoDB, DynamoDBClient, UpdateItemCommand, UpdateItemInput, UpdateTableInput, QueryCommand, QueryCommandInput } from "@aws-sdk/client-dynamodb";
import { useEffect, useState } from "react";
import { Document,getDocument } from "@/app/requests";
import Cover from "./cover";
import Image from "next/image";
import { CoverOption } from "./coveroptions";
import Skeleton from "./skeleton";
import { useMemo } from "react";
import { useCallback } from "react";
export const HeaderView = ({ documentId, documentName, documentImageURL, showCoverThumbPrint, showSmallTitle, loading }: (Document) & {showCoverThumbPrint: boolean, showSmallTitle? : boolean, loading: boolean}) => {

    const [showOptions, setShowOptions] = useState(false)
  

    const [header, setHeader] = useState(documentName)

    useEffect(() => {
      setHeader(documentName)
    },[loading])

    
    const client = new DynamoDBClient({ region: "us-east-1", credentials: {
      accessKeyId: "AKIA5YXVFGAJSRG4BHFB", secretAccessKey:"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"
    } });
   
    const updateDocName = async (name: string) => {
      const updateParams : UpdateItemInput =
                {"TableName": "NotifyNew",
                   Key: {
                       "userId": {"S": "1"},
                       "documentId": {"S": documentId}
                   },
                  "UpdateExpression": 'SET documentName = :value',
                  "ExpressionAttributeValues": 
                       {
                       ':value': {"S" : name},
                     },
                   "ReturnValues": "ALL_NEW"
               };
                const updating = new UpdateItemCommand(updateParams)
                const res = await client.send(updating)
    }
  
  
  
    return        <>
  
   
    
            <div  className={`relative w-full ${documentImageURL || loading ? 'h-[min(50%,35vh)]' : ""}  `}>
         
            {loading ?   <Skeleton style="relative w-full h-full "></Skeleton> :
            <>
             {documentImageURL && (
              <Cover documentId={documentId} url={documentImageURL}></Cover>
            )

            }
            </>

            }
          
          
           

          
   
           </div>
        
  
          
           <div 
    onMouseEnter={() => {
      setShowOptions(true)
  }}
  onMouseLeave={() => {
      setShowOptions(false)
  }}
    className={`w-full relative  z-1 ${showSmallTitle ? '' : 'pr-[54px] pl-[54px]'}  mt-4`}>
  
  
  {(documentImageURL == "" && showOptions && loading == false) && (
    <div className ={`absolute  z-[9000]  ${showSmallTitle ? 'left-[10%]' : 'left-[50px]'} text-[#7F7F7F] text-[12px] opacity-[${showOptions ?1:0}] bg-[#252525] p-1 rounded-[5px]`}>
    <CoverOption type="Add cover" documentId={documentId}></CoverOption>
  </div>
  )}
  
  { loading ? <Skeleton  style="mt-[-70px] w-[140px] h-[140px] relative flex justify-center items-center"></Skeleton> : <>

  {(documentImageURL && showCoverThumbPrint) && (
      <div className="mt-[-70px] w-[140px] h-[140px] relative flex justify-center items-center">
        <div className="">
          <Image fill style={{objectFit: "cover"}} alt={"gogo"}  src={documentImageURL}></Image>
        </div>
      </div>
    )}
  </>

  }

   
    {loading ? <Skeleton  style="w-[500px] h-[40px] rounded-[5px] mt-5 mb-5"></Skeleton> :
    <>
     {showSmallTitle ?  <div  className={`w-full relative font-bold flex items-center ps-[10%] pe-[10%] + ${documentImageURL ? 'pt-3' : 'pt-[1.9rem]'}`}>
        <h1 className="w-full whitespace-nowrap ">{documentName}</h1>
      </div> :  <div className="w-full relative text-[40px] font-bold flex items-center ">
      <br></br>
      <br></br>
      <input className="w-full bg-inherit " value={header} onChange={(e) => {
       
          setHeader(e.currentTarget.value)
          updateDocName(e.currentTarget.value)
        
      }}></input>
   
    </div>

    }
    </>

    }

   
   
    </div>
    </>
  }