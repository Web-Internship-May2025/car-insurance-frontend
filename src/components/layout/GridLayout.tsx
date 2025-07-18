import React from "react";
import "../../styles/GridLayout.scss";

interface GridLayoutProps {
  children: React.ReactNode;
}

const GridLayout = ({ children }: GridLayoutProps) => {
  return <div className="grid-layout">{children}</div>;
};

export default GridLayout;
