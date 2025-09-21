import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Plus, FolderOpen, Users, Package, TrendingUp } from "lucide-react";
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
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="px-4 py-8 pb-16 mx-auto max-w-7xl sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Tableau de bord</h1>
        {/* <p className="mt-2 text-gray-600">
          Overview of your sheet metal ordering system
        </p> */}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2 lg:grid-cols-4">
        <div className="p-6 bg-white border-l-4 border-blue-500 rounded-lg shadow">
          <div className="flex items-center">
            <FolderOpen className="w-8 h-8 text-blue-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Total Chantiers
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.totalProjects}
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 bg-white border-l-4 border-teal-500 rounded-lg shadow">
          <div className="flex items-center">
            <Users className="w-8 h-8 text-teal-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Total menuiseries
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.totalJoineries}
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 bg-white border-l-4 border-orange-500 rounded-lg shadow">
          <div className="flex items-center">
            <Package className="w-8 h-8 text-orange-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total tôles</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.totalSheets}
              </p>
            </div>
          </div>
        </div>

        {/* <div className="p-6 bg-white border-l-4 border-green-500 rounded-lg shadow">
          <div className="flex items-center">
            <TrendingUp className="w-8 h-8 text-green-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Efficiency</p>
              <p className="text-2xl font-bold text-gray-900">98%</p>
            </div>
          </div>
        </div> */}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
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
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            Chantiers récents
          </h2>
          {stats.recentProjects.length === 0 ? (
            <p className="py-4 text-center text-gray-500">
              Pas encore de chantier
            </p>
          ) : (
            <div className="space-y-3">
              {stats.recentProjects.map((project) => (
                <Link
                  key={project._id}
                  to={`/projects/${project._id}`}
                  className="block p-3 transition-colors border rounded-md hover:bg-gray-50"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {project.name}
                      </h3>
                      <p className="text-sm text-gray-600">{project.client}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        {project.joineries.length}{" "}
                        {project.joineries.length == 1
                          ? "menuiserie"
                          : "menuiseries"}
                      </p>
                      <p className="text-xs text-gray-500">
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
