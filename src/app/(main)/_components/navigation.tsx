import React, { useContext, useEffect } from "react";
import { NavItem } from "./navitem";
import { DocumentItem } from "./documentitem";

import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/app/hooks/store";
import { openModal } from "@/app/hooks/store";
import Navbar from "./navbar";
import Image from "next/image";
import { useState } from "react";
import { useRef, ElementRef } from "react";
import { collapse } from "@/app/hooks/store";
import {
  useAppSelector,
  isNavOpen,
  docsState,
  setDocuments,
  appendDocument,
} from "@/app/hooks/store";
import { addDocument } from "@/app/requests";
import { getDocuments } from "@/app/requests";
import { Document } from "@/app/requests";
import Skeleton from "./skeleton";
import { useToast } from "@/app/hooks/useToast";
import * as AWS from "aws-sdk/global";
import { CognitoUserPool } from "amazon-cognito-identity-js";
import { UserContext } from "@/app/context";


const Navigation = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { documents, loading } = useAppSelector(docsState);
  const context = useContext(UserContext)
  const isOpen = useAppSelector(isNavOpen);
  const { makeToast } = useToast();

  const handleCollapse = () => {
    dispatch(collapse());
  };

  return (
    <nav
      className={`h-full  overflow-y-auto flex ${
        isOpen ? "w-60" : "w-0"
      } flex-col relative `}
    >
      {isOpen && (
        <>
          {loading ? (
            <Skeleton style="w-full h-full"></Skeleton>
          ) : (
            <>
              <div className="flex flex-col dark:bg-[#1f1f1f] h-full items-start  gap-y-5 pt-4">
                <>
                  <div>
                  <LoggedNav></LoggedNav>
                    <NavItem
                      icon={"/home.svg"}
                      text={"Home"}
                      action={() => router.push("/documents")}
                    ></NavItem>
                    <button
                      onClick={() => {
                        handleCollapse();
                      }}
                      className="rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600 absolute top-4 right-2 opacity-100 group-hover/sidebar:opacity-100 transition"
                    >
                      <Image
                        alt={"left"}
                        style={{
                          width: 30,
                          height: 30,
                        }}
                        width={30}
                        height={30}
                        src={"/chevleft.svg"}
                      ></Image>
                    </button>
                    <NavItem
                      icon={"/search.svg"}
                      text={"Search"}
                      action={() => dispatch(openModal())}
                    ></NavItem>
                    <NavItem
                      icon={"/add.svg"}
                      text={"New page"}
                      action={() => {
                       if (context) {
                        addDocument<Document>(context.user.userId).then((res) => {
                          dispatch(appendDocument({ newDocument: res }));
                          router.push(`/documents/${res.documentId}`);
                          makeToast({
                            ...res,
                            editMessage: `Created new document ${res.documentName}`,
                          });
                        });
                       }
                      }}
                    ></NavItem>
                  </div>

                  <div className="w-full h-full overflow-scroll pb-3">
                    {documents.map((doc, index) => (
                      <DocumentItem
                        key={doc.documentId}
                        {...doc}
                      ></DocumentItem>
                    ))}
                  </div>
                </>
              </div>
            </>
          )}
        </>
      )}
    </nav>
  );
};

export default Navigation;

function UserModal() {
  const router = useRouter()
  return     <div 
  className=" w-[150px] absolute left-[10px] z-10 h-[40px] top-[50px] shadow-lg right-2  dark:bg-[#181818] rounded-[20px] backdrop-blur-lg ">
  

  <div className="flex w-full h-full flex-col gap-y-[5px] justify-center ">
<NavItem
text="Sign out"
icon={"/logout.svg"}
action={() => {
  signOut(() => router.push("/"))
}}
></NavItem>
  </div>
  </div>
}

 function signOut(action: () => void) {


  var poolData = {
    UserPoolId: "us-east-1_qYqgHGG06",
    ClientId: "7qinghbiqlttnjthgkgh4cesnj",
  };
  var userPool = new CognitoUserPool(poolData);
  try {
    const cognitoUser = userPool.getCurrentUser();
    if (cognitoUser) {
       cognitoUser.signOut();
    }

    // Clear local storage or session storage
    localStorage.clear();
    sessionStorage.clear();
    action()
    // Optionally, redirect to a specific page after logout

  } catch (error) {
    console.error('Error signing out:', error);
  }

  // Clear local storage or session storage

}

function LoggedNav() {

const [showOptions, setShow] = useState(false)
const context = useContext(UserContext)

return      <>
{context && (
   <div>
   <NavItem
   text={context.user.userId}
   icon={"/userwhite.svg"}
   action={() => {
     setShow((prev) => !prev)
   }}
   ></NavItem>
   
     {showOptions && (
       <UserModal></UserModal>
     )
   
     }
   
   </div>
)
}
</>
}