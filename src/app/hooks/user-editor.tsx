
"use client"
import React from "react";

import Image from "next/image";
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';

import { Block, BlockNoteEditor, PartialBlock, defaultBlockSchema, defaultProps,  BlockSchema } from "@blocknote/core";
import {
  Theme,  darkDefaultTheme,
  lightDefaultTheme ,
  BlockNoteView,
  getDefaultReactSlashMenuItems,
  ReactSlashMenuItem,
  useBlockNote,
  createReactBlockSpec,
} from "@blocknote/react";
import { marshall, unmarshall, } from '@aws-sdk/util-dynamodb';
import "@blocknote/core/style.css";
import { Document,getDocument } from "@/app/requests";

import { useEffect } from "react";
import { DynamoDB, DynamoDBClient, UpdateItemCommand, UpdateItemInput, UpdateTableInput, QueryCommand, QueryCommandInput } from "@aws-sdk/client-dynamodb";
import { useState } from "react";
import { getSummary } from "@/app/requests";
import { current } from "@reduxjs/toolkit";
const useEditor = (doc: Document) => {


  
   
    const summarizeAI = (editor: BlockNoteEditor) => {
        // Block that the text cursor is currently in.
        const currentBlock: Block = editor.getTextCursorPosition().block;
        const nextBlock = editor.getTextCursorPosition().nextBlock
        const currentPosition = currentBlock.id
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
        name: "Summarize",
        execute: summarizeAI,
        aliases: ["summarize"],
        group: "AI",
        icon: <Image width={15} height={15} alt="pencil"  src ={"/pencil.svg"}></Image>,
        hint: "Summarize content using AI",
      };
      const customSlashMenuItemList = [
        ...getDefaultReactSlashMenuItems(),
        insertSummarizeItem
      ];
  
      
      const client = new DynamoDBClient({ region: "us-east-1", credentials: {
        accessKeyId: "AKIA5YXVFGAJSRG4BHFB", secretAccessKey:"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"

      } });
  
      const options = {
        removeUndefinedValues: true,
        convertEmptyValues: true, 
      };

      marshall({}, options)
       const editor: BlockNoteEditor = useBlockNote({
        editable: true,
        domAttributes: {
          blockContainer: {
            class: ""
          }
        },
         initialContent:  doc.content,

         onEditorContentChange: async (editor) => {
        
             try {
                const params : UpdateItemInput =
                {"TableName": "NotifyNew",
                   Key: {
                       "userId": {"S": "1"},
                       "documentId": {"S": doc.documentId}
                   },
                  "UpdateExpression": 'SET content = :value',
                  "ExpressionAttributeValues": 
                     marshall({
                       ':value': editor.topLevelBlocks,
                     },options),
                   "ReturnValues": "ALL_NEW"
               };
                const updating = new UpdateItemCommand(params)
                const res = await client.send(updating)
               
               }
              catch(error) {
               console.log(error)
              }
             
         },
          uploadFile:  (file: File) => new Promise(async (resolve, reject) => {

            const client = new S3Client({ region: "us-east-1", credentials: {
                accessKeyId: "AKIA5YXVFGAJSRG4BHFB", secretAccessKey:"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"
              } });
              const command = new PutObjectCommand({
                Bucket: 'notifydocuments',
                Key: file.name,
                Body: file,
              });

              try {
                const response = await client.send(command);
              } catch (err) {
                console.error(err);
              }
              resolve( `https://${'notifydocuments'}.s3.${'us-east-1'}.amazonaws.com/${file.name}`)
              
          }),
          slashMenuItems: customSlashMenuItemList,
      });

      




      return editor
}

export default useEditor;