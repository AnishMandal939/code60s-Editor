import CodeArea from "./components/CodeArea"
import Sidebar from "./components/Sidebar"
import Titlebar from "./components/Titlebar"
import { SourceProvider } from "./context/SourceContext"
import { IFile } from "./types"

export default function App() {
  return <div className="wrapper">
    <Titlebar />
    <div id="editor" className="h-screen flex items-start overflow-hidden bg-primary">
      <SourceProvider>
        <Sidebar openFile={function (file: IFile): void {
          throw new Error("Function not implemented.")
        } } /> 
        <CodeArea />
      </SourceProvider>
    </div>
  </div>
}


