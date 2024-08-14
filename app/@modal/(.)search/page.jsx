"use client";

import React from "react";
import Modal from "./modal";
import Search from "../../search/page";

export default function PhotoModal({ params: { id: _photoId } }) {
  return (
    <Modal>
      <h1 style={{ color: "black" }}>
        <Search />
      </h1>{" "}
    </Modal>
  );
}
