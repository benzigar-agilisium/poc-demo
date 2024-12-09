"use client";

import Ripples from "react-ripples";
import { useHotkeys } from "react-hotkeys-hook";
import clsx from "clsx";

import {
  CircleUserRound,
  Command,
  Link as LinkIcon,
  PlusCircle,
  QrCode,
  Search,
} from "lucide-react";

import React from "react";
import FadeInComponent from "../components/FadeIn";

import GlobalSearch from "../components/GlobalSearch";
import AddContentPop from "../components/Add-Content-Pop";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import PreviewRender from "@/components/Preview-Render";
import axios from "axios";
import API from "@/constants/API";
import toast from "react-hot-toast";

const getFolderImage = (id) => {
  if (id === 1) return "senate.svg";
  if (id === 2) return "journal.svg";
  else return "other.svg";
};

export default function Page() {
  const [files, setFiles] = React.useState([]);

  const [folders, setFolders] = React.useState([]);
  const [selectedFolder, setSelectedFolder] = React.useState(null);

  const [selectedQr, setSelectedQr] = React.useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(true);

  const [searchText, setSearchText] = React.useState("");
  const [showGlobalSearch, setShowGlobalSearch] = React.useState(false);

  const [showAddContent, setShowAddContent] = React.useState(false);

  // const { userAccount, logout } = useAuth();
  const router = useRouter();

  useHotkeys(
    "esc",
    () => {
      setShowAddContent(false);
      setShowGlobalSearch(false);
    },
    { enableOnFormTags: true }
  );
  useHotkeys("mod+b", () => setSidebarCollapsed(!sidebarCollapsed), {
    enableOnFormTags: true,
  });
  useHotkeys("mod+k", () => setShowGlobalSearch(!showGlobalSearch), {
    enableOnFormTags: true,
  });

  const fetchFolders = async () => {
    try {
      const { data } = await axios.get(API.HOST + API.DIRECTORIES_LIST);
      setFolders(data);
    } catch (err) {
      toast.error("Oops!! There is a problem fetching directories");
    }
  };

  const fetchFiles = async () => {
    if (!selectedFolder) return;
    try {
      setFiles(null);
      const { data } = await axios.post(API.HOST + API.CONTENTS_LIST, {
        directory_id: selectedFolder,
      });
      setFiles(data);
    } catch (err) {
      toast.error("Oops!! There is a problem fetching contents");
    }
  };

  const getSelectedFolderName = () => {
    if (!selectedFolder) return null;
    return folders?.find((e) => e.id === selectedFolder)?.name;
  };

  // React.useEffect(() => {
  //   if (!userAccount) return router.replace("/login");
  //   else {
  //     fetchFolders();
  //   }
  // }, [userAccount]);

  React.useEffect(() => {
    fetchFolders();
  }, []);

  React.useEffect(() => {
    fetchFiles();
  }, [selectedFolder]);

  React.useEffect(() => {
    if (files?.length > 0) setSelectedQr(files?.[0].id);
    else setSelectedQr(null);
  }, [files]);

  React.useEffect(() => {
    if (folders.length > 0) setSelectedFolder(folders?.[0]?.id);
  }, [folders]);

  return (
    <div className="h-[100vh] flex flex-col">
      {showAddContent && (
        <AddContentPop
          selectedFolder={selectedFolder}
          initialFolders={folders}
          showAddContent={showAddContent}
          setShowAddContent={setShowAddContent}
          onCompleteSubmit={() => {
            setShowAddContent(false);
            fetchFiles();
          }}
        />
      )}
      <GlobalSearch
        onClick={(id) => setSelectedQr(id)}
        show={showGlobalSearch}
        setShow={setShowGlobalSearch}
      />
      <div className="flex flex-1">
        <div
          className={clsx(
            "transition-all duration-300 flex flex-col bg-[#0063C3]",
            sidebarCollapsed ? "w-16" : "w-1/5"
          )}
        >
          <FadeInComponent className="flex flex-1 flex-col">
            <div className="flex mt-4 px-6 items-center justify-between">
              {!sidebarCollapsed && (
                <img className={`h-6`} src="./amgen-logo.svg" alt="" />
              )}
              <button onClick={() => setSidebarCollapsed(!sidebarCollapsed)}>
                <img
                  className="h-[20px] transition-all duration-200"
                  src="collapse.svg"
                  style={{
                    transform: !sidebarCollapsed
                      ? "rotateZ(180deg)"
                      : "rotateZ(0deg)",
                  }}
                  alt=""
                />
              </button>
            </div>
            <div className="px-6 mt-5 text-white flex flex-col">
              <p style={{ opacity: sidebarCollapsed ? 0 : 1 }}>Welcome</p>
              <div
                className={clsx(
                  "flex gap-x-2 mt-2 items-center",
                  sidebarCollapsed ? "justify-center" : ""
                )}
              >
                <div className="min-w-5">
                  <CircleUserRound />
                </div>
                {!sidebarCollapsed && (
                  <p className="text-sm text-nowrap">Benzigar JS</p>
                )}
              </div>
            </div>
            <div className="mt-12 flex flex-col">
              <div className="flex flex-col">
                {folders?.map((each, id) => (
                  <Ripples key={id} className="flex-1 flex flex-col">
                    <button
                      onClick={() => setSelectedFolder(each.id)}
                      className={clsx(
                        "border-y border-[#4398ED] py-3 text-sm px-7 text-white gap-x-2 flex items-center",
                        selectedFolder === each.id
                          ? "bg-[#044383]"
                          : "hover:bg-[#0444838c]",
                        sidebarCollapsed ? "justify-center" : ""
                      )}
                    >
                      <div className="min-w-5 min-h-5">
                        <img
                          className="w-5 h-5 aspect-square"
                          src={getFolderImage(each.id)}
                          alt=""
                        />
                      </div>
                      {!sidebarCollapsed && <p>{each.name}</p>}
                    </button>
                  </Ripples>
                ))}
              </div>
            </div>
          </FadeInComponent>
          <FadeInComponent className="pb-10 flex flex-col gap-y-1">
            <button
              className={clsx(
                "hover:bg-[#0444838c] px-6 text-white flex gap-x-2 py-3 items-center",
                sidebarCollapsed ? "justify-center" : ""
              )}
            >
              <img className="min-w-5 aspect-square" src="people.svg" alt="" />
              <p className={sidebarCollapsed ? "hidden" : "text-sm"}>Admin</p>
            </button>
            <div
              className={clsx(
                "hover:bg-[#0444838c] px-6 text-white flex gap-x-2 py-3 items-center",
                sidebarCollapsed ? "justify-center" : ""
              )}
            >
              <img className="min-w-5 aspect-square" src="help.svg" alt="" />
              <p className={sidebarCollapsed ? "hidden" : "text-sm"}>Help</p>
            </div>
            <button
              onClick={() => {
                router.replace("/login");
              }}
              className={clsx(
                "hover:bg-[#0444838c] px-6 text-white flex gap-x-2 py-3 items-center",
                sidebarCollapsed ? "justify-center" : ""
              )}
            >
              <img className="min-w-5 aspect-square" src="logOut.svg" alt="" />
              <p className={sidebarCollapsed ? "hidden" : "text-sm"}>Logout</p>
            </button>
          </FadeInComponent>
        </div>
        <div delay={300} className="flex bg-white flex-col flex-1">
          <FadeInComponent
            delay={100}
            className="p-5 pb-4 flex justify-between items-center"
          >
            <p className="text-[#0063C5] font-bold">
              Publication Content Delivery Portal
            </p>
            <button
              onClick={() => setShowGlobalSearch(true)}
              className="min-w-[300px] border-2 rounded-full px-4 py-2 text-sm gap-x-2 border-zinc-100 flex justify-between items-center"
            >
              <div className="flex items-center">
                <Search className="text-zinc-400 h-4" />
                <p className="text-zinc-400">Search</p>
              </div>
              <div className="flex bg-zinc-100 px-2 py-1 rounded-full pr-3 text-zinc-400 items-center">
                <Command className="h-3" />
                <p className="text-sm">K</p>
              </div>
            </button>
          </FadeInComponent>
          <FadeInComponent delay={200} className="flex flex-1 px-4 pb-4">
            <div className="flex flex-col p-2 border-2 border-[#A0CAF5] rounded-l-md w-1/4 bg-[#EAF4FF]">
              <div className="bg-white border-2 rounded-full px-4 py-2 text-sm gap-x-2 border-zinc-100 flex items-center">
                <Search className="text-zinc-400 h-4" />
                <input
                  type="text"
                  className="flex-1 focus:outline-none"
                  placeholder="Search..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                />
              </div>
              <div className="flex-1 flex flex-col">
                <p className="text-base font-bold mt-2">
                  {getSelectedFolderName()}
                </p>
                <hr className="my-2" />
                {files !== null ? (
                  files?.length === 0 ? (
                    <FadeInComponent className="max-h-[60vh] flex overflow-y-scroll flex-col flex-1">
                      <div className="flex flex-col">
                        <p className="mt-5 text-sm text-center">
                          No Contents Yet
                        </p>
                        <button
                          onClick={() => setShowAddContent(true)}
                          className="text-sm mt-2 text-[#0063C4]"
                        >
                          Add Content
                        </button>
                      </div>
                    </FadeInComponent>
                  ) : (
                    <FadeInComponent className="max-h-[60vh] flex overflow-y-scroll flex-col flex-1">
                      {files
                        ?.filter((e) =>
                          searchText ? e?.name?.includes(searchText) : true
                        )
                        .map((each, id) => (
                          <button
                            onClick={() => setSelectedQr(each.id)}
                            key={id}
                            className={clsx(
                              "px-2 py-2 hover:bg-blue-100 text-left",
                              selectedQr === each.id
                                ? "bg-[#C7E2FF] rounded-md opacity-100"
                                : "opacity-70"
                            )}
                          >
                            <p className="text-sm">{each.name}</p>
                          </button>
                        ))}
                    </FadeInComponent>
                  )
                ) : null}
              </div>
            </div>
            <div className="border-y-2 border-r-2 border-[#A0CAF5] rounded-r-md flex flex-col flex-1 bg-[#F5F5F5]">
              <div className="mt-5 flex justify-between items-center mx-5">
                <p className="text-base font-bold">{getSelectedFolderName()}</p>
                <button
                  onClick={() => setShowAddContent(true)}
                  className="text-sm text-[#0063C4] hover:bg-white px-3 py-2 rounded-md flex items-center gap-x-2"
                >
                  <PlusCircle />
                  <p className="font-bold">Add Content</p>
                </button>
              </div>
              {selectedQr ? (
                <PreviewRender
                  onDelete={() => {
                    setSelectedQr(false);
                    fetchFiles();
                  }}
                  selectedFileId={selectedQr}
                />
              ) : files !== null && files?.length === 0 ? (
                <div className="flex flex-col mt-20 justify-center items-center">
                  <QrCode className="text-zinc-300 h-20 w-20" />
                  <p className="mt-5 text-lg font-medium">
                    Nothing to show here !
                  </p>
                  <p className="text-sm text-zinc-500">
                    Click any content to show details
                  </p>
                </div>
              ) : null}
            </div>
          </FadeInComponent>
        </div>
      </div>
      <div
        delay={300}
        className="bg-[#0F3B67] py-5 text-white flex justify-center items-center"
      >
        <FadeInComponent>
          <p className="text-xs">Amgen Inc. All Rights Reserved</p>
        </FadeInComponent>
      </div>
    </div>
  );
}
