import {
  DynamoDB,
  DynamoDBClient,
  UpdateItemCommand,
  UpdateItemInput,
  UpdateTableInput,
  QueryCommand,
  QueryCommandInput,
} from "@aws-sdk/client-dynamodb";
import { useContext, useEffect, useState } from "react";
import { Document, getDocument } from "@/app/requests";
import Cover from "./cover";
import Image from "next/image";
import CoverOption  from "./coveroptions";
import Skeleton from "./skeleton";
import { useMemo } from "react";
import { useCallback } from "react";
import { setADocument, useAppDispatch } from "@/app/hooks/store";

import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import { useToast } from "@/app/hooks/useToast";
import { UserContext } from "@/app/context";

export const HeaderView = ({
  documentId,
  documentName,
  documentImageURL,
  showCoverThumbPrint,
  showSmallTitle,
  loading,
  editable,
}: Document & {
  showCoverThumbPrint: boolean;
  showSmallTitle?: boolean;
  loading: boolean;
  editable: boolean;
}) => {
  const [showOptions, setShowOptions] = useState(false);
  const [header, setHeader] = useState(documentName);
  const dispatch = useAppDispatch();
  const { makeToast } = useToast();
  useEffect(() => {
    setHeader(documentName);
  }, [loading]);

  var timer: NodeJS.Timeout | undefined = useMemo(() => {
    return undefined;
  }, []);

  const updateHeader = useCallback(
    (newvalue: string) => {
      if (timer) {
        clearTimeout(timer as NodeJS.Timeout);
      }

      const delayDebounceFn = setTimeout(async () => {
        updateDocName(newvalue, documentId);
      }, 1000);
      timer = delayDebounceFn;
    },
    [header, documentId]
  );



  const context = useContext(UserContext)

  const updateDocName = async (name: string, documentId: string) => {


    if (context) {
    
      fetch(`/api/cred?userId=${context.user.userId}&name=${name}&documentId=${documentId}`,{
        method: "GET",
    }).then((res) => res.json()).then(res => {
  
  
      
      dispatch(
        setADocument({
          updatedDocument: {
            ...(res as Document),
            editMessage: `Changed title to ${name}`,
          },
        })
      );
      makeToast({
        ...(res as Document),
        editMessage: `Changed title to ${name}`,
      });
  
  
    })
    }
  };

  return (
    <>
      {loading ? (
        <SkeletonHeader hasImage={true}></SkeletonHeader>
      ) : (
        <>
          <div
            className={`relative w-full   ${
              documentImageURL || loading ? "h-[min(50%,35vh)] " : ""
            }  `}
          >
            {documentImageURL && (
              <Cover documentId={documentId} url={documentImageURL}></Cover>
            )}
          </div>

          <div
            onMouseEnter={() => {
              setShowOptions(true);
            }}
            onMouseLeave={() => {
              setShowOptions(false);
            }}
            className={`w-full    z-[0] ${
              showSmallTitle ? "" : "pr-[54px] pl-[54px]"
            }  mt-4`}
          >
            {documentImageURL == "" && showOptions && loading == false && (
              <div
                className={`absolute  z-[9000]  ${
                  showSmallTitle ? "left-[10%]" : "left-[50px]"
                } text-[#7F7F7F] text-[12px] opacity-[${
                  showOptions ? 1 : 0
                }] bg-[#252525] p-1 rounded-[5px]`}
              >
                <CoverOption
                  type="Add cover"
                  documentId={documentId}
                ></CoverOption>
              </div>
            )}

            <>
              {documentImageURL && showCoverThumbPrint && (
                <div className="mt-[-70px] z-[0] w-[140px] h-[140px] relative flex justify-center items-center">
                  <Image
                    fill
                    sizes=""
                    alt={"Cover"}
                    style={{
                      objectFit: "cover",
                      width: "100%",
                      height: "100%",
                    }}
                    src={documentImageURL}
                  ></Image>
                </div>
              )}
            </>

            <>
              {showSmallTitle ? (
                <div
                  className={`w-full relative font-bold flex items-center ps-[10%] pe-[10%] + ${
                    documentImageURL ? "pt-3" : "pt-[1.9rem]"
                  }`}
                >
                  <h1 className="w-full whitespace-nowrap ">{documentName}</h1>
                </div>
              ) : (
                <div className="w-full relative text-[40px] font-bold flex items-center ">
                  <br></br>
                  <br></br>
                  <input
                    disabled={editable}
                    className="w-full bg-inherit "
                    value={header}
                    onChange={(e) => {
                      setHeader(e.currentTarget.value);
                      updateHeader(e.currentTarget.value);
                    }}
                  ></input>
                </div>
              )}
            </>
          </div>
        </>
      )}
    </>
  );
};

const SkeletonHeader = ({ hasImage }: { hasImage: boolean }) => {
  return (
    <>
      <div
        className={`relative w-full   ${hasImage ? "h-[min(50%,35vh)]" : ""}  `}
      >
        <Skeleton style="relative w-full h-full "></Skeleton>
      </div>

      <div className={`w-full    z-[0]  pr-[54px] pl-[54px]  mt-4`}>
        <Skeleton style="mt-[-70px] w-[140px] h-[140px] relative flex justify-center items-center"></Skeleton>

        <Skeleton style="w-[500px] h-[40px] rounded-[5px] mt-5 mb-5"></Skeleton>
      </div>
    </>
  );
};
