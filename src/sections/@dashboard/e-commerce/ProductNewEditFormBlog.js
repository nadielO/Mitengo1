import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import { useCallback, useEffect, useMemo, useState } from 'react';
// form
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { styled } from '@mui/material/styles';
import { LoadingButton } from '@mui/lab';
import { Grid, Card, Chip, Stack, Button, TextField, Typography, Autocomplete, MenuItem, Divider, FormControl, InputLabel, Select } from '@mui/material';// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
import { useParams, useLocation } from 'react-router-dom';
import ReactPlayer from 'react-player'
import CircularProgress from '@mui/material/CircularProgress';

// components
import {
  FormProvider,
  RHFSwitch,
  RHFSelect,
  RHFEditor,
  RHFTextField,
  RHFRadioGroup,
  RHFUploadMultiFile,
  RHFUploadSingleFile,
} from '../../../components/hook-form';
import { db, storage } from 'src/config';
import { addDoc, collection, doc, getDocs, Timestamp, updateDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { async } from '@firebase/util';

// ----------------------------------------------------------------------

const GENDER_OPTION = [
  { label: 'Men', value: 'Men' },
  { label: 'Women', value: 'Women' },
  { label: 'Kids', value: 'Kids' },
];

const CATEGORY_OPTION = [
  { group: 'Clothing', classify: ['Shirts', 'T-shirts', 'Jeans', 'Leather'] },
  { group: 'Tailored', classify: ['Suits', 'Blazers', 'Trousers', 'Waistcoats'] },
  { group: 'Accessories', classify: ['Shoes', 'Backpacks and bags', 'Bracelets', 'Face masks'] },
];

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

ProductNewEditFormBlog.propTypes = {
  isEdit: PropTypes.bool,
  currentProduct: PropTypes.object,
};

export default function ProductNewEditFormBlog({ isEdit, currentProduct }) {
  const [growers, setGrowers] = useState([]);
  const [ newUrls, setUrls ] = useState(currentProduct?.imagesList || []);
  const [imagesListt, setImagesListt] = useState([]);
  const growersCollectionRef = collection(db, "locations");


  useEffect(() => {
    const getGrowers = async () => {
      const data = await getDocs(growersCollectionRef);
      setGrowers(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };
    getGrowers();
  }, []);
  const { id } = useParams();

  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();

  const NewProductSchema = Yup.object().shape({
    
  });

  const defaultValues = useMemo(
    () => ({
        title: currentProduct?.title || '',
        country: currentProduct?.locationID || "",
        images: currentProduct?.imagesList || [],
        description: currentProduct?.description || '',
        youTubeLink: currentProduct?.youTubeLink || [],
        cover: currentProduct?.galleryImage || '',
        publish: currentProduct?.showInApp || true,
        price: currentProduct?.price || 0,
        priceSale: currentProduct?.treePrice || 0,
        tags: currentProduct?.tags || [TAGS_OPTION[0]],
        inStock: currentProduct?.showInApp || true,
        taxes: true,
        gender: currentProduct?.gender || GENDER_OPTION[2].value,
        category: currentProduct?.category || CATEGORY_OPTION[0].classify[1],
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentProduct]
  );

  const methods = useForm({
    resolver: yupResolver(NewProductSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    control,
    setValue,
    getValues,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();
  const [newLocation, setLocation] = useState(currentProduct?.locationID || "");
  console.log(currentProduct?.imagesList)
  useEffect(() => {
    if (isEdit && currentProduct) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, currentProduct]);
  const [intPrice, setIntPrice] = useState("")

  useEffect(() => {
    const priceTree = async () => {
      const realPrice = parseInt(values.priceSale)
      setIntPrice(realPrice)
    }
    priceTree()
  },[values.priceSale])

  console.log(values.priceSale)

  const [progress, setProgress] = useState(0);
  console.log(values.cover)

  //sdedwdwqdwdwqd

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

  const [ files, setFiles ] = useState("")

  const changeHandler = (event) => {
    setFiles(event.target.files);
   };

  console.log(files)


  
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
    [setValue.imagesList]
  );

  const handleRemoveAll = () => {
    setValue('images', []);
  };

  const handleRemove = (file) => {
    const filteredItems = values.images?.filter((_file) => _file !== file);
    setValue('images', filteredItems);
  };

  useEffect(() => {
    setImagesListt(values.images);
  })

  const uploadFiles = (files) => {
    const promises = []
    if (files) {}
    imagesListt.map((file) => {

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

const onSubmit = async () => {
    
  const userCollectionRef = doc(db, "gallery", id)
  
         await updateDoc(userCollectionRef, {
          title: values.title,
          description: values.description,
          showInApp: values.publish,
          youTubeLink: values.youTubeLink,
          locationID: values.country,
        })
          .then(() => {
            new Promise((resolve) => setTimeout(resolve, 500))
            reset();
            enqueueSnackbar('Updated success!');
            navigate(PATH_DASHBOARD.gallery.posts);

          })

          .catch((err) => {
            alert(
              "There was An Error When Add The Grower Check Your Internet Or Contact Sygen"
            );
          });

};

const [ uploadWaitingList, setUploadWaitingList ] = useState([])


console.log(newUrls)

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={3}>
                <RHFTextField name="title" label="Post Title" />

                <RHFTextField name="description" label="Description" multiline rows={3} />

                <div>
                
                {!isEdit ? <div>
                        <LabelStyle>Cover</LabelStyle>
                        <RHFUploadSingleFile handleImageChange name="cover" accept="image/*" maxSize={3145728} onDrop={handleDrop} />
                    </div> :
                
                <RHFUploadMultiFile
                name="images"
                accept="image/*"
                maxSize={9145728}
                onDrop={handleDropImages}
                onChange={changeHandler}
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

                <RHFSelect name="country" label="Location" placeholder="Location">
                <option value="" />
                {growers.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.district}
                  </option>
                ))}
              </RHFSelect>
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
  );
}
