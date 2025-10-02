// src/pages/ProjectDetail.tsx
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "../services/api";
import { Button } from "../components/UI/Button";
import { Modal } from "../components/UI/Modal";
import { LoadingSpinner } from "../components/UI/LoadingSpinner";
import { JoineryForm } from "../components/Forms/JoineryForm";
import { SwipeableCard } from "../components/UI/SwipeableCard";
import { SwipeableCardProvider } from "../components/UI/SwipeableCardContext";
import { useAuth } from "../services/useAuth";
import {
  Plus,
  Calendar,
  MapPin,
  ClipboardList,
  User,
  Square,
  FileText,
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
      throw error;
    }
  };

  const handleUpdateJoinery = async (joineryData: any) => {
    try {
      await api.put(
        `/projects/${id}/joineries/${editingJoinery._id}`,
        joineryData
      );
      await fetchProject();
      setEditingJoinery(null);
    } catch (error) {
      console.error("Failed to update joinery:", error);
      throw error;
    }
  };

  const handleDeleteJoinery = async (joineryId: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette menuiserie ?")) return;
    try {
      await api.delete(`/projects/${id}/joineries/${joineryId}`);
      await fetchProject();
    } catch (error) {
      console.error("Failed to delete joinery:", error);
    }
  };

  if (loading) return <LoadingSpinner size="lg" />;
  if (!project) return <p>Projet introuvable</p>;

  // --- Icônes par type de menuiserie ---
  const getJoineryIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "porte":
        return <FileText className="w-5 h-5 text-gray-500 mr-2" />;
      case "fenetre":
      case "fenêtre":
        return <Square className="w-5 h-5 text-gray-500 mr-2" />;
      case "baie vitrée":
        return <Square className="w-5 h-5 text-gray-500 mr-2" />;
      default:
        return <Square className="w-5 h-5 text-gray-500 mr-2" />;
    }
  };

  // --- JoineryCard ---
  const JoineryCard = ({ joinery }: { joinery: any }) => (
    <Link to={`/projects/${project._id}/joineries/${joinery._id}`}>
      <SwipeableCard
        id={joinery._id}
        imageURL={joinery.imageURL || ""}
        onEdit={() => setEditingJoinery(joinery)}
        onDelete={() => handleDeleteJoinery(joinery._id)}
        showDelete={() => user?.role === "admin"}
        maxSwipe={75}
        style={{
          backgroundColor: "var(--color-app-bg)",
          cursor: "pointer",
        }}
      >
        <div className="w-full h-full p-1">
          <h3
            style={{ color: "var(--color-card-text)" }}
            className="mb-2 text-lg font-semibold"
          >
            {joinery.name}
          </h3>
          <div className="flex items-center text-sm" style={{ color: "var(--color-secondary)" }}>
            {getJoineryIcon(joinery.type)}
            {joinery.type}
          </div>
          {joinery.sheets?.length > 0 && (
            <div className="flex items-center mt-1 text-xs text-gray-500">
              <ClipboardList className="w-4 h-4 mr-1" />
              {joinery.sheets.length} tôles
            </div>
          )}
        </div>
      </SwipeableCard>
    </Link>
  );

  return (
    <div className="px-4 py-8 mx-auto pb-14 max-w-5xl sm:px-6 lg:px-8">
      {/* Encart projet */}
      <div className="flex flex-col md:flex-row items-start md:items-center mb-8 p-4 rounded-lg shadow bg-white">
        {project.imageURL && (
          <img
            src={project.imageURL}
            alt={project.name}
            className="w-32 h-32 object-cover rounded-md mr-6"
          />
        )}
        <div className="flex-1 space-y-2">
          <h1 className="text-3xl font-bold" style={{ color: "var(--color-page-title)" }}>
            {project.name}
          </h1>
          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
            {project.client && (
              <div className="flex items-center gap-1">
                <User className="w-4 h-4" />
                {project.client}
              </div>
            )}
            {project.address && (
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {project.address}
              </div>
            )}
            {project.date && (
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {new Date(project.date).toLocaleDateString()}
              </div>
            )}
            {project.notes && (
              <div className="flex items-center gap-1">
                <ClipboardList className="w-4 h-4" />
                {project.notes}
              </div>
            )}
            <div className="flex items-center gap-1">
              <Square className="w-4 h-4" />
              {project.joineries?.length || 0} menuiserie(s)
            </div>
          </div>
        </div>
      </div>

      {/* Bouton ajout */}
      <div className="flex justify-end mb-6">
        <Button variant="success" onClick={() => setShowCreateModal(true)}>
          <Plus className="w-4 h-4 mr-2" /> Nouvelle menuiserie
        </Button>
      </div>

      {/* Liste des menuiseries */}
      <SwipeableCardProvider>
        {project.joineries.length === 0 ? (
          <div className="py-12 text-center text-gray-500">
            Aucune menuiserie ajoutée
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 py-3 md:grid-cols-2 lg:grid-cols-3">
            {project.joineries.map((joinery: any) => (
              <JoineryCard key={joinery._id} joinery={joinery} />
            ))}
          </div>
        )}
      </SwipeableCardProvider>

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