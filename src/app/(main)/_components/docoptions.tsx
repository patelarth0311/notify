import { useRouter, usePathname } from "next/navigation"
import Image from "next/image";
import { favorite } from "@/app/requests";
import { Document } from "@/app/requests";
import { memo } from "react";
const DocOptions = memo(({documentId, starred}: Document) => {
    const router = useRouter()

    return <div className="dark:bg-[#191919] absolute shadow-lg top-2 right-2 flex justify-center items-center p-2 rounded-[20px] gap-x-3">
    <button className="" 
    onClick={() => {
        favorite(documentId)
       
    }}
    >
      <Image alt="viewmore" width={20} height={20} src={starred ? "/star.svg" : "/fillstar.svg"}></Image>
  </button>
  <button className=""   onClick={() => router.push( `/documents/${documentId}`)}>
      <Image alt="viewmore" width={20} height={20} src={"/viewmore.svg"}></Image>
  </button>
    </div>
})

export default DocOptions;