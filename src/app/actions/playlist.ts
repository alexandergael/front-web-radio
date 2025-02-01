"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "../../lib/prisma";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

interface Playlist {
  id: number;
  name: string;
  color: string;
  pochetteUrl: string | null;
}

export async function getPlaylists(): Promise<
  { playlists: Playlist[] } | { error: unknown; message: string }
> {
  try {
    const playlists = await prisma.playlist.findMany();
    return { playlists };
  } catch (error: unknown) {
    return { error, message: "Failed to fetch playlists" };
  }
}

export async function createPlaylist(
  formData: FormData
): Promise<{ playlist: Playlist } | { error: unknown; message: string }> {
  try {
    const name = formData.get("name") as string;
    const color = formData.get("color") as string;
    const pochetteUrl = formData.get("pochetteUrl") as string | null;

    const playlist = await prisma.playlist.create({
      data: { name, color, pochetteUrl },
    });

    revalidatePath("/");
    return { playlist };
  } catch (error: unknown) {
    return { error, message: "Failed to create playlist" };
  }
}

export async function updatePlaylist(
  formData: FormData
): Promise<{ playlist: Playlist } | { error: unknown; message: string }> {
  try {
    const id = parseInt(formData.get("id") as string);
    const name = formData.get("name") as string;
    const color = formData.get("color") as string;
    const pochetteUrl = formData.get("pochetteUrl") as string | null;

    const playlist = await prisma.playlist.update({
      where: { id },
      data: { name, color, pochetteUrl },
    });

    revalidatePath("/");
    return { playlist };
  } catch (error: unknown) {
    return { error, message: "Failed to update playlist" };
  }
}

export async function deletePlaylist(
  formData: FormData
): Promise<{ success: boolean } | { error: unknown; message: string }> {
  try {
    const id = parseInt(formData.get("id") as string);

    await prisma.playlist.delete({
      where: { id },
    });

    revalidatePath("/");
    return { success: true };
  } catch (error: unknown) {
    return { error, message: "Failed to delete playlist" };
  }
}

export async function uploadImage(
  formData: FormData
): Promise<{ url: string } | { error: unknown; message: string }> {
  try {
    const file = formData.get("file") as File;

    if (!file) {
      return { error: "No file provided", message: "No file provided" };
    }

    const buffer = await file.arrayBuffer();
    const bytes = Buffer.from(buffer);
    const filename = Date.now() + "-" + file.name;
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    const filePath = path.join(uploadDir, filename);

    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (mkdirError) {
      console.error("Error creating directory:", mkdirError);
      return {
        error: mkdirError,
        message: "Failed to create upload directory",
      };
    }

    try {
      await writeFile(filePath, bytes);
    } catch (writeError) {
      console.error("Error writing file:", writeError);
      return { error: writeError, message: "Failed to write file" };
    }

    const fileUrl = `/uploads/${filename}`;
    return { url: fileUrl };
  } catch (error: unknown) {
    console.error("Error handling upload:", error);
    return { error, message: "Internal server error" };
  }
}
