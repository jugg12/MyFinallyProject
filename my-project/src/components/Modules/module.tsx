import React from "react";
import "./module.css";

const Modal = ({active,setActive,children})=>{
  return(
    <div className={active ? "modal active":"modal"}>
      <div className="modal__content" onClick={e=>e.stopPropagation()}>
        {children}
      </div>
    </div>
  )
};
export default Modal;