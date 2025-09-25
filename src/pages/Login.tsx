// Login.tsx
import React, { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../services/useAuth";
import { Button } from "../components/UI/Button";
import logo from "../../public/pwa-512x512.png";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { user, login } = useAuth();

  if (user) return <Navigate to="/" replace />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await login(email, password);
    } catch (err: any) {
      setError(err.response?.data?.message || "Connexion échouée");
    } finally {
      setLoading(false);
    }
  };

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
                className="px-4 py-3 border rounded"
                style={{
                  color: "var(--color-error-text)",
                  borderColor: "var(--color-error-border)",
                  backgroundColor: "var(--color-error-bg)",
                }}
              >
                {error}
              </div>
            )}

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium"
                style={{ color: "var(--color-text)" }}
              >
                E-mail
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre_email@exemple.com"
                className="block w-full px-3 py-2 mt-1 rounded-md shadow-sm focus:outline-none"
                style={{
                  backgroundColor: "var(--color-input-bg)",
                  color: "var(--color-text)",
                  borderColor: "var(--color-border)",
                  placeholderColor: "var(--color-text-muted)",
                }}
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium"
                style={{ color: "var(--color-text)" }}
              >
                Mot de passe
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mot de passe"
                className="block w-full px-3 py-2 mt-1 rounded-md shadow-sm focus:outline-none"
                style={{
                  backgroundColor: "var(--color-input-bg)",
                  color: "var(--color-text)",
                  borderColor: "var(--color-border)",
                  placeholderColor: "var(--color-text-muted)",
                }}
              />
            </div>

            <Button type="submit" className="w-full" loading={loading}>
              Connexion
            </Button>

            <p className="mt-4 text-sm text-center" style={{ color: "var(--color-text-muted)" }}>
              Pas encore de compte?{" "}
              <Link to="/register" style={{ color: "var(--color-primary)" }} className="underline">
                Inscription
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}