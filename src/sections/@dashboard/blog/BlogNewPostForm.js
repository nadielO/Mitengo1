import * as Yup from 'yup';
import { useCallback, useEffect, useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';

import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
// form
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, Controller } from 'react-hook-form';
// @mui
import { LoadingButton } from '@mui/lab';
import { styled } from '@mui/material/styles';
import { Grid, Card, Chip, Stack, Button, TextField, Typography, Autocomplete, MenuItem, Divider, FormControl, InputLabel, Select } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import { RHFSwitch, RHFEditor, FormProvider, RHFTextField, RHFUploadSingleFile, RHFSelect, RHFUploadMultiFile } from '../../../components/hook-form';
//
import BlogNewPostPreview from './BlogNewPostPreview';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { db, storage } from 'src/config';
import { addDoc, collection, getDocs, Timestamp } from 'firebase/firestore';
import ReactPlayer from 'react-player'

// ----------------------------------------------------------------------

const TAGS_OPTION = [
  'Toy Story 3',
  'Logan',
  'Full Metal Jacket',
  'Dangal',
  'The Sting',
  '2001: A Space Odyssey',
  "Singin' in the Rain",
  'Toy Story',
  'Bicycle Thieves',
  'The Kid',
  'Inglourious Basterds',
  'Snatch',
  '3 Idiots',
];

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1),
}));

// ----------------------------------------------------------------------

export default function BlogNewPostForm() {

  const [growers, setGrowers] = useState([]);
  const [ newUrls, setUrls ] = useState([]);
  const [imagesList, setImagesList] = useState([]);
  const growersCollectionRef = collection(db, "locations");


  useEffect(() => {
    const getGrowers = async () => {
      const data = await getDocs(growersCollectionRef);
      setGrowers(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };
    getGrowers();
  }, []);

  const navigate = useNavigate();

  const [open, setOpen] = useState(false);

  const { enqueueSnackbar } = useSnackbar();

  const handleOpenPreview = () => {
    setOpen(true);
  };

  const handleClosePreview = () => {
    setOpen(false);
  };

  const NewBlogSchema = Yup.object().shape({
    title: Yup.string().required('Title is required'),
    description: Yup.string().required('Description is required'),
    cover: Yup.mixed().required('Cover is required'),
  });

  const defaultValues = {
    title: '',
    description: '',
    youTubeLink: '',
    content: '',
    images: [],
    cover: null,
    tags: ['Logan'],
    publish: true,
    comments: true,
    metaTitle: '',
    metaDescription: '',
    metaKeywords: ['Logan'],
  };

  const methods = useForm({
    resolver: yupResolver(NewBlogSchema),
    defaultValues,
  });
  const [newLocation, setLocation] = useState("");

  const {
    reset,
    watch,
    control,
    setValue,
    handleSubmit,
    formState: { isSubmitting, isValid },
  } = methods;

  const values = watch();
  const [progress, setProgress] = useState(0)
  const onSubmit = async () => {
    const storageRef = ref(
      storage,
      `/gallery/${Date.now()}${values.cover}`
    );
    const uploadImage = uploadBytesResumable(storageRef, values.cover);

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
          const growerRef = collection(db, "gallery");

          addDoc(growerRef, {
            title: values.title,
            locationID: newLocation,
            description: values.description,
            showInApp: values.publish,
            galleryImage: newImage,
            imagesList: newUrls,
            youTubeLink: values.youTubeLink,
            createdAt: Timestamp.now().toDate(),
          })
            .then(() => {
              new Promise((resolve) => setTimeout(resolve, 500))
                reset();
                handleClosePreview();
                enqueueSnackbar('Post success!');
                navigate(PATH_DASHBOARD.gallery.posts);
              
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
  const [formData, setFormData] = useState({

    Image: "",

  })
  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];

      if (file) {
        setValue(
          'cover',
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        );
      }
    },
    [setValue]
  );
  const handleImageChange = (e) => {
    setFormData({ ...formData, cover: e.target.files[0] })
  }

  
  const handleDropImages = useCallback(
    (acceptedFiles) => {
      const images = values.images || [];

      setValue('images', [
        ...images,
        ...acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        ),
      ]);
    },
    [setValue, values.images]
  );

  const handleRemoveAll = () => {
    setValue('images', []);
  };

  const handleRemove = (file) => {
    const filteredItems = values.images?.filter((_file) => _file !== file);
    setValue('images', filteredItems);
  };

  useEffect(() => {
    setImagesList(values.images);
  })

  const uploadFiles = (files) => {
    const promises = []
    imagesList.map((file) => {
        console.log('loop');

        const sotrageRef = ref(storage, `files/${file.name}`);

        const uploadTask = uploadBytesResumable(sotrageRef, file);
        promises.push(uploadTask)
        uploadTask.on(
            "state_changed",
            (snapshot) => {
                const prog = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                );
                setProgress(prog);
            },
            (error) => console.log(error),
            async () => {
                await getDownloadURL(uploadTask.snapshot.ref).then((downloadURLs) => {
                    setUrls(prevState => [...prevState, downloadURLs])
                    console.log("File available at", downloadURLs);
                });
            }
        );


    })
    Promise.all(promises)
        .then(() => alert('All images uploaded'))
        .then(err => console.log(err))
        .then(() => setProgress(0))

};

const hyandleUploadImages = () => { uploadFiles() }



  return (
    <>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={3}>
                <RHFTextField name="title" label="Post Title" />

                <RHFTextField name="description" label="Description" multiline rows={3} />

                

                <div>
                  <LabelStyle>Cover</LabelStyle>
                  <RHFUploadSingleFile handleImageChange name="cover" accept="image/*" maxSize={3145728} onDrop={handleDrop} />
                </div>
                <div>
                
                {!values.cover ? <div></div> : 
                
                <RHFUploadMultiFile
                showPreview
                name="images"
                accept="image/*"
                maxSize={9145728}
                onDrop={handleDropImages}
                onRemove={handleRemove}
                onRemoveAll={handleRemoveAll}
                onUpload={hyandleUploadImages}
              />
                }
                
              </div>
              <ReactPlayer url={values.youTubeLink} />
              </Stack>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={3}>
                <div>
                  <RHFSwitch
                    name="publish"
                    label="Publish"
                    labelPlacement="start"
                    sx={{ mb: 1, mx: 0, width: 1, justifyContent: 'space-between' }}
                  />

                 
                </div>

                <FormControl>
              <InputLabel id="demo-simple-select-label">Location</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={newLocation}
                label="Age"
                onChange={(event) => {
                  setLocation(event.target.value);
                }}
              >
                {growers.map((grower) => (
                  <MenuItem key={grower.id} value={grower.id}>
                    {grower.district}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <RHFTextField name="youTubeLink" label="Vidoe Link" />

                
              </Stack>
              
            </Card>

            <Stack direction="row" spacing={1.5} sx={{ mt: 3 }}>
            
            {progress === 0 ? <LoadingButton fullWidth type="submit" variant="contained" size="large" loading={isSubmitting}>
                Post
              </LoadingButton> : (
             <CircularProgress disableShrink />
           
          )}
              
              
            </Stack>
          </Grid>
        </Grid>
      </FormProvider>

      <BlogNewPostPreview
        values={values}
        isOpen={open}
        isValid={isValid}
        isSubmitting={isSubmitting}
        onClose={handleClosePreview}
        onSubmit={handleSubmit(onSubmit)}
      />
    </>
  );
}
