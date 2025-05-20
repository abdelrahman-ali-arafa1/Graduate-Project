"use client";
import Box from "@mui/material/Box";
import { PieChart } from "@mui/x-charts/PieChart";

// Define platforms data in the same file
const platforms = [
  {
    label: "All",
    value: 59.12,
  },
  {
    label: "Increase",
    value: 40.88,
  },
];

const pieParams = {
    height: 280, // pie size
    margin: { top: 0, bottom: 0, left: 0, right: 0 }, 
    slotProps: { legend: { hidden: true } },
  };

export default function PieColor() {
  return (
    <Box
    sx={{
        border: "5px solid #fff",
        borderRadius:"100%",
        width: "5rem", // تكبير العرض
        height: "5rem", // تكبير الارتفاع
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        "& .css-rbklcn-MuiResponsiveChart-container": { height: "100%" },
      }}
>
      <PieChart
        series={[
          {
            data: platforms.map((item, index) => ({
              ...item,
              color: index === 0 ? "#EAF6ED" : "#67C587", // Example coloring
            })),
          },
        ]}
        {...pieParams}
      />
    </Box>
  );
}
