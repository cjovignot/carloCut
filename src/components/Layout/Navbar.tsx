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
    <nav
      className="fixed z-50 w-full border-b border-gray-400
      bg-[repeating-linear-gradient(90deg,#f3f4f6,#f3f4f6_2px,#e5e7eb_2px,#e5e7eb_4px)]
      shadow-[inset_0_1px_2px_rgba(255,255,255,0.7),inset_0_-1px_2px_rgba(0,0,0,0.15),0_2px_6px_rgba(0,0,0,0.4)]"
    >
      {/* Desktop Navbar */}
      <div className="items-center justify-between hidden h-16 px-8 mx-auto md:flex max-w-7xl">
        <Link to="/" className="flex items-center space-x-2">
          <Anvil className="w-8 h-8 text-gray-700 drop-shadow" />
          <span className="text-xl font-bold text-gray-900 tracking-wide uppercase">
            MetalOrders
          </span>
        </Link>

        <div className="flex items-center space-x-4">
          {navItems.slice(0, 2).map((item) => (
            <Link
              key={item.label}
              to={item.path}
              className={`flex items-center px-3 py-2 rounded-md text-sm font-semibold tracking-wide transition-colors
                border border-gray-400 shadow-inner
                ${
                  location.pathname === item.path
                    ? "bg-gray-300 text-gray-900"
                    : "bg-gray-200/60 text-gray-700 hover:bg-gray-300"
                }`}
            >
              <item.icon className="w-4 h-4 mr-2 text-gray-700" />
              {item.label}
            </Link>
          ))}
          <button
            onClick={logout}
            className="flex items-center px-3 py-2 text-sm font-semibold text-gray-700 rounded-md border border-gray-400 shadow-inner hover:bg-gray-300"
          >
            <LogOut className="w-4 h-4 mr-2 text-gray-700" />
            Logout
          </button>
        </div>
      </div>

      {/* Mobile Navbar */}
      <div
        className="fixed bottom-0 left-0 w-full border-t border-gray-400 md:hidden
        bg-[repeating-linear-gradient(90deg,#f3f4f6,#f3f4f6_2px,#e5e7eb_2px,#e5e7eb_4px)]
        shadow-[inset_0_1px_2px_rgba(255,255,255,0.7),inset_0_-1px_2px_rgba(0,0,0,0.15),0_-2px_6px_rgba(0,0,0,0.4)]"
      >
        <div className="grid h-12 grid-cols-3">
          {navItems.map((item) =>
            item.path ? (
              <Link
                key={item.label}
                to={item.path}
                className={`flex-1 flex flex-col items-center justify-center border-r border-gray-400
                  ${
                    location.pathname === item.path
                      ? "bg-gray-400 text-gray-900"
                      : "text-gray-700 hover:bg-gray-300"
                  }`}
              >
                <item.icon className="w-6 h-6" />
              </Link>
            ) : (
              <button
                key={item.label}
                onClick={item.action}
                className="flex-1 flex flex-col items-center justify-center text-gray-700 hover:bg-gray-300"
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