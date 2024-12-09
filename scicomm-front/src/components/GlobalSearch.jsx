import { ArrowUpRight, Search } from "lucide-react";
import React from "react";
import { useDetectClickOutside } from "react-detect-click-outside";

import FadeInComponent from "./FadeIn";
import toast from "react-hot-toast";
import axios from "axios";
import API from "@/constants/API";
import Highlighter from "react-highlight-words";

const groupedByDirectory = (data) =>
  Object.values(
    data.reduce((acc, item) => {
      const directoryId = item.directory_id;
      if (!acc[directoryId]) {
        acc[directoryId] = {
          directory: item.directory,
          items: [],
        };
      }
      acc[directoryId].items.push(item);
      return acc;
    }, {})
  );

export default function GlobalSearch({
  show = false,
  setShow = () => {},
  onClick = () => {},
}) {
  const [text, setText] = React.useState("");

  const [results, setResults] = React.useState(false);

  const fetchFiles = async () => {
    try {
      const { data } = await axios.post(API.HOST + API.CONTENTS_LIST, {
        search: text,
      });
      setResults(groupedByDirectory(data));
    } catch (err) {
      console.log(err);
      toast.error("Oops!! There is a problem fetching contents");
    }
  };

  const ref = useDetectClickOutside({ onTriggered: () => setShow(false) });

  React.useEffect(() => {
    if (text) fetchFiles();
    else setResults([]);
  }, [text]);

  React.useEffect(() => {
    setText("");
  }, [show]);

  return (
    <FadeInComponent
      show={show}
      duration={0.2}
      className="z-30 fixed inset-0 bg-black bg-opacity-40 flex flex-col justify-center items-center"
    >
      <FadeInComponent
        show={show}
        fadeFromBottom
        duration={0.3}
        delay={100}
        ref={ref}
        className="w-[600px] min-h-[500px] max-h-[700px] shadow-xl flex-1 flex flex-col bg-white rounded-md p-5 pb-0"
      >
        <div className="flex gap-x-3 items-center">
          <div className="flex-1 gap-x-3 text-sm flex border px-4 py-3 rounded-md items-center">
            <div className="text-zinc-400">
              <Search />
            </div>
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="flex-1 focus:outline-none"
              placeholder="Search here"
              type="text"
              autoFocus
            />
            {text && (
              <button onClick={() => setText("")}>
                <p className="text-zinc-400 hover:text-zinc-800">Clear</p>
              </button>
            )}
          </div>
          <button
            onClick={() => setShow(false)}
            className="bg-zinc-400 text-sm px-6 py-3 rounded-md text-white"
          >
            esc
          </button>
        </div>
        <div className="flex flex-1 overflow-y-scroll py-3 pt-0 flex-col">
          {results &&
            results?.map((each, id) => (
              <div key={id}>
                <p key={id} className="mt-4">
                  {each?.directory?.name}
                </p>
                {each?.items?.map((item, id) => (
                  <div
                    onClick={() => {
                      onClick(item.id);
                      setShow(false);
                    }}
                    key={id}
                    className="hover:bg-blue-100 cursor-pointer bg-zinc-50 mt-4 rounded-md py-3 flex items-center justify-between px-4 border border-zinc-200"
                  >
                    <div className="flex flex-col">
                      <Highlighter
                        className="text-sm font-medium"
                        searchWords={[text]}
                        autoEscape={true}
                        textToHighlight={item?.name}
                      />
                      {/* <p className="text-sm font-medium">{}</p> */}
                      <p className="mt-2 text-xs text-zinc-500">
                        {item.header}
                      </p>
                    </div>
                    <div className="text-blue-500">
                      <ArrowUpRight className="h-5" />
                    </div>
                  </div>
                ))}
              </div>
            ))}
        </div>
      </FadeInComponent>
    </FadeInComponent>
  );
}
