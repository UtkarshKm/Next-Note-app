import dbConnect from "@/lib/mongodb";
import Note, { INote } from "@/models/notes";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

interface ApiResponse<T> {
	success: boolean;
	data?: T;
	error?: string;
}

interface UpdateNoteRequest {
	title?: string;
	body?: string;
}

export async function GET(
	request: Request,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const { id } = await params;
		await dbConnect();

		if (!mongoose.Types.ObjectId.isValid(id)) {
			return NextResponse.json<ApiResponse<never>>(
				{
					success: false,
					error: "Invalid note ID format",
				},
				{ status: 400 }
			);
		}
		const note = await Note.findById(id);

		if (!note) {
			return NextResponse.json<ApiResponse<never>>(
				{
					success: false,
					error: "Note not found",
				},
				{ status: 404 }
			);
		}

		return NextResponse.json<ApiResponse<INote>>(
			{
				success: true,
				data: note,
			},
			{ status: 200 }
		);
	} catch (error) {
		console.error(`Error in getting note `, error);
		return NextResponse.json<ApiResponse<never>>(
			{
				success: false,
				error: error instanceof Error ? error.message : `Failed to get note`,
			},
			{
				status: 500,
			}
		);
	}
}

export async function PUT(
	request: Request,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const { id } = await params;
		await dbConnect();

		// Validate ID format
		if (!mongoose.Types.ObjectId.isValid(id)) {
			return NextResponse.json<ApiResponse<never>>(
				{
					success: false,
					error: "Invalid note ID format",
				},
				{ status: 400 }
			);
		}

		// Parse and validate request body
		const body = (await request.json()) as UpdateNoteRequest;

		if (!body.title && !body.body) {
			return NextResponse.json<ApiResponse<never>>(
				{
					success: false,
					error: "At least one field (title or body) is required",
				},
				{ status: 400 }
			);
		}

		// Update note
		const updatedNote = await Note.findByIdAndUpdate(id, body, {
			new: true, // Return updated document
			runValidators: true, // Run schema validation
		});

		// Check if note exists
		if (!updatedNote) {
			return NextResponse.json<ApiResponse<never>>(
				{
					success: false,
					error: "Note not found",
				},
				{ status: 404 }
			);
		}

		return NextResponse.json<ApiResponse<INote>>(
			{
				success: true,
				data: updatedNote,
			},
			{ status: 200 }
		);
	} catch (error) {
		console.error("Error updating note:", error);
		return NextResponse.json<ApiResponse<never>>(
			{
				success: false,
				error: error instanceof Error ? error.message : "Failed to update note",
			},
			{ status: 500 }
		);
	}
}

export async function DELETE(
	request: Request,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const { id } = await params;
		await dbConnect();

		// Validate ID format
		if (!mongoose.Types.ObjectId.isValid(id)) {
			return NextResponse.json<ApiResponse<never>>(
				{
					success: false,
					error: "Invalid note ID format",
				},
				{ status: 400 }
			);
		}

		// Delete note
		const deletedNote = await Note.findByIdAndDelete(id);

		// Check if note existed
		if (!deletedNote) {
			return NextResponse.json<ApiResponse<never>>(
				{
					success: false,
					error: "Note not found",
				},
				{ status: 404 }
			);
		}

		return NextResponse.json<ApiResponse<INote>>(
			{
				success: true,
				data: deletedNote,
			},
			{ status: 200 }
		);
	} catch (error) {
		console.error("Error deleting note:", error);
		return NextResponse.json<ApiResponse<never>>(
			{
				success: false,
				error: error instanceof Error ? error.message : "Failed to delete note",
			},
			{ status: 500 }
		);
	}
}
