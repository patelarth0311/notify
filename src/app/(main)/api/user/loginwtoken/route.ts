
import { AuthenticationDetails, CognitoAccessToken, CognitoIdToken, CognitoRefreshToken, CognitoUser, CognitoUserPool, CognitoUserSession } from "amazon-cognito-identity-js";
import { NextRequest, NextResponse } from "next/server";
import jwt from 'jsonwebtoken';
export  async function PUT(req: NextRequest, res: NextResponse) {
    
    const checkForUserSession = () => new Promise<{email:  string}>((resolve,reject) => {

   
        const idToken = res.cookies.get("IdToken")?.value
        const accessToken = res.cookies.get("AccessToken")?.value
        const refreshToken = res.cookies.get("RefreshToken")?.value
        if (!idToken || !accessToken || !refreshToken) {
          resolve({email: "" })
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
          
      
        if (!cachedSession.isValid()) {
      
          var email = (decodedToken as any)['email']
    
          if (email) {
            var index = email.indexOf("@")
            email = email.substring(0, index)
          }
      
          
          resolve({email: (decodedToken as any)['email']})
      
        } 
        }
    
      })
      
      const result = await checkForUserSession()
    
      return Response.json(result)

}