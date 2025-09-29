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
import { useSwipeable } from "react-swipeable";

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

  // ---------------- Swipeable Card Component ----------------
  const ProjectCard = ({ project }: { project: any }) => {
    const [translateX, setTranslateX] = useState(0);
    const maxSwipe = 150; // largeur totale du panneau d'actions
    const buttonWidth = maxSwipe / 2;

    const handlers = useSwipeable({
      onSwipedLeft: () => setTranslateX(-maxSwipe),
      onSwipedRight: () => setTranslateX(0),
      onSwiping: (eventData) => {
        let x = Math.max(Math.min(-eventData.deltaX, maxSwipe), 0);
        setTranslateX(-x);
      },
      trackMouse: true,
    });

    return (
      <div className="relative w-full">
        {/* Actions derrière */}
        <div className="absolute top-0 right-0 h-full flex overflow-hidden">
          {/* Edit Button */}
          <div
            style={{
              width: buttonWidth,
              transform: `translateX(${Math.min(translateX + buttonWidth, 0)}px)`,
              transition: "transform 0.1s linear",
            }}
          >
            <button
              className="flex items-center justify-center h-full w-full text-white"
              style={{ backgroundColor: "var(--color-edit-btn, #6B7280)" }}
              onClick={() => setEditingProject(project)}
            >
              <Edit className="w-4 h-4" />
            </button>
          </div>

          {/* Delete Button */}
          {user?.role === "admin" && (
            <div
              style={{
                width: buttonWidth,
                transform: `translateX(${Math.min(translateX + maxSwipe, 0)}px)`,
                transition: "transform 0.1s linear",
              }}
            >
              <button
                className="flex items-center justify-center h-full w-full text-white"
                style={{ backgroundColor: "var(--color-delete-btn, #EF4444)" }}
                onClick={() => handleDeleteProject(project._id)}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Contenu de la card */}
        <div
          {...handlers}
          className="flex z-9999 flex-col transition-transform duration-200 rounded-l-lg shadow-md overflow-hidden"
          style={{
            transform: `translateX(${translateX}px)`,
            backgroundColor: "var(--color-card-bg)",
          }}
        >
          <div className="p-4">
            <h3
              style={{ color: "var(--color-card-text)" }}
              className="mb-2 text-lg font-semibold"
            >
              {project.name}
            </h3>

            <div className="flex flex-col w-full space-y-2">
              <div
                className="flex items-center text-sm"
                style={{ color: "var(--color-secondary)" }}
              >
                <MapPin className="w-4 h-4 mr-2" />
                <span className="truncate">{project.client}</span>
              </div>

              <div className="text-sm">
                <span style={{ color: "var(--color-info)" }}>
                  {project.joineries.length}{" "}
                  {project.joineries.length === 1
                    ? "menuiserie"
                    : "menuiseries"}
                </span>
              </div>

              <div
                className="flex items-center text-sm"
                style={{ color: "var(--color-card-text)" }}
              >
                <Calendar className="w-4 h-4 mr-2" />
                <span>{new Date(project.date).toLocaleDateString()}</span>
              </div>

              <div
                className="text-xs mt-2"
                style={{ color: "var(--color-accent)" }}
              >
                par {project.createdBy?.name}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ---------------- Render ----------------
  return (
    <div className="px-4 py-8 mx-auto pb-14 max-w-7xl sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1
          className="text-3xl font-bold"
          style={{ color: "var(--color-page-title)" }}
        >
          Chantiers
        </h1>
        <Button variant="success" onClick={() => setShowCreateModal(true)}>
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
          <p
            style={{ color: "var(--color-text-secondary)", fontSize: "1rem" }}
          >
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
        <div className="grid grid-cols-1 gap-6 py-3 md:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((project) => (
            <ProjectCard key={project._id} project={project} />
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