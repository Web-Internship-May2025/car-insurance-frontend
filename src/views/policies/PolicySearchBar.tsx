import React, { useEffect, useState } from "react";
import "../../styles/PolicySearchBar.scss";
import { Search, Trash } from "lucide-react";
import { formatDateToISO } from "../../utils/DateTimeFormatter";
import CustomCalendar from "../../components/CustomCalendar";

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

export interface PolicySearchBarProps {
  firstName: string;
  lastName: string;
  email: string;
  onFirstNameChange: (v: string) => void;
  onLastNameChange: (v: string) => void;
  onEmailChange: (v: string) => void;
  onSearch: () => void;
  onClear: () => void;

  showAdvancedSearch: boolean;
  toggleAdvancedSearch: () => void;

  creationDate: string;
  onCreationDateChange: (v: string) => void;

  carBrand: string;
  onCarBrandChange: (v: string) => void;

  carModel: string;
  onCarModelChange: (v: string) => void;

  carYear: number | "";
  onCarYearChange: (v: number | "") => void;
}

const PolicySearchBar: React.FC<PolicySearchBarProps> = ({
  firstName,
  lastName,
  email,
  onFirstNameChange,
  onLastNameChange,
  onEmailChange,
  onSearch,
  onClear,

  showAdvancedSearch,
  toggleAdvancedSearch,

  creationDate,
  onCreationDateChange,

  carBrand,
  onCarBrandChange,

  carModel,
  onCarModelChange,

  carYear,
  onCarYearChange,
}) => {
  const [dateValue, setDateValue] = useState<Value>(null);
  useEffect(() => {
    if (creationDate) {
      const d = new Date(creationDate);
      if (!isNaN(d.getTime())) setDateValue(d);
      else setDateValue(null);
    } else {
      setDateValue(null);
    }
  }, [creationDate]);

  return (
    <div className="policy-search-bar">
      <input
        type="text"
        placeholder="First name"
        value={firstName}
        onChange={(e) => onFirstNameChange(e.target.value)}
        style={{ marginRight: 8, width:"auto" }}
      />
      <input
        type="text"
        placeholder="Last name"
        value={lastName}
        onChange={(e) => onLastNameChange(e.target.value)}
        style={{ marginRight: 8, width:"auto" }}
      />
      <input
        type="text"
        placeholder="Email"
        value={email}
        onChange={(e) => onEmailChange(e.target.value)}
        style={{ marginRight: 8, width:"auto" }}
      />
      <button onClick={onSearch}>
        <Search size={20} />
      </button>
      <button
        onClick={onClear}
        style={{
          backgroundColor: "red",
          cursor: "pointer",
          color: "white",
        }}
      >
        <Trash size={20} />
      </button>
      <button onClick={toggleAdvancedSearch} style={{ marginLeft: 16 }}>
        {showAdvancedSearch ? "Hide Advanced Search" : "Show Advanced Search"}
      </button>

      {showAdvancedSearch && (
        <div className="advanced-search">
          <div>
            <label>Creation Date:</label>
            <CustomCalendar
              value={dateValue}
              onChange={(value: Value) => {
                setDateValue(value);
                if (value instanceof Date) {
                  onCreationDateChange(formatDateToISO(value));
                } else if (Array.isArray(value) && value[0]) {
                  onCreationDateChange(formatDateToISO(value[0]));
                } else {
                  onCreationDateChange("");
                }
              }}
              maxDate={new Date()}
            />
          </div>
          <div className="car-filters">
            <label>Car details:</label>
            <input
              type="text"
              value={carBrand}
              onChange={(e) => onCarBrandChange(e.target.value)}
              placeholder="Brand"
            />

            <input
              type="text"
              value={carModel}
              onChange={(e) => onCarModelChange(e.target.value)}
              placeholder="Model"
            />

            <input
              type="text"
              value={carYear}
              onChange={(e) => {
                const value = e.target.value;
                const num = value === "" ? "" : Number(value);
                onCarYearChange(num);
              }}
              placeholder="Year"
              min={1900}
              max={2100}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default PolicySearchBar;
