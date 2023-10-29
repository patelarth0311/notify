"use client";

import React from "react"
import Navigation from "./_components/navigation";
import Search from "../_components/search";

const MainLayer =  ({
    children
  }: {
    children: React.ReactNode;
  }) => {


    return <div className="h-full  flex dark:bg-[#121212] w-screen relative overflow-hidden">
       <Navigation/>
       <Search></Search>
       <main className="flex-1 h-full overflow-y-auto ">
       {children}
       
       </main>
    </div>
}

export default MainLayer;