import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import { deleteDocument, favorite } from "@/app/requests";
import { Document } from "@/app/requests";
import { useContext, useState } from "react";
import { memo } from "react";

import { useToast } from "@/app/hooks/useToast";
import {
  useAppDispatch,
  setADocument,
  removeADocument,
} from "@/app/hooks/store";
import { UserContext } from "@/app/context";
const DocOption = ({
  image,
  action,
  text,
}: {
  image: string;
  action: () => void;
  text: string;
}) => {
  return (
    <button
      className="flex items-center  w-full text-sm font-medium text-gray-400	"
      onClick={() => action()}
    >
      <Image
        alt=" "
        style={{ width: 20, height: 20 }}
        width={20}
        height={20}
        src={image}
      ></Image>
      {text && <p className="pl-4">{text}</p>}
    </button>
  );
};

const DocOptions = memo(
  ({ documentId, starred, style }: Document & { style?: string }) => {
    const router = useRouter();
    const [expand, setExpand] = useState(false);
    const dispatch = useAppDispatch();
    const { makeToast } = useToast();

    const context = useContext(UserContext)

    return (
      <div
        className={`${style} flex ${
          expand
            ? "flex-col rounded-[20px] gap-y-3 min-w-[150px] z-[200] dark:bg-[#292929e6]  backdrop-blur-lg p-[10px] aspect-square justify-center items-center shadow-lg"
            : "flex-row  gap-x-3 justify-center "
        } items-center p-2 `}
      >
        <DocOption
          text={expand ? "Options" : ""}
          image={"/more.svg"}
          action={() => setExpand((prev) => !prev)}
        ></DocOption>
        <DocOption
          text={expand ? "View more" : ""}
          image={"/viewmore.svg"}
          action={() => router.push(`/documents/${documentId}`)}
        ></DocOption>

        {expand && (
          <>
            <DocOption
              text={expand ? "Favorite" : ""}
              image={starred ? "/fillstar.svg" : "/star.svg"}
              action={() =>
                
              { if (context) {
                favorite<Document>(documentId,context.user.userId).then((res) => {
                  dispatch(setADocument({ updatedDocument: res }));
                  makeToast({
                    ...res,
                    editMessage: `Added ${res.documentName} to favorites`,
                  });
                })
               }}
              }
            ></DocOption>
            <DocOption
              text={expand ? "Delete" : ""}
              image={"/trash.svg"}
              action={() =>
               { 

                if (context) {
                  deleteDocument<Document>(documentId, context.user.userId).then((res) => {
                    dispatch(removeADocument({ removedDocument: res }));
                    makeToast({
                      ...res,
                      editMessage: `Deleted document ${res.documentName}`,
                    });
  
  
                  })
                }
              
              }
              }
            ></DocOption>
          </>
        )}
      </div>
    );
  }
);

DocOptions.displayName = "DocOptions"

export default DocOptions;
