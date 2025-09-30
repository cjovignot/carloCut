// ProjectDetail.tsx
import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, FileText, Mail, Grid2x2 } from "lucide-react";
import { api } from "../services/api";
import { Button } from "../components/UI/Button";
import { Modal } from "../components/UI/Modal";
import { LoadingSpinner } from "../components/UI/LoadingSpinner";
import { JoineryForm } from "../components/Forms/JoineryForm";
import { EmailForm } from "../components/Forms/EmailForm";
import { useAuth } from "../services/useAuth";
import { SwipeableCard } from "../components/UI/SwipeableCard";

export function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showJoineryModal, setShowJoineryModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [editingJoinery, setEditingJoinery] = useState<any>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

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
    try {
      await api.post(`/joineries/${id}/joineries`, joineryData);
      await fetchProject();
      setShowJoineryModal(false);
    } catch (error) {
      console.error("Failed to create joinery:", error);
      throw error;
    }
  };

  const handleUpdateJoinery = async (joineryData: any) => {
    try {
      await api.put(
        `/joineries/${id}/joineries/${editingJoinery._id}`,
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
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette menuiserie ?"))
      return;

    try {
      await api.delete(`/joineries/${id}/joineries/${joineryId}`);
      await fetchProject();
    } catch (error) {
      console.error("Failed to delete joinery:", error);
    }
  };

  const handleExportPDF = () => window.open(`/api/pdf/project/${id}`, "_blank");

  const handleSendEmail = async (emailData: any) => {
    try {
      await api.post(`/email/send-project/${id}`, emailData);
      setShowEmailModal(false);
      alert("Email envoyé avec succès !");
    } catch (error) {
      console.error("Failed to send email:", error);
      alert("Échec de l’envoi du mail. Veuillez réessayer.");
    }
  };

  if (loading) return <LoadingSpinner size="lg" />;

  if (!project) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2
            className="text-2xl font-bold"
            style={{ color: "var(--color-text-primary)" }}
          >
            Aucun chantier trouvé
          </h2>
          <Link
            to="/projects"
            className="inline-block mt-4 underline"
            style={{ color: "var(--color-primary)" }}
          >
            Retour aux chantiers
          </Link>
        </div>
      </div>
    );
  }

  // ---------------- JoineryCard ----------------
  const JoineryCard = ({ joinery }: { joinery: any }) => {
    const handleNavigate = () =>
      navigate(`/projects/${id}/joineries/${joinery._id}`);

    return (
      <SwipeableCard
        onEdit={() => setEditingJoinery(joinery)}
        onDelete={() => handleDeleteJoinery(joinery._id)}
        showDelete={() => user?.role === "admin"}
        maxSwipe={75}
        style={{ backgroundColor: "var(--color-card-bg)" }}
      >
        <div
          className="grid grid-cols-3 cursor-pointer"
          onClick={handleNavigate}
        >
          {/* Partie gauche = infos (2/3) */}
          <div className="col-span-2 p-6">
            <h3
              className="mb-2 text-lg font-semibold"
              style={{ color: "var(--color-card-text)" }}
            >
              {joinery.name}
            </h3>
            <div className="flex flex-col w-full space-y-4">
              <div
                className="flex items-center w-full text-sm"
                style={{ color: "var(--color-secondary)" }}
              >
                <Grid2x2 className="w-4 h-4 mr-2" />
                <span className="truncate">{joinery.type}</span>
              </div>
              <div className="w-full mt-2 text-sm">
                <span
                  className="font-medium"
                  style={{ color: "var(--color-info)" }}
                >
                  {joinery.sheets.length}{" "}
                  {joinery.sheets.length === 1 ? "tôle" : "tôles"}
                </span>
              </div>
            </div>
          </div>

          {/* Partie droite = encart photo */}
          <div className="col-span-1">
            {joinery.photo ? (
              <img
                src={joinery.photo}
                alt={joinery.name}
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
        </div>
      </SwipeableCard>
    );
  };

  // ---------------- Render ----------------
  return (
    <div className="px-4 py-8 mx-auto pb-14 max-w-7xl sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-4">
        <div className="flex items-center mb-4">
          <Link
            to="/projects"
            className="mr-4"
            style={{ color: "var(--color-primary)" }}
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1
            className="text-3xl font-bold"
            style={{ color: "var(--color-page-title)" }}
          >
            {project.name}
          </h1>
        </div>

        <div className="flex pb-3 mt-6 mb-4 space-x-2 border-b border-black/70">
          <Button
            variant="success"
            onClick={() => setShowJoineryModal(true)}
            className="w-2/3"
          >
            <Plus className="w-4 h-4 mr-1" />
            Menuiserie
          </Button>
          <Button
            variant="secondary"
            onClick={handleExportPDF}
            className="w-1/3"
          >
            <FileText className="w-4 h-4 mr-1" />
            PDF
          </Button>
          <Button
            variant="secondary"
            onClick={() => setShowEmailModal(true)}
            className="w-1/3"
          >
            <Mail className="w-4 h-4 mr-1" />
            Email
          </Button>
        </div>
      </div>

      {/* Infos projet */}
      <div
        className="p-6 mb-8 rounded-lg shadow-md"
        style={{ backgroundColor: "var(--color-card-bg)" }}
      >
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <h3
              className="mb-6 text-xl font-semibold text-center"
              style={{ color: "var(--color-page-title)" }}
            >
              INFORMATIONS
            </h3>
            <div
              className="grid grid-cols-2 gap-y-2 gap-x-4"
              style={{ color: "var(--color-card-text)" }}
            >
              <span className="font-medium">Client:</span>
              <span className="text-right">{project.client}</span>

              <span className="font-medium">Adresse:</span>
              <span className="text-right">{project.address}</span>

              <span className="font-medium">Date:</span>
              <span className="text-right">
                {project.date
                  ? new Date(project.date).toLocaleDateString()
                  : "Non définie"}
              </span>

              <span className="font-medium">Créé par:</span>
              <span className="text-right">
                {project.createdBy?.name || "Inconnu"}
              </span>
            </div>
          </div>
          {project.notes && (
            <div>
              <h3
                className="mb-4 text-lg font-semibold"
                style={{ color: "var(--color-info)" }}
              >
                Notes
              </h3>
              <p
                style={{
                  color: "var(--color-text-secondary)",
                  whiteSpace: "pre-wrap",
                }}
              >
                {project.notes}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Menuiseries */}
      <div>
        <h2
          className="mb-6 text-2xl font-bold"
          style={{ color: "var(--color-page-title)" }}
        >
          Menuiseries ({project.joineries.length})
        </h2>

        {project.joineries.length === 0 ? (
          <div
            className="p-12 text-center rounded-lg shadow-md"
            style={{ backgroundColor: "var(--color-card-bg)" }}
          >
            <p style={{ color: "var(--color-secondary)", fontSize: "1rem" }}>
              Encore aucune menuiserie
            </p>
            <p style={{ color: "var(--color-secondary)" }} className="mt-2">
              Créez une menuiserie pour commencer
            </p>
            <Button
              variant="success"
              className="mt-4"
              onClick={() => setShowJoineryModal(true)}
            >
              <Plus className="w-4 h-4 mr-2" /> Créer une menuiserie
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 py-3 md:grid-cols-2 lg:grid-cols-3">
            {project.joineries.map((joinery: any) => (
              <JoineryCard key={joinery._id} joinery={joinery} />
            ))}
          </div>
        )}
      </div>

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
          onSubmit={handleSendEmail}
          onCancel={() => setShowEmailModal(false)}
        />
      </Modal>
    </div>
  );
}