import { nanoid } from "nanoid";
import { useEffect, useMemo, useRef, useState } from "react";
import { EditorView, basicSetup } from "codemirror";
import { getFileObject } from "../stores/file";
import { readFile, writeFile } from "../helpers/filesys";
import { javascript } from "@codemirror/lang-javascript";
import { markdown } from "@codemirror/lang-markdown";
import { html } from "@codemirror/lang-html";
import { css } from "@codemirror/lang-css";
import { json } from "@codemirror/lang-json";
import { rust } from "@codemirror/lang-rust";
import { materialDark } from "cm6-theme-material-dark";
import { FILE_SAVED_SUCCESSFULLY } from "../constants/Messages";
import { FormatDate, FormatTime } from "../utils/FormatDate";
import Modals from "./Modals";
import ProgramRunner from "../utils/ProgramRunner";
import { simpleLezerLinter } from "../utils/SimpleLezerLinter";
import { keymap } from "@codemirror/view";
import { insertTab } from "@codemirror/commands";
import { StateEffect } from "@codemirror/state";
import { fontSizes } from "../utils/fontSizes";

interface Props {
  id: string;
  active: boolean;
}

export default function CodeEditor({ id, active }: Props) {
  const isRendered = useRef(0);
  const editorId = useMemo(() => nanoid(), []);
  const visible = active ? "" : "hidden";
  const editorRef = useRef<EditorView | null>(null);
  const [savedContentMessage, setSavedContentMessage] = useState(false);

  const [fontSize, setFontSize] = useState<number>(() => {
    // When initializing the state, read the font size from local storage
    const savedFontSize = localStorage.getItem("fontSize");
    return savedFontSize ? Number(savedFontSize) : 16;
  });
  const fontSizeExtension = [
    EditorView.theme({
      "&": { height: "100%" },
      ".cm-content": {
        fontSize: `${fontSize}px`,
      },
      ".cm-scroller": {},
    }),
  ];

  const updateEditorContent = async (id: string) => {
    const file = getFileObject(id);
    const content = await readFile(file.path);

    fillContentInEditor(content);
  };

  const fillContentInEditor = (content: string) => {
    const elem = document.getElementById(editorId);

    if (elem && isRendered.current === 0) {
      isRendered.current = 1;
      editorRef.current = new EditorView({
        doc: content,
        extensions: [
          basicSetup,
          javascript(),
          markdown(),
          html(),
          css(),
          json(),
          rust(),
          materialDark,
          fontSizeExtension,
          simpleLezerLinter(), // Add the linter as an extension
          keymap.of([{ key: "Tab", run: insertTab }]), // Add the keymap extension with the defaultTabBinding
        ],
        parent: elem,
      });
    }
  };

  const file = getFileObject(id);
  const onSave = async () => {
    if (!editorRef.current) return;

    const content = editorRef.current.state.doc.toString();

    await writeFile(file.path, content);
    file.saved = true;
    if (file.saved) {
      setSavedContentMessage(true);
      setTimeout(() => {
        setSavedContentMessage(false);
      }, 500);
    }
  };

  useEffect(() => {
    updateEditorContent(id);
  }, [id]);

  const updateFontSize = (newFontSize: any) => {
    if (editorRef.current) {
      let tr = editorRef.current.state.update({
        effects: changeFontSize.of(newFontSize)
      });
      editorRef.current.dispatch(tr);
    }
    // Update the state variable, which will also update the local storage
    setFontSize(newFontSize);
  };

  useEffect(() => {
    // When the font size changes, update the value in local storage
    localStorage.setItem("fontSize", String(fontSize));
    // Update the font size in the editor
  }, [fontSize]);
  const changeFontSize = StateEffect.define();

  return (
    <>
      <main
        className={`w-full overflow-y-auto ${visible}`}
        style={{ height: "calc(100vh - 40px)" }}
      >
        <div
          id={editorId}
          tabIndex={-1}
          onKeyUp={(ev) => {
            if (
              (ev.ctrlKey && ev.key === "s") ||
              (ev.metaKey && ev.key === "s")
            ) {
              ev.preventDefault();
              ev.stopPropagation();
              onSave();
            }
          }}
        ></div>
      </main>
      <div className="absolute top-0 right-[340px] px-2 rounded-md">
        <select className="select-tag"
          value={fontSize}
          onChange={(e) => updateFontSize(Number(e.target.value))}
        >
          {fontSizes?.map((size) => (
            <option key={size.value} value={size.value}>
              {size.label}
            </option>
          ))}
        </select>
      </div>
      <button
        onClick={onSave}
        className="absolute top-0 right-[90px] px-2 rounded-md text-green-400 bg-slate-600 hover:bg-slate-700"
      >
        Save
      </button>
      {savedContentMessage && (
        <span className="absolute top-0 right-[180px] bg-black z-10 text-green-400">
          {FILE_SAVED_SUCCESSFULLY}
        </span>
      )}

      <span className="absolute top-0 left-[200px] text-red-600">
        {FormatDate({ date: new Date().toISOString() })}
      </span>
      <ProgramRunner
        onRunFunction={() => console.log("running code")}
        editorRefProp={editorRef}
        fileProp={file}
        activeTab={active}
      />
      <Modals />
    </>
  );
}
