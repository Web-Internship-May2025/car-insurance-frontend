import React, { useState, useEffect } from "react";
import {
  Edit2 as EditIcon,
  Trash2 as TrashIcon,
  CircleEllipsis as InfoIcon,
  RotateCw as RestoreIcon,
} from "lucide-react";
import "../styles/Pagination.scss";
import "../styles/Table.scss";
import Paginate from "./Pagination";
import { Download } from "lucide-react";  


function renderCellContent(value: any): React.ReactNode {
  if (value === null || value === undefined) {
    return null;
  }
  if (
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    return value.toString();
  }
  if (React.isValidElement(value)) {
    return value;
  }
  if (typeof value === "object") {
    return JSON.stringify(value);
  }
  return null;
}

export interface Column<T> {
  header: string;
  field: keyof T;
  editable?: boolean;
  render?: (value: any, row: T) => React.ReactNode;
  width?: string | number;
}

interface GenericTableProps<T> {
  columns: Column<T>[];
  data: T[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  name: string;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  showPagination?: boolean;
  onViewMore?: (row: T) => void;
  onEditClick?: (row: T) => void;
  onDeleteClick?: (row: T) => void;
  getRowClass?: (row: T) => string;
  onRestoreClick?: (row: T) => void;
  onEdit?: (row: T) => void;
  canEditRow?: (row: T) => boolean;
  canViewMore?: (row: T) => boolean;
  canDownload?: (row: T) => boolean;
}

function GenericTable<
  T extends {
    id: number | string;
    isDeleted: boolean;
  },
>(props: GenericTableProps<T>) {

  const [startPage, setStartPage] = useState(0);

  useEffect(() => {
    if (props.currentPage < startPage) {
      setStartPage(props.currentPage);
    } else if (props.currentPage >= startPage + 3) {
      setStartPage(props.currentPage - 2);
    }
  }, [props.currentPage, startPage]);

  const hasNextPage = props.currentPage < props.totalPages - 1 && props.data.length === props.pageSize;


  return (
    <div>
      <div className="table-wrapper">
        <table className="app-table">
          <thead>
            <tr>
              {props.columns.map((col) => (
                <th key={col.header} style={{ width: col.width }}>
                  {col.header}
                </th>
              ))}
              <th colSpan={4} style={{ textAlign: "center" }}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {props.data.map((row) => (
              <tr
                key={row.id}
                className={props.getRowClass ? props.getRowClass(row) : row.isDeleted ? "deleted-row" : ""}
              >
                {props.columns.map((col) => {
                  const cellValue = row[col.field];
                  return (
                    <td key={String(col.field)}>
                      {col.render
                        ? col.render(cellValue, row)
                        : renderCellContent(cellValue)}
                    </td>
                  );
                })}

                <td style={{ textAlign: "center" }}>
                  {!(props.canEditRow && !props.canEditRow(row)) && (
                    <button
                      className="icon-btn"
                      aria-label="Edit"
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                      }}
                      title={`Edit ${props.name}`}
                      onClick={() => {
                        if (props.onEdit) {
                          props.onEdit(row);
                        }
                      }}
                    >
                      <EditIcon size={20} color="blue" className="edit-icon" />
                    </button>
                  )}
                  {row.isDeleted ? (
                    <button
                      className="icon-btn"
                      aria-label="Restore"
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                      }}
                      onClick={() =>
                        props.onRestoreClick && props.onRestoreClick(row)
                      }
                      title={`Restore ${props.name}`}
                    >
                      <RestoreIcon
                        size={20}
                        color="green"
                        className="restore-icon"
                      />
                    </button>
                  ) : (
                    <button
                      className="icon-btn"
                      aria-label="Delete"
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                      }}
                      onClick={() =>
                        props.onDeleteClick && props.onDeleteClick(row)
                      }
                      title={`Delete ${props.name}`}
                    >
                      <TrashIcon size={20} color="red" className="trash-icon" />
                    </button>
                  )}
                  {props.canViewMore?.(row) && (
                    <button
                      className="icon-btn"
                      aria-label="View More"
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                      }}
                      onClick={() => {
                        if (props.onViewMore) {
                          props.onViewMore(row);
                        }
                      }}
                      title={`View ${props.name}`}
                    >
                      <InfoIcon size={20} color="green" className="info-icon" />
                    </button>
                  )}
                  {props.canDownload?.(row) && (
                    <button
                      className="icon-btn"
                      aria-label="Download PDF"
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                      }}
                      title={`Download ${props.name} as PDF`}
                    >
                      <Download size={20} color="black" className="info-icon" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {props.showPagination && (
        <Paginate
          totalPages={props.totalPages}
          currentPage={props.currentPage}
          pageSize={props.pageSize}
          onPageChange={props.onPageChange}
          onPageSizeChange={props.onPageSizeChange}
          hasNextPage={hasNextPage}
          totalItems={0}
        />
      )}
    </div>
  );
}


export default GenericTable;
