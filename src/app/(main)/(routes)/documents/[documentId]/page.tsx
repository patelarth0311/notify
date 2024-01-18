"use server";
import React, { useContext } from "react";
import Cover from "@/app/(main)/_components/cover";
import { DragEvent, useState } from "react";
import Image from "next/image";
import Navbar from "@/app/(main)/_components/navbar";
import {
  DynamoDB,
  DynamoDBClient,
  UpdateItemCommand,
  UpdateItemInput,
  UpdateTableInput,
  QueryCommand,
  QueryCommandInput,
} from "@aws-sdk/client-dynamodb";
import "@blocknote/core/style.css";
import { Document, getDocument } from "@/app/requests";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import { useEffect } from "react";
import Editor from "@/app/(main)/_components/editor";

import { HeaderView } from "@/app/(main)/_components/headerview";
import { favorite } from "@/app/requests";
import Skeleton from "@/app/(main)/_components/skeleton";
import {
  useAppSelector,
  docsState,
  useAppDispatch,
  setADocument,
} from "@/app/hooks/store";

import { AskAI } from "@/app/(main)/_components/askai";
import { UserContext } from "@/app/context";
import { DocumentView } from "@/app/(main)/_components/documentview";

export async function generateStaticParams() {

  

  const posts = await fetch('https://4lqud0fnn0.execute-api.us-east-1.amazonaws.com/Notify/getdocuments?userId=1').then((res) => res.json())
 
  return [{documentId: ""}]

}
function DocumentPage({ params }: { params: { documentId: string } }) {
  return <DocumentView documentId={params.documentId} ></DocumentView>
}

export default DocumentPage;
