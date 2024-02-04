import { AuthenticationDetails, CognitoUser, CognitoUserPool } from "amazon-cognito-identity-js";
import { NextRequest, NextResponse } from "next/server";

import * as AWS from "aws-sdk/global";

import { cookies } from 'next/headers';

interface LogInResponse {
    status: boolean
    data: UserData | ErrorData
}

interface UserData {
    username: string
}

interface ErrorData {
    error: string
}

export  async function PUT(req: NextRequest, res: NextResponse) {

    const data = await req.json();
    const username  = data.username
    const password = data.password


    var authenticationData = {
        Username: username,
        Password: password,
      };
      var authenticationDetails = new AuthenticationDetails(authenticationData);
      var poolData = {
        UserPoolId: "us-east-1_qYqgHGG06",
        ClientId: "7qinghbiqlttnjthgkgh4cesnj",
      };
      var userPool = new CognitoUserPool(poolData);
      var userData = {
        Username: username,
        Pool: userPool,
      };
      var cognitoUser = new CognitoUser(userData);

      var getUserAttributesPromise = () => new Promise<LogInResponse>((resolve, reject) => { 
      cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: function (result) {
          var accessToken = result.getAccessToken().getJwtToken();
          
          
          AWS.config.region = "us-east-1";


        
            

      
          cognitoUser.getUserAttributes((err,attres) => {
            
            if (attres) {
                const username = attres.find((attribute) => attribute.Name === 'email')
    
              
                
              
  
              AWS.config.credentials = new AWS.CognitoIdentityCredentials({
                  IdentityPoolId: "us-east-1:0584b174-4f4e-4aae-96c1-ab6329ac4818",
                  Logins: {
                    "cognito-idp.us-east-1.amazonaws.com/us-east-1_qYqgHGG06": result
                      .getIdToken()
                      .getJwtToken(),
                  },
                });
          
               
                //refreshes credentials using AWS.CognitoIdentity.getCredentialsForIdentity()
                (AWS.config.credentials as AWS.CognitoIdentityCredentials).refresh(
                  (error) => {
                    if (error) {
                      reject({status: true, data: error})
                    } else {
                     
                      const cookiesInstance = cookies()
                      cookiesInstance.set({
                        name: 'IdToken',
                        value: result.getIdToken().getJwtToken(),
                        secure: false,
                        httpOnly: false,
                        path: '/',
                      })
                       cookiesInstance.set({
                        name: 'RefreshToken',
                        value:  result.getRefreshToken().getToken(),
                        secure: false,
                        httpOnly: false,
                        path: '/',
                      })
                       cookiesInstance.set({
                        name:  "AccessToken",
                        value:  result.getAccessToken().getJwtToken(),
                        secure: false,
                        httpOnly: false,
                        path: '/',
                      })
                      
                      if (username) {
                        const index = username.Value.indexOf("@")
                      
                        resolve({status: true, data: {username: username.Value.substring(0,index) }})
                      }
                     
                    }
                  }
                );
            }
            
          })
         
        },
    
        onFailure: function (err) {
          if (err) {
            reject({status: true, data: err})
          }
        },
      });

    })

    const result = await getUserAttributesPromise()
    
    if (result.status) {
        return NextResponse.json(result);
    } else {
        return new NextResponse("Error", { status: 400})
    }

}

