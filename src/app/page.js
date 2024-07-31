"use client";

import { Box, Stack, Typography } from "@mui/material";
import { Firestore, getDocs, query } from "firebase/firestore";
import { collection } from "firebase/firestore";
import { useEffect, useState } from "react";
import { firestore } from "../../firebase";

export default function Home() {
  const [pantry, setPantry] = useState([]);

  useEffect(() => {
    const updatePantry = async () => {
      const snapshot = query(collection(firestore, "pantry"));
      const docs = getDocs(snapshot);
      const pantryList = [];
      (await docs).forEach((doc) => {
        pantryList.push(doc.id);
        setPantry(pantryList);
      });
      console.log(pantryList);
    };
    updatePantry();
  }, []);
  return (
    <Box className="flex flex-col items-center justify-center relative h-screen">
      <Box className="border border-solid border-black ">
        <Box width={"800px"} height={"100px"} className="bg-[#ADD8E6]">
          <Typography variant={"h2"} className="text-[#333] text-center">
            Pantry Items
          </Typography>
        </Box>
        <Stack width="800px" height="200px" spacing={2} overflow={"auto"}>
          {pantry.map((i) => (
            <Box
              key={i}
              minHeight={"100px"}
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
