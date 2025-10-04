import { useState } from "react";
import { Plus, FileText, Mail, Menu, X } from "lucide-react";

export function FloatingActionButtons({
  onAddJoinery,
  onExportPDF,
  onEmail,
}: {
  onAddJoinery: () => void;
  onExportPDF: () => void;
  onEmail: () => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed z-50 flex flex-col items-end gap-2 bottom-16 right-6">
      {/* Boutons secondaires */}
      {open && (
        <>
          <button
            onClick={onExportPDF}
            className="flex items-center justify-center w-12 h-12 mb-2 text-white transition-all bg-blue-600 rounded-full shadow-lg hover:bg-blue-700"
          >
            <FileText className="w-6 h-6" />
          </button>

          <button
            onClick={onEmail}
            className="flex items-center justify-center w-12 h-12 mb-2 text-white transition-all bg-purple-600 rounded-full shadow-lg hover:bg-purple-700"
          >
            <Mail className="w-6 h-6" />
          </button>

          <button
            onClick={onAddJoinery}
            className="flex items-center justify-center w-12 h-12 text-white transition-all bg-green-600 rounded-full shadow-lg hover:bg-green-700"
          >
            <Plus className="w-6 h-6 transition-transform duration-200 transform" />
          </button>
        </>
      )}

      {/* Bouton principal */}
      <button
        onClick={() => setOpen(!open)}
        style={{ backgroundColor: "var(--color-action-bg)" }}
        className="flex items-center justify-center w-12 h-12 text-white transition-all rounded-full shadow-lg"
      >
        <div className="relative w-6 h-6">
          {/* Menu → croix */}
          <Menu
            className={`absolute w-6 h-6 transition-transform duration-300 transform ${
              open
                ? "rotate-45 scale-0 opacity-0"
                : "rotate-0 scale-100 opacity-100"
            }`}
          />
          <X
            className={`absolute w-6 h-6 transition-transform duration-300 transform ${
              open
                ? "rotate-0 scale-100 opacity-100"
                : "rotate-45 scale-0 opacity-0"
            }`}
          />
        </div>
      </button>
    </div>
  );
}
