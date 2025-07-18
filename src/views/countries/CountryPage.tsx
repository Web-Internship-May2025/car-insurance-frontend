import CountriesTable from "./CountriesTable";
import "../../styles/TableMainLayout.scss";
import { CirclePlus } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function CountriesPage() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/countries/new");
  };

  return (
    <>
      <div className="header-container">
        <h2 className="header">Countries</h2>
        <button className="add-new-button" onClick={handleClick}>
          <CirclePlus color="white" size={18} style={{ marginRight: 6 }} />
          Add new
        </button>
      </div>

      <CountriesTable></CountriesTable>
    </>
  );
}
