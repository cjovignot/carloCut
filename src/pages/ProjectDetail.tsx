// ProjectDetail.tsx
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Plus, Edit, Trash2, FileText, Mail } from "lucide-react";
import { api } from "../services/api";
import { Button } from "../components/UI/Button";
import { Modal } from "../components/UI/Modal";
import { LoadingSpinner } from "../components/UI/LoadingSpinner";
import { JoineryForm } from "../components/Forms/JoineryForm";
import { EmailForm } from "../components/Forms/EmailForm";
import { useAuth } from "../services/useAuth";

export function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
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
    if (!confirm("Are you sure you want to delete this joinery?")) return;

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
      alert("Email sent successfully!");
    } catch (error) {
      console.error("Failed to send email:", error);
      alert("Failed to send email. Please try again.");
    }
  };

  if (loading) {
    return <LoadingSpinner size="lg" />;
  }

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

  return (
    <div className="px-4 py-8 pb-16 mx-auto max-w-7xl sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <Link
            to="/projects"
            className="mr-4"
            style={{ color: "var(--color-primary)" }}
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1
              className="text-3xl font-bold"
              style={{ color: "var(--color-page-title)" }}
            >
              {project.name}
            </h1>
            <p style={{ color: "var(--color-secondary)" }}>
              Client: {project.client}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-4">
          <Button onClick={() => setShowJoineryModal(true)}>
            <Plus className="w-4 h-4 mr-2" /> Ajouter une menuiserie
          </Button>
          <Button variant="outline" onClick={handleExportPDF}>
            <FileText className="w-4 h-4 mr-2" /> Export PDF
          </Button>
          <Button variant="outline" onClick={() => setShowEmailModal(true)}>
            <Mail className="w-4 h-4 mr-2" /> Envoyer par mail
          </Button>
        </div>
      </div>

      {/* Project Info */}
      <div
        className="p-6 mb-8 rounded-lg shadow-md"
        style={{ backgroundColor: "var(--color-card-bg)" }}
      >
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <h3
              className="mb-4 text-lg font-semibold"
              style={{ color: "var(--color-page-title)" }}
            >
              Informations de chantier
            </h3>
            <div
              className="space-y-2"
              style={{ color: "var(--color-secondary)" }}
            >
              <p>
                <span className="font-medium">Client:</span> {project.client}
              </p>
              <p>
                <span className="font-medium">Adresse:</span> {project.address}
              </p>
              <p>
                <span className="font-medium">Date:</span>{" "}
                {new Date(project.date).toLocaleDateString()}
              </p>
              <p>
                <span className="font-medium">Créé par:</span>{" "}
                {project.createdBy?.name}
              </p>
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

      {/* Joineries */}
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
              Créer une menuiserie pour commencer
            </p>
            <Button className="mt-4" onClick={() => setShowJoineryModal(true)}>
              <Plus className="w-4 h-4 mr-2" /> Créer une menuiserie
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {project.joineries.map((joinery: any) => (
              <div
                key={joinery._id}
                className="transition-shadow rounded-lg shadow-md hover:shadow-lg"
                style={{ backgroundColor: "var(--color-card-bg)" }}
              >
                <Link
                  to={`/projects/${id}/joineries/${joinery._id}`}
                  className="block p-6"
                >
                  <h3
                    className="mb-2 text-lg font-semibold"
                    style={{ color: "var(--color-page-title)" }}
                  >
                    {joinery.name}
                  </h3>
                  <div className="space-y-1">
                    <p
                      className="text-sm"
                      style={{ color: "var(--color-secondary)" }}
                    >
                      Type: {joinery.type}
                    </p>
                    <p
                      className="text-sm font-medium"
                      style={{ color: "var(--color-info)" }}
                    >
                      {joinery.sheets.length}{" "}
                      {joinery.sheets.length === 1 ? "tôle" : "tôles"}
                    </p>
                  </div>
                </Link>

                <div className="flex justify-end px-6 pb-4 space-x-2">
                  <button
                    onClick={() => setEditingJoinery(joinery)}
                    style={{ color: "var(--color-navbar-text)" }}
                    className="p-2 transition-colors rounded-md"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteJoinery(joinery._id)}
                    style={{ color: "var(--color-error)" }}
                    className="p-2 transition-colors rounded-md"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      <Modal
        isOpen={showJoineryModal}
        onClose={() => setShowJoineryModal(false)}
        title="Créer une menuiserie"
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
