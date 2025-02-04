"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "../../lib/prisma";

interface PlaylistSong {
  playlistId: number;
  songId: number;
}

export async function createPlaylistSong(
  formData: FormData
): Promise<
  { playlistSong: PlaylistSong } | { error: unknown; message: string }
> {
  try {
    const playlistId = parseInt(formData.get("playlistId") as string);
    const songId = parseInt(formData.get("songId") as string);

    const playlistSong = await prisma.playlistSong.create({
      data: { playlistId, songId },
    });

    revalidatePath("/");
    return { playlistSong };
  } catch (error: unknown) {
    return { error, message: "Failed to create playlist-song association" };
  }
}

export async function getPlaylistSongs(
  playlistId: number
): Promise<
  { playlistSongs: PlaylistSong[] } | { error: unknown; message: string }
> {
  try {
    const playlistSongs = await prisma.playlistSong.findMany({
      where: { playlistId },
    });
    return { playlistSongs };
  } catch (error: unknown) {
    return { error, message: "Failed to fetch playlist songs" };
  }
}

export async function getAllPlalistSongs(): Promise<
  { playlistSongs: PlaylistSong[] } | { error: unknown; message: string }
> {
  try {
    const playlistSongs = await prisma.playlistSong.findMany({
      include: {
        playlist: {
          include: {
            songs: true,
          },
        },
      },
    });
    return { playlistSongs };
  } catch (error: unknown) {
    return { error, message: "Failed to fetch all playlist songs" };
  }
}

export async function deletePlaylistSong(
  formData: FormData
): Promise<{ success: boolean } | { error: unknown; message: string }> {
  try {
    const playlistId = parseInt(formData.get("playlistId") as string);
    const songId = parseInt(formData.get("songId") as string);

    await prisma.playlistSong.delete({
      where: {
        playlistId_songId: {
          playlistId,
          songId,
        },
      },
    });

    revalidatePath("/");
    return { success: true };
  } catch (error: unknown) {
    return { error, message: "Failed to delete playlist-song association" };
  }
}
