import Image from "next/image";
import {
  useAppSelector,
  isNavOpen,
  useAppDispatch,
  expand,
  collapse,
} from "@/app/hooks/store";
import { useState } from "react";
import { memo } from "react";
import Skeleton from "./skeleton";

interface NavbarProps {
  children: React.ReactNode;
  title: string;
  loading: boolean;
}

const Navbar = memo(({ children, title, loading }: NavbarProps) => {
  const isOpen = useAppSelector(isNavOpen);
  const [isHover, setHovering] = useState(false);
  const dispatch = useAppDispatch();
  return (
    <nav className="flex  items-center h-[50px] dark:bg-[#191919] flex-row justify-between gap-x-3  max-w-[100vw] p-3 ">
      {!isOpen && (
        <>
        { loading ?   <Skeleton style="w-[30px] h-[30px] rounded-[5px]"></Skeleton> :

        <button
          className="min-w-[30px] "
          onClick={(e) => {
            isHover ? dispatch(expand()) : () => {};
          }}
          onMouseLeave={(e) => {
            setHovering(false);
          }}
          onMouseEnter={(e) => {
            setHovering(true);
          }}
        >
          <Image
            alt={"menu"}
            style={{
              width: 30,
              height: 30,
            }}
            width={30}
            height={30}
            src={!isHover ? "/menu.svg" : "/chevright.svg"}
          ></Image>
        </button>

        }
        </>
      )}

      {loading ? (
        <Skeleton style="w-[100px] h-[24px] rounded-[10px]"></Skeleton>
      ) : (
        <h6 className="font-medium whitespace-nowrap text-[1em] ">{title}</h6>
      )}

      <div className="flex-grow flex-shrink flex justify-center  "></div>

      <div className="flex  justify-end items-center gap-x-2 ">
        {loading ? (
          <Skeleton style="w-[100px] h-[20px] rounded-[10px]"></Skeleton>
        ) : (
          <>{children}</>
        )}
      </div>
    </nav>
  );
});
Navbar.displayName = "Navbar"
export default Navbar;
