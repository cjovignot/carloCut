// Register.tsx
import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../services/useAuth";
import { Button } from "../components/UI/Button";
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
      <div
        className="flex flex-col items-center justify-center min-h-screen px-4 py-12 sm:px-6 lg:px-8"
        style={{ backgroundColor: "var(--color-app-bg)" }}
      >
        <h2
          className="text-2xl font-bold"
          style={{ color: "var(--color-text-primary)" }}
        >
          Utilisateur créé avec succès !
        </h2>
        <p
          className="mt-2"
          style={{ color: "var(--color-text-secondary)" }}
        >
          Vous pouvez maintenant{" "}
          <a href="/login" style={{ color: "var(--color-primary)" }}>
            vous connecter
          </a>
          .
        </p>
      </div>
    );

  return (
    <div
      className="flex items-center justify-center min-h-screen px-4 py-12 sm:px-6 lg:px-8"
      style={{ backgroundColor: "var(--color-app-bg)" }}
    >
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="flex items-center justify-center">
            <img src={logo} alt="Logo" className="rounded-2xl w-28 h-28" />
          </div>
        </div>

        <div
          className="px-6 py-8 rounded-lg shadow-xl"
          style={{ backgroundColor: "var(--color-card-bg)" }}
        >
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div
                className="px-4 py-3 border rounded bg-red-50"
                style={{
                  color: "var(--color-error-text)",
                  borderColor: "var(--color-error-border)",
                }}
              >
                {error}
              </div>
            )}

            <div>
              <label
                className="block text-sm font-medium"
                style={{ color: "var(--color-text-primary)" }}
              >
                Nom d'utilisateur
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Prénom NOM"
                className="block w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:outline-none"
                style={{
                  borderColor: "var(--color-border)",
                  backgroundColor: "var(--color-input-bg)",
                  color: "var(--color-text-primary)",
                }}
              />
            </div>

            <div>
              <label
                className="block text-sm font-medium"
                style={{ color: "var(--color-text-primary)" }}
              >
                E-mail
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre_email@exemple.com"
                className="block w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:outline-none"
                style={{
                  borderColor: "var(--color-border)",
                  backgroundColor: "var(--color-input-bg)",
                  color: "var(--color-text-primary)",
                }}
              />
            </div>

            <div>
              <label
                className="block text-sm font-medium"
                style={{ color: "var(--color-text-primary)" }}
              >
                Mot de passe
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mot de passe"
                className="block w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:outline-none"
                style={{
                  borderColor: "var(--color-border)",
                  backgroundColor: "var(--color-input-bg)",
                  color: "var(--color-text-primary)",
                }}
              />
            </div>

            <div>
              <label
                className="block text-sm font-medium"
                style={{ color: "var(--color-text-primary)" }}
              >
                Rôle
              </label>
              <select
                value={role}
                onChange={(e) =>
                  setRole(e.target.value as "admin" | "employee")
                }
                className="block w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:outline-none"
                style={{
                  borderColor: "var(--color-border)",
                  backgroundColor: "var(--color-input-bg)",
                  color: "var(--color-text-primary)",
                }}
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