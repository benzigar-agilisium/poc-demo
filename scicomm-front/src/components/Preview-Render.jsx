import { Eye, LinkIcon, Pencil, Trash } from "lucide-react";
import React from "react";
import QRCode from "react-qr-code";
import { Tooltip } from "react-tooltip";

import Link from "next/link";
import FadeInComponent from "./FadeIn";
import { useHotkeys } from "react-hotkeys-hook";
import toast from "react-hot-toast";
import axios from "axios";
import API from "@/constants/API";

export default function PreviewRender({
  selectedFileId = null,
  onDelete = () => {},
}) {
  const [showDeleteContent, setShowDeleteContent] = React.useState(false);
  const [showContentUrl, setShowContentUrl] = React.useState(false);

  const [contentDetails, setContentDetails] = React.useState(false);

  const [text, setText] = React.useState("https://urllink");

  const handleChange = (event) => {
    setText(event.target.value);
  };

  const fetchFileDetails = async () => {
    setContentDetails(false);
    try {
      const { data } = await axios.get(
        API.HOST + API.CONTENT_SINGLE_GET + selectedFileId
      );
      setContentDetails(data);
    } catch (err) {
      alert(err);
    }
  };

  const deleteFile = async () => {
    try {
      const { data } = await axios.delete(
        API.HOST + API.CONTENT_DELETE + selectedFileId
      );
      setShowDeleteContent(false);
      toast.success("Content Deleted", {
        position: "bottom-right",
      });
      onDelete();
    } catch (err) {
      alert(err);
    }
  };

  useHotkeys(
    "esc",
    () => {
      setShowDeleteContent(false);
      setShowContentUrl(false);
    },
    { enableOnFormTags: true }
  );

  React.useEffect(() => {
    if (selectedFileId) fetchFileDetails();
  }, [selectedFileId]);

  if (!contentDetails) return null;

  return (
    <FadeInComponent>
      <FadeInComponent
        show={showDeleteContent}
        fadeFromBottom
        duration={0.3}
        className="fixed inset-0 z-40 flex flex-col justify-center items-center h-screen bg-black bg-opacity-50"
      >
        <div className="overflow-hidden rounded-md flex flex-col w-[30%] bg-white">
          <div className="flex text-sm text-white px-5 py-2 bg-[#0063C3] items-center">
            <p>Delete Content</p>
          </div>
          <div className="px-5 py-4 flex flex-col justify-center items-center flex-1">
            <p className="mt-5">Are you sure to delete the content ?</p>
            <div className="my-5 flex justify-end items-center gap-x-2">
              <button
                onClick={() => setShowDeleteContent(false)}
                className="hover:bg-zinc-50 text-sm px-5 py-2 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={deleteFile}
                className="bg-[#0063C3] text-white text-sm px-5 py-2 rounded-md"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </FadeInComponent>
      <FadeInComponent
        show={showContentUrl}
        fadeFromBottom
        duration={0.3}
        className="fixed inset-0 z-40 flex flex-col justify-center items-center h-screen bg-black bg-opacity-50"
      >
        <div className="overflow-hidden rounded-md flex flex-col w-[50%] bg-white">
          <div className="flex text-sm text-white px-5 py-2 bg-[#0063C3] items-center">
            <p>Content URL</p>
          </div>
          <div className="px-5 py-4 flex flex-col flex-1">
            <p className="mt-5">Nulla in enim tortor Etiam molestie</p>
            <input
              className="border border-zinc-500 rounded-md mt-2 px-3 py-2"
              type="text"
              value={
                "http://localhost:3001/public-page?id=" + contentDetails.id
              }
            />
            <div className="mt-5 flex justify-end items-center gap-x-2">
              <button
                onClick={() => setShowContentUrl(false)}
                className="hover:bg-zinc-50 text-sm px-5 py-2 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  navigator?.clipboard
                    ?.writeText(
                      "http://localhost:3001/public-page?id=" +
                        contentDetails.id
                    )
                    .then(() => {
                      toast.success("URL copied to clipboard", {
                        position: "bottom-right",
                      });
                    });
                }}
                className="bg-[#0063C3] text-white text-sm px-5 py-2 rounded-md"
              >
                Copy URL
              </button>
            </div>
          </div>
        </div>
      </FadeInComponent>
      <div className="p-5 mx-4 my-4 border-2 border-zinc-200 rounded-md flex flex-col flex-1 bg-white">
        <p className="font-bold">Content Details</p>
        <div className="flex items-center justify-between">
          <p className="text-sm">{contentDetails?.name}</p>
          <div className="gap-x-2 flex items-center">
            <button
              data-tooltip-id="link-icon"
              data-tooltip-content="Link"
              data-tooltip-place="top"
              onClick={() => setShowContentUrl(true)}
            >
              <Tooltip id="link-icon" />
              <LinkIcon className="text-zinc-600 hover:text-black h-4" />
            </button>
            <Link
              target="_blank"
              data-tooltip-id="preview"
              data-tooltip-content="Preview Page"
              href={"/public-page?id=" + contentDetails.id}
            >
              <Tooltip id="preview" />
              <Eye className="text-zinc-600 hover:text-black h-4" />
            </Link>
            <button data-tooltip-id="edit" data-tooltip-content="Edit">
              <Tooltip id="edit" />
              <Pencil className="text-zinc-600 hover:text-black h-4" />
            </button>
            <button
              data-tooltip-id="delete"
              data-tooltip-content="Delete"
              onClick={() => setShowDeleteContent(true)}
            >
              <Tooltip id="delete" />
              <Trash className="text-zinc-600 hover:text-black h-4" />
            </button>
          </div>
        </div>
        <div className="mt-10 gap-x-5 flex">
          <QRCode className="h-[100px] w-[100px]" value={contentDetails?.id} />
          <div className="flex flex-col flex-1">
            <table className="border-collapse w-full text-left text-sm">
              <tbody>
                <tr>
                  <th className="text-sm border whitespace-nowrap px-4 py-2 font-semibold">
                    {contentDetails?.directory?.name} Name
                  </th>
                  <td className="border px-4 py-2">{contentDetails?.name}</td>
                </tr>
                <tr>
                  <th className="text-sm border whitespace-nowrap px-4 py-2 font-semibold">
                    {contentDetails?.directory?.name} Title
                  </th>
                  <td className="border px-4 py-2">{contentDetails?.header}</td>
                </tr>
                <tr>
                  <th className="text-sm border whitespace-nowrap px-4 py-2 font-semibold">
                    Page Sub-Header
                  </th>
                  <td className="border px-4 py-2">
                    {contentDetails?.sub_header}
                  </td>
                </tr>
                {/* <tr>
            <th className="text-sm border whitespace-nowrap px-4 py-2 font-semibold">
              Dept
            </th>
            <td className="border px-4 py-2">
              Global Publication
            </td>
          </tr> */}
                <tr>
                  <th className="text-sm border whitespace-nowrap px-4 py-2 font-semibold">
                    Doc No
                  </th>
                  <td className="border px-4 py-2">
                    {contentDetails?.document_number}
                  </td>
                </tr>
                <tr>
                  <th className="text-sm border whitespace-nowrap px-4 py-2 font-semibold">
                    Active from
                  </th>
                  <td className="border px-4 py-2">
                    {contentDetails?.active_from} to {contentDetails?.active_to}
                  </td>
                </tr>
                <tr>
                  <th className="text-sm border whitespace-nowrap px-4 py-2 font-semibold">
                    Show with Landing Page
                  </th>
                  <td className="border px-4 py-2">
                    {contentDetails?.show_landing_page ? "Yes" : "No"}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </FadeInComponent>
  );
}
