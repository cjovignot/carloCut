// ProjectDetails.tsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Calendar, MapPin, Edit, Trash2 } from "lucide-react";
import { api } from "../services/api";
import { Button } from "../components/UI/Button";
import { LoadingSpinner } from "../components/UI/LoadingSpinner";
import { Modal } from "../components/UI/Modal";
import { ProjectForm } from "../components/Forms/ProjectForm";
import { useAuth } from "../services/useAuth";

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProject();
  }, [id]);

  const fetchProject = async () => {
    try {
      const response = await api.get(`/projects/${id}`);
      setProject(response.data);
    } catch (error) {
      console.error("Failed to fetch project:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (projectData: any) => {
    try {
      await api.put(`/projects/${id}`, projectData);
      await fetchProject();
      setEditing(false);
    } catch (error) {
      console.error("Failed to update project:", error);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce chantier ?")) return;

    try {
      await api.delete(`/projects/${id}`);
      navigate("/projects");
    } catch (error) {
      console.error("Failed to delete project:", error);
    }
  };

  if (loading) {
    return <LoadingSpinner size="lg" />;
  }

  if (!project) {
    return (
      <div className="p-8 text-center">
        <p style={{ color: "var(--color-text-secondary)" }}>
          Chantier introuvable
        </p>
      </div>
    );
  }

  return (
    <div className="px-4 py-8 mx-auto max-w-5xl sm:px-6 lg:px-8">
      <h1
        className="mb-6 text-3xl font-bold"
        style={{ color: "var(--color-page-title)" }}
      >
        Détails du chantier
      </h1>

      {/* Card identique à Projects.tsx */}
      <div
        className="grid grid-cols-3 transition-shadow rounded-lg shadow-md"
        style={{
          backgroundColor: "var(--color-card-bg)",
          borderColor: "var(--color-border)",
        }}
      >
        {/* Partie gauche (infos) */}
        <div className="col-span-2 p-6">
          <h3
            className="mb-2 text-lg font-semibold"
            style={{ color: "var(--color-card-text)" }}
          >
            {project.name}
          </h3>

          <div className="flex flex-col w-full space-y-4">
            {/* Client */}
            <div
              className="flex items-center w-full text-sm"
              style={{ color: "var(--color-secondary)" }}
            >
              <MapPin className="w-4 h-4 mr-2" />
              <span className="truncate">{project.client}</span>
            </div>

            {/* Nombre de menuiseries */}
            <div className="w-full mt-2 text-sm">
              <span
                className="font-medium"
                style={{ color: "var(--color-info)" }}
              >
                {project.joineries?.length || 0}{" "}
                {project.joineries?.length === 1
                  ? "menuiserie"
                  : "menuiseries"}
              </span>
            </div>

            {/* Date */}
            <div
              className="flex items-center w-full text-sm"
              style={{ color: "var(--color-card-text)" }}
            >
              <Calendar className="w-4 h-4 mr-2" />
              <span>{new Date(project.date).toLocaleDateString()}</span>
            </div>

            {/* Créé par */}
            <div className="w-full mt-4 text-sm">
              <span className="text-xs" style={{ color: "var(--color-accent)" }}>
                par {project.createdBy?.name}
              </span>
            </div>
          </div>
        </div>

        {/* Partie droite (photo) */}
        <div className="col-span-1">
          {project.photo ? (
            <img
              src={project.photo}
              alt={project.name}
              className="object-cover w-full h-full rounded-r-lg"
            />
          ) : (
            <div
              className="flex items-center justify-center w-full h-full text-sm italic rounded-r-lg"
              style={{
                backgroundColor: "var(--color-app-bg)",
                color: "var(--color-secondary)",
                minHeight: "140px",
              }}
            >
              Pas de photo
            </div>
          )}
        </div>

        {/* Footer (actions) */}
        <div className="flex w-full col-span-3">
          <Button
            onClick={() => setEditing(true)}
            className="flex-1 w-full p-2 transition-colors !rounded-none !rounded-bl-md"
            style={{
              color: "var(--color-navbar-text)",
              backgroundColor: "var(--color-app-bg)",
            }}
          >
            <Edit className="w-4 h-4" />
          </Button>

          {user?.role === "admin" && (
            <Button
              variant="danger"
              onClick={handleDelete}
              className="flex-1 w-full p-2 transition-colors !rounded-none !rounded-br-md"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Modal édition */}
      <Modal
        isOpen={editing}
        onClose={() => setEditing(false)}
        title="Modifier le chantier"
        size="lg"
      >
        <ProjectForm
          initialData={project}
          onSubmit={handleUpdate}
          onCancel={() => setEditing(false)}
        />
      </Modal>
    </div>
  );
}