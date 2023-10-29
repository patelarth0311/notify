import React from "react"

export const Alert = ({children} : {children: React.ReactNode}) => {
    return <div className="max-w-[359px] bg-[#00000055] shadow-lg w-full h-[87px] backdrop-blur-lg rounded-[16px] overflow-hidden">
        {children}
    </div>
}