import { CognitoAccessToken, CognitoIdToken, CognitoRefreshToken, CognitoUserSession } from 'amazon-cognito-identity-js';
import { NextResponse, URLPattern } from 'next/server'
import type { NextRequest } from 'next/server'
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';



export function middleware(request: NextRequest) {
  const idToken = request.cookies.get("IdToken")?.value
  const accessToken = request.cookies.get("AccessToken")?.value
  const refreshToken = request.cookies.get("RefreshToken")?.value
  const path = request.nextUrl.pathname;

  if (request.method === 'OPTIONS' || request.method === 'HEAD') {
    return NextResponse.next();
  }

  if ((!idToken || !accessToken || !refreshToken)) {
    if (!request.url.endsWith("/")) {
      return NextResponse.redirect(new URL('/', request.url))
    }
    
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
  

  if (!cachedSession.isValid() && !request.url.endsWith("/")) {

    return NextResponse.redirect(new URL('/', request.url))

  } 

  if (cachedSession.isValid() && request.url.endsWith("/")) {
    return NextResponse.redirect(new URL('/documents', request.url))

  }
  }
  


  
}

 
export const config = {
  // Skip all paths that should not be internationalized
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)','/'],
}