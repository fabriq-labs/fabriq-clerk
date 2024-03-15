import React from "react";
import NavBar from "./navbar";

interface CardComponentProps {
  children: any;
}

const Layout: React.FC<CardComponentProps> = ({ children }) => (
  <div>
    <NavBar />
    <div className="content-container">{children}</div>
  </div>
);

export default Layout;
