import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./auth/Login";
import Dashboard from "./pages/Dashboard";
import { AuthProvider } from "./context/AuthContext";
import UserIndentRequest from "./components/UserIndentRequest";
import SLAView from "./components/SLAView";
import StoreView from "./components/StoreView";
import FinanceView from "./pages/FinanceView";
import PurchasePanel from "./pages/PurchasePanel";
// import TrackIndent from "./components/TrackIndent";
// import TrackIndentStepper from "./components/TrackIndentStepper";
// import FinancePanel from "./components/FinancePanel";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          {/* <Route path="/dashboard" element={<Dashboard />} /> */}
          <Route path="/user/indent" element={<UserIndentRequest />} />
          <Route path="/dashboard/sla" element={<SLAView />} />
          <Route path="/dashboard/store" element={<StoreView />} />
          <Route path="/finance" element={<FinanceView />} />
          <Route path="/purchase" element={<PurchasePanel />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
