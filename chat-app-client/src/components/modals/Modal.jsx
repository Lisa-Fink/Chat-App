import React, { useEffect, useRef } from "react";
import "../../styles/modal.css";
import { MdClose } from "react-icons/md";

function Modal({ closeModal, children }) {
  const containerRef = useRef(null);

  const closeClick = (e) => {
    if (e.target === containerRef.current) closeModal();
  };
  useEffect(() => {
    document.addEventListener("click", closeClick);
    return () => {
      document.removeEventListener("click", closeClick);
    };
  }, []);

  return (
    <div className="modal-container" ref={containerRef}>
      <div className="modal">
        <div className="modal-close">
          <button onClick={closeModal} className="modal-hover">
            <MdClose />
          </button>
        </div>
        {children}
        <button id="close-btn" onClick={closeModal}>
          Close
        </button>
      </div>
    </div>
  );
}

export default Modal;
