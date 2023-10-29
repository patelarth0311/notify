import Image from "next/image";
import { useAppSelector, isNavOpen, useAppDispatch, expand, collapse } from "@/app/hooks/store";
import { useState } from "react";
import { memo } from "react";
import Skeleton from "./skeleton";
interface NavbarProps {
    children: React.ReactNode
    title: string,
    loading: boolean,
}


const Navbar = memo(({children, title, loading}: NavbarProps) => {
   
    const isOpen = useAppSelector(isNavOpen)
    const [isHover, setHovering] = useState(false)
    const dispatch = useAppDispatch()
    return <nav className="flex z-[1000] items-center  dark:bg-[#191919] flex-row justify-start gap-x-3  max-w-[100vw] p-2 ">

    {!isOpen && (
        <button 
        onClick={(e) => {isHover ? dispatch(expand()) : () => {}}}
        onMouseLeave={(e) => {setHovering(false);}}
        onMouseEnter={(e) => {setHovering(true);}}>
  <Image alt={"menu"} width={30} height={30} src={ !isHover ? "/menu.svg" : "/chevright.svg"}></Image>
        </button>
    )
    }
    
   

    { loading ? <Skeleton style="w-[100px] h-[24px] rounded-[10px]"></Skeleton> : 
    <h6 className="font-medium whitespace-nowrap text-[1em] ">{title}</h6>
    }
   
   <div className="flex-grow flex-shrink">
        
        </div>
      
    <div className="flex w-full justify-end items-center gap-x-1">

        { loading ? <Skeleton style="w-[100px] h-[20px] rounded-[10px]"></Skeleton> :
        <>    {children}</>
        }

    </div>


    </nav>
})

export default Navbar;