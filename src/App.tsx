import "./App.scss";
import { BrowserRouter } from "react-router-dom";
import Navbar from "./components/menu/Navbar.tsx";
import Navigation from "./navigation/Navigation";
import { Provider } from "react-redux";
import { store } from "./reducers/index.ts";
import { ToastContainer } from "react-toastify";
import LayoutContent from "./components/layout/LayoutContent.tsx";
import DynamicBreadcrumb from "./components/DynamicBreadcrumb.tsx";

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Navbar />
        <LayoutContent>
          <DynamicBreadcrumb />
          <Navigation />
          <ToastContainer position="bottom-right" autoClose={3000} />
        </LayoutContent>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
