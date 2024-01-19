import { Modal } from "@/app/_components/search";
import useModal from "@/app/hooks/use-modal";
import { closeLogInModal, useAppDispatch } from "@/app/hooks/store";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import * as AWS from "aws-sdk/global";
import jwt from 'jsonwebtoken';
import {
  AuthenticationDetails,
  CognitoUser,
  CognitoAccessToken,
  CognitoIdToken,
  CognitoRefreshToken,
  CognitoUserSession,
  CognitoUserPool,
} from "amazon-cognito-identity-js";
import { UserContext } from "@/app/context";
import { useContext } from "react";
export function UserRegView() {
  const dispatch = useAppDispatch();
  const context = useContext(UserContext)
  

  const { ref } = useModal(() => dispatch(closeLogInModal()));
  const [isUserSigningUp, setIsUserSigningUp] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    password2: "",
  });

  const router = useRouter();
  const [showVerification, setVerification] = useState(false);

  var manageFormData = (e: HTMLInputElement) => {
    setFormData((prev) => {
      return { ...prev, [e.name]: e.value };
    });
  };

  return (
    <Modal zindex={20}>
      <div
        ref={ref}
        className="max-w-[500px] w-[calc(100%-15px)] h-[500px] bg-white rounded-[20px] shadow-2xl"
      >
        <div className="flex w-full h-full relative justify-center flex-col p-3  ">
          <h1 className="font-bold text-lg">Notify</h1>
          <div className="flex w-full h-full flex-col p-4 gap-y-[10px] justify-center">
            <>
              {showVerification ? (
                <>
                  <PinView action={() => setVerification(false)} username={formData.username}></PinView>
                </>
              ) : (
                <>
                  {isUserSigningUp == false ? (
                    <>
                      {" "}
                      <input
                        onChange={(e) => manageFormData(e.target)}
                        placeholder="username@email.com"
                        name={"username"}
                        value={formData.username}
                        className="p-3 rounded-[10px] bg-[#f1f5f9]"
                      ></input>
                      <input
                        onChange={(e) => manageFormData(e.target)}
                        placeholder="password"
                        name={"password"}
                        type="password"
                        value={formData.password}
                        className="p-3 rounded-[10px] bg-[#f1f5f9]"
                      ></input>
                    </>
                  ) : (
                    <>
                      <input
                        onChange={(e) => manageFormData(e.target)}
                        placeholder="username@email.com"
                        name={"username"}
                        value={formData.username}
                        className="p-3 rounded-[10px] bg-[#f1f5f9]"
                      ></input>
                      <input
                        onChange={(e) => manageFormData(e.target)}
                        placeholder="password"
                        name={"password"}
                        type="password"
                        value={formData.password}
                        className="p-3 rounded-[10px] bg-[#f1f5f9]"
                      ></input>
                      <input
                        onChange={(e) => manageFormData(e.target)}
                        placeholder="re-enter password"
                        name={"password2"}
                        type="password"
                        value={formData.password2}
                        className="p-3 rounded-[10px] bg-[#f1f5f9]"
                      ></input>
                    </>
                  )}
                </>
              )}
            </>
          </div>

          {!showVerification && (
            <div className="flex flex-col gap-y-[20px] w-full justify-center items-center">
              <>
                {isUserSigningUp == false ? (
                  <>
                    <button
                      onClick={() => {
                        logIn(formData.username, formData.password, (userName: string) =>
                         {
                          if (context) {
                            context.login({userId: userName, auth: true})
                            dispatch(closeLogInModal())
                            router.push("/documents")
                           }
                            
                         }
                        );
                      }}
                      className="w-[200px] h-[50px] rounded-[10px]  bg-[#f1f5f9] p-1 "
                    >
                      <p className="text-lg">Log In</p>
                    </button>

                    <button
                      onClick={() => setIsUserSigningUp(true)}
                      className=" p-2 "
                    >
                      <p className="text-sm">Sign Up?</p>
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        if (
                          formData.username &&
                          formData.password == formData.password2
                        ) {
                          signUp(formData.username, formData.password, () =>
                            setVerification(true)
                          );
                        }
                      }}
                      className="w-[200px] h-[50px] rounded-[10px]  bg-[#f1f5f9] p-1 "
                    >
                      <p className="text-lg">Sign Up</p>
                    </button>

                    <button
                      onClick={() => setIsUserSigningUp(false)}
                      className=" p-2 "
                    >
                      <p className="text-sm">Login In?</p>
                    </button>
                  </>
                )}
              </>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}

export function logInWithTokens(successAction: () => void, failureAction: () => void) {

  
  const idToken = localStorage.getItem("IdToken");
  const accessToken = localStorage.getItem("AccessToken");
  const refreshToken = localStorage.getItem("RefreshToken");
  if (idToken && accessToken && refreshToken) {
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
      successAction()
     
      const email = (decodedToken as any)['email']

      if (email) {
        var index = email.indexOf("@")
        return email.substring(0, index)
      }
      
      return (decodedToken as any)['email']
    }

    if (!RefreshToken.getToken()) {
      failureAction()
      localStorage.clear()
      return "";
    }
  }

  return "";

}

function logIn(username: string, password: string, action: (userName: string) => void) {
  
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
  

  
  cognitoUser.authenticateUser(authenticationDetails, {
    onSuccess: function (result) {
      var accessToken = result.getAccessToken().getJwtToken();
      
      
      AWS.config.region = "us-east-1";
      cognitoUser.getUserAttributes((err,result) => {
        if (result) {
          const username = result.find((attribute) => attribute.Name === 'email')

          if (username) {
            const index = username.Value.indexOf("@")
            action(username.Value.substring(0,index))
          }
          
        }
      })
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
          
          } else {
            
            localStorage.setItem("IdToken", result.getIdToken().getJwtToken());
            localStorage.setItem(
              "AccessToken",
              result.getAccessToken().getJwtToken()
            );
            localStorage.setItem(
              "RefreshToken",
              result.getRefreshToken().getToken()
            );
          }
        }
      );
    },

    onFailure: function (err) {
      if (err) {
      }
    },
  });
}

function verify(email: string, confirmation: string, action: () => void) {
  var poolData = {
    UserPoolId: "us-east-1_qYqgHGG06",
    ClientId: "7qinghbiqlttnjthgkgh4cesnj",
  };

  var userPool = new CognitoUserPool(poolData);

  var userData = {
    Username: email,
    Pool: userPool,
  };
  var cognitoUser = new CognitoUser(userData);
  cognitoUser.confirmRegistration(confirmation, true, function (err, result) {
    if (result) {
      
      action();
    }
    if (err) {
      alert(err.message || JSON.stringify(err));
      return;
    }
  });
}

function signUp(email: string, password: string, action: () => void) {
  var poolData = {
    UserPoolId: "us-east-1_qYqgHGG06",
    ClientId: "7qinghbiqlttnjthgkgh4cesnj",
  };
  var userPool = new CognitoUserPool(poolData);

  userPool.signUp(email, password, [], [], function (err, result) {
    if (result) {
      action();
    } else if (err) {
    }
  });
}

function PinView({ username, action }: { username: string, action: () => void }) {
  const router = useRouter();
  const [confirmation, setConfirmation] = useState("");

  return (
    <>
      <div className="flex flex-col gap-x-[10px] w-full items-center justify-center h-full ">
        <div className="flex h-full w-full items-center justify-center gap-x-[10px]">
          <input
            value={confirmation}
            onChange={(e) => {
          
              setConfirmation(e.target.value);
            }}
            className="w-[250px] border h-[50px] rounded-[10px] pl-[19px]"
          ></input>
        </div>
        <button
          onClick={() => {
            verify(username, confirmation, () => action());
          }}
          className="w-[200px] h-[50px] rounded-[10px]  bg-[#f1f5f9] p-1 "
        >
          <p className="text-lg">Confirm</p>
        </button>
      </div>
    </>
  );
}
