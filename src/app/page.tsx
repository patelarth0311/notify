

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
  features: { title: string, pics: string[], details: string }[];
  title: string
}

function Nav() {
  const dispatch = useAppDispatch();

  return (
    <div className="flex   justify-between p-3">
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

function FeatureCard({ text, title, action, icon, selected }: FaceCardProps & {selected: boolean}) {
  return (
    <div
      onClick={() => action()}
  className=  {`${ selected ?  "bg-[#ffffff] border-[3px] border-[#f1f5f9]" : "bg-[#f1f5f9]"} flex-1 max-w-[220px] h-[130px] px-[20px] py-[16px] rounded-[10px] bg-[#f1f5f9] `}
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


function CapabilityCard({ feature}: {feature: { title: string, pics: string[] }}) {
  return         <div className=" flex justify-center items-center flex-wrap gap-x-[10px] gap-y-[10px] overflow-hidden relative  w-full max-w-[900px] text-[28px] font-[600] rounded-[10px] p-[30px]">


          {feature.pics.map((pic, index) => (
              <div key={index} className="relative aspect-square w-full h-full  flex-1 overflow-hidden">
               <Image
          sizes="width:100%"
  
          fill
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",

          }}
          onLoadingComplete={() => {}}
          placeholder="empty"
          quality={100}
        
          src={pic}
          alt={"Cover"}
        ></Image>
            </div>
          ))

          }
 


</div>
}

function FeaturePanel({ features, title }: FeaturePanelProps) {


  const [featureSelection, setSelection] = useState(features[0])


  return (
 
         

    <div className="flex   gap-y-[10px] gap-x-[15px] flex-col">
      
        <div className="flex flex-col justify-center items-center gap-y-[30px]">
       <div className="flex  w-full max-w-[900px] ">
       <h1 className="text-5xl text-black font-bold text-left">{title}</h1>
       </div>
       <div className=" overflow-scroll w-full  pl-[calc(50%-(900px/2))] pr-[calc(50%-(900px/2))]">
        <div className="grid  grid-flow-col w-fit grid-rows-1 gap-x-[10px]">
        {features.map((feature, index) => (
          <div 
            onClick={() => {
              setSelection(feature)
            }}
           key={index} className={`${featureSelection.title == feature.title ? "bg-[#ffffff] border-[3px] border-[#f1f5f9]" : "bg-[#f1f5f9]"} h-[172px] w-[348px]  rounded-[20px] p-[30px]`}>
           <p className="text-[28px] font-[600]"> {feature.title}</p>
           <p className="text-[17px]">{feature.details}</p>
          </div>
        ))
        }
      
        </div>
        </div>
        <CapabilityCard feature={featureSelection} ></CapabilityCard>
        </div>
        

       
    </div>

  );
}


function FeatureView() {
  const [selection, setSelection] = useState(0);

  const aiFeatures = [{ title: "Summarize", pics: [], details: "Have your notes to be summarized by AI" }, { title: "Ask", pics: [] , details: "Engage in Q&A with AI about your notes"  }];
  const docFeatures = [{ title: "Rich Text-Editor",  pics: ["/richtext.png"], details: "Easily create the content of your notes. Powered by BlockNote.js"    }, { title: "Customize", pics:["/card1.png" , "/card2.png"] , details: "Manage your notes beyond just writing" }];

  return (
    <div className="flex gap-x-[15px] w-full justify-between  flex-col  gap-y-[50px] overflow-hidden">
      <div className="flex gap-x-[15px] w-full  flex-row flex-1 items-center justify-center">
        <FeatureCard
        selected={selection == 0}
          action={() => setSelection(0)}
          title={"AI"}
          icon={"/magic2.svg"}
          text={"Leverage it for Q&A, summarization, and much more"}
        ></FeatureCard>
        <FeatureCard
          selected={selection == 1}
          action={() => setSelection(1)}
          title={"Notes"}
          icon={"/notebookred.svg"}
          text={"Write, edit, and organize your thoughts"}
        ></FeatureCard>
      </div>

      {selection === 0 && (
        <FeaturePanel title={"AI"} features={aiFeatures}></FeaturePanel>
      )}
      {selection === 1 && (
        <FeaturePanel title={"Notes"} features={docFeatures} ></FeaturePanel>
      )}
    </div>
  );
}


export default function Home() {
  const isLoginOpen = useAppSelector(loginState);


  return (
    <main className="flex relative min-h-screen h-full  text-black flex-col  w-full  bg-white ">
   
        <Nav></Nav>
        <div className=" flex-1  p-[10px] w-full h-full flex flex-col gap-y-[20px] pt-[30px] ">

          <div className="flex  flex-col rounded-[20px] w-full items-center justify-center p-[35px] gap-y-[20px]">
          <h1 className="text-4xl text-black font-medium ">Personalized workspace</h1>
     
          </div>

          <FeatureView></FeatureView>

        </div>
    
      {isLoginOpen && <UserRegView></UserRegView>}
    </main>
  );
}
