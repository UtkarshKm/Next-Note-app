"use client";

import type { INote } from "@/models/notes";

interface NoteCardProps {
	note: INote;
	onEdit: (note: INote) => void;
	onDelete: (id: string) => void;
}

export default function NoteCard({ note, onEdit, onDelete }: NoteCardProps) {
	const formatDate = (date: Date | string | undefined) => {
		if (!date) return "Unknown date";
		const d = new Date(date);
		return d.toLocaleDateString("en-US", {
			year: "numeric",
			month: "short",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		});
	};

	const truncateText = (text: string, maxLength: number = 150) => {
		if (text.length <= maxLength) return text;
		return text.substring(0, maxLength) + "...";
	};

	const noteId = note._id?.toString() || "";

	return (
		<div className="bg-white dark:bg-zinc-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-6 flex flex-col h-full">
			{/* Note Header */}
			<div className="mb-4">
				<h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50 mb-2 line-clamp-2">
					{note.title}
				</h3>
				<p className="text-xs text-zinc-500 dark:text-zinc-400">
					{formatDate(note.createdAt)}
				</p>
			</div>

			{/* Note Body */}
			<div className="flex-1 mb-4">
				<p className="text-zinc-700 dark:text-zinc-300 text-sm leading-relaxed whitespace-pre-wrap">
					{truncateText(note.body)}
				</p>
			</div>

			{/* Action Buttons */}
			<div className="flex gap-2 pt-4 border-t border-zinc-200 dark:border-zinc-700">
				<button
					onClick={() => onEdit(note)}
					className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors duration-200"
				>
					Edit
				</button>
				<button
					onClick={() => onDelete(noteId)}
					className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors duration-200"
				>
					Delete
				</button>
			</div>
		</div>
	);
}
