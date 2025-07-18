import "../../styles/PoliciesPage.scss";
import "../../styles/TableMainLayout.scss";
import PoliciesTabs from "./PoliciesTabs";

export default function PoliciesPage() {
  return (
    <>
      <div className="header-container">
        <h2 className="header">Policies</h2>
      </div>

      <PoliciesTabs></PoliciesTabs>
    </>
  );
}
