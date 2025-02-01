import React, { ChangeEvent, useRef, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import { Settings, Upload } from "@mui/icons-material";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  IconButton,
  InputBase,
  MenuItem,
  Paper,
  Select,
  Typography,
} from "@mui/material";
const MesFichier = ({ songsListMesFichier, setSongsListMesFichier }: any) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTag, setSelectedTag] = useState("all");
  const [selectedSongs, setSelectedSongs] = useState<Record<string, boolean>>(
    {}
  );
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [draggedOverIndex, setDraggedOverIndex] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const getAudioDuration = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const audio = new Audio();
      audio.src = URL.createObjectURL(file);
      audio.onloadedmetadata = () => {
        const durationInSeconds = audio.duration;
        const minutes = Math.floor(durationInSeconds / 60);
        const seconds = Math.floor(durationInSeconds % 60);
        const duration = `${minutes}:${seconds.toString().padStart(2, "0")}`;
        resolve(duration);
      };
    });
  };

  // Gestionnaire d'upload de fichiers
  const handleFileUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;
    const fileArray = Array.from(files);
    for (const file of fileArray) {
      try {
        const duration = await getAudioDuration(file);
        setSongsListMesFichier((prev: any) => [
          ...prev,
          {
            title: file.name.replace(".mp3", ""),
            artist: "Artiste inconnu",
            duration,
            tags: ["Nouveau"],
          },
        ]);
      } catch (error) {
        console.error("Erreur lors de la lecture du fichier :", error);
        setSongsListMesFichier((prev: any) => [
          ...prev,
          {
            title: file.name.replace(".mp3", ""),
            artist: "Artiste inconnu",
            duration: "0:00",
            tags: ["Nouveau"],
          },
        ]);
      }
    }
  };
  const handleDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    index: number
  ) => {
    setDraggedIndex(index);
    e.dataTransfer.setData("text/plain", index.toString());
  };

  const handleDragOver = (
    e: React.DragEvent<HTMLDivElement>,
    index: number
  ) => {
    e.preventDefault();
    setDraggedOverIndex(index);
  };

  const handleDropMesFichier = () => {
    if (draggedIndex === null || draggedOverIndex === null) return;
    const newSongs = [...songsListMesFichier];
    const [draggedItem] = newSongs.splice(draggedIndex, 1);
    newSongs.splice(draggedOverIndex, 0, draggedItem);
    setSongsListMesFichier(newSongs);

    setDraggedIndex(null);
    setDraggedOverIndex(null);
  };

  const handleCheckboxChange =
    (songTitle: string) => (event: ChangeEvent<HTMLInputElement>) => {
      setSelectedSongs((prev) => ({
        ...prev,
        [songTitle]: event.target.checked,
      }));
    };
  return (
    <div>
      <div className="space-y-4">
        <div className="h-12">
          <Button
            className="w-full"
            startIcon={<Upload />}
            variant="outlined"
            onClick={handleUploadClick}
          >
            {" "}
            Ajouter des fichiers
          </Button>
          <input
            type="file"
            accept=".mp3"
            multiple
            ref={fileInputRef}
            onChange={handleFileUpload}
            style={{ display: "none" }}
          />
        </div>
        <div className="flex gap-4 mb-6">
          <Paper className="flex items-center flex-1 " elevation={0}>
            <IconButton>
              <SearchIcon />
            </IconButton>
            <InputBase
              placeholder="Rechercher dans mes fichiers..."
              className="flex-1"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Paper>

          <FormControl variant="outlined" className="min-w-[130px]">
            <Select
              size="small"
              value={selectedTag}
              onChange={(e) => setSelectedTag(e.target.value)}
              displayEmpty
            >
              <MenuItem value="all">Tous les tags</MenuItem>
              <MenuItem value="Pop">Pop</MenuItem>
              <MenuItem value="Danse">Danse</MenuItem>
              <MenuItem value="Électro">Électro</MenuItem>
            </Select>
          </FormControl>
          <IconButton>
            <Settings />
          </IconButton>
        </div>

        {/* Liste des musiques */}
        <div className="overflow-y-auto h-[360px] no-scrollbar">
          {songsListMesFichier.map((song: any, index: any) => (
            <Paper
              key={index}
              className=" px-2 py-4 mb-4"
              elevation={1}
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDrop={handleDropMesFichier}
              style={{
                backgroundColor:
                  draggedOverIndex === index ? "#f0f4f8" : "white",
                cursor: "grab",
                opacity: draggedIndex === index ? 0.5 : 1,
                transition: "all 0.3s ease",
              }}
            >
              <div className="w-full h-full flex items-center justify-between relative">
                <FormControlLabel
                  control={
                    <div className="-space-x-3">
                      <Checkbox
                        checked={!!selectedSongs[song.title]}
                        onChange={handleCheckboxChange(song.title)}
                      />
                      <DragIndicatorIcon
                        style={{ cursor: "grab" }}
                        onMouseDown={(e) => e.stopPropagation()}
                      />
                    </div>
                  }
                  label={
                    <div className="ml-2">
                      <Typography className="font-semibold text-[16px]">
                        {song.title}
                      </Typography>

                      <Typography className="text-[12px]">
                        {song.artist} - {song.duration}
                      </Typography>
                    </div>
                  }
                />

                <div className="flex justify-end gap-2 absolute right-12 -top-2">
                  {song.tags.map((tag: any, tagIndex: any) => (
                    <Box
                      key={tagIndex}
                      className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-lg"
                    >
                      <Typography className="text-[10px]">{tag}</Typography>
                    </Box>
                  ))}
                </div>
                <IconButton size="medium" color="info" className="bg-[#e0ebfb]">
                  <AddIcon fontSize="medium" color="info" />
                </IconButton>
              </div>
            </Paper>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MesFichier;
