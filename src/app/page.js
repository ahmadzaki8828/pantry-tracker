"use client";

import {
  Box,
  Stack,
  Typography,
  Button,
  Modal,
  TextField,
} from "@mui/material";
import {
  Firestore,
  doc,
  getDocs,
  query,
  setDoc,
  deleteDoc,
  count,
} from "firebase/firestore";
import { collection } from "firebase/firestore";
import { useEffect, useState } from "react";
import { firestore } from "../../firebase";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  gap: 3,
};

export default function Home() {
  const [pantry, setPantry] = useState([]);
  const [itemName, setItemName] = useState("");
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const updatePantry = async () => {
    const snapshot = query(collection(firestore, "pantry"));
    const docs = await getDocs(snapshot);
    const pantryList = [];
    docs.forEach((doc) => {
      pantryList.push(doc.id);
    });
    setPantry(pantryList);
    console.log(pantryList);
  };

  useEffect(() => {
    updatePantry();
  }, []);

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, "pantry"), item);
    await setDoc(docRef, { count: 1 });
    await updatePantry();
  };

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, "pantry"), item);
    await deleteDoc(docRef);
    await updatePantry();
  };

  return (
    <Box
      gap={2}
      className="flex flex-col items-center justify-center relative h-screen"
    >
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography
            className="pb-3 text-center"
            id="modal-modal-title"
            variant="h6"
            component="h2"
          >
            Add Item
          </Typography>
          <Stack width={"100%"} direction={"row"} spacing={2}>
            <TextField
              id="outlined-basic"
              label="Item"
              variant="outlined"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              fullWidth
            />
            <Button
              variant="contained"
              onClick={() => {
                addItem(itemName);
                setItemName("");
                handleClose();
              }}
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>
      <Button onClick={handleOpen} variant="contained">
        Add Item
      </Button>
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
              width={"100%"}
              minHeight={"100px"}
              display={"flex"}
              justifyContent={"space-between"}
              alignItems={"center"}
              padding={2}
              bgcolor={"#f0f0f0"}
            >
              <Typography variant={"h5"} className="text-[#333] text-center">
                {i.charAt(0).toUpperCase() + i.slice(1)}
              </Typography>
              <Button variant="contained" onClick={() => removeItem(i)}>
                Remove
              </Button>
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  );
}
