


import { CognitoUser, CognitoUserPool } from "amazon-cognito-identity-js";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";



export  async function GET(req: NextRequest, res: NextResponse) {

    const cookiesInstance = cookies()
    cookiesInstance.set({
        name: 'IdToken',
        value: '',
        secure: false,
        httpOnly: false,
        path: '/',
      })
      cookiesInstance.set({
        name: "RefreshToken",
        value: '',
        secure: false,
        httpOnly: false,
        path: '/',
      })
      cookiesInstance.set({
        name: "AccessToken",
        value: '',
        secure: false,
        httpOnly: false,
        path: '/',
      })

      return new NextResponse("Success", {statusText: "Logged out", status: 200})
    
}
