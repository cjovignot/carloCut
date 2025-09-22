import { Link, useLocation } from "react-router-dom";
import { LogOut, Home, FolderOpen, Anvil, Settings } from "lucide-react";
import { useAuth } from "../../services/useAuth";
import { useSettings } from "../../services/useSettings";

// Fonction utilitaire pour déterminer si une couleur est claire ou foncée
function isColorLight(hex: string) {
  const c = hex.replace("#", "");
  const r = parseInt(c.substring(0, 2), 16);
  const g = parseInt(c.substring(2, 4), 16);
  const b = parseInt(c.substring(4, 6), 16);
  // Formule de luminance relative
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return luminance > 180; // seuil à ajuster si besoin
}

export function Navbar() {
  const { user, logout } = useAuth();
  const { selectedRAL } = useSettings();
  const location = useLocation();

  if (!user || location.pathname === "/login") return null;

  const navItems = [
    { label: "Tableau de bord", icon: Home, path: "/" },
    { label: "Projets", icon: FolderOpen, path: "/projects" },
    { label: "Réglages", icon: Settings, path: "/settings" },
    { label: "Logout", icon: LogOut, action: logout },
  ];

  const bgColor = selectedRAL?.hex;
  const textColor = isColorLight(bgColor) ? "text-gray-900" : "text-white";
  const hoverBgColor = isColorLight(bgColor) ? "hover:bg-black/5" : "hover:bg-white/10";
  const activeBgColor = isColorLight(bgColor) ? "bg-black/10" : "bg-white/20";

  return (
    <nav
      style={{ backgroundColor: bgColor }}
      className="fixed z-50 w-full border-b border-gray-200 shadow-md transition-colors duration-300"
    >
      {/* Desktop Navbar */}
      <div className="items-center justify-between hidden h-16 px-8 mx-auto md:flex max-w-7xl">
        <Link to="/" className={`flex items-center space-x-2 ${textColor}`}>
          <Anvil className={`w-8 h-8`} />
          <span className="text-xl font-bold tracking-wide uppercase">ECB-Carlo</span>
        </Link>

        <div className="flex items-center space-x-4">
          {navItems.slice(0, 2).map((item) => (
            <Link
              key={item.label}
              to={item.path}
              className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${textColor} ${
                location.pathname === item.path ? activeBgColor : hoverBgColor
              }`}
            >
              <item.icon className="w-4 h-4 mr-2" />
              {item.label}
            </Link>
          ))}
          <button
            onClick={logout}
            className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${textColor} ${hoverBgColor}`}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </button>
        </div>
      </div>

      {/* Mobile Navbar */}
      <div
        className=´fixed bottom-0 left-0 w-full border-t border-gray-200 shadow-md md:hidden transition-colors duration-300 bg-${bgColor.hex}´
      >
        <div className="grid h-12 grid-cols-4">
          {navItems.map((item) =>
            item.path ? (
              <Link
                key={item.label}
                to={item.path}
                className={`flex-1 flex flex-col items-center justify-center ${textColor} ${
                  location.pathname === item.path ? activeBgColor : hoverBgColor
                }`}
              >
                <item.icon className="w-6 h-6" />
              </Link>
            ) : (
              <button
                key={item.label}
                onClick={item.action}
                className={`flex-1 flex flex-col items-center justify-center ${textColor} ${hoverBgColor}`}
              >
                <item.icon className="w-6 h-6" />
              </button>
            )
          )}
        </div>
      </div>
    </nav>
  );
}