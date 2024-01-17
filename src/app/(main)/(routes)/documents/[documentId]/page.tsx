"use client";
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
import { socket } from "@/app/requests";
import { AskAI } from "@/app/(main)/_components/askai";
import { UserContext } from "@/app/context";
const DocumentView = ({ params }: { params: { documentId: string } }) => {
  const [doc, setDoc] = useState<Document>();
  const client = new DynamoDBClient({
    region: "us-east-1",
    credentials: {
      accessKeyId: "AKIA5YXVFGAJSRG4BHFB",
      secretAccessKey: "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",
    },
  });

  const { documents } = useAppSelector(docsState);
  const [loading, setLoading] = useState(true);
  const dispatch = useAppDispatch();
  const context = useContext(UserContext)

  useEffect(() => {
      if (context) {
        getDocument<{ Items: Document[] }>(params.documentId, context.user.userId).then((res) => {
          setDoc(res.Items[0]);
          setLoading(false);
      });
    }
  
  }, [documents]);

  return (
    <div className="dark:bg-[#191919] flex relative flex-col h-full w-full overflow-hidden ">
      <Navbar loading={loading} title={doc ? doc.documentName : ""}>
        {doc && (
          <>
            <button>
              <Image
                style={{
                  width: 20,
                  height: 20,
                }}
                onClick={() => {
                  if (context) {
                    favorite<Document>(doc.documentId, context.user.userId).then((res) => {
                      dispatch(setADocument({ updatedDocument: res }));
                    });
                  }
                }}
                alt={"menu"}
                width={20}
                height={20}
                src={doc.starred ? "/fillstar.svg" : "/star.svg"}
              ></Image>
            </button>
            <button>
              <Image
                style={{
                  width: 20,
                  height: 20,
                }}
                alt={"menu"}
                width={20}
                height={20}
                src={"/more.svg"}
              ></Image>
            </button>
          </>
        )}
      </Navbar>

      <div className="  overflow-auto w-full h-full">
        <HeaderView
          editable={false}
          loading={loading}
          showCoverThumbPrint={true}
          {...doc!}
        ></HeaderView>

        {loading ? (
          <Skeleton style="ml-[54px] rounded-[5px] w-[300px] h-[30px]"></Skeleton>
        ) : (
          <>{doc && <Editor editable={true} doc={doc}></Editor>}</>
        )}
      </div>
    </div>
  );
};

export default DocumentView;
