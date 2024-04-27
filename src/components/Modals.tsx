import React, { useEffect } from "react";

type Props = {};

const Modals = (props: Props) => {
  // for modal
  useEffect(() => {
    const modal = document.querySelector(".modal");
    const modalBtn = document.querySelector(".has-tooltip");
    const closeModal = document.querySelector(".close-modal");

    modalBtn?.addEventListener("click", () => {
      modal?.setAttribute("open", "true");
    });

    closeModal?.addEventListener("click", () => {
      modal?.removeAttribute("open");
    });

    return () => {
      modalBtn?.removeEventListener("click", () => {
        modal?.setAttribute("open", "true");
      });
      closeModal?.removeEventListener("click", () => {
        modal?.removeAttribute("open");
      });
    };
  }, []);
  return (
    <div>
      <button
        className="absolute top-0 right-[220px] rounded-md text-green-400 hover:text-green-500 has-tooltip"
        onClick={() => {
          const modal = document.querySelector(".modal");
          modal?.setAttribute("open", "true");
        }}
      >
        Shortcuts
      </button>
      {/* modal element  */}
      <dialog
        className="modal absolute z-10 rounded-md top-10 w-100 p-2 bg-auto"
        open={false}
      >
        <div className="modal-content">
          <button
            className="close-modal float-right text-red-600 top-0"
            onClick={() => {
              const modal = document.querySelector(".modal");
              modal?.removeAttribute("open");
            }}
          >
            X
          </button>
          <div className="modal-header">
            <h2>Shortcuts: </h2>
          </div>
          <div className="modal-body">
            <p>Save: Cmd + S or Ctrl + S</p>
            <p>Run: Cmd + R or Ctrl + R</p>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default Modals;
