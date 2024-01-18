"use client";

import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Provider } from "react-redux";
import { store } from "./hooks/store";
import { User, UserContext } from "./context";
import { useCallback, useEffect, useMemo, useState } from "react";
import { logInWithTokens } from "./(main)/_components/userreg";
import { useRouter } from "next/navigation";
const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User>({ userId: "", auth: false });
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
    var res = logInWithTokens(
      () => {},
      () => router.push("/")
    );

    if (!res) {
      router.push("/");
    } else {
     
      setUser((prev) => {
        return { ...prev, userId: res };
      });
    }
  }, []);

  return (
    <html lang="en">
      <UserContext.Provider value={contextValue}>
        <Provider store={store}>
          <body className="h-full w-full">{children}</body>
        </Provider>
      </UserContext.Provider>
    </html>
  );
}