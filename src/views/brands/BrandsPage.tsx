import BrandTable from "./BrandTable";
import "../../styles/BrandsPage.scss";
import "../../styles/TableMainLayout.scss";
import { CirclePlus } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function BrandsPage() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/brands/new");
  };
  return (
    <>
      <div className="header-container">
        <h2 className="header">Brands</h2>
        <button className="add-new-button" onClick={handleClick}>
          <CirclePlus color="white" size={18} style={{ marginRight: 6 }} />
          Add new
        </button>
      </div>

      <BrandTable></BrandTable>
    </>
  );
}
