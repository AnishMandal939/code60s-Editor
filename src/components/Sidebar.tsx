import { useState } from "react";
import { IFile } from "../types";
import { open } from "@tauri-apps/api/dialog";
import NavFiles from "./NavFiles";
import { readDirectory } from "../helpers/filesys";
import { useSource } from "../context/SourceContext";
import { CLOSE_SIDEBAR, OPEN_SIDEBAR } from "../constants/Messages";

interface SidebarProps {
  openFile: (file: IFile) => void;
}

export default function Sidebar({ openFile }: SidebarProps) {
  const [projectName, setProjectName] = useState("");
  const [files, setFiles] = useState<IFile[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [openCollapseSidebar, setOpenCollapseSidebar] = useState(true);

  const loadFile = async () => {
    const selected = await open({
      directory: true,
    });

    if (!selected) return;

    setProjectName(selected as string);
    readDirectory(selected + "/").then((files) => {
      // console.log(files);
      setFiles(files);
    });
  };
  const { setSelect, selected, addOpenedFile, closeAllFiles } = useSource();

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  // for search algo  - use Binary tree, The algorithm commonly used for searching files is the Depth-First Search (DFS) algorithm. This algorithm traverses through the directory structure recursively, exploring each branch fully before backtracking. In terms of code, programming languages like Python often utilize functions such as os.walk() or os.listdir() to implement file searching functionality. These functions allow for navigating directories, listing files, and performing search operations efficiently.
  const filteredFiles = files.filter(
    (file) =>{
      file.name.toLowerCase().includes(searchTerm.toLowerCase()) 
      if(file.kind === "directory"){
        return file.children.filter((child:any) => child.name.toLowerCase().includes(searchTerm.toLowerCase()))
      }
    }
  );

  const openFileInEditor = async (file: IFile) => {
    if (file.kind === "file") {
      setSelect(file.id);
      addOpenedFile(file.id);
    }
  };

  const handleCloseOpenSidebar = () => {
    setOpenCollapseSidebar(!openCollapseSidebar);
  };
  window.addEventListener('keydown', (e) =>{
    if((e.ctrlKey && e.key === 'b') || (e.metaKey && e.key === 'b')){
      setOpenCollapseSidebar(!openCollapseSidebar)

    }
  })

  return (
    <>
      <button
        className="absolute top-0 left-40 text-white text-lg"
        onClick={handleCloseOpenSidebar}
      >
        {openCollapseSidebar ? CLOSE_SIDEBAR : OPEN_SIDEBAR}
      </button>
      {openCollapseSidebar && (
        <aside
          id="sidebar"
          className={`shrink-0 h-full bg-darken ${
            openCollapseSidebar && "w-60"
          }`}
        >
          <button
            className="text-red-500 text-end w-full"
            onClick={closeAllFiles}
          >
            Close All Files
          </button>
          <input
            type="search"
            id="searchFile"
            className="outline-0 dark bg-transparent placeholder-green-500 text-white w-full px-2"
            placeholder="search your file here"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <ul className={`${searchTerm && "h-auto"}`}>
            {searchTerm &&
              filteredFiles.map((file) => (
                <li
                  className="text-purple-600 cursor-pointer p-1"
                  key={file.path}
                  onClick={(ev) => openFileInEditor(file)}
                >
                  {file.name}
                </li>
              ))
              }
          </ul>
          <div className="sidebar-header flex items-center justify-between p-4 py-2.5">
            <button className="project-explorer" onClick={loadFile}>
              File explorer (Open)
            </button>
            <div className="has-tooltip text-red-50">
              <span className="tooltip rounded shadow-lg p-1 bg-gray-100 text-red-500 -mt-8 project-name">
                {projectName}
              </span>
              {projectName && <>Path</>}
            </div>
          </div>
          <div className="code-structure">
            <NavFiles visible={true} files={files} />
          </div>
        </aside>
      )}
    </>
  );
}
