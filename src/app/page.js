import { Box, Stack, Typography } from "@mui/material";

const items = [
  "tomate",
  "potato",
  "onion",
  "garlic",
  "carrot",
  "lettuce",
  "ginger",
  "kale",
];

export default function Home() {
  return (
    <Box className="flex flex-col items-center justify-center relative h-screen">
      <Box className="border border-solid border-black ">
        <Box width={"800px"} height={"100px"} className="bg-[#ADD8E6]">
          <Typography variant={"h2"} className="text-[#333] text-center">
            Pantry Items
          </Typography>
        </Box>
        <Stack width="800px" height="200px" spacing={2} overflow={"auto"}>
          {items.map((i) => (
            <Box
              key={i}
              className="flex items-center justify-center relative h-screen bg-[#f0f0f0]"
            >
              <Typography variant={"h5"} className="text-[#333] text-center">
                {i.charAt(0).toUpperCase() + i.slice(1)}
              </Typography>
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  );
}
