import React from "react";
import Image from "next/image";
import logoicon from "@/assets/logpage/logomodal.svg";

function Modal({ onClose }) {
  const modalStyle = {
    position: "fixed",
    top: "0",
    left: "0",
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.0)",
    zIndex: "9999",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  };

  const modalContentStyle = {
    backgroundColor: "#000000",
    padding: "30px",
    borderRadius: "5px",
    maxWidth: "500px",
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  };

  const closeButtonStyle = {
    backgroundColor: "#7FC047",
    color: "#000000",
    border: "none",
    borderRadius: "3px",
    // padding: "10px 20px",
    cursor: "pointer",
    marginTop: "20px",
    width: "350px",
    height: "30px",
    fontSize: "20px",
  };
  const header = {
    color: "#FFFFFF",
    fontSize: "20px",
    fontFamily: "Figtree, sans-serif",
    lineHeight: "36px",
    marginBottom: "20px",
  };
  const subHeader = {
    color: "#FFFFFF",
    fontSize: "14px",
    fontFamily: "Figtree, sans-serif",
    fontWeight: "500",
    marginBottom: "20px",
  };

  const imageLogo = {
    height: "40px",
    width: "80px",
    marginBottom: "20px",
    margin: "auto !important",
  };
  const backdropStyle = {
    position: "fixed",
    top: "0",
    left: "0",
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    backdropFilter: "blur(5px)",
    zIndex: "9998",
  };

  return (
    <div style={backdropStyle}>
      <div style={modalStyle}>
        <div style={modalContentStyle}>
          <Image
            height={10}
            width={10}
            src={logoicon.src}
            alt="Image"
            style={imageLogo}
          />
          <h2 style={header}>Invalid token</h2>
          <p style={subHeader}>
            Please check your inbox for further instructions.
          </p>
          <div>
            <button onClick={onClose} style={closeButtonStyle} type="button">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Modal;
