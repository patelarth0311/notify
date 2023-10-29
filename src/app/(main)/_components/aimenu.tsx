import React, { useState } from "react"
import { useEffect } from "react"
import Image from "next/image"
import { getSummary } from "@/app/requests"
import { useCallback } from "react"
import { DynamoDB, DynamoDBClient, UpdateItemCommand, UpdateItemInput, UpdateTableInput, QueryCommand, QueryCommandInput } from "@aws-sdk/client-dynamodb";
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { useAppDispatch,useAppSelector,conversations } from "@/app/hooks/store"
import { setOutputs, setPrompts } from "@/app/hooks/store"


export const AIMenu = () => {

    
   
   
    const [showConvo, setShowConvo] = useState(false)
    const chathistory = useAppSelector(conversations)
    useEffect(() => {

    },[])


       
    return <div className ={`absolute w-auto right-0 bottom-2 z-[1000] mr-2 overflow-hidden ml-2`}>

        <div className=" h-auto backdrop-blur-md flex-col fixed">

        </div>
        <button 
        onClick = {() => {
            setShowConvo(prev => !prev)
        }}
className={` p-2 z-[1000]  ${showConvo ? 'absolute top-1 right-1 ' : 'relative bg-[#2C2C2D] backdrop-blur-md shadow-lg'} rounded-full `}>
        <Image width={20}  height={20} alt={"magic"} src={ showConvo ? "/close.svg" : "/magic.svg"}></Image>
        </button>



        {showConvo && (
        <div className="dark:bg-[#2020206b] backdrop-blur-md  min-w-[max(min(calc(100vw/2),500px),300px)]    flex flex-col justify-end relative max-w-[500px] min-h-[max(min(calc(100vh/2),400px),90px)] max-h-[600px] overflow-x-hidden   rounded-[20px] ">
            
        <div className="overflow-scroll w-full  pt-[50px] overflow-x-hidden inline-flex flex-col gap-y-2  p-2 pb-[80px]">
        {Object.entries(chathistory).map(([key, value]) => (
         <div key={key} className="flex flex-col gap-y-2 ">
         <p className="bg-[#26252A] break-words self-end   p-3 rounded-[10px]" >{value.prompt}</p>
         <p className="bg-[#26252A]  break-words self-start   p-3 rounded-[10px]" >{value.output}</p>
        </div>
        ))}
        </div>

<Toolbar></Toolbar>

    </div>
        )}

        
    </div>
}



const Toolbar = () => {

    const dispatch = useAppDispatch()

    const [prompt, setPrompt] = useState("")
    const handleUpload = async (file : File ) => {
        const s3client = new S3Client({ region: "us-east-1", credentials: {
            accessKeyId: "AKIA5YXVFGAJSRG4BHFB", secretAccessKey:"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"
          } });
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
    }
  return  <div className=" h-auto backdrop-blur-md flex-col absolute   p-2  bottom-0 w-full flex justify-center ">
    <input

  onChange={(e) => {

    if (e.target.files) {
      handleUpload(e.target.files[0])
    }
  }}
    type="file"
    id="input-file"
    style={{ display: "none" }}
    />
    <label htmlFor="input-file">
<Image width={25}  height={25} alt={"more"} src={"/file.svg"}></Image>
</label>
        <div className=" flex w-full  ml-[2px] rounded-[6px] mb-2 ">
        <button onClick={() => {

}}>
<Image width={25}  height={25} alt={"more"} src={"/more.svg"}></Image>
</button>
        <input value={prompt}
        onChange={(e) => {
            setPrompt(e.target.value)
        }}  
         className=" mr-1 ml-1 bg-[#00000047] w-full rounded-[6px] p-1">

</input>
<button onClick={() => {

const now = new Date().toISOString();
const id = now ;


dispatch(setPrompts({prompt: prompt, key: id}))

  getSummary<string>(prompt).then((res) => {

        dispatch(setOutputs({output: res, key: id}))
  })
  setPrompt("")

}}>
<Image width={25}  height={25} alt={"send"} src={"/send.svg"}></Image>
</button>
        </div>
    </div>
}
