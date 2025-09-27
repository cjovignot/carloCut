import { Link, useLocation } from "react-router-dom";
import { LogOut, Home, FolderOpen, Anvil, Settings } from "lucide-react";
import { useAuth } from "../../services/useAuth";
import { useSettings } from "../../services/useSettings";

export function Navbar() {
  const { user, logout } = useAuth();
  const { tempTheme } = useSettings();
  const location = useLocation();

  if (!user || location.pathname === "/login") return null;

  const navItems = [
    { label: "Tableau de bord", icon: Home, path: "/" },
    { label: "Projets", icon: FolderOpen, path: "/projects" },
    { label: "Réglages", icon: Settings, path: "/settings" },
    { label: "Logout", icon: LogOut, action: logout },
  ];

  const textColorStyle = { color: "var(--color-text-on-navbar)" };

  return (
    <nav
      className="fixed z-50 w-full transition-colors duration-300 shadow-md"
      style={{ backgroundColor: "var(--color-navbar-bg)" }}
    >
      {/* Desktop Navbar */}
      <div className="items-center justify-between hidden h-16 px-8 mx-auto md:flex max-w-7xl">
        <Link
          to="/"
          style={textColorStyle}
          className="flex items-center space-x-2"
        >
          <Anvil className="w-8 h-8" style={textColorStyle} />
          <span
            className="text-xl font-bold tracking-wide uppercase"
            style={textColorStyle}
          >
            ECB-Carlo
          </span>
        </Link>

        <div className="flex items-center space-x-4">
          {navItems.slice(0, 3).map((item) => (
            <Link
              key={item.label}
              to={item.path}
              style={textColorStyle}
              className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors
                ${
                  location.pathname === item.path
                    ? "bg-[var(--color-navbar-active)]"
                    : "hover:bg-[var(--color-navbar-hover)]"
                }`}
            >
              <item.icon className="w-4 h-4 mr-2" style={textColorStyle} />
              {item.label}
            </Link>
          ))}
          <button
            onClick={logout}
            style={textColorStyle}
            className="flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-[var(--color-navbar-hover)] transition-colors"
          >
            <LogOut className="w-4 h-4 mr-2" style={textColorStyle} />
            Logout
          </button>
        </div>
      </div>

      {/* Mobile Navbar */}
      <div
        className="fixed bottom-0 left-0 w-full transition-colors duration-300 shadow-md md:hidden"
        style={{
          backgroundColor: "var(--color-navbar-bg)",
          color: "var(--color-navbar-text)",
        }}
      >
        <div className="grid h-12 grid-cols-4">
          {navItems.map((item) =>
            item.path ? (
              <Link
                key={item.label}
                to={item.path}
                className={`flex-1 flex flex-col items-center justify-center transition-colors`}
              >
                <item.icon className="w-6 h-6" style={{ color: "var(--color-text-on-navbar)" }} />
              </Link>
            ) : (
              <button
                key={item.label}
              style={{ color: "var(--color-text-on-navbar)" }}
                onClick={item.action}
                className="flex-1 flex flex-col items-center justify-center hover:bg-[var(--color-navbar-hover)] transition-colors"
              >
                <item.icon className="w-6 h-6" style={{ color: "var(--color-text-on-navbar)" }} />
              </button>
            )
          )}
        </div>
      </div>
    </nav>
  );
}
