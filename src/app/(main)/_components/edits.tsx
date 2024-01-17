import { Modal } from "@/app/_components/search";
import { Document } from "@/app/requests";
import { Alert } from "./alert";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  useAppSelector,
  toastState,
  useAppDispatch,
  removeToast,
} from "@/app/hooks/store";
export const Edits = () => {
  const toasts = useAppSelector(toastState);
  const dispatch = useAppDispatch();

  return (
    <div className="fixed right-0 z-[1000] max-w-[359px] w-full ">
      <div className="  flex h-auto ">
        <div className="flex  overflow-y-scroll pb-[50px] flex-col gap-y-3 w-full pt-3 pr-2 pl-2 items-end justify-start">
          {toasts.map((toast, key) => (
            <Alert
              action={() => {
                dispatch(removeToast({ removedToast: toast }));
              }}
              key={toast.documentId}
            >
              <EditDetail {...toast}></EditDetail>
            </Alert>
          ))}
        </div>
      </div>
    </div>
  );
};

export const EditDetail = (document: Document) => {
  const router = useRouter();
  return (
    <div
      role="button"
      onClick={() => {
        router.push(`/documents/${document.documentId}`);
      }}
      className=" h-full items-center p-2.5 gap-x-2 grid grid-cols-[70px_1fr] w-full "
    >
      <div className="h-[70px]  aspect-square relative  ">
        <Image
          sizes=""
          fill
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            borderRadius: "5px",
          }}
          onLoadingComplete={() => {}}
          placeholder="empty"
          quality={100}
          draggable="true"
          priority
          src={document.documentImageURL}
          alt=""
        ></Image>
      </div>

      <div className="flex flex-col h-full  flex-1 w-full">
        <div className="flex justify-between w-full ">
          <p className=" self-start text-sm  font-medium">
            {document.documentName}
          </p>
          <p className=" self-start text-sm   text-gray-400   font-small">
            {new Date(Number(document.documentId)).toLocaleTimeString()}
          </p>
        </div>
        <p className=" self-end text-sm w-full flex-1    text-gray-400   font-small">
          {document.editMessage}
        </p>
      </div>
    </div>
  );
};
