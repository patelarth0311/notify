"use client";

import React, { useCallback, useState } from "react";
import { DocumentCard } from "../../_components/documentcard";
import Image from "next/image";

import Navbar from "../../_components/navbar";
import { getDocuments, Document, getSummary } from "@/app/requests";
import { useEffect } from "react";

import { memo } from "react";
import { useRef } from "react";
import { Modal } from "@/app/_components/search";
import Skeleton from "../../_components/skeleton";
import useModal from "@/app/hooks/use-modal";
import {
  useAppDispatch,
  useAppSelector,
  isModalOpennable,
  setDocuments,
  isNavOpen,
} from "@/app/hooks/store";
import { Alert } from "../../_components/alert";
import { Edits } from "../../_components/edits";
import {
  docsState,
  setPaginatedRecentsDocuments,
  setPaginatedAllDocuments,
} from "@/app/hooks/store";


import { Option } from "../../_components/option";


const DocumentsLayer = () => {
  const dispatch = useAppDispatch();
  const show = useAppSelector(isModalOpennable);
  const isOpen = useAppSelector(isNavOpen);

  const {
    documents,
    loading,
    paginatedRecentsDocuments,
    paginatedAllDocuments,
  } = useAppSelector(docsState);

  const allDivRef = useRef<HTMLDivElement | null>(null);

  const handleVerticalScroll = () => {
    const div = allDivRef.current;

    if (div) {
      const isAtBottom =
        div.scrollHeight - div.scrollTop - div.clientHeight < 1;

      if (isAtBottom && documents.length > paginatedAllDocuments.length) {
        dispatch(setPaginatedAllDocuments());
      }
    }
  };

  useEffect(() => {
    handleVerticalScroll();
  }, [allDivRef, documents.length == 0]);

  const [showAll, setShowAll] = useState(false);
  const [showEdits, setShowEdits] = useState(false);

  const viewalloption = useCallback(() => {
    setShowAll((prev) => !prev);
  }, []);

  const viewedits = useCallback(() => {
    setShowEdits((prev) => !prev);
  }, []);

  return (
    <div className="  flex relative flex-col h-full w-full overflow-hidden">
      <Navbar loading={loading} title={""}>
        <Option
          icon={"/bell.svg"}
          action={() => {
            viewedits();
          }}
        ></Option>
        <Option
          icon={"/grid.svg"}
          action={() => {
            viewalloption();
          }}
        ></Option>
      </Navbar>

      <main className=" flex flex-col items-center  overflow-auto">
        <div
          ref={allDivRef}
          onScroll={handleVerticalScroll}
          className="pl-[2%] pr-[2%] flex h-full w-full flex-col gap-y-10 justify-start    overflow-auto p-3 "
        >
          <div className="w-full flex justify-center pb-[100px] pt-[50px] ">
            <div
              className={`grid  grid-cols-1 ${
                isOpen
                  ? "nav-md:grid-cols-2 nav-lg:grid-cols-2  nav-xl:grid-cols-3  nav-2xl:grid-cols-4"
                  : "md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 "
              } gap-x-4 gap-y-4`}
            >
              {loading ? (
                <>
                  {[1, 2, 3].map((item, key) => (
                    <Skeleton
                      key={item}
                      style={
                        "dark:bg-[#191919]  flex-1 w-full  w-[338px] h-[354px]  aspect-square  relative    	shadow-lg rounded-[22px]  overflow-hidden "
                      }
                    ></Skeleton>
                  ))}
                </>
              ) : (
                <>
                  {paginatedAllDocuments.map((item, key) => (
                    <DocumentCard
                    
                      loading={loading}
                      showSmallTitle={false}
                      style={
                        "dark:bg-[#191919]  flex-1   w-[338px] h-[354px]  relative    	shadow-lg rounded-[22px]  overflow-hidden "
                      }
                      key={item.documentId}
                      {...item}
                    >
                      <></>
                    </DocumentCard>
                  ))}

                  {documents.length > paginatedAllDocuments.length && (
                    <Skeleton
                      style={
                        " dark:bg-[#191919]  flex-1  w-[338px] h-[354px]   relative    	shadow-lg rounded-[22px]  overflow-hidden"
                      }
                    ></Skeleton>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        <DocGrid
          loading={loading}
          documents={documents}
          showAll={showAll}
          setShowAll={() => setShowAll(false)}
        ></DocGrid>
        {showEdits && <Edits></Edits>}
      </main>
    </div>
  );
};

const DocGrid = ({
  documents,
  showAll,
  loading,
  setShowAll
}: {
  documents: Document[];
  showAll: boolean;
  loading: boolean;
  setShowAll: () => void
}) => {
  const [query, setQuery] = useState("");
  const {ref} = useModal(() => setShowAll())

  return (
    showAll && (
      <Modal zindex={8000}>
        <div  className="flex justify-start  relative flex-col items-center w-full h-full content-center ">
          <div  className="  top-[80px] fixed w-full z-[8001] pl-[5%] pr-[5%] justify-center items-center flex ">
            <div className="flex flex-1 ml-[20%] mr-[20%]  max-w-[500px] shadow-lg backdrop-blur-lg  dark:bg-[#1f1f1fe6] rounded-[10px]  p-[_0px_16px_0px_12px] items-center justify-center min-h-[50px]">
              <Image
                style={{
                  width: 19,
                  height: 19,
                }}
                className="mr-3"
                alt={"mg"}
                width={19}
                height={19}
                src={"/search.svg"}
              ></Image>
              <div className="w-full relative">
                <input
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                  }}
                  className="p-0 bg-inherit w-full"
                  placeholder="Search "
                ></input>
              </div>
            </div>
          </div>

          <div  className="w-full justify-center flex  ">
            <div className=" h-auto z-[2000]  overflow-scroll gap-y-5 gap-x-5 top-[120px] absolute grid  md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4  pb-[4.25rem] grid-cols-1  ">
              {documents
                .filter((doc) =>
                  doc.documentName.toLowerCase().includes(query.toLowerCase())
                )
                .map((item, key) => (
                  <DocumentCard
                    loading={loading}
                    showSmallTitle={true}
                    style={
                      "dark:bg-[#191919]  flex-1 self-center relative self-center  aspect-square min-w-[200px]	shadow-lg rounded-[20px]  overflow-hidden "
                    }
                    key={item.documentId}
                    {...item}
                  >
                    <></>
                  </DocumentCard>
                ))}
            </div>
          </div>
        </div>
      </Modal>
    )
  );
};

export default DocumentsLayer;