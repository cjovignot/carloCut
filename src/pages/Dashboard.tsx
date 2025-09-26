import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Plus, FolderOpen, Users, Package } from "lucide-react";
import { api } from "../services/api";
import { Button } from "../components/UI/Button";
import { LoadingSpinner } from "../components/UI/LoadingSpinner";

interface DashboardStats {
  totalProjects: number;
  totalJoineries: number;
  totalSheets: number;
  recentProjects: any[];
}

export function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalProjects: 0,
    totalJoineries: 0,
    totalSheets: 0,
    recentProjects: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await api.get("/projects");
      const projects = response.data;

      const totalJoineries = projects.reduce(
        (sum: number, project: any) => sum + project.joineries.length,
        0
      );
      const totalSheets = projects.reduce((sum: number, project: any) => {
        return (
          sum +
          project.joineries.reduce(
            (jSum: number, joinery: any) => jSum + joinery.sheets.length,
            0
          )
        );
      }, 0);

      setStats({
        totalProjects: projects.length,
        totalJoineries,
        totalSheets,
        recentProjects: projects.slice(0, 5),
      });
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner size="lg" />;
  }

  return (
    <div className="px-4 py-8 pb-16 mx-auto max-w-7xl sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1
          className="text-3xl font-bold"
          style={{ color: "var(--color-page-title)" }}
        >
          Tableau de bord PREVIEW
        </h1>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-6 mb-8 md:grid-cols-2 lg:grid-cols-4">
        {/* Total Projects */}
        <div
          className="p-6 rounded-lg shadow"
          style={{
            backgroundColor: "var(--color-card-bg)"
          }}
        >
          <div className="flex items-center">
            <FolderOpen
              className="w-8 h-8"
              style={{ color: "var(--color-action-txt)" }}
            />
            <div className="ml-4">
              <p
                className="text-sm font-medium"
                style={{ color: "var(--color-action-txt)" }}
              >
                Total Chantiers
              </p>
              <p
                className="text-2xl font-bold"
                style={{ color: "var(--color-action-txt)" }}
              >
                {stats.totalProjects}
              </p>
            </div>
          </div>
        </div>

        {/* Total Joineries */}
        <div
          className="p-6 rounded-lg shadow"
          style={{
            backgroundColor: "var(--color-card-bg)"
          }}
        >
          <div className="flex items-center">
            <Users
              className="w-8 h-8"
              style={{ color: "var(--color-action-txt)" }}
            />
            <div className="ml-4">
              <p
                className="text-sm font-medium"
                style={{ color: "var(--color-action-txt)" }}
              >
                Total menuiseries
              </p>
              <p
                className="text-2xl font-bold"
                style={{ color: "var(--color-action-txt)" }}
              >
                {stats.totalJoineries}
              </p>
            </div>
          </div>
        </div>

        {/* Total Sheets */}
        <div
          className="p-6 rounded-lg shadow"
          style={{
            backgroundColor: "var(--color-card-bg)"
          }}
        >
          <div className="flex items-center">
            <Package
              className="w-8 h-8"
              style={{ color: "var(--color-action-txt)" }}
            />
            <div className="ml-4">
              <p
                className="text-sm font-medium"
                style={{ color: "var(--color-action-txt)" }}
              >
                Total tôles
              </p>
              <p
                className="text-2xl font-bold"
                style={{ color: "var(--color-action-txt)" }}
              >
                {stats.totalSheets}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div
          className="p-6 rounded-lg shadow-md"
          style={{ backgroundColor: "var(--color-card-bg)" }}
        >
          <h2
            className="mb-4 text-lg font-semibold"
            style={{ color: "var(--color-action-txt)" }}
          >
            Actions rapides
          </h2>
          <div className="flex justify-around gap-4">
            <Link to="/projects">
              <Button variant="outline" className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Créer un chantier
              </Button>
            </Link>
            <Link to="/projects">
              <Button variant="outline" className="w-full">
                <FolderOpen className="w-4 h-4 mr-2" />
                Voir les chantiers
              </Button>
            </Link>
          </div>
        </div>

        {/* Recent Projects */}
        <div
          className="p-6 rounded-lg shadow-md"
          style={{ backgroundColor: "var(--color-surface)" }}
        >
          <h2
            className="mb-4 text-lg font-semibold"
            style={{ color: "var(--color-text-primary)" }}
          >
            Chantiers récents
          </h2>
          {stats.recentProjects.length === 0 ? (
            <p
              className="py-4 text-center"
              style={{ color: "var(--color-text-action-txt)" }}
            >
              Pas encore de chantier
            </p>
          ) : (
            <div className="space-y-3">
              {stats.recentProjects.map((project) => (
                <Link
                  key={project._id}
                  to={`/projects/${project._id}`}
                  className="block p-3 transition-colors border rounded-md"
                  style={{
                    borderColor: "var(--color-border)",
                    color: "var(--color-text-primary)",
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3
                        className="font-medium"
                        style={{ color: "var(--color-text-primary)" }}
                      >
                        {project.name}
                      </h3>
                      <p
                        className="text-sm"
                        style={{ color: "var(--color-text-secondary)" }}
                      >
                        {project.client}
                      </p>
                    </div>
                    <div className="text-right">
                      <p
                        className="text-sm font-medium"
                        style={{ color: "var(--color-text-primary)" }}
                      >
                        {project.joineries.length}{" "}
                        {project.joineries.length === 1
                          ? "menuiserie"
                          : "menuiseries"}
                      </p>
                      <p
                        className="text-xs"
                        style={{ color: "var(--color-text-muted)" }}
                      >
                        {new Date(project.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
