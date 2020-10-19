import React from "react";

const menuStyles = {
  maxHeight: 80,
  maxWidth: 300,
  overflowY: "scroll",
  backgroundColor: "#eee",
  padding: 0,
  listStyle: "none",
  position: "relative",
};

const menuMultipleStlyes = {
  maxHeight: "180px",
  overflowY: "auto",
  width: "135px",
  margin: 0,
  borderTop: 0,
  background: "white",
  position: "absolute",
  zIndex: 1000,
  listStyle: "none",
  padding: 0,
  left: "340px",
};

const selectedItemStyles = {
  marginLeft: "5px",
  backgroundColor: "aliceblue",
  borderRadius: "10px",
};

const selectedItemIconStyles = { cursor: "pointer" };

const comboboxStyles = { display: "inline-block", marginLeft: "5px" };

const comboboxWrapperStyles = {
  display: "inline-flex",
  flexWrap: "wrap",
};

export {
  menuMultipleStlyes,
  menuStyles,
  comboboxStyles,
  comboboxWrapperStyles,
  selectedItemIconStyles,
  selectedItemStyles,
};
