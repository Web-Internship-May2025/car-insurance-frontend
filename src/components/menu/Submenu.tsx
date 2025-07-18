import { Link } from "react-router-dom";
import "../../styles/Submenu.scss";

interface MenuItem {
  label: string;
  path: string;
}

interface SubmenuProps {
  isOpen: boolean;
  onClose: () => void;
  position?: "dropDown" | "inline";
  items: MenuItem[];
}

export default function Submenu({
  isOpen,
  onClose,
  position = "dropDown",
  items,
}: SubmenuProps) {
  if (!isOpen) return null;

  return (
    <div className={`submenu ${position}`}>
      {items.map((item, index) => (
        <Link
          key={index}
          to={item.path}
          className="d-block px-3 py-2"
          onClick={onClose}
        >
          {item.label}
        </Link>
      ))}
    </div>
  );
}
