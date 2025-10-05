// src/pages/ProjectDetail.tsx
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { api } from "../services/api";
import { joineryTypes, JoineryForm } from "../components/Forms/JoineryForm";
import { Modal } from "../components/UI/Modal";
import { Divider } from "../components/UI/Divider";
import { FloatingActionButtons } from "../components/UI/FloatingActionButtons";
import { LoadingSpinner } from "../components/UI/LoadingSpinner";
import { SwipeableCard } from "../components/UI/SwipeableCard";
import { SwipeableCardProvider } from "../components/UI/SwipeableCardContext";
import { EmailForm } from "../components/Forms/EmailForm";
import { useAuth } from "../services/useAuth";
import { sheetModels } from "../constants/sheetModels";
import {
  Calendar,
  MapPin,
  User,
  DoorClosed,
  FileText,
  LayoutPanelTop,
  PanelsTopLeft,
} from "lucide-react";
import { ImageWithPlaceholder } from "../components/UI/ImageWithPlaceholder";

// --- Utils Cloudinary ---
function optimizeCloudinary(url: string, width: number = 1200) {
  if (!url || !url.includes("res.cloudinary.com")) return url;
  return url.replace("/upload/", `/upload/f_auto,q_auto,w_${width}/`);
}

export function ProjectDetail() {
  const { id } = useParams();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingJoinery, setEditingJoinery] = useState<any>(null);
  const [showEmailModal, setShowEmailModal] = useState(false);
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

  // --- CRUD Joineries ---
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
        `/joineries/${id}/joineries/${editingJoinery._id}`,
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
      await api.delete(`/joineries/${id}/joineries/${joineryId}`);
      await fetchProject();
    } catch (error) {
      console.error("Failed to delete joinery:", error);
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );

  if (!project) return <p>Projet introuvable</p>;

  // --- Infos projet ---
  const infoFields = [
    {
      icon: <User className="w-4 h-4" />,
      label: "Nom du client",
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
      icon: <DoorClosed className="w-4 h-4" />,
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

  // --- Carte Joinery ---
  const JoineryCard = ({ joinery }: { joinery: any }) => {
    const sheetModel = sheetModels.find((m) => m.profileType === joinery.type);
    const thumbnail = sheetModel?.src || "";

    return (
      <SwipeableCardProvider>
        <SwipeableCard
          id={joinery._id}
          imageURL={optimizeCloudinary(joinery.imageURL || thumbnail, 600)}
          onEdit={() => setEditingJoinery(joinery)}
          onDelete={() => handleDeleteJoinery(joinery._id)}
          showDelete={() => user?.role === "admin"}
          maxSwipe={75}
          style={{ backgroundColor: "var(--color-app-bg)" }}
          linkTo={`/projects/${project._id}/joineries/${joinery._id}`}
        >
          <div className="w-full p-2 cursor-pointer">
            <h3
              className="pb-2 mt-2 mb-1 text-lg font-semibold"
              style={{ color: "var(--color-card-text)" }}
            >
              {joinery.name}
            </h3>
            <div
              className="flex items-center gap-2 mt-2 text-sm"
              style={{ color: "var(--color-secondary)" }}
            >
              <PanelsTopLeft className="w-4 h-4" />
              {joineryTypes.find((t) => t.value === joinery.type)?.label ||
                joinery.type}
            </div>
            <div
              className="flex items-center gap-2 mt-1 text-sm"
              style={{ color: "var(--color-secondary)" }}
            >
              <LayoutPanelTop className="w-4 h-4" />
              {joinery.sheets?.length || 0}{" "}
              {joinery.sheets?.length > 1 ? "tôles" : "tôle"}
            </div>
          </div>
        </SwipeableCard>
      </SwipeableCardProvider>
    );
  };

  // --- Export PDF depuis backend ---
  const handleExportPDF = async () => {
    try {
      if (!project) return;

      // On envoie project et user.phone au backend
      const response = await api.post(
        `/export/${id}/pdf`,
        {
          project,
          userPhone: user?.phone || "",
        },
        { responseType: "blob" }
      );

      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `${project.name}.pdf`;
      link.click();

      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Erreur export PDF", err);
      alert("Impossible de générer le PDF");
    }
  };

  // --- Envoi email avec PDF généré par le backend ---
  const handleSendEmail = async (data: any) => {
    try {
      const response = await api.post(
        `/export/${id}/pdf`,
        {
          project,
          userPhone: user?.phone || "",
        },
        { responseType: "blob" }
      );
      const pdfBlob = new Blob([response.data], { type: "application/pdf" });

      const formData = new FormData();
      formData.append("file", pdfBlob, `${project.name}.pdf`);
      formData.append("recipient", "jovignot.cosme@icloud.com"); // TODO: mettre depuis l'input
      formData.append("subject", data.subject);
      formData.append("message", data.message || "");

      await api.post(`/email/send-project/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setShowEmailModal(false);
      alert("Email envoyé !");
    } catch (error: any) {
      console.error("Failed to send email:", error);
      alert("Erreur lors de l'envoi de l'email");
    }
  };

  return (
    <div className="relative pb-20">
      {/* Titre projet */}
      <h1
        className="px-4 py-4 mb-4 text-3xl font-bold"
        style={{ color: "var(--color-page-title)" }}
      >
        {project.name}
      </h1>

      <FloatingActionButtons
        onAddJoinery={() => setShowCreateModal(true)}
        onExportPDF={handleExportPDF}
        onEmail={() => setShowEmailModal(true)}
      />

      {/* Image projet */}
      {project.imageURL && (
        <div className="w-full mb-6">
          <ImageWithPlaceholder
            src={optimizeCloudinary(project.imageURL, 1600)}
            alt={project.name}
            style={{ height: "33vh" }}
            width="1600"
            height="600"
          />
        </div>
      )}

      {/* Infos projet */}
      <div
        className="px-4 py-3 pr-0 mx-4 mb-8 rounded-lg"
        style={{ backgroundColor: "var(--color-card-bg)" }}
      >
        <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2">
          {infoFields
            .filter((f) => f.value)
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
                  style={{ color: "var(--color-card-text)" }}
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

      {/* Modal email avec aperçu PDF */}
      <Modal
        isOpen={showEmailModal}
        onClose={() => setShowEmailModal(false)}
        title="Envoyer par email"
        size="xl"
      >
        <EmailForm
          onSubmit={handleSendEmail}
          onCancel={() => setShowEmailModal(false)}
        />
      </Modal>
    </div>
  );
}
