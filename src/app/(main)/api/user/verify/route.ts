import { CognitoUser, CognitoUserPool } from "amazon-cognito-identity-js";
import { NextRequest, NextResponse } from "next/server";



export  async function PUT(req: NextRequest, res: NextResponse) {

    var poolData = {
        UserPoolId: "us-east-1_qYqgHGG06",
        ClientId: "7qinghbiqlttnjthgkgh4cesnj",
      };
    
      var userPool = new CognitoUserPool(poolData);
      const data = await req.json();
      const email = data.email
      const confirmation = data.confirmation
      var userData = {
        Username: email,
        Pool: userPool,
      };
      var cognitoUser = new CognitoUser(userData);

      try {      
        
        var verifyPromise = () => new Promise<{status: Boolean, data: any}>((resolve, reject) => {
            cognitoUser.confirmRegistration(confirmation, true, function (err, result) {
                if (result) {
                    resolve({status: true, data: result})
                }
                if (err) {
                   reject({status: true, data: err})
                }
              });
        })

        const result = await verifyPromise()

        if (result.status) {
            return new NextResponse("Success", {statusText: result.data, status: 200})
        } else {
            return new NextResponse("Error", {statusText: result.data, status: 400})
        }

      } catch(error) {
        let err = error as {status: Boolean, data: string}
        return new NextResponse("Error", {statusText: err.data, status: 400})
      }

}

