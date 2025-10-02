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
            <div className="flex items-center gap-2 text-sm" style={{ color: "var(--color-secondary)" }}>
              <PanelsTopLeft className="w-4 h-4" style={{ color: "var(--color-secondary)" }} />
              {joinery.type}
            </div>
            <div className="flex items-center gap-2 text-xs mt-1" style={{ color: "var(--color-secondary)" }}>
              <LayoutPanelTop className="w-4 h-4" style={{ color: "var(--color-secondary)" }} />
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
        className="text-3xl font-bold mb-4 px-4 py-4"
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
            className="w-full object-cover"
            style={{ height: "33vh" }} // 1/3 hauteur écran
          />
        </div>
      )}

      {/* Infos projet en grid 2 colonnes */}
      <div
        className="rounded-lg p-2 pr-0 mb-8"
        style={{ backgroundColor: "var(--color-primary)" }}
      >
        <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2">
          {project.client && (
            <>
              <div className="flex items-center gap-2" style={{ color: "var(--color-page-title)" }}>
                <User className="w-4 h-4" />
                <span>Nom du client</span>
              </div>
              <div style={{ color: "var(--color-secondary)" }}>{project.client}</div>
              <div className="col-span-2 border-b border-gray-300"></div>
            </>
          )}

          {project.address && (
            <>
              <div className="flex items-center gap-2" style={{ color: "var(--color-page-title)" }}>
                <MapPin className="w-4 h-4" />
                <span>Adresse</span>
              </div>
              <div style={{ color: "var(--color-secondary)" }}>{project.address}</div>
              <div className="col-span-2 border-b border-gray-300"></div>
            </>
          )}

          {project.date && (
            <>
              <div className="flex items-center gap-2" style={{ color: "var(--color-page-title)" }}>
                <Calendar className="w-4 h-4" />
                <span>Date</span>
              </div>
              <div style={{ color: "var(--color-secondary)" }}>
                {new Date(project.date).toLocaleDateString()}
              </div>
              <div className="col-span-2 border-b border-gray-300"></div>
            </>
          )}

          {project.notes && (
            <>
              <div className="flex items-center gap-2" style={{ color: "var(--color-page-title)" }}>
                <FileText className="w-4 h-4" />
                <span>Notes</span>
              </div>
              <div style={{ color: "var(--color-secondary)" }}>{project.notes}</div>
              <div className="col-span-2 border-b border-gray-300"></div>
            </>
          )}

          {/* Menuiseries */}
          <div className="flex items-center gap-2" style={{ color: "var(--color-page-title)" }}>
            <PanelsTopLeft className="w-4 h-4" />
            <span>Menuiseries</span>
          </div>
          <div style={{ color: "var(--color-secondary)" }}>
            {project.joineries?.length || 0} menuiseries
          </div>
          <div className="col-span-2 border-b border-gray-300"></div>

          {/* Créateur */}
          {project.createdBy && (
            <>
              <div className="flex items-center gap-2" style={{ color: "var(--color-page-title)" }}>
                <User className="w-4 h-4" />
                <span>Créé par</span>
              </div>
              <div style={{ color: "var(--color-secondary)" }}>
                {project.createdBy?.name || "Inconnu"}
              </div>
              <div className="col-span-2 border-b border-gray-300"></div>
            </>
          )}
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
        className="fixed top-6 right-6 p-4 rounded-full shadow-lg bg-green-600 hover:bg-green-700 text-white"
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