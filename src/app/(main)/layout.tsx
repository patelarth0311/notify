"use client";

import React from "react";
import Navigation from "./_components/navigation";
import Search from "../_components/search";
import { useEffect } from "react";
import { Document, getDocument, getDocuments } from "../requests";
import { useAppDispatch, setDocuments, docsState } from "../hooks/store";
import { useContext } from "react";
import { UserContext } from "../context";

const MainLayer = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useAppDispatch();


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
  }, []);

  return (
    <>
      <div
        id="main-layout"
        className="h-screen  flex dark:bg-[#121212] w-screen relative overflow-hidden"
      >
        <Search></Search>
        <Navigation />
       

        <main id="main" className="flex-1 h-full overflow-y-auto relative ">
          {children}
        </main>
      </div>
    </>
  );
};

export default MainLayer;
