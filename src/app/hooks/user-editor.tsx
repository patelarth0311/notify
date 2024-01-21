"use client";
import React, { useContext } from "react";

import Image from "next/image";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

import {
  Block,
  BlockNoteEditor,
  PartialBlock,
  defaultBlockSchema,
  defaultProps,
  BlockSchema,
  StyledText,
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
import { UserContext } from "../context";

const useEditor = (doc: Document, editable: boolean) => {
  const dispatch = useAppDispatch();
  const askAI = useAppSelector(askAIState);
  const context = useContext(UserContext)
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


  const editor: BlockNoteEditor = useBlockNote({
    editable: editable,
    domAttributes: {
      blockContainer: {
        class: "",
      },
    },
    initialContent: doc.content,

    onEditorContentChange: async (editor) => {

      var currentcontent = editor.getTextCursorPosition().block.content
      
      

      var controller = new AbortController()
      if (timer) {
      
        clearTimeout(timer as NodeJS.Timeout);
      }
      const delayDebounceFn = setTimeout(async () => {
        if (context && currentcontent) {
          
           
          fetch(`/api/edit?userId=${context.user.userId}&documentId=${doc.documentId}`,{
         
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({content: JSON.stringify(editor.topLevelBlocks), 
              curBlockId: editor.getTextCursorPosition().block.id,
              text: (currentcontent[0] as StyledText).text}),

            
        }).then((res) => res.json()).then(res => {
         

          dispatch(setADocument({ updatedDocument: res as Document }));
          makeToast({ ...res as Document , editMessage: "Updated content" });
        })
    
        }
      }, 1000);

      timer = delayDebounceFn;
    },
    uploadFile: (file: File) =>
      upload<string>(file),
    slashMenuItems: customSlashMenuItemList,
  });

  return editor;
};

function upload<T>(file: File) : Promise<T>  {
  const formData = new FormData();
  formData.append('file', file);
  return fetch(`/api/uploadfromeditor`,{
    method: 'PUT',
    body: formData,
   }).then((res) => res.json())

}

export default useEditor;
