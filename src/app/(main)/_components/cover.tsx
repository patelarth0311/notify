"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef } from "react";
import useCover from "@/app/hooks/use-cover";
import { useState } from "react";
import { CoverOption } from "./coveroptions";
import { memo } from "react";

const Cover = memo(
  ({ url, documentId }: { url: string; documentId: string }) => {
    const { ref, height } = useCover();
    const [value, setValue] = useState(0);
    const [showOptions, setShowOptions] = useState(false);

    return (
      <div
        className="z-[1000]"
        onMouseEnter={() => {
          setShowOptions(true);
        }}
        onMouseLeave={() => {
          setShowOptions(false);
        }}
      >
        <Image
          sizes="width:100%"
          fill
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: `center ${value}%`,
          }}
          onLoadingComplete={() => {}}
          placeholder="empty"
          quality={100}
          ref={ref}
          draggable="true"
          priority
          onDragEnd={(e) =>
            setValue(Math.min((Math.max(0, e.clientY) / height) * 100, 100))
          }
          onDrag={(e) => {
            setValue(Math.min((Math.max(0, e.clientY) / height) * 100, 100));
          }}
          src={url}
          alt={"Cover"}
        ></Image>

        <div
          className={
            `absolute bottom-2  right-2 text-[#7F7F7F] text-[12px] bg-[#252525] p-1 rounded-[5px] ` +
            `${showOptions ? "opacity-1" : "opacity-0"}`
          }
        >
          <CoverOption
            type="Change cover"
            documentId={documentId}
          ></CoverOption>
        </div>
      </div>
    );
  }
);

export default Cover;
