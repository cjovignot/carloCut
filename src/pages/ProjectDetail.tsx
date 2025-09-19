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
    if (id) {
      fetchProject();
    }
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

  const handleExportPDF = () => {
    window.open(`/api/pdf/project/${id}`, "_blank");
  };

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
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">
            Project not found
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
  }

  return (
    <div className="px-4 py-8 pb-16 mx-auto max-w-7xl sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <Link
            to="/projects"
            className="mr-4 text-blue-600 hover:text-blue-800"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{project.name}</h1>
            <p className="text-gray-600">Client: {project.client}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-4">
          <Button onClick={() => setShowJoineryModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Joinery
          </Button>
          <Button variant="outline" onClick={handleExportPDF}>
            <FileText className="w-4 h-4 mr-2" />
            Export PDF
          </Button>
          <Button variant="outline" onClick={() => setShowEmailModal(true)}>
            <Mail className="w-4 h-4 mr-2" />
            Send by Email
          </Button>
        </div>
      </div>

      {/* Project Info */}
      <div className="p-6 mb-8 bg-white rounded-lg shadow-md">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <h3 className="mb-4 text-lg font-semibold text-gray-900">
              Project Details
            </h3>
            <div className="space-y-2">
              <p>
                <span className="font-medium">Client:</span> {project.client}
              </p>
              <p>
                <span className="font-medium">Address:</span> {project.address}
              </p>
              <p>
                <span className="font-medium">Date:</span>{" "}
                {new Date(project.date).toLocaleDateString()}
              </p>
              <p>
                <span className="font-medium">Created by:</span>{" "}
                {project.createdBy?.name}
              </p>
            </div>
          </div>
          {project.notes && (
            <div>
              <h3 className="mb-4 text-lg font-semibold text-gray-900">
                Notes
              </h3>
              <p className="text-gray-700 whitespace-pre-wrap">
                {project.notes}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Joineries */}
      <div>
        <h2 className="mb-6 text-2xl font-bold text-gray-900">
          Joineries ({project.joineries.length})
        </h2>

        {project.joineries.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-lg shadow-md">
            <p className="text-lg text-gray-500">No joineries yet</p>
            <p className="mt-2 text-gray-400">
              Add your first joinery to get started
            </p>
            <Button className="mt-4" onClick={() => setShowJoineryModal(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Joinery
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {project.joineries.map((joinery: any, index: number) => (
              <div
                key={joinery._id}
                className="transition-shadow bg-white rounded-lg shadow-md hover:shadow-lg"
              >
                <Link
                  to={`/projects/${id}/joineries/${joinery._id}`}
                  className="block p-6"
                >
                  <h3 className="mb-2 text-lg font-semibold text-gray-900">
                    {joinery.name}
                  </h3>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-600">
                      Type: {joinery.type}
                    </p>
                    <p className="text-sm font-medium text-blue-600">
                      {joinery.sheets.length} sheets
                    </p>
                  </div>
                </Link>

                <div className="flex justify-end px-6 pb-4 space-x-2">
                  <button
                    onClick={() => setEditingJoinery(joinery)}
                    className="p-2 text-gray-400 transition-colors hover:text-blue-600"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteJoinery(joinery._id)}
                    className="p-2 text-gray-400 transition-colors hover:text-red-600"
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
        title="Add Joinery"
      >
        <JoineryForm
          onSubmit={handleCreateJoinery}
          onCancel={() => setShowJoineryModal(false)}
        />
      </Modal>

      <Modal
        isOpen={!!editingJoinery}
        onClose={() => setEditingJoinery(null)}
        title="Edit Joinery"
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
        title="Send Project by Email"
      >
        <EmailForm
          onSubmit={handleSendEmail}
          onCancel={() => setShowEmailModal(false)}
        />
      </Modal>
    </div>
  );
}
