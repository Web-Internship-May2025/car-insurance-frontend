import "../../styles/TableMainLayout.scss";

interface LayoutContentProps {
  children?: React.ReactNode;
}

export default function LayoutContent({ children }: LayoutContentProps) {
  return <div className="main-layout">{children}</div>;
}
