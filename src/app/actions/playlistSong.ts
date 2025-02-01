import { NextResponse } from "next/server";
import { prisma } from "../../lib/prisma";

// Function to handle errors
const handlePrismaError = (error: any) => {
  console.error("Prisma Error:", error);
  return NextResponse.json(
    { error: "Internal Server Error", details: error.message },
    { status: 500 }
  );
};

// Function to handle successful responses
const handleSuccess = (data: any, status = 200) => {
  return NextResponse.json(data, { status });
};

// POST /api/playlist-songs - Add a song to a playlist
export async function POST(request: Request) {
  try {
    const { playlistId, songId } = await request.json();

    if (!playlistId || !songId) {
      return NextResponse.json(
        { error: "Missing playlistId or songId" },
        { status: 400 }
      );
    }

    const playlist = await prisma.playlist.findUnique({
      where: { id: playlistId },
    });

    if (!playlist) {
      return NextResponse.json(
        { error: "Playlist not found" },
        { status: 404 }
      );
    }

    const song = await prisma.song.findUnique({
      where: { id: songId },
    });

    if (!song) {
      return NextResponse.json({ error: "Song not found" }, { status: 404 });
    }

    // Update the song to associate it with the playlist

    return handleSuccess({
      message: "Song added to playlist successfully",
    });
  } catch (error: any) {
    return handlePrismaError(error);
  }
}

// GET /api/playlist-songs?playlistId= - Get all songs in a playlist
export async function GET(request: Request) {
  try {
    const searchParams = new URL(request.url).searchParams;
    const playlistId = searchParams.get("playlistId");

    if (!playlistId) {
      return NextResponse.json(
        { error: "Missing playlistId" },
        { status: 400 }
      );
    }

    const playlist = await prisma.playlist.findUnique({
      where: { id: parseInt(playlistId) },
      include: { songs: true },
    });

    if (!playlist) {
      return NextResponse.json(
        { error: "Playlist not found" },
        { status: 404 }
      );
    }

    return handleSuccess({ songs: playlist.songs });
  } catch (error: any) {
    return handlePrismaError(error);
  }
}

// DELETE /api/playlist-songs?playlistId=&songId= - Remove a song from a playlist
export async function DELETE(request: Request) {
  try {
    const searchParams = new URL(request.url).searchParams;
    const playlistId = searchParams.get("playlistId");
    const songId = searchParams.get("songId");

    if (!playlistId || !songId) {
      return NextResponse.json(
        { error: "Missing playlistId or songId" },
        { status: 400 }
      );
    }

    const playlist = await prisma.playlist.findUnique({
      where: { id: parseInt(playlistId) },
    });

    if (!playlist) {
      return NextResponse.json(
        { error: "Playlist not found" },
        { status: 404 }
      );
    }

    const song = await prisma.song.findUnique({
      where: { id: parseInt(songId) },
    });

    if (!song) {
      return NextResponse.json({ error: "Song not found" }, { status: 404 });
    }

    return handleSuccess({
      message: "Song removed from playlist successfully",
    });
  } catch (error: any) {
    return handlePrismaError(error);
  }
}
