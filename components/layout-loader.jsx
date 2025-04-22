"use client";
import React from "react";
import { SiteLogo } from "@/components/svg";
import logo from "@/public/yallalogo.png";
import { Loader2 } from "lucide-react";
import Image from "next/image";
const LayoutLoader = () => {
  return (
    <div className=" h-screen flex items-center justify-center flex-col space-y-2">
      <Image src={logo} alt="image" className="w-20 mb-5"/>
      <span className=" inline-flex gap-1">
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Loading...
      </span>
    </div>
  );
};

export default LayoutLoader;
