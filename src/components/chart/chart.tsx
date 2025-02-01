"use client";

import * as React from "react";
import { PieChart } from "@mui/x-charts/PieChart";
import { useDrawingArea } from "@mui/x-charts/hooks";
import { styled } from "@mui/material/styles";

const data = [
  { value: 10, label: "A" },
  { value: 10, label: "B" },
];

const size = {
  width: 300,
  height: 300,
};

const StyledText = styled("text")(({ theme }) => ({
  fill: theme.palette.text.primary,
  textAnchor: "middle",
  dominantBaseline: "central",
  fontSize: 20,
  textAlign: "center",
}));

function PieCenterLabel({ children }: { children: React.ReactNode }) {
  const { width, height, left, top } = useDrawingArea();
  return (
    <StyledText x={left + width / 2} y={top + height / 2}>
      {children}
    </StyledText>
  );
}

export default function PieChartWithCenterLabel() {
  return (
    <div className="h-auto w-auto flex justify-center items-center">
      <PieChart
        series={[{ data, innerRadius: 60, cx: 150, cy: 150 }]}
        {...size}
        slotProps={{
          legend: {
            labelStyle: {
              fontSize: 12,
              fill: "blue",
            },
            direction: "column",
            position: { vertical: "bottom", horizontal: "left" },
            padding: -11,
          },
        }}
      >
        {/* <PieCenterLabel>Image label</PieCenterLabel> */}
      </PieChart>
    </div>
  );
}
