import React from "react";
import Image from "next/image";
interface OptionProps {
    icon: string;
    action: () => void;
  }
  
  
export const Option = ({ icon, action }:  OptionProps) => {
    return (
      <button className="min-w-[20px] " onClick={action}>
        <Image
          alt={icon}
          style={{
            width: 20,
            height: 20,
          }}
          width={20}
          height={20}
          src={icon}
        ></Image>
      </button>
    );
  };
  
  Option.displayName = "Option"