import { useState } from "react";
import Image from "next/image";
import { Expand } from "tailwindcss/types/config";
interface IslandProps {
  image: string;
}

interface CompactIslandProps extends IslandProps {}

interface ExpandedIslandProps extends IslandProps {}

export function Island({ image }: IslandProps) {
  const [expand, setExpand] = useState(false);
  return (
    <div className=" z-[9000] ">
      <CompactIsland image={image}></CompactIsland>
    </div>
  );
}

function CompactIsland({ image }: CompactIslandProps) {
  return (
    <div className="w-[38px] h-[38px] bg-black rounded-full shadow-lg flex justify-center items-center">
      <Image width={21} height={21} alt="magic" src={image}></Image>
    </div>
  );
}

function ExpandedIsland({ image }: ExpandedIslandProps) {
  return (
    <div className="w-[173px] items-center flex p-2 h-[38px] bg-black rounded-full shadow-lg">
      <Image width={21} height={21} alt="magic" src={image}></Image>
    </div>
  );
}
