import { CognitoUserPool } from "amazon-cognito-identity-js";
import { NextRequest, NextResponse } from "next/server";
import { json } from "stream/consumers";



export  async function PUT(req: NextRequest, res: NextResponse) {


    try {

            var poolData = {
              UserPoolId: "us-east-1_qYqgHGG06",
              ClientId: "7qinghbiqlttnjthgkgh4cesnj",
            };
            const data = await req.json();
            var userPool = new CognitoUserPool(poolData);
            const email = data.email
            const password = data.password
          
            const signUpPromise = () => new Promise<{status: Boolean, message: string}>((resolve, reject) => {

                userPool.signUp(email, password, [], [], function (err, result) {
                    if (result) {
                        resolve({status: true, message: "Success"})
                    } else if (err) {
                       
                      reject({status: false, message: err.message})
                    }
                  })

            })
          
    
          const result = await signUpPromise()
          
          
        
          if (result.status) {
            return new NextResponse("Success", {statusText: result.message, status: 200})
          } else {
            return new NextResponse("Error", {statusText: result.message, status: 400})
          }

    } catch (error) {
        let err = error as {status: Boolean, message: string}
        return new NextResponse("Error", {statusText: err.message, status: 400})
    }

}

