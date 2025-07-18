import React from "react";
import "../../styles/CardsLayout.scss";

interface CardsLayoutProps {
  children: React.ReactNode;
}
const CardsLayout = ({ children }: CardsLayoutProps) => {
  return <div className="cards-layout">{children}</div>;
};
export default CardsLayout;
