// Projects.tsx
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Plus, Search, Calendar, MapPin, Trash2, Edit } from "lucide-react";
import { api } from "../services/api";
import { Button } from "../components/UI/Button";
import { Modal } from "../components/UI/Modal";
import { LoadingSpinner } from "../components/UI/LoadingSpinner";
import { ProjectForm } from "../components/Forms/ProjectForm";
import { useAuth } from "../services/useAuth";

export function Projects() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingProject, setEditingProject] = useState<any>(null);
  const { user } = useAuth();
  const location = useLocation();

  useEffect(() => {
    fetchProjects();
  }, []);

  // ✅ Ouvre le modal si l’URL contient ?create=true
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("create") === "true") {
      setShowCreateModal(true);
    }
  }, [location]);

  const fetchProjects = async () => {
    try {
      const response = await api.get("/projects");
      setProjects(response.data);
    } catch (error) {
      console.error("Failed to fetch projects:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (projectData: any) => {
    try {
      await api.post("/projects", projectData);
      await fetchProjects();
      setShowCreateModal(false);
    } catch (error) {
      console.error("Failed to create project:", error);
      throw error;
    }
  };

  const handleUpdateProject = async (projectData: any) => {
    try {
      await api.put(`/projects/${editingProject._id}`, projectData);
      await fetchProjects();
      setEditingProject(null);
    } catch (error) {
      console.error("Failed to update project:", error);
      throw error;
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce chantier ?")) return;

    try {
      await api.delete(`/projects/${projectId}`);
      await fetchProjects();
    } catch (error) {
      console.error("Failed to delete project:", error);
    }
  };

  const filteredProjects = projects.filter(
    (project) =>
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.client.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <LoadingSpinner size="lg" />;
  }

  return (
    <div className="px-4 py-8 pb-14 mx-auto max-w-7xl sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1
          className="text-3xl font-bold"
          style={{ color: "var(--color-page-title)" }}
        >
          Chantiers
        </h1>
        <Button onClick={() => setShowCreateModal(true)}>
          <Plus className="w-4 h-4 mr-2" /> Nouveau chantier
        </Button>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search
          className="absolute w-4 h-4 transform -translate-y-1/2 left-3 top-1/2"
          style={{
            color: "var(--color-input-text)",
          }}
        />
        <input
          type="text"
          placeholder="Rechercher un chantier..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full py-2 pl-10 pr-4 border rounded-md focus:outline-none"
          style={{
            border: "none",
            backgroundColor: "var(--color-input-bg)",
            color: "var(--color-input-text)",
          }}
        />
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <div className="py-12 text-center">
          <p style={{ color: "var(--color-text-secondary)", fontSize: "1rem" }}>
            Aucun chantier trouvé
          </p>
          <p
            className="mt-2"
            style={{ color: "var(--color-text-muted)", fontSize: "0.875rem" }}
          >
            Créez un nouveau chantier pour commencer
          </p>
        </div>
      ) : (
        <div className="grid py-3 grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((project) => (
            <div
              key={project._id}
              className="transition-shadow rounded-lg shadow-md hover:shadow-lg"
              style={{
                backgroundColor: "var(--color-card-bg)",
                borderColor: "var(--color-border)",
              }}
            >
              <Link to={`/projects/${project._id}`} className="block p-6">
                <h3
                  className="mb-2 text-lg font-semibold"
                  style={{ color: "var(--color-card-text)" }}
                >
                  {project.name}
                </h3>
                <div className="space-y-2">
                  <div
                    className="flex items-center text-sm"
                    style={{ color: "var(--color-secondary)" }}
                  >
                    <MapPin className="w-4 h-4 mr-2" />
                    <span className="truncate">{project.client}</span>
                  </div>
                  <div
                    className="flex items-center text-sm"
                    style={{ color: "var(--color-card-text)" }}
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>{new Date(project.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <span
                      className="text-sm font-medium"
                      style={{ color: "var(--color-info)" }}
                    >
                      {project.joineries.length}{" "}
                      {project.joineries.length === 1
                        ? "menuiserie"
                        : "menuiseries"}
                    </span>
                    <span
                      className="text-xs"
                      style={{ color: "var(--color-accent)" }}
                    >
                      par {project.createdBy?.name}
                    </span>
                  </div>
                </div>
              </Link>

              {/* Actions */}
              <div className="flex justify-end px-6 pb-4 space-x-2">
                <button
                  onClick={() => setEditingProject(project)}
                  className="p-2 transition-colors rounded-md"
                  style={{
                    color: "var(--color-navbar-text)",
                    backgroundColor: "var(--color-app-bg",
                  }}
                >
                  <Edit className="w-4 h-4" />
                </button>
                {user?.role === "admin" && (
                  <button
                    onClick={() => handleDeleteProject(project._id)}
                    className="p-2 transition-colors rounded-md"
                    style={{
                      color: "var(--color-error)",
                      backgroundColor: "var(--color-app-bg)",
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Project Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Créer un chantier"
        size="xl"
      >
        <ProjectForm
          onSubmit={handleCreateProject}
          onCancel={() => setShowCreateModal(false)}
        />
      </Modal>

      {/* Edit Project Modal */}
      <Modal
        isOpen={!!editingProject}
        onClose={() => setEditingProject(null)}
        title="Modifier un chantier"
        size="lg"
      >
        {editingProject && (
          <ProjectForm
            initialData={editingProject}
            onSubmit={handleUpdateProject}
            onCancel={() => setEditingProject(null)}
          />
        )}
      </Modal>
    </div>
  );
}
