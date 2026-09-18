import React, { useState, useEffect } from "react";

const API_BASE_URL = "http://localhost:5000/api";

export default function KnowledgeBase() {
  const [documents, setDocuments] = useState([]);
  const [file, setFile] = useState(null);
  const [docCategory, setDocCategory] = useState("company_overview");
  const [uploading, setUploading] = useState(false);
  const [reindexing, setReindexing] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [statusMessage, setStatusMessage] = useState(null);

  const fetchDocuments = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/rag/documents`);
      if (res.ok) {
        const data = await res.json();
        setDocuments(data.documents || []);
      }
    } catch {
      // Fallback empty state
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleFileUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    setUploading(true);
    setStatusMessage(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("category", docCategory);

    try {
      const res = await fetch(`${API_BASE_URL}/rag/ingest-document`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setStatusMessage({ type: "success", text: "Document uploaded and indexed successfully!" });
        setFile(null);
        // Reset file input element
        e.target.reset();
        fetchDocuments();
      } else {
        setStatusMessage({ type: "error", text: data.message || "Failed to ingest document." });
      }
    } catch (error) {
      setStatusMessage({ type: "error", text: "Network error occurred while uploading." });
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteDocument = async (docId, filename) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${filename}"? This will also purge its embeddings from AI memory.`
    );
    if (!confirmed) return;

    setDeletingId(docId);
    setStatusMessage(null);

    try {
      const res = await fetch(`${API_BASE_URL}/rag/documents/${docId}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setStatusMessage({ type: "success", text: data.message || "Document deleted successfully." });
        setDocuments((prev) => prev.filter((d) => d.document_id !== docId));
      } else {
        setStatusMessage({ type: "error", text: data.message || "Failed to delete document." });
      }
    } catch {
      setStatusMessage({ type: "error", text: "Network error occurred while deleting." });
    } finally {
      setDeletingId(null);
    }
  };

  const handleReindexAll = async () => {
    if (!window.confirm("Re-indexing will recreate all vector embeddings from scratch. Continue?")) return;

    setReindexing(true);
    setStatusMessage(null);

    try {
      const res = await fetch(`${API_BASE_URL}/rag/rebuild-index`, {
        method: "POST",
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setStatusMessage({ type: "success", text: "Vector index recreated successfully!" });
      } else {
        setStatusMessage({ type: "error", text: data.message || "Re-indexing failed." });
      }
    } catch {
      setStatusMessage({ type: "error", text: "Server error during re-indexing." });
    } finally {
      setReindexing(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">AI Knowledge Base (RAG)</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage company context, service catalogs, and PDF documents queried by the website chatbot.
          </p>
        </div>
        <button
          type="button"
          onClick={handleReindexAll}
          disabled={reindexing}
          className="px-4 py-2 text-xs font-medium rounded-lg bg-gray-900 text-white hover:bg-gray-800 disabled:opacity-50 transition-colors shadow-xs"
        >
          {reindexing ? "Rebuilding Vector Index..." : "⚡ Rebuild Vector Index"}
        </button>
      </div>

      {statusMessage && (
        <div
          className={`p-3.5 rounded-xl text-xs font-medium ${
            statusMessage.type === "success"
              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
              : "bg-rose-50 text-rose-800 border border-rose-200"
          }`}
        >
          {statusMessage.text}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upload Form */}
        <div className="lg:col-span-1 bg-white border border-gray-200 rounded-xl p-5 shadow-xs">
          <h2 className="text-sm font-semibold text-gray-900 mb-1">Upload New PDF Source</h2>
          <p className="text-xs text-gray-500 mb-4">
            Upload updated brochures, case studies, or FAQs to inject into the vector store.
          </p>

          <form onSubmit={handleFileUpload} className="space-y-4">
            <div>
              <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1">
                Category
              </label>
              <select
                value={docCategory}
                onChange={(e) => setDocCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="company_overview">Company Overview & About</option>
                <option value="services_pricing">Services & Tech Stacks</option>
                <option value="policies_terms">Policies & Client FAQs</option>
                <option value="case_studies">Case Studies & Portfolios</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1">
                PDF Document
              </label>
              <input
                type="file"
                accept=".pdf"
                required
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="w-full text-xs text-gray-500 file:mr-3 file:py-2 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-medium file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 cursor-pointer"
              />
            </div>

            <button
              type="submit"
              disabled={uploading || !file}
              className="w-full py-2.5 px-4 text-xs font-medium rounded-lg bg-black text-white hover:bg-gray-800 disabled:opacity-50 transition-colors shadow-xs"
            >
              {uploading ? "Extracting & Embedding..." : "Upload & Ingest PDF"}
            </button>
          </form>
        </div>

        {/* Existing Documents List */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-xl p-5 shadow-xs">
          <h2 className="text-sm font-semibold text-gray-900 mb-1">Indexed Knowledge Sources</h2>
          <p className="text-xs text-gray-500 mb-4">
            Files currently referenced by the Retrieval-Augmented Generation pipeline.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-600 border-b border-gray-100">
                <tr>
                  <th className="px-4 py-2.5">Document</th>
                  <th className="px-4 py-2.5">Category</th>
                  <th className="px-4 py-2.5">Chunks</th>
                  <th className="px-4 py-2.5">Status</th>
                  <th className="px-4 py-2.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {documents.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-8 text-gray-400">
                      No documents indexed yet. Upload a PDF on the left to start.
                    </td>
                  </tr>
                ) : (
                  documents.map((doc) => (
                    <tr key={doc.document_id} className="hover:bg-gray-50/50">
                      <td className="px-4 py-3 font-medium text-gray-900 flex items-center gap-2">
                        <span>📄</span>
                        <span className="truncate max-w-xs">{doc.filename}</span>
                      </td>
                      <td className="px-4 py-3 text-gray-500 capitalize">{doc.category?.replace("_", " ")}</td>
                      <td className="px-4 py-3 font-mono text-gray-600">{doc.chunk_count || 0}</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 text-[10px] rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                          Active
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          type="button"
                          onClick={() => handleDeleteDocument(doc.document_id, doc.filename)}
                          disabled={deletingId === doc.document_id}
                          className="px-2.5 py-1 text-[11px] font-medium text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-md transition-colors disabled:opacity-50"
                        >
                          {deletingId === doc.document_id ? "Deleting..." : "Delete"}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}