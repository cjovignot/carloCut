import { Link, useLocation } from "react-router-dom";
import { LogOut, Home, FolderOpen, Anvil, Settings } from "lucide-react";
import { useAuth } from "../../services/useAuth";
import { useSettings } from "../../services/useSettings";
import { useEffect, useState } from "react";

export function Navbar() {
  const { user, logout } = useAuth();
  const { tempTheme } = useSettings();
  const location = useLocation();
  const [selectedPath, setSelectedPath] = useState(location.pathname);

  useEffect(() => {
    setSelectedPath(location.pathname);
  }, [location.pathname]);

  if (!user || location.pathname === "/login") return null;

  const navItems = [
    { label: "Tableau de bord", icon: Home, path: "/" },
    { label: "Projets", icon: FolderOpen, path: "/projects" },
    { label: "Réglages", icon: Settings, path: "/settings" },
    { label: "Logout", icon: LogOut, action: logout },
  ];

  const bgStyle = "var(--color-navbar-bg)";
  const hoverStyle = "var(--color-navbar-hover)";
  const textColor = "var(--color-navbar-text)";

  return (
    <nav
      className="fixed z-50 w-full transition-colors duration-300 shadow-md"
      style={{ backgroundColor: bgStyle }}
    >
      {/* Desktop Navbar */}
      <div className="items-center justify-between hidden h-16 px-8 mx-auto md:flex max-w-7xl">
        <Link
          to="/"
          className="flex items-center space-x-2"
          style={{ color: textColor }}
        >
          <Anvil className="w-8 h-8" style={{ color: textColor }} />
          <span
            className="text-xl font-bold tracking-wide uppercase"
            style={{ color: textColor }}
          >
            ECB-Carlo
          </span>
        </Link>

        <div className="flex items-center space-x-4">
          {navItems.slice(0, 3).map((item) => (
            <Link
              key={item.label}
              to={item.path}
              className="flex items-center px-3 py-2 text-sm font-medium transition-colors rounded-md"
              style={{
                backgroundColor:
                  selectedPath === item.path ? "var(--color-primary)" : bgStyle,
                color: textColor,
              }}
            >
              <item.icon
                className="w-4 h-4 mr-2"
                style={{ color: textColor }}
              />
              {item.label}
            </Link>
          ))}

          {/* Logout button */}
          <button
            onClick={logout}
            className="flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors hover:bg-[var(--color-primary)]"
            style={{ backgroundColor: bgStyle, color: textColor }}
          >
            <LogOut className="w-4 h-4 mr-2" style={{ color: textColor }} />
            Logout
          </button>
        </div>
      </div>

      {/* Mobile Navbar */}
      <div
        className="fixed bottom-0 left-0 w-full transition-colors duration-300 shadow-md md:hidden"
        style={{ backgroundColor: bgStyle, color: textColor }}
      >
        <div className="grid h-12 grid-cols-4">
          {navItems.map((item) =>
            item.path ? (
              <Link
                key={item.label}
                to={item.path}
                className="flex flex-col items-center justify-center flex-1 transition-colors"
                style={{
                  backgroundColor:
                    selectedPath === item.path
                      ? "var(--color-primary)"
                      : bgStyle,
                  color: textColor,
                }}
              >
                <item.icon className="w-6 h-6" style={{ color: textColor }} />
              </Link>
            ) : (
              <button
                key={item.label}
                onClick={item.action}
                className="flex-1 flex flex-col items-center justify-center transition-colors rounded-md hover:bg-[var(--color-primary)]"
                style={{ backgroundColor: bgStyle, color: textColor }}
              >
                <item.icon className="w-6 h-6" style={{ color: textColor }} />
              </button>
            )
          )}
        </div>
      </div>
    </nav>
  );
}
