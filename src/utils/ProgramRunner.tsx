import { EditorView } from "codemirror";
import React, { useEffect, useRef } from "react";
import { useRunEventListener } from "./EventListener";

type Props = {
  onRunFunction: () => void;
  editorRefProp: React.MutableRefObject<EditorView | null>;
  fileProp: any;
  activeTab: boolean;
};

const ProgramRunner = ({ fileProp, editorRefProp, activeTab }: Props) => {
  // const editorRef = useRef<EditorView | null>(null);

  const onRun = async () => {
    if (!editorRefProp.current) return;

    const content = editorRefProp.current.state.doc.toString();
    const blob = new Blob([content], {
      type: "text/javascript" || "text/python",
    });
    const url = URL.createObjectURL(blob);
    const worker = new Worker(url);

    worker.onmessage = (ev) => {
      console.log(ev.data);
    };

    if (fileProp.name.endsWith(".py")) {
      console.log(`Python code: ${content}`);
    }
    //

    worker.postMessage("Hello from the editor");
  };

  // on shortcut cmd + r or ctrl + r run the code
  // useEffect(() => {
  //   const onKeyPress = (ev: KeyboardEvent) => {
  //     // if ((ev.ctrlKey && ev.key === "r") || (ev.metaKey && ev.key === "r")) {
  //     //   ev.preventDefault();
  //     //   ev.stopPropagation();
  //     //   onRun();
  //     useRunEventListener(onRun);
      
  //   };

  //   document.addEventListener("keydown", onKeyPress);

  //   return () => {
  //     document.removeEventListener("keydown", onKeyPress);
  //   };
  // }, []);

  useRunEventListener(onRun);


  return (
    <div>
      {(fileProp.name.endsWith(".js") || fileProp.name.endsWith(".py")) &&
        activeTab && (
          <button
            onClick={onRun}
            className="absolute top-0 right-[150px] rounded-md text-green-400 hover:text-green-500"
          >
            ▶
          </button>
        )}
    </div>
  );
};

export default ProgramRunner;
