import {
  Box,
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
import React, { ChangeEvent, useState } from "react";
import { Settings } from "@mui/icons-material";
import SearchIcon from "@mui/icons-material/Search";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import AddIcon from "@mui/icons-material/Add";

const Bibliotheque = ({ songsList, setSongsList }: any) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTag, setSelectedTag] = useState("all");
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [draggedOverIndex, setDraggedOverIndex] = useState<number | null>(null);
  const [selectedSongs, setSelectedSongs] = useState<Record<string, boolean>>(
    {}
  );
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

  const handleDrop = () => {
    if (draggedIndex === null || draggedOverIndex === null) return;
    const newSongs = [...songsList];
    const [draggedItem] = newSongs.splice(draggedIndex, 1);
    newSongs.splice(draggedOverIndex, 0, draggedItem);
    setSongsList(newSongs);

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
    <div className="space-y-4">
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
      <div className="overflow-y-auto h-[420px] no-scrollbar">
        {songsList.map((song: any, index: any) => (
          <Paper
            key={index}
            className=" px-2 py-4 mb-4"
            elevation={1}
            draggable
            //   onDragStart={() => handleDragStart(index)}
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDrop={handleDrop}
            style={{
              backgroundColor: draggedOverIndex === index ? "#f0f4f8" : "white",
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
  );
};

export default Bibliotheque;
