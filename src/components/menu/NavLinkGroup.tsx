import { useState } from "react";
import { Link } from "react-router-dom";
import Submenu from "./Submenu";

interface Item {
  label: string;
  path: string;
  subpaths?: Item[];
}

interface NavLinkGroupProps {
  label: string;
  path?: string;
  items?: Item[];
  isDropdown?: boolean;
  position?: "dropDown" | "inline";
  className?: string;
}

export default function NavLinkGroup({
  label,
  path,
  items,
  isDropdown = false,
  position = "inline",
  className = "",
}: NavLinkGroupProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleMouseEnter = () => {
    if (isDropdown) setIsOpen(true);
  };

  const handleMouseLeave = () => {
    if (isDropdown) setIsOpen(false);
  };

  if (items) {
    return (
      <div
        className={`nav-link mx-3 position-relative cursor-pointer ${position} ${className}`}
        onClick={() => setIsOpen((prev) => !prev)}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {label}
        {isDropdown && (
          <Submenu
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            position={position}
            items={items}
          />
        )}
      </div>
    );
  }

  return (
    <Link to={path || "#"} className="nav-link mx-3">
      {label}
    </Link>
  );
}
