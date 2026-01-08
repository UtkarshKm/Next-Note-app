import mongoose from "mongoose";

interface INote {
	_id?: mongoose.Types.ObjectId;
	title: string;
	body: string;
	createdAt?: Date;
	updatedAt?: Date;
}

const noteSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: [true, "Title is required"],
			trim: true,
			maxlength: [100, "Title cannot exceed 100 characters"],
		},
		body: {
            type: String,
			required: [true, "Body is required"],
            maxlength: [2000, "body cannot exceed 2000 characters"],
		},
	},
	{
		timestamps: true,
	}
);

// During development, Next.js has hot reload. Every time you save a file, the code reruns.
const Note = mongoose.models.Note || mongoose.model<INote>("Note", noteSchema);

export default Note;
export type { INote };
