import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./auth/Login";
import Dashboard from "./pages/Dashboard";
import { AuthProvider } from "./context/AuthContext";
import UserIndentRequest from "./components/UserIndentRequest";
import SLAView from "./components/SLAView";
import StoreView from "./components/StoreView";
import FinanceView from "./pages/FinanceView";
import PurchasePanel from "./pages/PurchasePanel";
import Navbar from "./pages/Navbar";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import "./App.css";
import ProfilePage from "./pages/ProfilePage";
// import AdminPanel from "./pages/AdminDashboard";
import AdminDashboard from "./pages/AdminDashboard";
// import TrackIndent from "./components/TrackIndent";
// import TrackIndentStepper from "./components/TrackIndentStepper";
// import FinancePanel from "./components/FinancePanel";




// Create a theme instance
const theme = createTheme({
  palette: {
    primary: {
      main: '#1565c0',
      light: '#5e92f3',
      dark: '#003c8f',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#2e7d32',
      light: '#60ad5e',
      dark: '#005005',
      contrastText: '#ffffff',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.12)',
        },
      },
    },
  },
});

// Protected route component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};






function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
    <AuthProvider>
      <BrowserRouter>
      <div className="app-container">
        {/* <Navbar /> */}
        <Navbar />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<ProfilePage />} />
          {/* <Route path="/dashboard" element={<Dashboard />} /> */}
          <Route path="/user/indent" element={<UserIndentRequest />} />
          <Route path="/dashboard/sla" element={<SLAView />} />
          <Route path="/dashboard/store" element={<StoreView />} />
          <Route path="/finance" element={<FinanceView />} />
          <Route path="/purchase" element={<PurchasePanel />} />
          <Route path="/admin" element={<AdminDashboard />} />

        </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
