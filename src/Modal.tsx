import React from "react";
import { createPortal } from "react-dom";
import styles from "./AppModal.module.css";

const Modal = (props: any) => {
  return createPortal(
    <div className={styles.myModal}>{props.children}</div>,
    document.body
  );
};

export default Modal;
