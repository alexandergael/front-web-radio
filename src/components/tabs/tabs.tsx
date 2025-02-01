import { Box, lighten, styled, Tab, Tabs } from "@mui/material";
import React, { ChangeEvent, useState } from "react";

import Bibliotheque from "./organisme/bibliotheque";
import MesFichier from "./organisme/mesFichier";

export interface Song {
  title: string;
  artist: string;
  duration: string;
  tags: string[];
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
          <Bibliotheque songsList={songsList} setSongsList={setSongsList} />
        )}
        {currentTab === "mes fichiers" && (
          <MesFichier
            songsListMesFichier={songsListMesFichier}
            setSongsListMesFichier={setSongsListMesFichier}
          />
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
