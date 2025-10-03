// src/pages/ProjectDetail.tsx
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "../services/api";
import { Button } from "../components/UI/Button";
import { Modal } from "../components/UI/Modal";
import { Divider } from "../components/UI/Divider";
import { LoadingSpinner } from "../components/UI/LoadingSpinner";
import { JoineryForm } from "../components/Forms/JoineryForm";
import { SwipeableCard } from "../components/UI/SwipeableCard";
import { SwipeableCardProvider } from "../components/UI/SwipeableCardContext";
import { useAuth } from "../services/useAuth";
import {
  Plus,
  Calendar,
  MapPin,
  User,
  FileText,
  LayoutPanelTop,
  PanelsTopLeft,
} from "lucide-react";

export function ProjectDetail() {
  const { id } = useParams();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingJoinery, setEditingJoinery] = useState<any>(null);
  const { user } = useAuth();

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

  // --- CRUD joineries ---
  const handleCreateJoinery = async (joineryData: any) => {
    try {
      await api.post(`/projects/${id}/joineries`, joineryData);
      await fetchProject();
      setShowCreateModal(false);
    } catch (error) {
      console.error("Failed to create joinery:", error);
    }
  };

  const handleUpdateJoinery = async (joineryData: any) => {
    try {
      console.log(joineryData);
      await api.put(
        `/projects/${id}/joineries/${editingJoinery._id}`,
        joineryData
      );
      await fetchProject();
      setEditingJoinery(null);
    } catch (error) {
      console.error("Failed to update joinery:", error);
    }
  };

  const handleDeleteJoinery = async (joineryId: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette menuiserie ?"))
      return;
    try {
      await api.delete(`/projects/${id}/joineries/${joineryId}`);
      await fetchProject();
    } catch (error) {
      console.error("Failed to delete joinery:", error);
    }
  };

  if (loading) return <LoadingSpinner size="lg" />;
  if (!project) return <p>Projet introuvable</p>;

  // Définition des infos projet
  const infoFields = [
    {
      icon: <User className="w-4 h-4" />,
      label: "Client",
      value: project.client,
      showDivider: true,
    },
    {
      icon: <MapPin className="w-4 h-4" />,
      label: "Adresse",
      value: project.address,
      showDivider: true,
    },
    {
      icon: <Calendar className="w-4 h-4" />,
      label: "Date",
      value: project.date ? new Date(project.date).toLocaleDateString() : null,
      showDivider: true,
    },
    {
      icon: <FileText className="w-4 h-4" />,
      label: "Notes",
      value: project.notes,
      showDivider: true,
    },
    {
      icon: <PanelsTopLeft className="w-4 h-4" />,
      label: "Menuiseries",
      value: `${project.joineries?.length || 0} menuiserie${
        project.joineries?.length > 1 ? "s" : ""
      }`,
      showDivider: true,
    },
    {
      icon: <User className="w-4 h-4" />,
      label: "Créé par",
      value: project.createdBy?.name || "Inconnu",
      showDivider: false,
    },
  ];

  // --- JoineryCard ---
  const JoineryCard = ({ joinery }: { joinery: any }) => (
    <SwipeableCardProvider>
      <SwipeableCard
        id={joinery._id}
        imageURL={joinery.imageURL || ""}
        onEdit={() => setEditingJoinery(joinery)}
        onDelete={() => handleDeleteJoinery(joinery._id)}
        showDelete={() => user?.role === "admin"}
        maxSwipe={75}
        style={{
          backgroundColor: "var(--color-app-bg)",
        }}
      >
        {/* Partie cliquable pour navigation */}
        <Link to={`/projects/${project._id}/joineries/${joinery._id}`}>
          <div className="w-full p-2 cursor-pointer">
            <h3
              className="mb-1 text-lg font-semibold"
              style={{ color: "var(--color-card-text)" }}
            >
              {joinery.name}
            </h3>
            <div
              className="flex items-center gap-2 text-sm"
              style={{ color: "var(--color-secondary)" }}
            >
              <PanelsTopLeft
                className="w-4 h-4"
                style={{ color: "var(--color-secondary)" }}
              />
              {joinery.type}
            </div>
            <div
              className="flex items-center gap-2 mt-1 text-xs"
              style={{ color: "var(--color-secondary)" }}
            >
              <LayoutPanelTop
                className="w-4 h-4"
                style={{ color: "var(--color-secondary)" }}
              />
              {joinery.sheets?.length || 0} tôles
            </div>
          </div>
        </Link>
      </SwipeableCard>
    </SwipeableCardProvider>
  );

  return (
    <div className="relative pb-20">
      {/* Titre projet */}
      <h1
        className="px-4 py-4 mb-4 text-3xl font-bold"
        style={{ color: "var(--color-page-title)" }}
      >
        {project.name}
      </h1>

      {/* Image projet */}
      {project.imageURL && (
        <div className="w-full mb-6">
          <img
            src={project.imageURL}
            alt={project.name}
            className="object-cover w-full"
            style={{ height: "33vh" }} // 1/3 hauteur écran
          />
        </div>
      )}

      {/* Infos projet en grid 2 colonnes */}
      <div
        className="px-3 py-2 pr-0 mx-4 mb-6 rounded-lg"
        style={{ backgroundColor: "var(--color-card-bg)" }}
      >
        <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2">
          {infoFields
            .filter((field) => field.value) // n’affiche que si une valeur existe
            .map((field, idx) => (
              <div key={idx} className="contents">
                <div
                  className="flex items-center gap-2"
                  style={{ color: "var(--color-page-title)" }}
                >
                  {field.icon}
                  <span>{field.label}</span>
                </div>
                <div
                  className="flex items-center justify-end pr-3"
                  style={{ color: "var(--color-secondary)" }}
                >
                  {field.value}
                </div>
                {field.showDivider && <Divider />}
              </div>
            ))}
        </div>
      </div>

      {/* Liste des menuiseries */}
      {project.joineries.length === 0 ? (
        <div className="py-12 text-center text-gray-500">
          Aucune menuiserie ajoutée
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 px-4 sm:px-6 lg:px-8 md:grid-cols-2 lg:grid-cols-3">
          {project.joineries.map((joinery: any) => (
            <JoineryCard key={joinery._id} joinery={joinery} />
          ))}
        </div>
      )}

      {/* Bouton flottant */}
      <button
        onClick={() => setShowCreateModal(true)}
        className="fixed p-2 text-white bg-green-600 shadow-lg rounded-xl top-4 right-4 hover:bg-green-700"
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* Modal création */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Ajouter une menuiserie"
        size="lg"
      >
        <JoineryForm
          onSubmit={handleCreateJoinery}
          onCancel={() => setShowCreateModal(false)}
        />
      </Modal>

      {/* Modal édition */}
      <Modal
        isOpen={!!editingJoinery}
        onClose={() => setEditingJoinery(null)}
        title="Modifier une menuiserie"
        size="lg"
      >
        {editingJoinery && (
          <JoineryForm
            initialData={editingJoinery}
            onSubmit={handleUpdateJoinery}
            onCancel={() => setEditingJoinery(null)}
          />
        )}
      </Modal>
    </div>
  );
}
