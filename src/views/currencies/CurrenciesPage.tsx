import { CirclePlus } from "lucide-react";
import CurrenciesTable from "./CurrenciesTable";
import "../../styles/TableMainLayout.scss";
import { useNavigate } from "react-router-dom";

export default function CurrenciesPage() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/currencies/new");
  };
  return (
    
    <>
      <div className="header-container">
        <h2 className="header">Currencies</h2>
        <button className="add-new-button"  onClick={handleClick}>
          <CirclePlus color="white" size={18} style={{ marginRight: 6 }}/>
          Add new
        </button>
      </div>

      <CurrenciesTable></CurrenciesTable>
    </>
  );
}
