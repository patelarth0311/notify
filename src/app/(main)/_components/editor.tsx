"use client";
import React, { ReactNode, useEffect } from "react";
import {
  Theme,
  darkDefaultTheme,
  lightDefaultTheme,
  BlockNoteView,
  DragHandleMenu,
  RemoveBlockButton,
  DragHandleMenuItem,
  ColorStyleButton,
  DefaultSideMenu,
  BlockColorsButton,
  DragHandleMenuProps,
  Toolbar,
  ToggledStyleButton,
  ToolbarButton,
} from "@blocknote/react";
import "@blocknote/core/style.css";
import { Document, getDocument, getSummary } from "@/app/requests";
import useEditor from "@/app/hooks/user-editor";
import { Block, BlockNoteEditor, PartialBlock } from "@blocknote/core";
import {
  DragHandle,
  FormattingToolbarPositioner,
  HyperlinkToolbarPositioner,
  SideMenu,
  SideMenuButton,
  SideMenuPositioner,
  SideMenuProps,
  SlashMenuPositioner,
  useBlockNote,
} from "@blocknote/react";
import "@blocknote/core/style.css";
import { MdDelete } from "react-icons/md";
import { useCallback } from "react";
import Image from "next/image";
import { useAppSelector, askAIState } from "@/app/hooks/store";
interface EditorProps {
  doc: Document;
  editable: boolean;
}

import { AskAI } from "./askai";

const Editor = ({ doc, editable }: EditorProps) => {
  const editor = useEditor(doc, editable);
  const askAI = useAppSelector(askAIState);

  const lighttheme = {
    ...lightDefaultTheme,
  } satisfies Theme;

  // Custom red dark theme
  const darkTheme = {
    ...lighttheme,
    colors: {
      ...darkDefaultTheme.colors,
      editor: {
        ...darkDefaultTheme.colors.editor,
        background: "none",
      },
    },
  } satisfies Theme;

  // Combining the custom themes into a single theme object.
  const theme = {
    light: lighttheme,
    dark: darkTheme,
  };

  const CustomDragHandleMenu = (props: {
    editor: BlockNoteEditor;
    block: Block;
  }) => {
    return (
      <DragHandleMenu>
        {/*Default item to remove the block.*/}

        <RemoveBlockButton {...props}>Delete</RemoveBlockButton>
        {/*Custom item which opens an alert when clicked.*/}
        <BlockColorsButton {...props}>Colors</BlockColorsButton>
      </DragHandleMenu>
    );
  };

  return (
    <>
     
      <BlockNoteView
        spellCheck={true}
        theme={theme}
        className="bg-[inherit]"
        editor={editor}
        style={{position: "relative"}}
      >
        <FormattingToolbarPositioner
          editor={editor}
          formattingToolbar={CustomFormattingToolbar}
        />
        <HyperlinkToolbarPositioner editor={editor} />
        <SlashMenuPositioner editor={editor} />
        <SideMenuPositioner
          editor={editor}
          sideMenu={(props) => (
            <DefaultSideMenu {...props} dragHandleMenu={CustomDragHandleMenu} />
          )}
        />
         {askAI && <AskAI editor={editor}></AskAI>}
      </BlockNoteView>

    
    </>
  );
};

const CustomFormattingToolbar = (props: { editor: BlockNoteEditor }) => {
  // Tracks whether the text & background are both blue.

  return (
    <>
      <Toolbar>
        {/*Default button to toggle bold.*/}
        <ToggledStyleButton editor={props.editor} toggledStyle={"bold"} />
        {/*Default button to toggle italic.*/}
        <ToggledStyleButton editor={props.editor} toggledStyle={"italic"} />
        {/*Default button to toggle underline.*/}
        <ToggledStyleButton editor={props.editor} toggledStyle={"underline"} />
        {/*Custom button to toggle blue text & background color.*/}
        <ToolbarButton
          mainTooltip={"Summarize"}
          onClick={() => {
            const currentBlock: Block =
              props.editor.getTextCursorPosition().block;
            const nextBlock = props.editor.getTextCursorPosition().nextBlock;
            const currentPosition = currentBlock.id;
              
            const now = new Date();
            const id =
              now.getDay().toString() +
              now.getHours().toString() +
              now.getMinutes().toString() +
              now.getSeconds() +
              now.getFullYear().toString();

            var controller = new AbortController();

            getSummary<string>(
              `Summarize the following: ${window.getSelection()!.toString()}`,
              id,
              controller
            ).then((res) => {
              const summarizeAI: PartialBlock = {
                type: "paragraph",

                content: [{ type: "text", text: res, styles: {} }],
              };

              props.editor.insertBlocks([summarizeAI], currentBlock, "after");
            });
          }}
        >
          <Image
            className="self-center"
            width={16}
            height={16}
            alt={"magic"}
            src={"/magic.svg"}
          ></Image>
        </ToolbarButton>
      </Toolbar>
    </>
  );
};

export default Editor;
