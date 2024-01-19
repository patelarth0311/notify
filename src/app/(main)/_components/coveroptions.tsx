
import { useContext, useEffect, useState } from "react";
import { memo } from "react";
import { useRef } from "react";


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


  const handleUpload = async (e: File) => {
  


      try {
        if (context) {
         
      
          const formData = new FormData();
          formData.append('file', e);
        
          await fetch(`/api/uploadcover?userId=${context.user.userId}&documentId=${documentId}`,{
             
            method: 'POST',
            body: formData,
          
      }).then((res) => res.json()).then((res) => {
        dispatch(setADocument({ updatedDocument: res as Document }));
        makeToast({ ...res as Document , editMessage: `Changed cover letter` });
      })
    
      };
      } catch(error) {
        console.log(error)
      }
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