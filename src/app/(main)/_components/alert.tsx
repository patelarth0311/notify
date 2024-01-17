import React from "react";
import { useState } from "react";
import Image from "next/image";
export const Alert = ({
  children,
  action,
}: { children: React.ReactNode } & { action: () => void }) => {
  const [showClose, setShowClose] = useState(false);

  return (
    <div
      onMouseEnter={() => {
        setShowClose(true);
      }}
      onMouseLeave={() => {
        setShowClose(false);
      }}
      className="max-w-[359px] relative w-full dark:bg-[#1f1f1fe6] shadow-lg  min-h-[87px]  backdrop-blur-lg rounded-[16px] "
    >
      {children}
      {showClose && (
        <button
          onClick={() => {
            action();
          }}
          className="absolute top-[-6px] left-[-6px]  rounded-full"
        >
          <Image alt="close" width={20} height={20} src="/x.svg"></Image>
        </button>
      )}
    </div>
  );
};
