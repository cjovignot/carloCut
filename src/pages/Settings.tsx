import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Plus, Edit, Trash2, FileText, Mail } from "lucide-react";
import { api } from "../services/api";
import { Button } from "../components/UI/Button";
import { LoadingSpinner } from "../components/UI/LoadingSpinner";
import { useAuth } from "../services/useAuth";

export function Settings() {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();


  return (
    <div className="px-4 py-8 pb-16 mx-auto max-w-7xl sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
      Réglages
      </div>


    </div>
  );
}
