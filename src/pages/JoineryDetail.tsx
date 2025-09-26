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
import { SheetVisualization } from "../components/Sheets/SheetVisualization";
import { SheetCard } from "../components/UI/SheetCard";

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

  if (loading) return <LoadingSpinner size="lg" />;

  if (!project || !joinery)
    return (
      <div
        className="flex items-center justify-center min-h-screen"
        // style={{ backgroundColor: "var(--color-app-bg)", color: "var(--color-text-primary)" }}
      >
        Aucune menuiserie trouvée
      </div>
    );

  return (
    <div className="px-4 py-8 pb-16 mx-auto space-y-6 max-w-7xl">
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

      <div className="flex space-x-2">
        <Button onClick={() => setShowSheetModal(true)}>
          <Plus className="w-4 h-4 mr-1" /> Ajouter une tôle
        </Button>
        <Button variant="outline" onClick={handleExportPDF}>
          <FileText className="w-4 h-4 mr-1" /> PDF
        </Button>
        <Button variant="outline" onClick={() => setShowEmailModal(true)}>
          <Mail className="w-4 h-4 mr-1" /> Email
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {joinery.sheets.map((sheet: any, i: number) => (
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
                style={{ color: "var(--color-page-title)" }}
              >
                Tôle {i + 1}
              </h2>
              <div className="flex space-x-2">
                <button className="p-2 transition-colors rounded-md">
                  <Edit
                    className="w-4 h-4"
                    style={{ color: "var(--color-page-title)" }}
                    onClick={() => setEditingSheet(sheet)}
                  />
                </button>
                <button className="p-2 transition-colors rounded-md">
                  <Trash2
                    className="w-4 h-4"
                    style={{ color: "var(--color-error)" }}
                    onClick={() => handleDeleteSheet(sheet._id)}
                  />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3 text-sm">
              <SheetCard
                title="Type"
                data={sheet.profileType.toUpperCase()}
                textured={false}
              />
              <SheetCard
                title="RAL"
                data={sheet.color}
                textured={sheet.textured}
              />
              <SheetCard
                title="Longueur"
                data={sheet.length}
                unit="mm"
                textured={false}
              />
              <SheetCard title="QTE" data={sheet.quantity} textured={false} />
            </div>

            <div className="w-full h-48">
              <SheetVisualization
                segments={sheet.segments}
                widthAppui={sheet.widthAppui}
                dimensions={sheet.dimensions}
              />
            </div>
          </div>
        ))}
      </div>

      <Modal
        isOpen={showSheetModal}
        onClose={() => setShowSheetModal(false)}
        title="Ajouter une tôle"
        size="lg"
      >
        <SheetForm
          onSubmit={handleCreateSheet}
          onCancel={() => setShowSheetModal(false)}
        />
      </Modal>

      <Modal
        isOpen={!!editingSheet}
        onClose={() => setEditingSheet(null)}
        title="Éditer la tôle"
        size="lg"
      >
        {editingSheet && (
          <SheetForm
            initialData={editingSheet}
            onSubmit={handleUpdateSheet}
            onCancel={() => setEditingSheet(null)}
          />
        )}
      </Modal>

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
