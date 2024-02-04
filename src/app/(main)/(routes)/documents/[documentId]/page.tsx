"use server";
import React, { useContext } from "react";
import { DocumentView } from "@/app/(main)/_components/documentview";


async function DocumentPage({ params }: { params: { documentId: string } }) {

  return <DocumentView documentId={params.documentId} ></DocumentView>
}

export default DocumentPage;