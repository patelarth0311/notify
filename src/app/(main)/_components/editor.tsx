
"use client"
import React from "react";
import {
  Theme,  darkDefaultTheme,
  lightDefaultTheme ,
  BlockNoteView
  
} from "@blocknote/react";
import "@blocknote/core/style.css";
import { Document,getDocument } from "@/app/requests";
import useEditor from "@/app/hooks/user-editor";
interface EditorProps {
    doc: Document
    action?: () => void
}

const Editor = ({doc, action}: EditorProps) => {

    const editor = useEditor(doc)

    const lighttheme = {
       
        ...lightDefaultTheme
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
        light: lighttheme ,
        dark: darkTheme,
      };
  
      

  

    return <BlockNoteView   key={JSON.stringify(editor.topLevelBlocks)}theme={theme} className="bg-[inherit]" editor={editor}>

        </BlockNoteView>
}

export default Editor;