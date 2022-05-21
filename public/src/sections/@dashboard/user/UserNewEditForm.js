import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
// form
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import {
  addDoc,
  collection,
  getDoc,
  getDocs,
  onSnapshot,
  Timestamp,
} from "firebase/firestore";
import { db, storage } from "src/config";

import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { LoadingButton } from '@mui/lab';
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
// utils
import { fData } from '../../../utils/formatNumber';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';

import Iconify from "../../../components/Iconify";
// _mock
import { countries } from '../../../_mock';
// components
import Label from '../../../components/Label';
import { FormProvider, RHFSelect, RHFSwitch, RHFTextField, RHFUploadAvatar } from '../../../components/hook-form';

// ----------------------------------------------------------------------

UserNewEditForm.propTypes = {
  isEdit: PropTypes.bool,
  currentUser: PropTypes.object,
};

export default function UserNewEditForm({ isEdit, currentUser }) {

  const [inputFields, setInputFields] = useState([
    { treeId: "", quantityLeft: "" },
  ]);
  const [growers, setGrowers] = useState([]);
  const [trees, setTrees] = useState([]);
  const growersCollectionRefFetch = collection(db, "growers");
  const treeCollectionRef = collection(db, "trees");


  useEffect(() => {
    const getGrowers = async () => {
      const data = await getDocs(growersCollectionRef);
      setGrowers(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };
    getGrowers();
  }, []);

  useEffect(() => {
    const getTrees = async () => {
      const data = await getDocs(treeCollectionRef);
      setTrees(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };
    getTrees();
  }, []);

  const growersCollectionRef = collection(db, "locations");

  const [newTitle, setFullName] = useState("");
  const [newEmail, setEmail] = useState("");
  const [newLocation, setLocation] = useState("");
  const [newShowInApp, setShowInApp] = useState("");
  const [newPhone, setPhone] = useState("");
  const [newImage, setImage] = useState("");
  const [treeId, setNewGrowerTreeId] = useState("");
  const [quantityLeft, setnewGrowerTreeQuantity] = useState(0);

  const [formData, setFormData] = useState({
    Image: "",
  });

  const [progress, setProgress] = useState(0);
  const handleImageChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  
  const handleAddFields = () => {
    setInputFields([...inputFields, { treeId: '', quantityLeft: 0 }])
  }

  const handleRemoveFields = (index) => {
    const values = [...inputFields]
    values.splice(index, 1)
    setInputFields(values)
  }
  const [age, setAge] = useState("");

  const handleChange = (event) => {
    setAge(event.target.value);
  };

  const handleChangev = (event) => {
    setShowInApp(event.target.value);
  };

  const handleChangeInput = (index, event) => {
    const values = [...inputFields]
    values[index][event.target.name] = event.target.value
    setInputFields(values)
  }

  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();

  const NewUserSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    email: Yup.string().required('Email is required').email(),
    phoneNumber: Yup.string().required('Phone number is required'),
    
    avatarUrl: Yup.mixed().test('required', 'Avatar is required', (value) => value !== ''),
  });

  const defaultValues = useMemo(
    () => ({
      name: currentUser?.name || '',
      email: currentUser?.email || '',
      phoneNumber: currentUser?.phoneNumber || '',
      address: currentUser?.address || '',
      country: currentUser?.country || '',
      state: currentUser?.state || '',
      city: currentUser?.city || '',
      zipCode: currentUser?.zipCode || '',
      avatarUrl: currentUser?.avatarUrl || '',
      isVerified: currentUser?.isVerified || true,
      status: currentUser?.status,
      company: currentUser?.company || '',
      role: currentUser?.role || '',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentUser]
  );

  const methods = useForm({
    resolver: yupResolver(NewUserSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    control,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  useEffect(() => {
    if (isEdit && currentUser) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, currentUser]);
  console.log(watch.avatarUrl);

  const onSubmit = async () => {

    const storageRef = ref(
      storage,
      `/growers/${Date.now()}${values.avatarUrl}`
    );
    const uploadImage = uploadBytesResumable(storageRef, values.avatarUrl);

    uploadImage.on(
      "state_changed",
      (snapshot) => {
        const progressPercent = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(progressPercent);
        console.log(progress)
      },
      (err) => {
        console.log(err);
      },
      () => {
        
        const growersTrees = {};

        getDownloadURL(uploadImage.snapshot.ref).then((url) => {
          const newImage = url;
          const growerRef = collection(db, "growers");
          addDoc(growerRef, {
            fullName: values.name,
            locationID: values.country,
            showInApp: values.isVerified,
            phone: values.phoneNumber,
            email: values.email,
            growerImage: newImage,
            growersTrees: inputFields,
            createdAt: Timestamp.now().toDate(),
          })
          .then(() => {
            new Promise((resolve) => setTimeout(resolve, 500))
              reset();
              enqueueSnackbar('Post success!');
              navigate(PATH_DASHBOARD.blog.posts);
            
          })

          .catch((err) => {
            alert(
              "There was An Error When Add The Grower Check Your Internet Or Contact Sygen"
            );
          });
        });
      }
    );
    
  };

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];

      if (file) {
        setValue(
          'avatarUrl',
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        );
      }
    },
    [setValue]
  );

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ py: 10, px: 3 }}>
            {isEdit && (
              <Label
                color={values.status !== 'active' ? 'error' : 'success'}
                sx={{ textTransform: 'uppercase', position: 'absolute', top: 24, right: 24 }}
              >
                {values.status}
              </Label>
            )}

            <Box sx={{ mb: 5 }}>
              <RHFUploadAvatar
                name="avatarUrl"
                accept="image/*"
                maxSize={3145728}
                onDrop={handleDrop}
                helperText={
                  <Typography
                    variant="caption"
                    sx={{
                      mt: 2,
                      mx: 'auto',
                      display: 'block',
                      textAlign: 'center',
                      color: 'text.secondary',
                    }}
                  >
                    Allowed *.jpeg, *.jpg, *.png, *.gif
                    <br /> max size of {fData(3145728)}
                  </Typography>
                }
              />
            </Box>

            {isEdit && (
              <FormControlLabel
                labelPlacement="start"
                control={
                  <Controller
                    name="status"
                    control={control}
                    render={({ field }) => (
                      <Switch
                        {...field}
                        checked={field.value !== 'active'}
                        onChange={(event) => field.onChange(event.target.checked ? 'banned' : 'active')}
                      />
                    )}
                  />
                }
                label={
                  <>
                    <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                      Banned
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Apply disable account
                    </Typography>
                  </>
                }
                sx={{ mx: 0, mb: 3, width: 1, justifyContent: 'space-between' }}
              />
            )}

            <RHFSwitch
              name="isVerified"
              labelPlacement="start"
              label={
                <>
                  <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                    Show In App
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Disabling this will automatically send the grower an email
                  </Typography>
                </>
              }
              sx={{ mx: 0, width: 1, justifyContent: 'space-between' }}
            />
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Box
              sx={{
                display: 'grid',
                columnGap: 2,
                rowGap: 3,
                gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
              }}
            >
              <RHFTextField name="name" label="Full Name" />
              <RHFTextField name="email" label="Email Address" />
              <RHFTextField name="phoneNumber" label="Phone Number" />

              <RHFSelect name="country" label="Location" placeholder="Location">
                <option value="" />
                {growers.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.district}
                  </option>
                ))}
              </RHFSelect>

              <RHFTextField name="state" label="State/Region" />
              
            </Box>
            <Box sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ color: "text.disabled", mb: 3 }}>
              Add Tree:
            </Typography>

            <Stack
              divider={<Divider flexItem sx={{ borderStyle: "dashed" }} />}
              spacing={3}
            >
              {inputFields.map((inputField, index) => (
                <Stack key={index} alignItems="flex-end" spacing={1.5}>
                  <Stack
                    direction={{ xs: "column", md: "row" }}
                    spacing={2}
                    sx={{ width: 1 }}
                  >
                    <FormControl>
                      <InputLabel id="demo-simple-select-label">
                        Trees
                      </InputLabel>
                      <Select
                        name="treeId"
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={inputField.treeId}
                        label="Tree"
                        onChange={event => handleChangeInput(index, event)}
                      >
                        {trees.map((tree) => (
                          <MenuItem key={tree.id} value={tree.id}>
                            {tree.treeName}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    <TextField
                      type="number"
                      name="quantityLeft"
                      value={inputField.quantityLeft}
                      onChange={event => handleChangeInput(index, event)}
                      label="Quantity Left"
                    />
                  </Stack>

                  <Button
                    size="small"
                    color="error"
                    startIcon={<Iconify icon="eva:trash-2-outline" />}
                    onClick={() => handleRemoveFields()}
                  >
                    Remove
                  </Button>
                </Stack>
              ))}
            </Stack>

            <Divider sx={{ my: 3, borderStyle: "dashed" }} />

            <Stack
              spacing={2}
              direction={{ xs: "column-reverse", md: "row" }}
              alignItems={{ xs: "flex-start", md: "center" }}
            >
              <Button
                size="small"
                startIcon={<Iconify icon="eva:plus-fill" />}
                sx={{ flexShrink: 0 }}
                onClick={() => handleAddFields()}
              >
                Add new detail
              </Button>

              <Stack
                spacing={2}
                justifyContent="flex-end"
                direction={{ xs: "column", md: "row" }}
                sx={{ width: 1 }}
              ></Stack>
            </Stack>
          </Box>

            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                {!isEdit ? 'Create User' : 'Save Changes'}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
