import { useState } from "react";
import { appWindow } from "@tauri-apps/api/window";

export default function Titlebar() {
  const [isScaleup, setScaleup] = useState(false);
  const onMinimize = () => appWindow.minimize();
  const onScaleup = () => {
    appWindow.toggleMaximize();
    setScaleup(true);
  }

  const onScaledown = () => {
    appWindow.toggleMaximize();
    setScaleup(false);
  }

  const onClose = () => appWindow.close();

  return <div id="titlebar" data-tauri-drag-region>
    {/* <input type="search" id="searchFile" className="outline-0 text-50-white" placeholder="search your file here" /> */}
    <div className="titlebar-actions">
      <i id="ttb-close" className="titlebar-icon ri-close-fill" onClick={onClose}></i>
      <i className="titlebar-icon minimize-icon ri-subtract-line" onClick={onMinimize}></i>
      {isScaleup ? <i className="titlebar-icon maximize-icon ri-file-copy-line" onClick={onScaledown}></i> : <i onClick={onScaleup} className="titlebar-icon ri-stop-line maximize-icon"></i>}
    </div>
    <div className="flex items-center gap-1 5 pl-2 px-2">
      <img src="/anish.jpg" style={{ width: 10 }} alt="" />
      <span className="text-xs uppercase">60s Code</span>
    </div>
  </div>
}
