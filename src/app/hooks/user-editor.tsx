"use client";
import React from "react";

import Image from "next/image";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

import {
  Block,
  BlockNoteEditor,
  PartialBlock,
  defaultBlockSchema,
  defaultProps,
  BlockSchema,
} from "@blocknote/core";
import {
  Theme,
  darkDefaultTheme,
  lightDefaultTheme,
  BlockNoteView,
  getDefaultReactSlashMenuItems,
  ReactSlashMenuItem,
  useBlockNote,
  createReactBlockSpec,
  defaultBlockTypeDropdownItems,
  SideMenuProps,
} from "@blocknote/react";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import "@blocknote/core/style.css";
import { Document, getDocument } from "@/app/requests";
import EditorJS from "@editorjs/editorjs";
import { useEffect } from "react";
import {
  DynamoDB,
  DynamoDBClient,
  UpdateItemCommand,
  UpdateItemInput,
  UpdateTableInput,
  QueryCommand,
  QueryCommandInput,
} from "@aws-sdk/client-dynamodb";
import { useState } from "react";
import { getSummary } from "@/app/requests";
import { current } from "@reduxjs/toolkit";

import {
  useAppDispatch,
  setADocument,
  setAskAI,
  useAppSelector,
  askAIState,
} from "./store";
import { useToast } from "./useToast";

const useEditor = (doc: Document, editable: boolean) => {
  const dispatch = useAppDispatch();
  const askAI = useAppSelector(askAIState);

  var timer: NodeJS.Timeout | undefined = undefined;

  const summarizeAI = (editor: BlockNoteEditor) => {
    dispatch(setAskAI({ ask: true }));

    // Block that the text cursor is currently in.
    /**
         * const currentBlock: Block = editor.getTextCursorPosition().block;
        const nextBlock = editor.getTextCursorPosition().nextBlock
        const currentPosition = currentBlock.id
        
       
        const summarizeAI: PartialBlock = {
              
          type: "paragraph",
          
          content: [{ type: "text", text: "Ask AI", styles: { bold: true, backgroundColor: 'purple' } }],

            
        };
        
        editor.insertBlocks([summarizeAI], currentBlock, "after")
         */

    /**
        * 
          getSummary<string>("Summarize my experience at Salesloft in Chinese").then((res) => {
         
            const summarizeAI: PartialBlock = {
              
              type: "paragraph",
              content: [{ type: "text", text: res, styles: { bold: true } }],
            };
            if (currentBlock.id && currentBlock.content == undefined || (currentBlock.content && currentBlock.content.length == 0)) {
              editor.updateBlock(currentPosition,summarizeAI)
    
            } else {
              editor.insertBlocks([summarizeAI],currentPosition, "after");
              if (nextBlock) {
                editor.setTextCursorPosition(nextBlock, "start");
              }
              
            }
          })
        */
  };

  const insertSummarizeItem: ReactSlashMenuItem = {
    name: "Ask AI",
    execute: summarizeAI,
    aliases: ["Ask AI"],
    group: "AI",
    icon: (
      <Image width={15} height={15} alt="pencil" src={"/pencil.svg"}></Image>
    ),
    hint: "Ask AI anything",
  };
  const customSlashMenuItemList = [
    ...getDefaultReactSlashMenuItems(),
    insertSummarizeItem,
  ];

  const { makeToast } = useToast();

  const client = new DynamoDBClient({
    region: "us-east-1",
    credentials: {
      accessKeyId: process.env.ACCESSKEYID ? process.env.ACCESSKEYID : "", secretAccessKey: process.env.SECRETKEY ? process.env.SECRETKEY  : ""
    },
  });

  const options = {
    removeUndefinedValues: true,
    convertEmptyValues: true,
  };

  marshall({}, options);
  const editor: BlockNoteEditor = useBlockNote({
    editable: editable,
    domAttributes: {
      blockContainer: {
        class: "",
      },
    },
    initialContent: doc.content,

    onEditorContentChange: async (editor) => {
      if (timer) {
        clearTimeout(timer as NodeJS.Timeout);
      }
      const delayDebounceFn = setTimeout(async () => {
        try {
          const params: UpdateItemInput = {
            TableName: "NotifyNew",
            Key: {
              userId: { S: "1" },
              documentId: { S: doc.documentId },
            },
            UpdateExpression: "SET content = :value",
            ExpressionAttributeValues: marshall(
              {
                ":value": editor.topLevelBlocks,
              },
              options
            ),
            ReturnValues: "ALL_NEW",
          };
          const updating = new UpdateItemCommand(params);
          await client.send(updating).then((res) => {
            const unmarshalledData = unmarshall(res.Attributes!) as Document;
            dispatch(setADocument({ updatedDocument: unmarshalledData }));
            makeToast({ ...unmarshalledData, editMessage: "Updated content" });
          });
        } catch (error) {
          console.log(error);
        }
      }, 1000);

      timer = delayDebounceFn;
    },
    uploadFile: (file: File) =>
      new Promise(async (resolve, reject) => {
        const client = new S3Client({
          region: "us-east-1",
          credentials: {
            accessKeyId: process.env.ACCESSKEYID ? process.env.ACCESSKEYID : "", secretAccessKey: process.env.SECRETKEY ? process.env.SECRETKEY  : ""
          },
        });
        const command = new PutObjectCommand({
          Bucket: "notifydocuments",
          Key: file.name,
          Body: file,
        });

        try {
          const response = await client.send(command);
        } catch (err) {
          console.error(err);
        }
        resolve(
          `https://${"notifydocuments"}.s3.${"us-east-1"}.amazonaws.com/${
            file.name
          }`
        );
      }),
    slashMenuItems: customSlashMenuItemList,
  });

  return editor;
};

export default useEditor;
