"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Document } from "@/app/requests";
import { useEffect, useRef, useState } from "react";
import DocumentLargeCard from "./largedocumentcard";
import Cover from "./cover";
import DocOptions from "./docoptions";
import { HeaderView } from "./headerview";
const DocumentCard = ({
  documentId,
  documentName,
  documentImageURL,
  style,
  userId,
  children,
  showSmallTitle,
  starred,
  loading,
}: Document & { style?: string; showSmallTitle: boolean; loading: boolean } & {
  children: React.ReactNode;
}) => {
  const router = useRouter();
  const [show, setShow] = useState(false);

  return (
    <>
      <div
        className={`${style}  relative`}
        onMouseLeave={() => {
          setShow(false);
        }}
        onMouseEnter={() => {
          setShow(true);
        }}
      >
        <HeaderView
          editable={true}
          loading={loading}
          showSmallTitle={showSmallTitle}
          showCoverThumbPrint={false}
          starred={starred}
          userId={userId}
          documentId={documentId}
          documentImageURL={documentImageURL}
          documentName={documentName}
        ></HeaderView>
        {children}

        {show && (
          <DocOptions
            style="absolute shadow-lg top-2 right-2  dark:bg-[#292929e6] rounded-[20px] backdrop-blur-lg "
            starred={starred}
            documentName={documentName}
            userId={userId}
            documentId={documentId}
            documentImageURL={documentImageURL}
          ></DocOptions>
        )}
      </div>
    </>
  );
};

export { DocumentCard };
