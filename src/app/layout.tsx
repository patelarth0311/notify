"use server";

import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Provider } from "react-redux";
import { store } from "./hooks/store";
import { User, UserContext } from "./context";
import { useCallback, useEffect, useMemo, useState } from "react";

import { useRouter } from "next/navigation";
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from '@vercel/analytics/react';
import { MainBody } from "./(main)/_components/mainbody";
import { cookies } from "next/headers";
import { CognitoAccessToken, CognitoIdToken, CognitoRefreshToken, CognitoUserSession } from "amazon-cognito-identity-js";
import { NextResponse } from "next/server";
import jwt from 'jsonwebtoken';



export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {




   
    const idToken = cookies().get("IdToken")?.value
    const accessToken = cookies().get("AccessToken")?.value
    const refreshToken = cookies().get("RefreshToken")?.value
    var email = ""
    if (!idToken || !accessToken || !refreshToken) {
     
    } else {
          
  
      const AccessToken = new CognitoAccessToken({
        AccessToken: accessToken,
      });
      const IdToken = new CognitoIdToken({
        IdToken: idToken,
      });
  
      const RefreshToken = new CognitoRefreshToken({
        RefreshToken: refreshToken,
      });
  
      const sessionData = {
        IdToken: IdToken,
        AccessToken: AccessToken,
        RefreshToken: RefreshToken,
      };
  
  
      const decodedToken = jwt.decode(idToken);
      const cachedSession = new CognitoUserSession(sessionData);
      
    
    if (cachedSession.isValid()) {
  
      email = (decodedToken as any)['email']
      if (email) {
        var index = email.indexOf("@")
        email = email.substring(0, index)
       
      }
  
    } 
    }
 

  return (
    <html lang="en">
      <MainBody userId={email}>
        {children}
      </MainBody>
    </html>
  );
}
