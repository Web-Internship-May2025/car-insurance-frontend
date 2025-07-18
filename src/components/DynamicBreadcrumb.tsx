import * as React from "react";
import { useLocation } from "react-router-dom";
import { Link as RouterLink } from "react-router-dom";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import "../styles/DynamicBreadcrumb.scss";

function capitalizeFirstLetter(str: string): string {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export default function DynamicBreadcrumb() {
  const location = useLocation();
  const segments = location.pathname.split("/").filter(Boolean);
  const breadcrumbs = React.useMemo(() => {
    if (segments.length === 0) {
      return [{ label: "Home", to: "/" }];
    }
    if (segments.length === 1) {
      const name = capitalizeFirstLetter(segments[0]);
      return [{ label: name, to: `/${segments[0]}` }];
    }
    const parentSegment = segments[0];
    const childSegment = segments[1];
    const parentName = capitalizeFirstLetter(parentSegment);
    const childLabel = childSegment.match(/^\d+$/)
      ? childSegment
      : capitalizeFirstLetter(childSegment);
    return [
      { label: parentName, to: `/${parentSegment}` },
      { label: childLabel, to: `/${parentSegment}/${childSegment}` },
    ];
  }, [location.pathname]);

  const shouldUnderline = breadcrumbs.length >= 2;

  return (
    <div
      className={`breadcrumb-wrapper ${shouldUnderline ? "underline-last" : ""}`}
      role="navigation"
      aria-label="breadcrumb"
    >
      <Breadcrumbs className="breadcrumb" aria-label="breadcrumb">
        {breadcrumbs.map((crumb, index) => {
          const isLast = index === breadcrumbs.length - 1;
          if (isLast) {
            return (
              <span
                key={index}
                className="breadcrumb-current"
                style={{ cursor: "pointer" }}
                onClick={() => window.location.reload()}
              >
                {crumb.label}
              </span>
            );
          } else {
            return (
              <Link
                key={index}
                underline="none"
                className="breadcrumb-item"
                color="inherit"
                component={RouterLink}
                to={crumb.to}
              >
                {crumb.label}
              </Link>
            );
          }
        })}
      </Breadcrumbs>
    </div>
  );
}
