// src/pages/Projects.tsx
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom"; // 🔹 import useNavigate
import {
  Plus,
  Search,
  Calendar,
  MapPin,
  User,
  FileText,
  LayoutPanelTop,
  SquarePen,
  PanelsTopLeft,
} from "lucide-react";
import { api } from "../services/api";
import { Button } from "../components/UI/Button";
import { Modal } from "../components/UI/Modal";
import { LoadingSpinner } from "../components/UI/LoadingSpinner";
import { ProjectForm } from "../components/Forms/ProjectForm";
import { useAuth } from "../services/useAuth";
import { SwipeableCard } from "../components/UI/SwipeableCard";
import { SwipeableCardProvider } from "../components/UI/SwipeableCardContext";

export function Projects() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingProject, setEditingProject] = useState<any>(null);
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate(); // 🔹 hook navigation

  // --- Fetch projects ---
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

  // --- CRUD handlers ---
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

  // --- Filtered projects ---
  const filteredProjects = projects.filter(
    (project) =>
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.client.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // ---------------- ProjectCard ----------------
  const ProjectCard = ({ project }: { project: any }) => {
    const infoFields = [
      {
        icon: <User className="w-4 h-4" />,
        label: "Client",
        value: project.client,
      },
      // {
      //   icon: <MapPin className="w-4 h-4" />,
      //   label: "Adresse",
      //   value: project.address,
      // },
      // {
      //   icon: <Calendar className="w-4 h-4" />,
      //   label: "Date",
      //   value: project.date
      //     ? new Date(project.date).toLocaleDateString()
      //     : null,
      // },
      {
        icon: <PanelsTopLeft className="w-4 h-4" />,
        label: "Menuiseries",
        value: `${project.joineries?.length || 0} menuiserie${
          project.joineries?.length > 1 ? "s" : ""
        }`,
      },
      {
        icon: <FileText className="w-4 h-4" />,
        label: "Notes",
        value: project.notes,
      },
      {
        icon: (
          <SquarePen
            className="w-4 h-4"
            style={{ color: "var(--color-warning)" }}
          />
        ),
        label: "Créé par",
        value: project.createdBy?.name || "Inconnu",
      },
    ];

    return (
      <SwipeableCard
        id={project._id}
        imageURL={project.imageURL}
        linkTo={`/projects/${project._id}`} // 🔹 un seul paramètre à passer
        onEdit={() => setEditingProject(project)}
        onDelete={() => handleDeleteProject(project._id)}
        showDelete={() => user?.role === "admin"}
        maxSwipe={75}
        style={{
          backgroundColor: "var(--color-app-bg)",
          cursor: "pointer",
        }} // 🔹 curseur pointer
      >
        <div className="grid grid-cols-[auto_1fr] gap-x-2 gap-y-2">
          {infoFields
            .filter((field) => field.value) // n’affiche que si une valeur existe
            .map((field, idx) => {
              if (field.label === "Client") {
                // Champ client : pas d'icône, valeur en titre
                return (
                  <div key={idx} className="col-span-full">
                    <h3
                      className="mb-3 text-xl font-semibold"
                      style={{ color: "var(--color-page-title)" }}
                    >
                      {field.value}
                    </h3>
                  </div>
                );
              } else if (field.label === "Créé par") {
                // Champ client : pas d'icône, valeur en titre
                return (
                  <div key={idx} className="col-span-full">
                    <h3
                      className="my-3 text-xs italic"
                      style={{ color: "var(--color-warning)" }}
                    >
                      {field.label} {field.value}
                    </h3>
                  </div>
                );
              }

              return (
                <div key={idx} className="contents">
                  <div
                    className="flex items-center gap-2"
                    style={{ color: "var(--color-page-title)" }}
                  >
                    {field.icon}
                  </div>
                  <div
                    className="flex items-center"
                    style={{ color: "var(--color-secondary)" }}
                  >
                    {field.value}
                  </div>
                </div>
              );
            })}
        </div>
      </SwipeableCard>
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
      <SwipeableCardProvider>
        {filteredProjects.length === 0 ? (
          <div className="py-12 text-center">
            <p
              style={{ color: "var(--color-text-secondary)", fontSize: "1rem" }}
            >
              Aucun chantier trouvé
            </p>
            <p
              className="mt-2"
              style={{
                color: "var(--color-text-muted)",
                fontSize: "0.875rem",
              }}
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
      </SwipeableCardProvider>

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
