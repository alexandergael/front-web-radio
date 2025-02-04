import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  IconButton,
  InputBase,
  lighten,
  MenuItem,
  Paper,
  Select,
  styled,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import React, { ChangeEvent, useRef, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import { Settings, Upload } from "@mui/icons-material";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";

export interface Song {
  title: string;
  artist: string;
  duration: string;
  tags: string[];
  file: File | null;
  songUrl?: string;
}

interface TabulationProps {
  songsList: Song[];
  setSongsList: React.Dispatch<React.SetStateAction<Song[]>>;
  songsListMesFichier: Song[];
  setSongsListMesFichier: React.Dispatch<React.SetStateAction<Song[]>>;
}

const Tabulation = ({
  songsList,
  setSongsList,
  songsListMesFichier,
  setSongsListMesFichier,
}: TabulationProps) => {
  const [currentTab, setCurrentTab] = useState<string>("bibliothéque");
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

  // Gestionnaire d'upload de fichiers
  const handleFileUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];

      if (!file) return;

      try {
        // Obtenir la durée du fichier
        const duration = await getAudioDuration(file);

        // Ajouter la chanson à la liste
        setSongsListMesFichier((prev) => [
          ...prev,
          {
            title: file.name.replace(".mp3", ""), // Utiliser le nom du fichier comme titre
            artist: "Artiste inconnu", // Par défaut
            duration, // Durée calculée
            tags: ["Nouveau"], // Tag par défaut
            file,
          },
        ]);
      } catch (error) {
        console.error("Erreur lors de la lecture du fichier :", error);
        // Ajouter la chanson avec des valeurs par défaut en cas d'erreur
        setSongsListMesFichier((prev) => [
          ...prev,
          {
            title: file.name.replace(".mp3", ""),
            artist: "Artiste inconnu",
            duration: "0:00",
            tags: ["Nouveau"],
            file: null,
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

  const handleDrop = () => {
    if (draggedIndex === null || draggedOverIndex === null) return;
    const newSongs = [...songsList];
    const [draggedItem] = newSongs.splice(draggedIndex, 1);
    newSongs.splice(draggedOverIndex, 0, draggedItem);
    setSongsList(newSongs);

    setDraggedIndex(null);
    setDraggedOverIndex(null);
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

  const tabs = [
    { value: "bibliothéque", label: "Bibliothéque" },
    { value: "mes fichiers", label: "Mes fichiers" },
  ];

  const handleTabsChange = (
    _event: ChangeEvent<object>,
    value: string
  ): void => {
    setCurrentTab(value);
  };
  return (
    <div>
      <TabsContainerWrapper className="dark:text-[#676E76] pb-6">
        <Tabs
          onChange={handleTabsChange}
          value={currentTab}
          variant="scrollable"
          scrollButtons="auto"
          textColor="primary"
          indicatorColor="primary"
        >
          {tabs.map((tab) => (
            <Tab key={tab.value} label={tab.label} value={tab.value} />
          ))}
        </Tabs>
      </TabsContainerWrapper>

      <TabBox mt={2} className="h-[520px]">
        {currentTab === "bibliothéque" && (
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
              {songsList.map((song, index) => (
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
                      {song.tags.map((tag, tagIndex) => (
                        <Box
                          key={tagIndex}
                          className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-lg"
                        >
                          <Typography className="text-[10px]">{tag}</Typography>
                        </Box>
                      ))}
                    </div>
                    <IconButton
                      size="medium"
                      color="info"
                      className="bg-[#e0ebfb]"
                    >
                      <AddIcon fontSize="medium" color="info" />
                    </IconButton>
                  </div>
                </Paper>
              ))}
            </div>
          </div>
        )}

        {currentTab === "mes fichiers" && (
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
                {songsListMesFichier.map((song, index) => (
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
                        {song.tags.map((tag, tagIndex) => (
                          <Box
                            key={tagIndex}
                            className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-lg"
                          >
                            <Typography className="text-[10px]">
                              {tag}
                            </Typography>
                          </Box>
                        ))}
                      </div>
                      <IconButton
                        size="medium"
                        color="info"
                        className="bg-[#e0ebfb]"
                      >
                        <AddIcon fontSize="medium" color="info" />
                      </IconButton>
                    </div>
                  </Paper>
                ))}
              </div>
            </div>
          </div>
        )}
      </TabBox>
    </div>
  );
};

export default Tabulation;

const TabsContainerWrapper = styled(Box)(({ theme }) => ({
  ".MuiTabs-indicator": {
    minHeight: "4px",
    height: "4px",
    boxShadow: "none",
    border: "0",
  },
  ".MuiTab-root": {
    "&.MuiButtonBase-root": {
      padding: 0,
      marginRight: theme.spacing(3),
      fontSize: theme.typography.pxToRem(16),
      color: theme.palette.grey[600],
    },
  },
}));

const TabBox = styled(Box)(
  ({ theme }) => `
            background-color: ${lighten(theme.colors.alpha.black[10], 0.5)};
            margin: ${theme.spacing(2)} 0;
            border-radius: ${theme.general.borderRadius};
            padding: ${theme.spacing(2)};
            height: 520px,
      `
);
