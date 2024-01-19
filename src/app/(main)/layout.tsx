"use client";

import React from "react";
import Navigation from "./_components/navigation";
import Search from "../_components/search";
import { useEffect } from "react";
import { Document, getDocument, getDocuments } from "../requests";
import { useAppDispatch, setDocuments, docsState } from "../hooks/store";
import { useRouter } from "next/navigation";

import ReactDOM from "react-dom/client";
import { useToast } from "../hooks/useToast";
import { createPortal } from "react-dom";
import { toastState, useAppSelector } from "../hooks/store";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";

import { Edits } from "./_components/edits";

import { fetchChatHistory } from "../requests";
import { useContext } from "react";
import { UserContext } from "../context";
import { Island } from "./_components/island";
const MainLayer = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { documents, loading } = useAppSelector(docsState);
  const context = useContext(UserContext);

  useEffect(() => {
    const controller = new AbortController();

    if (context && context.user.userId) {
      getDocuments<{ Items: Document[] }>(controller, context.user.userId).then(
        (res) => {
          dispatch(setDocuments(res.Items));
        }
      );
    }

    return () => {
      controller.abort();
    };
  }, [context && context.user.userId]);

  return (
    <>
      <div
        id="main-layout"
        className="h-screen  flex dark:bg-[#121212] w-screen relative overflow-hidden"
      >
        <Navigation />
        <Search></Search>

        <main id="main" className="flex-1 h-full overflow-y-auto relative ">
          {children}
        </main>
      </div>
    </>
  );
};

export default MainLayer;
