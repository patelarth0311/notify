"use client";

import Image from "next/image";
import { NavItem } from "./(main)/_components/navitem";
import { useContext, useState } from "react";
import { UserRegView } from "./(main)/_components/userreg";
import {
  useAppDispatch,
  openLogInModal,
  closeLogInModal,
  loginState,
  useAppSelector,
} from "./hooks/store";
import useModal from "./hooks/use-modal";
import { UserContext } from "./context";
import { useRouter } from "next/navigation";

interface FaceCardProps {
  text: string;
  title: string;
  action: () => void;
  icon: string;
}

interface FeaturePanelProps {
  pic: string;
  features: { title: string }[];
}

function Nav() {
  const dispatch = useAppDispatch();

  return (
    <div className="flex   justify-between">
      <h1 className="text-xl font-medium">Notify</h1>

      <NavItem
        text="Log in"
        icon={"/user.svg"}
        action={() => {
          dispatch(openLogInModal());
        }}
      ></NavItem>
    </div>
  );
}

function FeatureCard({ text, title, action, icon }: FaceCardProps) {
  return (
    <div
      onClick={() => action()}
      className="w-[220px] shadow-lg h-[130px] px-[20px] py-[16px] rounded-[10px] bg-[#f1f5f9]"
    >
      <div className="flex w-full justify-between">
        <h1 className="text-xl text-black font-bold">{title}</h1>
        <Image
          alt={""}
          style={{
            width: 19,
            height: 19,
          }}
          width={19}
          height={19}
          src={icon}
        ></Image>
      </div>
      <p className="text-sm">{text}</p>
    </div>
  );
}

function FeaturePanel({ pic, features }: FeaturePanelProps) {
  return (
    <div className="flex flex-col gap-y-[20px]">
      <div className="flex relative shadow-lg w-[650px] h-[429px]  rounded-[10px] overflow-hidden ">
        <Image
          sizes="width:100%"
          fill
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: `center ${0}%`,
          }}
          onLoadingComplete={() => {}}
          src={pic}
          alt={""}
        ></Image>
      </div>
      <FeatureGrid features={features}></FeatureGrid>
    </div>
  );
}

function FeatureGrid({ features }: { features: { title: string }[] }) {
  return (
    <div className="flex  w-[650px] h-[250px] flex-row gap-x-[20px]">
      {features.map((item, index) => (
        <div key={index} className="rounded-[10px] bg-[#f1f5f9] flex-1 p-3">
          <h1 className="text-xl text-black font-semibold">{item.title}</h1>
        </div>
      ))}
    </div>
  );
}

function FeatureView() {
  const [selection, setSelection] = useState(0);

  const aiFeatures = [{ title: "Summarize" }, { title: "Ask" }];
  const docFeatures = [{ title: "Rich Text-Editor" }, { title: "Customize" }];

  return (
    <div className="flex gap-x-[15px] flex-col items-center gap-y-[15px]">
      <div className="flex gap-x-[15px] flex-row">
        <FeatureCard
          action={() => setSelection(0)}
          title={"AI"}
          icon={"/magic2.svg"}
          text={"Leverage it for Q&A, summarization, and much more"}
        ></FeatureCard>
        <FeatureCard
          action={() => setSelection(1)}
          title={"Notes"}
          icon={"/notebookred.svg"}
          text={"Write, edit, and organize your thoughts"}
        ></FeatureCard>
      </div>

      {selection === 0 && (
        <FeaturePanel features={aiFeatures} pic={"/doc2.png"}></FeaturePanel>
      )}
      {selection === 1 && (
        <FeaturePanel features={docFeatures} pic={"/doc.png"}></FeaturePanel>
      )}
    </div>
  );
}

export default function Home() {
  const isLoginOpen = useAppSelector(loginState);


  return (
    <main className="flex min-h-screen h-full  text-black flex-col  w-full  bg-white">
      <div className="p-3">
        <Nav></Nav>
        <div className="items-center p-24 w-full h-full flex flex-col gap-y-[20px] ">
          <h1 className="text-4xl text-black">Personalized workspace</h1>

          <FeatureView></FeatureView>
        </div>
      </div>
      {isLoginOpen && <UserRegView></UserRegView>}
    </main>
  );
}
