import { useRouter } from 'next/navigation'

import { Document } from '@/app/requests'
import Image from 'next/image'

const DocumentItem = ({documentId, documentName, documents, documentImageURL}: Document) => {
    const router = useRouter()
    return (
         

            <button 
             onClick={() => router.push(`/documents/${documentId}`)}
    className="flex  gap-x-[5px] p-3 min-h-[27px] hover:bg-gray-700 hover:rounded-full  text-sm py-1  justify-center   items-center font-medium">
        <div className="w-[25px] h-[25px] relative ">
         <Image 
fill
placeholder="empty"
       quality={100}
         draggable="true"
         priority
         style={{objectFit: "cover"}}
          src={documentImageURL} alt="" ></Image>
         </div>
    <p>{documentName}</p>
</button>


    )
        

    
   
}

export {DocumentItem}