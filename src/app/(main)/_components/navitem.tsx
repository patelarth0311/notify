import Image from "next/image";
export interface NavItemProps {
  action: () => void;
  icon: string;
  text: string;
}

const NavItem = ({ action, icon, text }: NavItemProps) => {
  return (
    <button
      className="flex p-3  gap-x-[5px] group min-h-[27px] text-sm py-1 pr-3  items-center text-muted-foreground font-medium"
      onClick={action}
    >
      <Image
        alt={icon}
        style={{
          width: 19,
          height: 19,
        }}
        width={19}
        height={19}
        src={icon}
      ></Image>
      <p>{text}</p>
    </button>
  );
};
export { NavItem };
