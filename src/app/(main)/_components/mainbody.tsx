"use client";



import { Provider } from "react-redux";
import { store } from "../../hooks/store";
import { User, UserContext } from "../../context";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from '@vercel/analytics/react';


export const MainBody = ({children, userId} : { children: React.ReactNode;} & {userId: string}) => {
    const [user, setUser] = useState<User>({ userId: userId, auth: false });
    const router = useRouter();
    const login = useCallback((user: User) => {
      setUser(user);
    }, []);
  
    const contextValue = useMemo(
      () => ({
        user,
        login,
      }),
      [user, login]
    );
  
    useEffect(() => {
  
     
    
  
    }, []);
    return       <UserContext.Provider value={contextValue}>
    <Provider store={store}>
      <body className="h-full w-full">{children}</body>
      <SpeedInsights />
      <Analytics />

    </Provider>
  </UserContext.Provider>
}

