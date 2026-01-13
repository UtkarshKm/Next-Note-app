"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import type { INote } from "@/models/notes";
import NoteCard from "./NoteCard";

interface PaginatedResponse {
    success: boolean;
    data: INote[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
    error?: string;
}

interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
}

export default function NotesPage() {
    const [notes, setNotes] = useState<INote[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingNote, setEditingNote] = useState<string | null>(null);
    const [formData, setFormData] = useState({ title: "", body: "" });

    // Fetch notes from API
    const fetchNotes = async () => {
        try {
            setLoading(true);
            const response = await fetch("/api/notes?page=1&limit=50");
            const data: PaginatedResponse = await response.json();

            if (data.success && data.data) {
                setNotes(data.data);
            } else {
                toast.error(data.error || "Failed to fetch notes");
            }
        } catch (error) {
            toast.error("Error fetching notes");
            console.error("Fetch error:", error);
        } finally {
            setLoading(false);
        }
    };

    // Create a new note
    const createNote = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.title.trim() || !formData.body.trim()) {
            toast.error("Title and body are required");
            return;
        }

        try {
            const response = await fetch("/api/notes", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data: ApiResponse<INote> = await response.json();

            if (data.success && data.data) {
                toast.success("Note created successfully!");
                setFormData({ title: "", body: "" });
                fetchNotes(); // Refresh the list
            } else {
                toast.error(data.error || "Failed to create note");
            }
        } catch (error) {
            toast.error("Error creating note");
            console.error("Create error:", error);
        }
    };

    // Update an existing note
    const updateNote = async (id: string) => {
        if (!formData.title.trim() || !formData.body.trim()) {
            toast.error("Title and body are required");
            return;
        }

        try {
            const response = await fetch(`/api/notes/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data: ApiResponse<INote> = await response.json();

            if (data.success && data.data) {
                toast.success("Note updated successfully!");
                setFormData({ title: "", body: "" });
                setEditingNote(null);
                fetchNotes(); // Refresh the list
            } else {
                toast.error(data.error || "Failed to update note");
            }
        } catch (error) {
            toast.error("Error updating note");
            console.error("Update error:", error);
        }
    };

    // Delete a note
    const deleteNote = async (id: string) => {
        if (!confirm("Are you sure you want to delete this note?")) {
            return;
        }

        try {
            const response = await fetch(`/api/notes/${id}`, {
                method: "DELETE",
            });

            const data: ApiResponse<INote> = await response.json();

            if (data.success) {
                toast.success("Note deleted successfully!");
                fetchNotes(); // Refresh the list
            } else {
                toast.error(data.error || "Failed to delete note");
            }
        } catch (error) {
            toast.error("Error deleting note");
            console.error("Delete error:", error);
        }
    };

    // Handle edit button click
    const handleEdit = (note: INote) => {
        setEditingNote(note._id?.toString() || null);
        setFormData({ title: note.title, body: note.body });
    };

    // Handle cancel edit
    const handleCancelEdit = () => {
        setEditingNote(null);
        setFormData({ title: "", body: "" });
    };

    // Fetch notes on component mount
    useEffect(() => {
        fetchNotes();
    }, []);

    // Handle form submit
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingNote) {
            updateNote(editingNote);
        } else {
            createNote(e);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-900 dark:to-zinc-950 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">
                        My Notes
                    </h1>
                    <p className="text-zinc-600 dark:text-zinc-400">
                        Create, edit, and manage your notes
                    </p>
                </div>

                {/* Create/Edit Form */}
                <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-md p-6 mb-8">
                    <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50 mb-4">
                        {editingNote ? "Edit Note" : "Create New Note"}
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label
                                htmlFor="title"
                                className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2"
                            >
                                Title
                            </label>
                            <input
                                type="text"
                                id="title"
                                value={formData.title}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        title: e.target.value,
                                    })
                                }
                                className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-50"
                                placeholder="Enter note title..."
                                maxLength={100}
                                required
                            />
                        </div>
                        <div>
                            <label
                                htmlFor="body"
                                className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2"
                            >
                                Body
                            </label>
                            <textarea
                                id="body"
                                value={formData.body}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        body: e.target.value,
                                    })
                                }
                                className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-50 resize-none"
                                placeholder="Enter note content..."
                                rows={4}
                                maxLength={2000}
                                required
                            />
                        </div>
                        <div className="flex gap-3">
                            <button
                                type="submit"
                                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
                            >
                                {editingNote ? "Update Note" : "Create Note"}
                            </button>
                            {editingNote && (
                                <button
                                    type="button"
                                    onClick={handleCancelEdit}
                                    className="px-6 py-2 bg-zinc-300 hover:bg-zinc-400 dark:bg-zinc-600 dark:hover:bg-zinc-700 text-zinc-900 dark:text-zinc-50 font-medium rounded-lg transition-colors duration-200"
                                >
                                    Cancel
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                {/* Notes Grid */}
                {loading ? (
                    <div className="flex justify-center items-center py-12">
                        <div className="text-zinc-600 dark:text-zinc-400 text-lg">
                            Loading notes...
                        </div>
                    </div>
                ) : notes.length === 0 ? (
                    <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-md p-12 text-center">
                        <p className="text-zinc-600 dark:text-zinc-400 text-lg">
                            No notes yet. Create your first note above!
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {notes.map((note) => (
                            <NoteCard
                                key={note._id?.toString()}
                                note={note}
                                onEdit={handleEdit}
                                onDelete={deleteNote}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
