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
import LineDrawer, { Segment } from "../Profiles/LineDrawer";

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
  const [segmentsMap, setSegmentsMap] = useState<Record<string, Segment[]>>({});

  useEffect(() => {
    if (projectId && joineryId) fetchProject();
  }, [projectId, joineryId]);

  const fetchProject = async () => {
    try {
      const response = await api.get(`/projects/${projectId}`);
      const projectData = response.data;
      const joineryData = projectData.joineries.find(
        (j: any) => j._id === joineryId
      );
      setProject(projectData);
      setJoinery(joineryData);

      // Préparer les segments existants pour chaque sheet
      const initialSegments: Record<string, Segment[]> = {};
      joineryData.sheets.forEach((sheet: any) => {
        initialSegments[sheet._id] = sheet.segments || [];
      });
      setSegmentsMap(initialSegments);
    } catch (error) {
      console.error("Failed to fetch project:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSheet = async (sheetData: any) => {
    try {
      await api.post(
        `/sheets/${projectId}/joineries/${joineryId}/sheets`,
        sheetData
      );
      await fetchProject();
      setShowSheetModal(false);
    } catch (error) {
      console.error("Failed to create sheet:", error);
      throw error;
    }
  };

  const handleUpdateSheet = async (sheetData: any) => {
    try {
      await api.put(
        `/sheets/${projectId}/joineries/${joineryId}/sheets/${editingSheet._id}`,
        sheetData
      );
      await fetchProject();
      setEditingSheet(null);
    } catch (error) {
      console.error("Failed to update sheet:", error);
      throw error;
    }
  };

  const handleDeleteSheet = async (sheetId: string) => {
    if (!confirm("Are you sure you want to delete this sheet?")) return;
    try {
      await api.delete(
        `/sheets/${projectId}/joineries/${joineryId}/sheets/${sheetId}`
      );
      await fetchProject();
    } catch (error) {
      console.error("Failed to delete sheet:", error);
    }
  };

  const handleExportPDF = () => {
    window.open(`/api/pdf/joinery/${projectId}/${joineryId}`, "_blank");
  };

  const handleSendEmail = async (emailData: any) => {
    try {
      await api.post(
        `/email/send-joinery/${projectId}/${joineryId}`,
        emailData
      );
      setShowEmailModal(false);
      alert("Email sent successfully!");
    } catch (error) {
      console.error("Failed to send email:", error);
      alert("Failed to send email. Please try again.");
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );

  if (!project || !joinery)
    return (
      <div className="flex items-center justify-center min-h-screen pb-16">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">
            Joinery not found
          </h2>
          <Link
            to="/projects"
            className="inline-block mt-4 text-blue-600 hover:text-blue-800"
          >
            Back to Projects
          </Link>
        </div>
      </div>
    );

  return (
    <div className="px-4 py-8 pb-16 mx-auto max-w-7xl sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <Link
            to={`/projects/${projectId}`}
            className="mr-4 text-blue-600 hover:text-blue-800"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{joinery.name}</h1>
            <p className="text-gray-600">
              Project: {project.name} | Type: {joinery.type}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-4">
          <Button onClick={() => setShowSheetModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Ajouter une tôle
          </Button>
          <Button variant="outline" onClick={handleExportPDF}>
            <FileText className="w-4 h-4 mr-2" />
            PDF
          </Button>
          <Button variant="outline" onClick={() => setShowEmailModal(true)}>
            <Mail className="w-4 h-4 mr-2" />
            Envoyer par mail
          </Button>
        </div>
      </div>

      {/* Sheets */}
      <div>
        <h2 className="mb-6 text-2xl font-bold text-gray-900">
          Tôles ({joinery.sheets.length})
        </h2>

        {joinery.sheets.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-lg shadow-md">
            <p className="text-lg text-gray-500">No sheets yet</p>
            <p className="mt-2 text-gray-400">
              Ajouter une tôle pour commencer !
            </p>
            <Button className="mt-4" onClick={() => setShowSheetModal(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Ajouter une tôle
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {joinery.sheets.map((sheet: any, index: number) => (
              <div
                key={sheet._id}
                className="overflow-hidden bg-white rounded-lg shadow-md"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Tôle {index + 1}
                    </h3>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setEditingSheet(sheet)}
                        className="p-2 text-gray-400 transition-colors hover:text-blue-600"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteSheet(sheet._id)}
                        className="p-2 text-gray-400 transition-colors hover:text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-600">
                        Elément:{" "}
                        <span className="font-medium">
                          {sheet.profileType.toUpperCase()}
                        </span>
                      </p>
                      <p className="text-sm text-gray-600">
                        RAL: <span className="font-medium">{sheet.color}</span>
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">
                        {sheet.profileType.toLowerCase().includes("tableau")
                          ? "Hauteur:"
                          : "Longueur:"}{" "}
                        <span className="font-medium">{sheet.length}mm</span>
                      </p>
                      <p className="text-sm text-gray-600">
                        QTE:{" "}
                        <span className="font-medium">{sheet.quantity}</span>
                      </p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm text-gray-600">
                      Dimensions:{" "}
                      <span className="font-medium">
                        {sheet.dimensions.join(" × ")}mm
                      </span>
                    </p>
                  </div>

                  {/* SheetVisualization */}
                  <SheetVisualization
                    segments={segmentsMap[sheet._id] || []}
                    dimensions={sheet.dimensions}
                  />

                  <div className="mt-4">
                    <p className="text-sm text-gray-600">
                      Mesures:{" "}
                      <span className="font-medium">
                        {/* {sheet.dimensions.map(dim, index)}mm */}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
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
        title="Edition de la tôle"
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
        title="Envoyer par mail"
      >
        <EmailForm
          onSubmit={handleSendEmail}
          onCancel={() => setShowEmailModal(false)}
        />
      </Modal>
    </div>
  );
}
