import { useEffect, useState } from "react";
import { fetchPoliciesSubsriber } from "../../services/PolicyApi";
import PolicyCard, { type Policy } from "./PolicyCard";
import GridLayout from "../../components/layout/GridLayout";
import Pagination from "../../components/Pagination";
import "../../styles/PoliciesPage.scss";
import { getUserId } from "../../services/jwtService";
import { GridOn, TableChart } from "@mui/icons-material";

export default function PoliciesPageSubsriber() {
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  useEffect(() => {
    (async () => {
      try {
        const response = await fetchPoliciesSubsriber(1, currentPage, pageSize);
        setPolicies(response.data.content);
        setTotalItems(response.data.totalElements);
      } catch (err) {
        console.error("Error fetching:", err);
      }
    })();
  }, [currentPage, pageSize]);

  const totalPages = Math.ceil(totalItems / pageSize);

  const handlePageChange = (page: number) => {
    if (page >= 0 && page < totalPages) {
      setCurrentPage(page);
    }
  };
  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(0);
  };
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetchPoliciesSubsriber(
          Number(getUserId()),
          currentPage,
          pageSize,
          "dateSigned",
          "asc"
        );
        console.log("Response data:", response.data);
        console.log("Total items:", response.data.totalElements);
        setPolicies(response.data.content);
        setTotalItems(response.data.totalElements);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [currentPage, pageSize]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <div className="view-toggle">
        <div
          className={`part ${viewMode === "grid" ? "active" : ""}`}
          onClick={() => setViewMode("grid")}
        >
          <GridOn fontSize="small" />
        </div>
        <div
          className={`part ${viewMode === "table" ? "active" : ""}`}
          onClick={() => setViewMode("table")}
        >
          <TableChart fontSize="small" />
        </div>
      </div>

      {/* Prikaz */}
      {viewMode === "grid" ? (
        <GridLayout>
          {policies.map((policy) => (
            <PolicyCard key={policy.id} policy={policy} />
          ))}
        </GridLayout>
      ) : (
        <table className="policy-table">
          <thead>
            <tr>
              <th>Date Signed</th>
              <th>Expiring Date</th>
              <th>Amount</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {policies.map((policy) => (
              <tr key={policy.id}>
                <td>{policy.dateSigned}</td>
                <td>{policy.expiringDate}</td>
                <td>${policy.amount}</td>
                <td className="actions">
                  <button>View</button>
                  <button
                    className={!policy.canAddClaim ? "disabled" : ""}
                    disabled={!policy.canAddClaim}
                  >
                    Add claim
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Pagination */}
      <Pagination
        pageSize={pageSize}
        currentPage={currentPage}
        onPageSizeChange={handlePageSizeChange}
        onPageChange={handlePageChange}
        totalPages={0} totalItems={0}        />
    </div>
  );
}
