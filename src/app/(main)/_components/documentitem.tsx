import { useRouter } from "next/navigation";

import { Document } from "@/app/requests";
import Image from "next/image";
import DocOptions from "./docoptions";
import { useState } from "react";
const DocumentItem = (document: Document) => {
  const { documentId, documentName, documents, documentImageURL } = document;
  const router = useRouter();
  const [showOptions, setShowOptions] = useState(false);
  return (
    <div
      onMouseLeave={() => {
        setShowOptions(false);
      }}
      onMouseEnter={() => {
        setShowOptions(true);
      }}
      className="flex  relative hover:bg-[#3b3b3bc8] "
    >
      <button
        onClick={() => router.push(`/documents/${documentId}`)}
        className="flex  gap-x-[5px] p-3 min-h-[27px]  text-sm py-1  text-gray-400 justify-start   items-center font-medium"
      >
        <div className="w-[25px] h-[25px] relative">
          <Image
            fill
            placeholder="empty"
            quality={100}
            sizes=""
            draggable="true"
            priority
            style={{ objectFit: "cover", width: "100%", height: "100%" }}
            src={documentImageURL}
            alt=""
          ></Image>
        </div>
        <p className="truncate overflow-scroll w-[120px] text-start ">
          {documentName}
        </p>
      </button>
      {showOptions && (
        <DocOptions style="absolute right-0" {...document}></DocOptions>
      )}
    </div>
  );
};

export { DocumentItem };
