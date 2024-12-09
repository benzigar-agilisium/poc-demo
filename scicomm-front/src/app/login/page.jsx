"use client";

import FadeInComponent from "@/components/FadeIn";
import { useAuth } from "@/context/AuthContext";
import { User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

export default function Login() {
  const { userAccount, login, logout } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (userAccount) return router.replace("/");
  }, [userAccount]);

  return (
    <div className="flex flex-col h-screen justify-center items-center">
      <FadeInComponent
        className="flex px-5 py-4 rounded-md w-[400px] flex-col"
        style={{
          boxShadow: "0px 3px 6px #00000029",
        }}
      >
        <p className="text-center text-[#0163C4] font-bold text-2xl">okta</p>
        <FadeInComponent
          delay={100}
          className="relative flex justify-center items-center mt-5"
        >
          <div className="z-10 p-5 text-2xl bg-zinc-200 rounded-full">
            <User />
          </div>
          <p className="top-[50%] absolute w-full h-0.5 bg-zinc-100"></p>
        </FadeInComponent>
        {/* <FadeInComponent
          delay={150}
          className="font-medium text-lg text-zinc-800 mt-4 text-center"
        >
          Sign in
        </FadeInComponent> */}
        {/* <FadeInComponent delay={200} className="flex flex-col">
          <input
            type="text"
            placeholder="Tylerjordan"
            className="focus:outline-none text-sm mt-5 px-4 py-3 rounded-md bg-[#EDF2F6]"
          />
          <input
            type="text"
            placeholder="*******"
            className="focus:outline-none text-sm mt-3 px-4 py-3 rounded-md bg-[#EDF2F6]"
          />
          <div className="text-sm flex gap-x-2 mt-5 items-center">
            <input type="checkbox" name="" id="" />
            <p className="text-[#6C6C6C]">Remember me</p>
          </div>
        </FadeInComponent> */}
        <FadeInComponent delay={250}>
          <Link className="flex" href={"/"}>
            <button
              onClick={login}
              className="flex-1 bg-[#0163C4] hover:bg-blue-800 text-white px-3 py-3 rounded-md mt-5"
            >
              Sign in
            </button>
          </Link>
        </FadeInComponent>
        {/* <FadeInComponent delay={300} className="text-[#6C6C6C] text-sm mt-5">
          Need help signing in ?
        </FadeInComponent> */}
      </FadeInComponent>
    </div>
  );
}
