/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRef, useState } from "react";
import { Popover, Typography } from "@mui/material";

const colors = [
  "#FF0000",
  "#00FF00",
  "#0000FF",
  "#FFFF00",
  "#FF00FF",
  "#00FFFF",
  "#FFA500",
  "#800080",
  "#008000",
  "#808080",
  "#65b996",
  "#817d7d",
];

interface DropdownColorProps {
  onColorSelect: (color: string) => void;
  selectedColor: string | null;
}

function DropdownColor({ onColorSelect, selectedColor }: DropdownColorProps) {
  const ref = useRef<any>(null);
  const [isOpen, setOpen] = useState<boolean>(false);

  const handleOpen = (): void => {
    setOpen(true);
  };

  const handleClose = (): void => {
    setOpen(false);
  };

  const handleColorSelect = (color: string) => {
    onColorSelect(color);
    handleClose();
  };

  return (
    <>
      <div
        className="flex items-center justify-center flex-grow gap-2 cursor-pointer w-full border border-gray-200 px-1 py-[8px] rounded-md"
        ref={ref}
        onClick={handleOpen}
        style={{ backgroundColor: selectedColor || "transparent" }}
      >
        <Typography>Couleur</Typography>
      </div>
      <Popover
        className="top-14"
        component={"div"}
        anchorEl={ref.current}
        onClose={handleClose}
        open={isOpen}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <div className="p-4">
          <div className="grid grid-cols-6 gap-2 w-48">
            {colors.map((color) => (
              <button
                key={color}
                className="h-8 w-8 rounded-full border-2 border-gray-200 hover:border-gray-400 transition-all"
                style={{ backgroundColor: color }}
                onClick={() => handleColorSelect(color)}
                title={color}
              />
            ))}
          </div>
        </div>
      </Popover>
    </>
  );
}

export default DropdownColor;
