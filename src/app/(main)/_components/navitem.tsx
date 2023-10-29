import Image from "next/image"
export interface NavItemProps  {
    action: () => void
    icon: string
    text: string
}

const NavItem = ({action, icon, text} : NavItemProps) => {
    return <button 

        className="flex p-3 hover:bg-gray-700 hover:rounded-full gap-x-[5px] group min-h-[27px] text-sm py-1 pr-3 w-full hover:bg-primary/5  items-center text-muted-foreground font-medium"
        onClick={action}>
         <Image alt={icon} width={19} height={19} src={icon}></Image>
        <p>{text}</p>
    </button>
}
export {NavItem};