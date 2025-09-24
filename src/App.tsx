import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { SettingsProvider } from "./services/useSettings";
import { useApplyTheme } from "./services/useApplyTheme";
import { Navbar } from "./components/Layout/Navbar";

import { ProtectedRoute } from "./components/Auth/ProtectedRoute";
import { Register } from "./pages/Register";
import { Login } from "./pages/Login";
import { Dashboard } from "./pages/Dashboard";
import { Projects } from "./pages/Projects";
import { ProjectDetail } from "./pages/ProjectDetail";
import { JoineryDetail } from "./pages/JoineryDetail";
import { Settings } from "./pages/Settings";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function InnerApp() {
  useApplyTheme();

  return (
    <AuthProvider>
      <Router>
        <div
          style={{
            backgroundColor: "var(--color-app-background)",
            color: "var(--color-text-on-navbar)",
          }}
          className="min-h-screen"
        >
          <Navbar />
          <main>
            <div className="p-0">
              <Routes>
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route
                  path="/"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/projects"
                  element={
                    <ProtectedRoute>
                      <Projects />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/projects/:id"
                  element={
                    <ProtectedRoute>
                      <ProjectDetail />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/projects/:projectId/joineries/:joineryId"
                  element={
                    <ProtectedRoute>
                      <JoineryDetail />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/settings"
                  element={
                    <ProtectedRoute>
                      <Settings />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </div>
          </main>

          {/* ✅ Toast notifications */}
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="colored"
          />
        </div>
      </Router>
    </AuthProvider>
  );
}

function App() {
  return (
    <SettingsProvider>
      <InnerApp />
    </SettingsProvider>
  );
}

export default App;
