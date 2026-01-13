import dbConnect from "@/lib/mongodb";
import Note from "@/models/notes";
import { NextResponse } from "next/server";
import type { INote } from "@/models/notes";

interface CreateNoteRequest {
	title: string;
	body: string;
}

interface ApiResponse<T> {
	success: boolean;
	data?: T;
	error?: string;
}

interface PaginationMeta {
	page: number;
	limit: number;
	total: number;
	totalPages: number;
}

interface PaginatedApiResponse<T> {
	success: boolean;
	data: T;
	pagination: PaginationMeta;
	error?: string;
}

export async function POST(request: Request) {
	try {
		await dbConnect();
		const body = (await request.json()) as CreateNoteRequest;

		if (!body.title || !body.body) {
			return NextResponse.json<ApiResponse<never>>(
				{ success: false, error: "Title and body are required" },
				{ status: 400 }
			);
		}
		const note = await Note.create(body);

		return NextResponse.json<ApiResponse<INote>>(
			{
				success: true,
				data: note,
			},
			{ status: 201 }
		);
	} catch (error) {
		console.error("Create note error:", error);
		return NextResponse.json<ApiResponse<never>>(
			{
				success: false,
				error: error instanceof Error ? error.message : "Failed to create note",
			},
			{ status: 500 }
		);
	}
}

export async function GET(request: Request) {
	try {
		await dbConnect();
		const { searchParams } = new URL(request.url);
		const page = parseInt(searchParams.get("page") || "1");
		const limit = parseInt(searchParams.get("limit") || "10");

		const skip = (page - 1) * limit;

		const notes = await Note.find()
			.sort({ createdAt: -1 }) // Newest first
			.limit(limit) // Return only 'limit' items
			.skip(skip); // Skip previous pages
		const total = await Note.countDocuments(); // Total count

		return NextResponse.json<PaginatedApiResponse<INote[]>>(
			{
				success: true,
				data: notes,
				pagination: {
					page,
					limit,
					total,
					totalPages: Math.ceil(total / limit),
				},
			},
			{ status: 200 }
		);
	} catch (error) {
		console.error("Create note error:", error);
		return NextResponse.json<ApiResponse<never>>(
			{
				success: false,
				error: error instanceof Error ? error.message : "Failed to get notes",
			},
			{ status: 500 }
		);
	}
}

