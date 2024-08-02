"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Stack,
  Typography,
  Button,
  Modal,
  TextField,
  IconButton,
  Drawer,
  AppBar,
  Toolbar,
  InputBase,
} from "@mui/material";
import { styled, alpha } from "@mui/material/styles";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  deleteDoc,
} from "firebase/firestore";
import { firestore } from "../../firebase";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import SearchIcon from "@mui/icons-material/Search";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

const drawerWidth = 240;

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
};

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: "12ch",
      "&:focus": {
        width: "20ch",
      },
    },
  },
}));

export default function Home() {
  const [pantry, setPantry] = useState([]);
  const [itemName, setItemName] = useState("");
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const updatePantry = async () => {
    const snapshot = query(collection(firestore, "pantry"));
    const docs = await getDocs(snapshot);
    const pantryList = [];
    docs.forEach((doc) => {
      pantryList.push({ name: doc.id, ...doc.data() });
    });
    setPantry(pantryList);
  };

  useEffect(() => {
    updatePantry();
  }, []);

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, "pantry"), item);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { count } = docSnap.data();
      await setDoc(docRef, { count: count + 1 });
    } else {
      await setDoc(docRef, { count: 1 });
    }
    await updatePantry();
    handleClose();
    setItemName("");
  };

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, "pantry"), item);
    const docSnap = await getDoc(docRef);
    const { count } = docSnap.data();
    if (count === 1) {
      await deleteDoc(docRef);
    } else {
      await setDoc(docRef, { count: count - 1 });
    }
    await updatePantry();
  };

  const decreaseQuantity = async (item) => {
    const docRef = doc(collection(firestore, "pantry"), item);
    const docSnap = await getDoc(docRef);
    const { count } = docSnap.data();
    if (count === 1) {
      return;
    } else {
      await setDoc(docRef, { count: count - 1 });
    }
    await updatePantry();
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredPantry = pantry.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            Pantry Tracker
          </Typography>
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              inputProps={{ "aria-label": "search" }}
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </Search>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Toolbar />
        <Box sx={{ overflow: "auto" }}>
          <Stack spacing={2} sx={{ p: 2 }}>
            <Button
              onClick={handleOpen}
              variant="contained"
              startIcon={<AddCircleIcon />}
            >
              Add Item
            </Button>
          </Stack>
        </Box>
      </Drawer>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: "background.default",
          p: 3,
          pt: 8,
          minHeight: "100vh",
          backgroundImage: "url(https://source.unsplash.com/random/?pantry)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
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
            <Stack direction="row" spacing={2}>
              <TextField
                label="Item"
                variant="outlined"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                fullWidth
              />
              <Button variant="contained" onClick={() => addItem(itemName)}>
                Add
              </Button>
            </Stack>
          </Box>
        </Modal>

        <Box
          sx={{
            width: "100%",
            bgcolor: "white",
            borderRadius: 2,
            boxShadow: 3,
            overflow: "hidden",
            mt: 2,
            maxHeight: "88vh",
            overflowY: "auto",
          }}
        >
          <Box
            sx={{
              bgcolor: "#1976d2",
              color: "white",
              py: 2,
              textAlign: "center",
            }}
          >
            <Typography variant="h4">Pantry Items</Typography>
          </Box>
          <Stack spacing={2} sx={{ p: 2, overflowY: "auto" }}>
            {filteredPantry.map(({ name, count }) => (
              <Box
                key={name}
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                p={2}
                sx={{ bgcolor: "grey.100", borderRadius: 1, boxShadow: 1 }}
              >
                <Typography variant="h6" sx={{ flex: 1 }}>
                  {name.charAt(0).toUpperCase() + name.slice(1)}
                </Typography>
                <Box
                  display="flex"
                  alignItems="center"
                  sx={{ flex: 1, textAlign: "center" }}
                >
                  <Typography variant="h6" sx={{ mx: 1 }}>
                    Quantity: {count}
                  </Typography>
                  <Stack direction="column" spacing={0} alignItems="center">
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => addItem(name)}
                    >
                      <KeyboardArrowUpIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="secondary"
                      onClick={() => decreaseQuantity(name)}
                    >
                      <KeyboardArrowDownIcon fontSize="small" />
                    </IconButton>
                  </Stack>
                </Box>
                <IconButton
                  color="secondary"
                  onClick={() => removeItem(name)}
                  sx={{ flex: 1, textAlign: "right" }}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            ))}
          </Stack>
        </Box>
      </Box>
    </Box>
  );
}
