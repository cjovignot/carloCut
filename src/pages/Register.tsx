import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../services/useAuth";
import { Button } from "../components/UI/Button";
import { UserPlus } from "lucide-react";
import { api } from "../services/api";
import logo from "../../public/pwa-512x512.png";

export function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"admin" | "employee">("employee");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const { user } = useAuth();

  if (user) return <Navigate to="/" replace />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await api.post("/auth/register", {
        name,
        email,
        password,
        role,
      });
      console.log("User created:", response.data);
      setSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  if (success)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-4 py-12 bg-gradient-to-br from-blue-50 to-indigo-100 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold">User created successfully!</h2>
        <p className="mt-2">
          You can now{" "}
          <a href="/login" className="text-blue-600 underline">
            login
          </a>
          .
        </p>
      </div>
    );

  return (
    <div className="flex items-center justify-center min-h-screen px-4 py-12 bg-gradient-to-br from-blue-50 to-indigo-100 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="flex items-center justify-center">
            {/* <UserPlus className="w-12 h-12 mr-2 text-green-600" /> */}
            {/* <h2 className="text-3xl font-bold text-gray-900">Register</h2> */}
            <img src={logo} alt="Logo" className="rounded-2xl w-28 h-28" />
          </div>
          {/* <p className="mt-2 text-sm text-gray-600">Create a new account</p> */}
        </div>

        <div className="px-6 py-8 bg-white rounded-lg shadow-xl">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="px-4 py-3 text-red-700 border border-red-200 rounded bg-red-50">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Nom d'utilisateur
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                placeholder="Prénom NOM"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                E-mail
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                placeholder="votre_email@exemple.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Mot de passe
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                placeholder="Mot de passe"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Rôle
              </label>
              <select
                value={role}
                onChange={(e) =>
                  setRole(e.target.value as "admin" | "employee")
                }
                className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
              >
                <option value="employee">Employé</option>
                <option value="admin">Employeur</option>
                <option value="admin">Administrateur</option>
              </select>
            </div>

            <Button type="submit" className="w-full" loading={loading}>
              Inscription
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
