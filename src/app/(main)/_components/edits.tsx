import { Modal } from "@/app/_components/search"
import { Document } from "@/app/requests"
import { Alert } from "./alert"
import Image from "next/image"
import { useRouter } from "next/navigation"
export const Edits = ({documents} : {documents: Document[]}) => {
    return <div className="absolute right-0  max-w-[409px] w-full">
       <div className="flex flex-col gap-y-2 w-full mt-4 pr-4 pl-4 items-end justify-start ">    
        {documents.map((document,key) => (
            <Alert key={document.documentId}>
                <EditDetail {...document}></EditDetail>
            </Alert>
        ))}
       </div>
    </div>
     
}


export const EditDetail = (document: Document) => {
    const router = useRouter()
    return <div className="flex items-center w-full h-full">
    <button className="h-[70px]  aspect-square relative m-2.5  "
    onClick={() => {router.push(`/documents/${document.documentId}`)}}
    >
<Image 
sizes=""
fill
style={{
  objectFit: "cover",
  borderRadius: '5px'
}}
onLoadingComplete={() => {

}}
placeholder="empty"
       quality={100}
       
         draggable="true"
         priority src={document.documentImageURL} alt="toji" ></Image>
        
</button>
<p className=" text-sm py-1  justify-center   items-center font-medium">{document.documentName}</p>
    </div>


}