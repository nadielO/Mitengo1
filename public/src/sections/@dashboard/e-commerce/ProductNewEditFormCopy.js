import PropTypes from "prop-types";
import * as Yup from "yup";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
// form
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
// @mui
import { LoadingButton } from "@mui/lab";
import {
  Box,
  Card,
  Grid,
  Stack,
  Switch,
  Typography,
  Divider,
  FormControlLabel,
  Button,
  TextField,
  Select,
  FormControl,
  InputLabel,
  MenuItem,
} from "@mui/material";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { db, storage } from "src/config";
import { Route, Router, useParams } from "react-router";

import Iconify from "../../../components/Iconify";

// utils
import { fData } from "../../../utils/formatNumber";
// routes
import { PATH_DASHBOARD } from "../../../routes/paths";
// _mock
import { countries } from "../../../_mock";
// components
import Label from "../../../components/Label";
import {
  FormProvider,
  RHFSelect,
  RHFSwitch,
  RHFTextField,
  RHFUploadAvatar,
} from "../../../components/hook-form";
import { values } from "lodash";

// ----------------------------------------------------------------------

UserNewEditForm.propTypes = {
  isEdit: PropTypes.bool,
  currentUser: PropTypes.object,
};

export default function UserNewEditForm({ isEdit, currentUser }) {  
  const { name } = useParams();
  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();

  const [inputFields, setInputFields] = useState([
    { treeId: "", quantityLeft: 0 },
  ]);
  const [growers, setGrowers] = useState([]);
  const [trees, setTrees] = useState([]);
  const growersCollectionRef = doc(db, "trees", name);
  
  const treeCollectionRef = collection(db, "trees");

  const handleEdit = () => {
    if (
      !treeName ||
      !treePrice ||
      !treeDescription ||
      !formData.image
    ) {
      alert("Please Fill The Fields");
      return;
    }
  }

  useEffect(() => {
    onSnapshot(growersCollectionRef, (doc) => {
      setGrowers(doc.data(), doc.id);
    })
    console.log(growers);
  }, [])

  


  const [treeName, setTreeName] = useState("");
  const [treePrice, setTreePrice] = useState(0);
  const [treeDescription, setTreeDescription] = useState("");

  const [formData, setFormData] = useState({
    Image: "",
  });
  const [progress, setProgress] = useState(0);
  const handleImageChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handlePublish = () => {
    if (
      !treeName ||
      !treePrice ||
      !treeDescription ||
      !formData.image
    ) {
      alert("Please Fill The Fields");
      return;
    }

    const storageRef = ref(
      storage,
      `/trees/${Date.now()}${formData.image.name}`
    );
    const uploadImage = uploadBytesResumable(storageRef, formData.image);

    uploadImage.on(
      "state_changed",
      (snapshot) => {
        const progressPercent = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(progressPercent);
      },
      (err) => {
        console.log(err);
      },
      () => {
        

        getDownloadURL(uploadImage.snapshot.ref).then((url) => {
          const newImage = url;
          const growerRef = doc(db, "trees", name);
          let treeIntprice = parseInt(treePrice);
          updateDoc(growerRef, {
            treeName: treeName,
            treePrice: treeIntprice,
            treeDescription: treeDescription,
            image: newImage,
            createdAt: Timestamp.now().toDate(),
          })
          .then(() => {
            alert("Data Added")
            setProgress(0)
          })
         
          .catch(err=>{
            alert("There was An Error When Add The Grower Check Your Internet Or Contact Sygen")
          })
        });
      }
    );
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={4}>
        <Card sx={{ py: 10, px: 3 }}>
          <Box sx={{ mb: 5 }}>
          <TextField
              name="avatarUrl"
              accept="image/*"
              maxSize={3145728}
              type="file"
              onChange={(e) => handleImageChange(e)}
              helperText={
                <Typography
                  variant="caption"
                  sx={{
                    mt: 2,
                    mx: "auto",
                    display: "block",
                    textAlign: "center",
                    color: "text.secondary",
                  }}
                >
                  Allowed *.jpeg, *.jpg, *.png, *.gif
                  <br /> max size of {fData(3145728)}
                </Typography>
              }
            />
          </Box>
        </Card>
      </Grid>

      <Grid item xs={12} md={8}>
        <Card sx={{ p: 3 }}>
          <Box
            sx={{
              display: "grid",
              columnGap: 2,
              rowGap: 3,
              gridTemplateColumns: {
                xs: "repeat(1, 1fr)",
                sm: "repeat(2, 1fr)",
              },
            }}
          >
            <TextField
              onChange={(event) => {
                setTreeName(event.target.value);
              }}
              placeholder={growers.treeName}
              label="Tree Name"
            />
            <TextField
            
              onChange={(event) => {
                setTreePrice(event.target.value);
              }}
              type="number"
              placeholder={growers.treePrice}
              label="Price"
              
            />

            <TextField
              onChange={(event) => {
                setTreeDescription(event.target.value);
              }}
              id="outlined-textarea"
              label="Description"
              placeholder={growers.treeDescription}
              multiline
            />

            
          </Box>
          

          <Stack alignItems="flex-end" sx={{ mt: 3 }}>
            <Button type="submit" onClick={handlePublish}>
              Submit
            </Button>
          </Stack>
        </Card>
      </Grid>
    </Grid>
  );
}
