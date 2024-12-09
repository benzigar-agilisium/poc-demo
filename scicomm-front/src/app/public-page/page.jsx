"use client";

import React, { Suspense } from "react";
import FadeInComponent from "../../components/FadeIn";

import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import API from "@/constants/API";
import Link from "next/link";
import toast from "react-hot-toast";

export default function PublicPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const id = searchParams.get("id");

  const [contentDetails, setContentDetails] = React.useState(false);

  const fetchContentDetails = async () => {
    setContentDetails(false);
    try {
      const { data } = await axios.get(API.HOST + API.CONTENT_SINGLE_GET + id);
      if (data.show_landing_page === false && data?.files?.[0]?.link)
        return router.replace(data?.files?.[0]?.link);
      else setContentDetails(data);
    } catch (err) {
      toast.error("Oops!!! there is a problem happended !!");
    }
  };

  React.useEffect(() => {
    fetchContentDetails();
  }, []);

  if (!id || !contentDetails) return null;

  return (
    <div className="flex flex-col min-h-screen">
      <div className="bg-[#0063C5] text-white py-10 flex flex-col items-center">
        <FadeInComponent className="container mx-auto px-20">
          <p>2024 - WODC World Orphan Drug Congress</p>
        </FadeInComponent>
      </div>
      <div className="flex flex-col flex-1">
        <FadeInComponent
          delay={100}
          className="mt-10 container flex gap-x-10 mx-auto px-20"
        >
          <img
            className="h-[200px] rounded-md bg-zinc-50 aspect-square"
            src="placeholder.png"
            alt=""
          />
          <div className="flex justify-between flex-col">
            <div className="flex flex-col">
              <p className="text-[#0063C5] text-xl">{contentDetails?.name}</p>
              <p className="text-sm opacity-50">{contentDetails?.header}</p>
              <p className="mt-4 text-sm">{contentDetails?.sub_header}</p>
            </div>
            <div className="flex">
              {contentDetails?.files?.length > 0 ? (
                <div className="flex mt-3">
                  <Link
                    href={contentDetails?.files?.[0]?.link}
                    className="bg-[#0063C5] text-white px-8 py-2 rounded-md"
                  >
                    View Content
                  </Link>
                </div>
              ) : null}
            </div>
          </div>
        </FadeInComponent>
      </div>
    </div>
  );
}
