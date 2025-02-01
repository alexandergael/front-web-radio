"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "../../lib/prisma";

export async function getSongs() {
  try {
    const songs = await prisma.song.findMany();
    return { songs };
  } catch (error) {
    return { error, message: "Failed to fetch songs" };
  }
}

export async function createSong(formData: FormData) {
  try {
    const title = formData.get("title") as string;
    const artist = formData.get("artist") as string;
    const songUrl = formData.get("songUrl") as string;
    const duration = parseInt(formData.get("duration") as string);
    const playlistId = formData.get("playlistId")
      ? parseInt(formData.get("playlistId") as string)
      : null;

    const song = await prisma.song.create({
      data: { title, artist, songUrl, duration, playlistId },
    });

    revalidatePath("/");
    return { song };
  } catch (error) {
    return { error, message: "Failed to create song" };
  }
}

export async function updateSong(formData: FormData) {
  try {
    const id = parseInt(formData.get("id") as string);
    const title = formData.get("title") as string;
    const artist = formData.get("artist") as string;
    const songUrl = formData.get("songUrl") as string;
    const duration = parseInt(formData.get("duration") as string);
    const playlistId = formData.get("playlistId")
      ? parseInt(formData.get("playlistId") as string)
      : null;

    const song = await prisma.song.update({
      where: { id },
      data: { title, artist, songUrl, duration, playlistId },
    });

    revalidatePath("/");
    return { song };
  } catch (error) {
    return { error, message: "Failed to update song" };
  }
}

export async function deleteSong(formData: FormData) {
  try {
    const id = parseInt(formData.get("id") as string);

    await prisma.song.delete({
      where: { id },
    });

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    return { error, message: "Failed to delete song" };
  }
}
