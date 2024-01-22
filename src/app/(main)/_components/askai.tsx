import React, { useState } from "react";
import { useEffect } from "react";
import Image from "next/image";
import { getSummary } from "@/app/requests";
import { useCallback } from "react"
import {
  useAppDispatch,
  useAppSelector,
  docsState,
  askAIState,
  setAskAI,
} from "@/app/hooks/store";
import { fetchChatHistory } from "@/app/requests";
import { Block, BlockNoteEditor, PartialBlock } from "@blocknote/core";
import useModal from "@/app/hooks/use-modal";
import { Option } from "./option";


function AIInput({ editor }: { editor: BlockNoteEditor }) {
  const [prompt, setPrompt] = useState("");
  const [fetching, setFetching] = useState(false);

return       <div className="w-full   bg-[#000000bf] rounded-[7px] p-3 shadow-lg flex gap-x-1">
<input
  placeholder={fetching ? "AI is fetching" : "Ask AI"}
  value={prompt}
  disabled={fetching}
  onChange={(e) => {
    setPrompt(e.target.value);
  }}
  className="w-full bg-inherit"
></input>
<button
  disabled={fetching}
  onClick={() => {
    const now = new Date();
    const id =
      now.getDay().toString() +
      now.getHours().toString() +
      now.getMinutes().toString() +
      now.getSeconds() +
      now.getFullYear().toString();
    var controller = new AbortController();

    setFetching(true);

    getSummary<string>(prompt, id, controller).then((res) => {
      setFetching(false);
      const currentBlock: Block = editor.getTextCursorPosition().block;

      const askAI: PartialBlock = {
        type: "paragraph",

        content: [{ type: "text", text: res, styles: {} }],
      };

      editor.insertBlocks([askAI], currentBlock, "after");
    });
    setPrompt("");
  }}
>
  {!fetching && (
    <Image
      width={25}
      height={25}
      alt={"send"}
      src={"/send.svg"}
    ></Image>
  )}
</button>
</div>
}

export function AskAI({ editor }: { editor: BlockNoteEditor }) {

  const dispatch = useAppDispatch();

  const { ref } = useModal(() => dispatch(setAskAI({ ask: false })));

  return (
    <div ref={ref} className=" absolute max-w-[700px]  w-full left-[54px] flex flex-col gap-y-[10px] z-[20]">
      <AIToolBarOptions></AIToolBarOptions>
      <AIInput editor={editor}></AIInput>
    </div>
  );
}

function AIOption({render} : {render: () =>  React.JSX.Element})  {

  const [showHelperText, setShowHelperText] = useState(false)

  return <div  className="flex flex-col gap-y-[10px] "
  onMouseLeave={() => setShowHelperText(false)}
  onMouseEnter={() => setShowHelperText(true)}>
    { showHelperText && (
      <p className="text-sm w-[auto] top-[-65px] dark:bg-[#000000ce]  p-2 rounded-[7px] shadow-sm">Upload a document to give AI more context</p>
    )
      
    }
    <div className="dark:bg-[#000000ce] w-[35px] rounded-[7px]  shadow-lg p-1  backdrop-blur-lg ">
    {render()}
    </div>
  
  </div>
}

function AIToolBarOptions() {
  const handleUpload = async (file : File ) => {
  
    const formData = new FormData();
    formData.append('file', file);
  
    await fetch(`/api/aicontext`,{
       
      method: 'POST',
      body: formData,
    
})
}
  return <div className="">

    <AIOption render={() => <>
      <input

onChange={(e) => {

  if (e.target.files) {
    handleUpload(e.target.files[0])
  }
}}
  accept=".txt,.pdf"
  type="file"
  id="input-file"
  style={{ display: "none" }}
  />
  <label htmlFor="input-file">
<Image width={25}  height={25} alt={"more"} src={"/file.svg"}></Image>
</label>
    </>}></AIOption>

  </div>
}
