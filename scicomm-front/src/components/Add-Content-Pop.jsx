import React from "react";
import FadeInComponent from "./FadeIn";
import { useForm } from "react-hook-form";
import { Eye, LoaderCircle, Trash2 } from "lucide-react";
import { FaRegFilePdf } from "react-icons/fa";

import { FaToggleOn, FaToggleOff } from "react-icons/fa6";
import useUtils from "@/hooks/useUtils";
import Link from "next/link";
import axios from "axios";
import API from "@/constants/API";

export default function AddContentPop({
  initialFolders = null,
  showAddContent = false,
  setShowAddContent = () => {},
  onCompleteSubmit = () => {},
  selectedFolder = "",
}) {
  const { uploadFileToSupabase } = useUtils();
  const [folders, setFolders] = React.useState(initialFolders);
  const [file, setFile] = React.useState(null);
  const [showLanding, setShowLanding] = React.useState(true);

  const [formLoading, setFormLoading] = React.useState(false);

  const [fileLoading, setFileLoading] = React.useState(false);
  const [filePath, setFilePath] = React.useState(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      directory: selectedFolder,
    },
  });

  const onSubmit = async (data) => {
    setFormLoading(true);
    try {
      const { data: responseContent } = await axios.post(
        API.HOST + API.CONTENTS_CREATE,
        {
          directory_id: data.directory,
          name: data.abbreviatedName,
          header: data.pageHeader,
          sub_header: data.pageSubHeader,
          document_number: data.documentNumber,
          active_from: data.activeFrom,
          active_to: data.activeTo,
          show_landing_page: showLanding,
          created_at: new Date().toISOString().split("T")[0],
          status: "active",
        }
      );
      const { data: responseData } = await axios.post(
        API.HOST + API.FILE_CREATE,
        {
          content_id: responseContent.content_id,
          name: file.name,
          type: file.type,
          link: filePath,
          status: "active",
        }
      );
      onCompleteSubmit();
    } catch (err) {
      console.log(err);
    }
    setFormLoading(false);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === "application/pdf") {
      setFile(droppedFile);
    } else {
      alert("Only PDF files are allowed.");
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const formatFileSize = (size) => {
    if (size < 1024) return `${size} bytes`;
    else if (size < 1024 * 1024) return `${(size / 1024).toFixed(2)} KB`;
    else return `${(size / (1024 * 1024)).toFixed(2)} MB`;
  };

  const fetchFolders = async () => {
    try {
      const { data } = await axios.get(API.HOST + API.DIRECTORIES_LIST);
      setFolders(data);
    } catch (err) {
      toast.error("Oops!! There is a problem fetching directories");
    }
  };

  const uploadFile = async () => {
    setFileLoading(true);
    const fileUrl = await uploadFileToSupabase(file);
    setFilePath(fileUrl);
    setFileLoading(false);
  };

  React.useEffect(() => {
    if (file) uploadFile();
  }, [file]);

  React.useEffect(() => {
    setFile(null);
  }, [showAddContent]);

  React.useEffect(() => {
    if (folders === null) fetchFolders();
  }, [folders]);

  React.useEffect(() => {
    if (initialFolders !== null) setFolders(initialFolders);
  }, [initialFolders]);

  return (
    <FadeInComponent
      show={showAddContent}
      duration={0.2}
      className="fixed inset-0 z-40 flex flex-col justify-center items-center h-screen bg-black bg-opacity-50"
    >
      <FadeInComponent
        show={showAddContent}
        delay={150}
        fadeFromBottom
        duration={0.2}
        className="rounded-md flex flex-col w-[50%] bg-white"
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="rounded-t-md bg-[#0063C3] text-white px-5 text-sm py-3">
            <p>Add Content</p>
          </div>
          <div className="text-sm flex flex-1 flex-col">
            <div className="mt-4 px-4 flex gap-x-3 items-center">
              <div className="w-1/3 text-right items-center">
                <p>Select Directory</p>
              </div>
              <div className="flex flex-1">
                <select
                  className="flex-1 focus:outline-none border-[#838383] border py-2 rounded-md px-3"
                  name=""
                  id=""
                  required
                  {...register("directory", {
                    required: "Directory is required",
                  })}
                >
                  {folders?.map((each) => (
                    <option key={each.id} value={each.id}>
                      {each.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mt-2 px-4 flex gap-x-3 items-center">
              <div className="w-1/3 text-right items-center">
                <p>Abbreviated Name</p>
              </div>
              <div className="flex flex-1">
                <input
                  autoFocus
                  type="text"
                  className="flex-1 focus:outline-none border-[#838383] border py-2 rounded-md px-3"
                  name=""
                  id=""
                  required
                  {...register("abbreviatedName", {
                    required: "Abbreviated Name is required",
                  })}
                />
              </div>
            </div>
            <div className="mt-2 px-4 flex gap-x-3 items-center">
              <div className="w-1/3 text-right items-center">
                <p>Page Header</p>
              </div>
              <div className="flex flex-1">
                <input
                  type="text"
                  className="flex-1 focus:outline-none border-[#838383] border py-2 rounded-md px-3"
                  name=""
                  id=""
                  required
                  {...register("pageHeader", {
                    required: "Page Header is required",
                  })}
                />
              </div>
            </div>
            <div className="mt-2 px-4 flex gap-x-3 items-center">
              <div className="w-1/3 text-right items-center">
                <p>Page Sub - Header</p>
              </div>
              <div className="flex flex-1">
                <input
                  type="text"
                  className="flex-1 focus:outline-none border-[#838383] border py-2 rounded-md px-3"
                  name=""
                  id=""
                  required
                  {...register("pageSubHeader", {
                    required: "Page Sub-Header is required",
                  })}
                />
              </div>
            </div>
            <div className="mt-2 px-4 flex gap-x-3 items-center">
              <div className="w-1/3 text-right items-center">
                <p>Document Number</p>
              </div>
              <div className="flex flex-1">
                <input
                  type="text"
                  className="flex-1 focus:outline-none border-[#838383] border py-2 rounded-md px-3"
                  name=""
                  id=""
                  required
                  {...register("documentNumber", {
                    required: "Document Number is required",
                  })}
                />
              </div>
            </div>
            <div className="mt-2 px-4 flex gap-x-3 items-center">
              <div className="w-1/3 text-right items-center">
                <p>Active From</p>
              </div>
              <div className="flex items-center gap-x-3 flex-1">
                <input
                  type="date"
                  className="flex-1 focus:outline-none border-[#838383] border py-2 rounded-md px-3"
                  name=""
                  id=""
                  required
                  {...register("activeFrom", {
                    required: "Active From is required",
                  })}
                />
                <div className="text-right items-center">
                  <p>To</p>
                </div>
                <div className="flex flex-1">
                  <input
                    type="date"
                    className="flex-1 focus:outline-none border-[#838383] border py-2 rounded-md px-3"
                    name=""
                    id=""
                    required
                    {...register("activeTo", {
                      required: "Active To is required",
                    })}
                  />
                </div>
              </div>
            </div>
            <div className="mt-2 px-4 flex gap-x-3 items-center">
              <div className="w-1/3 text-right items-center">
                <p>Show with Landing Page</p>
              </div>
              <div className="flex flex-1">
                <div onClick={() => setShowLanding(!showLanding)}>
                  {showLanding ? (
                    <FaToggleOn className="text-2xl text-[#3498DB]" />
                  ) : (
                    <FaToggleOff className="text-2xl" />
                  )}
                </div>
              </div>
            </div>
            <div className="mt-2 px-4 flex gap-x-3 items-center">
              <div className="w-1/3 text-right items-center">
                <p>File Upload</p>
              </div>
              <div className="flex-1 flex flex-col">
                {!file && (
                  <div
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    className="rounded-md border border-dashed p-4 py-5 border-zinc-400 flex flex-col justify-center items-center flex-1"
                  >
                    <label className="cursor-pointer">
                      <p>
                        Drag & Drop or{" "}
                        <span className="text-blue-500">choose file</span>
                      </p>
                      <input
                        type="file"
                        className="hidden"
                        accept="application/pdf"
                        onChange={handleFileChange}
                      />
                    </label>
                    <p className="text-xs opacity-30">PDF format only</p>
                  </div>
                )}
                {file && (
                  <div className="flex bg-zinc-100 rounded-md mt-2 px-4 py-3 justify-between items-center">
                    <div className="flex gap-x-3 items-center">
                      <div className="text-2xl">
                        <FaRegFilePdf />
                      </div>
                      <div className="text-sm flex flex-col">
                        <p>{file.name}</p>
                        <p className="text-xs opacity-30">
                          {formatFileSize(file.size)}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-x-2 items-center">
                      {fileLoading ? (
                        <div>
                          <LoaderCircle className="animate-spin h-5" />
                        </div>
                      ) : (
                        <div className="flex gap-x-2 items-center">
                          {filePath && (
                            <Link target="_blank" href={filePath}>
                              <Eye className="h-5" />
                            </Link>
                          )}
                          <div
                            onClick={() => {
                              setFile(null);
                              setFilePath(null);
                            }}
                          >
                            <Trash2 className="h-5" />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="text-sm p-4 gap-x-2 px-5 flex justify-end items-center">
            <div
              onClick={() => setShowAddContent(false)}
              className="px-5 hover:bg-zinc-100 rounded-md py-2"
            >
              Cancel
            </div>
            <button
              disabled={formLoading}
              className="bg-[#0063C3] hover:bg-[#0062c3f4] px-5 rounded-md py-2 text-white"
              style={{
                opacity: formLoading ? 0.5 : 1,
              }}
            >
              Save
            </button>
          </div>
        </form>
      </FadeInComponent>
    </FadeInComponent>
  );
}
