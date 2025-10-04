// JoineryDetail.tsx
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Plus, Edit, Trash2, FileText, Mail } from "lucide-react";
import { api } from "../services/api";
import { Button } from "../components/UI/Button";
import { Modal } from "../components/UI/Modal";
import { LoadingSpinner } from "../components/UI/LoadingSpinner";
import { SheetForm } from "../components/Forms/SheetForm";
import { EmailForm } from "../components/Forms/EmailForm";
import { SheetCard } from "../components/UI/SheetCard";
import { RAL_CLASSIC } from "../constants/ral_classic_colors";
import { sheetModels } from "../constants/sheetModels";

export function JoineryDetail() {
  const { projectId, joineryId } = useParams<{
    projectId: string;
    joineryId: string;
  }>();
  const [project, setProject] = useState<any>(null);
  const [joinery, setJoinery] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showSheetModal, setShowSheetModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [editingSheet, setEditingSheet] = useState<any>(null);

  useEffect(() => {
    if (projectId && joineryId) fetchProject();
  }, [projectId, joineryId]);

  const fetchProject = async () => {
    try {
      const { data } = await api.get(`/projects/${projectId}`);
      setProject(data);
      setJoinery(data.joineries.find((j: any) => j._id === joineryId));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSheet = async (sheetData: any) => {
    await api.post(
      `/sheets/${projectId}/joineries/${joineryId}/sheets`,
      sheetData
    );
    setShowSheetModal(false);
    fetchProject();
  };

  const handleUpdateSheet = async (sheetData: any) => {
    await api.put(
      `/sheets/${projectId}/joineries/${joineryId}/sheets/${editingSheet._id}`,
      sheetData
    );
    setEditingSheet(null);
    fetchProject();
  };

  const handleDeleteSheet = async (sheetId: string) => {
    if (!confirm("Are you sure?")) return;
    await api.delete(
      `/sheets/${projectId}/joineries/${joineryId}/sheets/${sheetId}`
    );
    fetchProject();
  };

  const handleExportPDF = () =>
    window.open(`/api/pdf/joinery/${projectId}/${joineryId}`, "_blank");

  const handleSendEmail = async (data: any) => {
    await api.post(`/email/send-joinery/${projectId}/${joineryId}`, data);
    setShowEmailModal(false);
    alert("Email sent!");
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );

  if (!project || !joinery)
    return (
      <div className="flex items-center justify-center min-h-screen">
        Aucune menuiserie trouvée
      </div>
    );

  return (
    <div className="px-4 py-8 mx-auto pb-14 max-w-7xl sm:px-6 lg:px-8">
      <div className="flex items-center space-x-4">
        <Link to={`/projects/${projectId}`}>
          <ArrowLeft
            className="w-5 h-5"
            style={{ color: "var(--color-secondary)" }}
          />
        </Link>
        <h1
          className="text-3xl font-bold"
          style={{ color: "var(--color-page-title)" }}
        >
          {joinery.name}
        </h1>
      </div>

      <div className="flex pb-3 mt-6 mb-4 space-x-2 border-b border-black/70">
        <Button onClick={() => setShowSheetModal(true)} variant="success">
          <Plus className="w-4 h-4 mr-1" /> Ajouter une tôle
        </Button>
        <Button variant="secondary" onClick={handleExportPDF}>
          <FileText className="w-4 h-4 mr-1" /> PDF
        </Button>
        <Button variant="secondary" onClick={() => setShowEmailModal(true)}>
          <Mail className="w-4 h-4 mr-1" /> Email
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {joinery.sheets.map((sheet: any, i: number) => {
          const colorHex =
            RAL_CLASSIC.find((c) => c.code === sheet.color)?.hex || "#ccc";

          // Cherche le modèle correspondant pour la vignette
          const sheetModel = sheetModels.find(
            (m) => m.profileType === sheet.profileType
          );

          return (
            <div
              key={sheet._id}
              className="p-4 rounded-lg shadow-md h-fit"
              style={{
                backgroundColor: "var(--color-card-bg)",
                border: "1px solid var(--color-border)",
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <h2
                  className="font-semibold"
                  style={{ color: "var(--color-card-text)" }}
                >
                  Tôle {i + 1}
                </h2>
                <div className="flex space-x-2">
                  <Button
                    variant="action"
                    onClick={() => setEditingSheet(sheet)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => handleDeleteSheet(sheet._id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Aperçu du modèle */}
              {sheetModel && (
                <div className="mb-3">
                  <img
                    src={sheetModel.src}
                    alt={sheetModel.name}
                    className="object-contain w-full h-auto mt-4 rounded-xl"
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-3 mb-3 text-sm">
                <SheetCard
                  title="Type"
                  data={sheet.profileType.toUpperCase()}
                  textured={sheet.textured}
                />
                <SheetCard
                  title="RAL"
                  data={sheet.color}
                  textured={sheet.textured}
                />
                <SheetCard
                  title="Longueur"
                  data={sheet.dimensions.L}
                  unit="mm"
                  textured={false}
                />
                <SheetCard title="QTE" data={sheet.quantity} textured={false} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal création */}
      <Modal
        isOpen={showSheetModal}
        onClose={() => setShowSheetModal(false)}
        title="Ajouter une tôle"
        size="xl"
      >
        <SheetForm
          onSubmit={handleCreateSheet}
          onCancel={() => setShowSheetModal(false)}
        />
      </Modal>

      {/* Modal édition */}
      <Modal
        isOpen={!!editingSheet}
        onClose={() => setEditingSheet(null)}
        title="Éditer la tôle"
        size="xl"
      >
        {editingSheet && (
          <SheetForm
            initialData={editingSheet}
            onSubmit={handleUpdateSheet}
            onCancel={() => setEditingSheet(null)}
          />
        )}
      </Modal>

      {/* Modal email */}
      <Modal
        isOpen={showEmailModal}
        onClose={() => setShowEmailModal(false)}
        title="Envoyer par email"
        size="md"
      >
        <EmailForm
          onSubmit={handleSendEmail}
          onCancel={() => setShowEmailModal(false)}
        />
      </Modal>
    </div>
  );
}
