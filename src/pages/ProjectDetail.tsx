// ProjectDetail.tsx
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Plus,
  Edit,
  Trash2,
  FileText,
  Mail,
  Grid2x2,
  Layers,
} from "lucide-react";
import { api } from "../services/api";
import { Button } from "../components/UI/Button";
import { Modal } from "../components/UI/Modal";
import { LoadingSpinner } from "../components/UI/LoadingSpinner";
import { JoineryForm } from "../components/Forms/JoineryForm";
import { EmailForm } from "../components/Forms/EmailForm";
import { useAuth } from "../services/useAuth";
import { SwipeableCard } from "../components/UI/SwipeableCard";

export function ProjectDetail() {
  const { id } = useParams<{ _id: string }>();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showJoineryModal, setShowJoineryModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [editingJoinery, setEditingJoinery] = useState<any>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (id) fetchProject();
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

  const handleCreateJoinery = async (joineryData: any) => {
    await api.post(`/joineries/${id}/joineries`, joineryData);
    await fetchProject();
    setShowJoineryModal(false);
  };

  const handleUpdateJoinery = async (joineryData: any) => {
    await api.put(
      `/joineries/${id}/joineries/${editingJoinery._id}`,
      joineryData
    );
    await fetchProject();
    setEditingJoinery(null);
  };

  const handleDeleteJoinery = async (joineryId: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette menuiserie ?"))
      return;
    await api.delete(`/joineries/${id}/joineries/${joineryId}`);
    await fetchProject();
  };

  const handleDeleteSheet = async (joineryId: string, sheetId: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette tôle ?")) return;
    await api.delete(
      `/joineries/${id}/joineries/${joineryId}/sheets/${sheetId}`
    );
    await fetchProject();
  };

  if (loading) return <LoadingSpinner size="lg" />;
  if (!project) return <p>Aucun chantier trouvé</p>;

  return (
    <div className="px-4 py-8 mx-auto pb-14 max-w-7xl sm:px-6 lg:px-8">
      {/* Retour + titre */}
      <div className="flex items-center mb-6">
        <Link to="/projects" className="mr-4" style={{ color: "var(--color-primary)" }}>
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-3xl font-bold" style={{ color: "var(--color-page-title)" }}>
          {project.name}
        </h1>
      </div>

      {/* Menuiseries */}
      <h2 className="mb-4 text-2xl font-bold" style={{ color: "var(--color-page-title)" }}>
        Menuiseries ({project.joineries.length})
      </h2>

      {project.joineries.map((joinery: any) => (
        <div key={joinery._id} className="mb-10">
          <h3 className="mb-3 text-xl font-semibold" style={{ color: "var(--color-info)" }}>
            {joinery.name} ({joinery.sheets.length} tôles)
          </h3>

          {joinery.sheets.length === 0 ? (
            <p className="italic" style={{ color: "var(--color-secondary)" }}>
              Aucune tôle enregistrée
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {joinery.sheets.map((sheet: any) => (
                <SwipeableCard
                  key={sheet._id}
                  onEdit={() => alert("Éditer cette tôle")}
                  onDelete={() => handleDeleteSheet(joinery._id, sheet._id)}
                  showDelete={user?.role === "admin"} // ✅ booléen simple
                  maxSwipe={75}
                  style={{ backgroundColor: "var(--color-card-bg)" }}
                >
                  <div className="p-4">
                    <h4
                      className="mb-2 font-semibold"
                      style={{ color: "var(--color-card-text)" }}
                    >
                      {sheet.name || "Tôle sans nom"}
                    </h4>
                    <div
                      className="flex items-center text-sm"
                      style={{ color: "var(--color-secondary)" }}
                    >
                      <Layers className="w-4 h-4 mr-2" />
                      <span>{sheet.material || "Matériau inconnu"}</span>
                    </div>
                    {sheet.dimensions && (
                      <div
                        className="mt-2 text-sm"
                        style={{ color: "var(--color-info)" }}
                      >
                        Dimensions : {sheet.dimensions}
                      </div>
                    )}
                  </div>
                </SwipeableCard>
              ))}
            </div>
          )}
        </div>
      ))}

      {/* Modals */}
      <Modal
        isOpen={showJoineryModal}
        onClose={() => setShowJoineryModal(false)}
        title="Créer une menuiserie"
        size="xl"
      >
        <JoineryForm
          onSubmit={handleCreateJoinery}
          onCancel={() => setShowJoineryModal(false)}
        />
      </Modal>

      <Modal
        isOpen={!!editingJoinery}
        onClose={() => setEditingJoinery(null)}
        title="Modifier la menuiserie"
      >
        {editingJoinery && (
          <JoineryForm
            initialData={editingJoinery}
            onSubmit={handleUpdateJoinery}
            onCancel={() => setEditingJoinery(null)}
          />
        )}
      </Modal>

      <Modal
        isOpen={showEmailModal}
        onClose={() => setShowEmailModal(false)}
        title="Envoyer le chantier par mail"
      >
        <EmailForm
          onSubmit={() => {}}
          onCancel={() => setShowEmailModal(false)}
        />
      </Modal>
    </div>
  );
}