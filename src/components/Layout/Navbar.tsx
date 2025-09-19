import { Link, useLocation } from "react-router-dom";
import { LogOut, Home, FolderOpen, Anvil } from "lucide-react";
import { useAuth } from "../../services/useAuth";

export function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();

  if (!user || location.pathname === "/login") return null;

  const navItems = [
    { label: "Dashboard", icon: Home, path: "/" },
    { label: "Projects", icon: FolderOpen, path: "/projects" },
    { label: "Logout", icon: LogOut, action: logout },
  ];

  return (
    <nav className="fixed z-50 w-full bg-white border-b border-gray-200 shadow-md">
      {/* Desktop Navbar */}
      <div className="items-center justify-between hidden h-16 px-8 mx-auto md:flex max-w-7xl">
        <Link to="/" className="flex items-center space-x-2">
          <Anvil className="w-8 h-8 text-blue-600" />
          <span className="text-xl font-bold text-gray-900">MetalOrders</span>
        </Link>

        <div className="flex items-center space-x-4">
          {navItems.slice(0, 2).map((item) => (
            <Link
              key={item.label}
              to={item.path}
              className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                location.pathname === item.path
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              <item.icon className="w-4 h-4 mr-2" />
              {item.label}
            </Link>
          ))}
          <button
            onClick={logout}
            className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 rounded-md hover:text-gray-900 hover:bg-gray-50"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </button>
        </div>
      </div>

      {/* Mobile Navbar */}
      <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 shadow-md md:hidden">
        <div className="flex h-16">
          {navItems.map((item) =>
            item.path ? (
              <Link
                key={item.label}
                to={item.path}
                className={`flex-1 flex flex-col items-center justify-center transition-colors ${
                  location.pathname === item.path
                    ? "bg-sky-800/80 text-white"
                    : "text-gray-600 hover:text-blue-600"
                }`}
              >
                <item.icon
                  className={`w-6 h-6 ${
                    location.pathname === item.path ? "text-white" : ""
                  }`}
                />
              </Link>
            ) : (
              <button
                key={item.label}
                onClick={item.action}
                className={`flex-1 flex flex-col items-center justify-center transition-colors ${
                  location.pathname === item.path
                    ? "bg-blue-600 text-white"
                    : "text-gray-600 hover:text-blue-600"
                }`}
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
