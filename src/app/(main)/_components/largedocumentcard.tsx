"use client";
import React from "react";

import { useState } from "react";

import "@blocknote/core/style.css";
import { Document, getDocument } from "@/app/requests";
import Editor from "./editor";

const DocumentLargeCard = ({
  doc,
  editable,
}: { doc: Document } & { editable: boolean }) => {
  return doc && <Editor editable={editable} doc={doc}></Editor>;
};
export default DocumentLargeCard;
