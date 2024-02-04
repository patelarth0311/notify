import { Modal } from "@/app/_components/search";
import useModal from "@/app/hooks/use-modal";
import { closeLogInModal, useAppDispatch } from "@/app/hooks/store";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import * as AWS from "aws-sdk/global";
import jwt from 'jsonwebtoken';

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

                        fetch('/api/user/login', {
                          method: "PUT",
                          body: JSON.stringify({username: formData.username, password: formData.password})
                        }).then((res) => res.json()).then((res) => {
                         
                          if (res.status == true) {
                            if (context) {
                              console.log(res)
                              context.login({userId: res.data.username, auth: true})
                              dispatch(closeLogInModal())
                              router.push("/documents")
                             }
                          }
                        })


                      
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
                          fetch(`/api/user/signup`,{
                            method: "PUT",
                            body: JSON.stringify({email: formData.username, password: formData.password})
                          }).then((res) => {
                            if (res.status == 200) {
                                setVerification(true)
                            } else {

                            }
                          })
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

            fetch('/api/user/verify', {
              method: "GET",
              body: JSON.stringify({email: username, confirmation: confirmation})
            }).then((res) => {
                if (res.status == 200) {
                  action()
                } else {

                }
            })


          }}
          className="w-[200px] h-[50px] rounded-[10px]  bg-[#f1f5f9] p-1 "
        >
          <p className="text-lg">Confirm</p>
        </button>
      </div>
    </>
  );
}
