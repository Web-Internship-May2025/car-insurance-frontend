import { createRoot } from "react-dom/client";
import "./index.scss";
import App from "./App.tsx";
import "react-toastify/dist/ReactToastify.css";

createRoot(document.getElementById("root")!).render(<App />);
