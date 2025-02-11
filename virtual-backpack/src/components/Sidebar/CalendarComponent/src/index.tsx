import React, { StrictMode } from "react";
import * as ReactDOMClient from "react-dom/client";
import './style.css';
import Calendar from "./Calendar.tsx";
import ParentComponent from "./ParentComponent.tsx";

const rootElement = document.getElementById("root");
const root = ReactDOMClient.createRoot(rootElement!);

root.render(
  <StrictMode>
    <ParentComponent />
  </StrictMode>
);