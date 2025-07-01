"use client";

import { useEffect, useState } from "react";

interface Subject {
  _id: string;
  name: string;
  code: string;
  credits: number;
  department?: string;
  semester?: number;
}

export default function AdminSubjectsPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ name: "", code: "", credits: 0 });
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    fetchSubjects();
  }, []);

  async function fetchSubjects() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/subjects");
      const data = await res.json();
      setSubjects(data.subjects || []);
    } catch (err) {
      setError("Failed to load subjects");
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch("/api/subjects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      if (!res.ok) throw new Error("Failed to create subject");
      setForm({ name: "", code: "", credits: 0 });
      fetchSubjects();
    } catch (err) {
      setError("Failed to create subject");
    }
  }

  async function handleDelete(id: string) {
    setError("");
    try {
      const res = await fetch(`/api/subjects/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete subject");
      fetchSubjects();
    } catch (err) {
      setError("Failed to delete subject");
    }
  }

  function startEdit(subject: Subject) {
    setEditingId(subject._id);
    setForm({ name: subject.name, code: subject.code, credits: subject.credits });
  }

  async function handleEdit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!editingId) return;
    try {
      const res = await fetch(`/api/subjects/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      if (!res.ok) throw new Error("Failed to update subject");
      setEditingId(null);
      setForm({ name: "", code: "", credits: 0 });
      fetchSubjects();
    } catch (err) {
      setError("Failed to update subject");
    }
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Manage Subjects</h1>
      {error && <div className="text-red-500 mb-4 text-center">{error}</div>}
      <form onSubmit={editingId ? handleEdit : handleCreate} className="mb-8 grid grid-cols-1 md:grid-cols-4 gap-4 items-end bg-white p-4 rounded shadow">
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <input type="text" className="border rounded px-3 py-2 w-full" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required placeholder="Subject Name" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Code</label>
          <input type="text" className="border rounded px-3 py-2 w-full" value={form.code} onChange={e => setForm({ ...form, code: e.target.value })} required placeholder="e.g. CS101" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Credits</label>
          <input type="number" className="border rounded px-3 py-2 w-full" value={form.credits} onChange={e => setForm({ ...form, credits: Number(e.target.value) })} required min={0} placeholder="Credits" />
        </div>
        <div className="flex gap-2">
          <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded w-full">
            {editingId ? "Update" : "Add"}
          </button>
          {editingId && (
            <button type="button" className="px-4 py-2 rounded border w-full" onClick={() => { setEditingId(null); setForm({ name: "", code: "", credits: 0 }); }}>Cancel</button>
          )}
        </div>
      </form>
      {loading ? (
        <div className="text-center text-gray-500">Loading subjects...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border rounded shadow bg-white">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-4 py-2">Name</th>
                <th className="border px-4 py-2">Code</th>
                <th className="border px-4 py-2">Credits</th>
                <th className="border px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {subjects.length === 0 ? (
                <tr><td colSpan={4} className="text-center text-gray-400 py-6">No subjects found.</td></tr>
              ) : (
                subjects.map(subject => (
                  <tr key={subject._id} className="hover:bg-gray-50">
                    <td className="border px-4 py-2">{subject.name}</td>
                    <td className="border px-4 py-2">{subject.code}</td>
                    <td className="border px-4 py-2">{subject.credits}</td>
                    <td className="border px-4 py-2 flex gap-2 justify-center">
                      <button className="text-blue-600 hover:underline" onClick={() => startEdit(subject)}>Edit</button>
                      <button className="text-red-600 hover:underline" onClick={() => handleDelete(subject._id)}>Delete</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}