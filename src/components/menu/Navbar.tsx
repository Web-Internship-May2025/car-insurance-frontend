import { Car as CarIcon, Menu as MenuIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useAppSelector } from "../../reducers";
import { selectAuthRole } from "../../reducers/AuthSlice";
import NavLinkGroup from "./NavLinkGroup";
import type { UserRoleType } from "../../types/UserServiceTypes";
import "../../styles/Navbar.scss";

interface Item {
  label: string;
  path: string;
  subpaths?: Item[];
  allowedRoles?: UserRoleType[];
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const role = useAppSelector(selectAuthRole);

  const mainLinks: Item[] = [
    {
      label: "Home",
      path: "/home",
      allowedRoles: [
        "ADMINISTRATOR",
        "SUBSCRIBER",
        "SALES_AGENT",
        "MANAGER",
        "DRIVER",
        "CLAIMS_ADJUSTER",
        "CLAIM_HANDLER",
        "CUSTOMER_SERVICE_REPRESENTATIVE",
      ],
      subpaths: [],
    },
    {
      label: "Profile",
      path: "/profile",
      allowedRoles: [
        "ADMINISTRATOR",
        "SUBSCRIBER",
        "SALES_AGENT",
        "MANAGER",
        "DRIVER",
        "CLAIMS_ADJUSTER",
        "CLAIM_HANDLER",
        "CUSTOMER_SERVICE_REPRESENTATIVE",
      ],
      subpaths: [],
    },
    {
      label: "Register",
      path: "/register",
      allowedRoles: ["MANAGER"],
      subpaths: [],
    },
    {
      label: "Proposals",
      path: "/proposals",
      subpaths: [],
      allowedRoles: ["SALES_AGENT"],
    },
    {
      label: "Claims",
      path: "/claims",
      subpaths: [],
      allowedRoles: ["SUBSCRIBER"],
    },
    {
      label: "Currencies",
      path: "/currencies",
      allowedRoles: ["ADMINISTRATOR"],
    },
    {
      label: "Subscribers",
      path: "/subscribers",
      allowedRoles: ["SALES_AGENT"]
    },
    {
      label: "Policy Creation",
      path: "/policy-creation",
      allowedRoles: ["SALES_AGENT"]
    },
    {
      label: "Countries",
      path: "/countries",
      allowedRoles: ["ADMINISTRATOR"],
    },
    {
      label: "Brands",
      path: "/brands",
      allowedRoles: ["ADMINISTRATOR"],
    },
    {
      label: "Policies",
      path: "/policies",
      allowedRoles: ["SALES_AGENT"],
    },
    {
      label: "Policies",
      path: "/policy",
      allowedRoles: ["SUBSCRIBER"],
    },
    {
      label: "Log out",
      path: "/",
      allowedRoles: [
        "ADMINISTRATOR",
        "SUBSCRIBER",
        "SALES_AGENT",
        "MANAGER",
        "DRIVER",
        "CLAIMS_ADJUSTER",
        "CLAIM_HANDLER",
        "CUSTOMER_SERVICE_REPRESENTATIVE",
      ],
      subpaths: [],
    },
  ];

  const visibleLinks = mainLinks.filter((item) => {
    if (!item.allowedRoles) return true;
    return item.allowedRoles.includes(role!);
  });

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to log out?");
      if (confirmLogout) {
        localStorage.removeItem("jwtToken");
        localStorage.removeItem("refreshToken");
        setIsOpen(false);
        window.location.href = "/";
  }
  };

  const renderMenuItems = (items: Item[]) => {
    return items.map((item) => {
      if (item.label === "Log out") {
        return (
          <a
            key={item.label}
            href={item.path}
            className="d-block px-3 py-3 nav-link"
            onClick={(e) => {
              e.preventDefault();
              handleLogout();
            }}
          >
            {item.label}
          </a>
        );
      }
      if (item.subpaths && item.subpaths.length > 0) {
        return (
          <NavLinkGroup
            key={item.label}
            label={item.label}
            path={item.path}
            items={item.subpaths}
            isDropdown={true}
            position="dropDown"
            className="py-3 nav-link"
          />
        );
      }
      return (
        <Link
          key={item.label}
          to={item.path}
          className="d-block px-3 py-3 nav-link"
          onClick={() => setIsOpen(false)}
        >
          {item.label}
        </Link>
      );
    });
  };

  return (
    <>
      <nav className="navbar fixed-top shadow">
        <div className="container-fluid d-flex align-items-center">
          <Link to="/home" className="d-none d-md-flex me-3 car-icon">
            <CarIcon
              style={{ width: "45px", height: "45px", color: "white" }}
            />
          </Link>

          <button
            className="btn btn-outline-primary d-custom-none me-2"
            onClick={() => setIsOpen(true)}
            aria-label="Open menu"
          >
            <MenuIcon size={20} style={{ color: "white" }} />
          </button>

          <Link to="/home" className="d-flex d-md-none ms-auto car-icon">
            <CarIcon
              style={{ width: "45px", height: "45px", color: "white" }}
            />
          </Link>

          <div className="d-none d-md-flex ">
            {renderMenuItems(visibleLinks)}
          </div>
        </div>
      </nav>

      <div className={`offcanvas-menu ${isOpen ? "open" : ""}`}>
        <button
          className="btn btn-close position-absolute top-0 end-0 m-3"
          onClick={() => setIsOpen(false)}
          aria-label="Close menu"
        ></button>

        <div className="custom-link">{renderMenuItems(visibleLinks)}</div>
      </div>

      {isOpen && <div className="overlay" onClick={() => setIsOpen(false)} />}
    </>
  );
}
