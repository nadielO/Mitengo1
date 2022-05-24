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
import { Card, Chip, Grid, Stack, TextField, Typography, Autocomplete, InputAdornment, CircularProgress } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
import { useParams, useLocation } from 'react-router-dom';

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
import { addDoc, collection, doc, Timestamp, updateDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';

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

ProductNewEditForm.propTypes = {
  isEdit: PropTypes.bool,
  currentProduct: PropTypes.object,
};

export default function ProductNewEditForm({ isEdit, currentProduct }) {
  const { name } = useParams();

  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();

  const NewProductSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    description: Yup.string().required('Description is required'),
    priceSale: Yup.number().moreThan(0, 'Price should not be $0.00'),
  });

  const defaultValues = useMemo(
    () => ({
      name: currentProduct?.treeName || '',
      description: currentProduct?.treeDescription || '',
      cover: currentProduct?.image || [],
      code: currentProduct?.code || '',
      sku: currentProduct?.sku || '',
      price: currentProduct?.price || 0,
      priceSale: currentProduct?.treePrice || 0,
      tags: currentProduct?.tags || [TAGS_OPTION[0]],
      inStock: currentProduct?.showInApp || false,
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

  useEffect(() => {
    if (isEdit && currentProduct) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, currentProduct]);

  const [progress, setProgress] = useState(0);
  console.log(values.cover)

  const onSubmit = async () => {
    if (isEdit) {
      const userCollectionRef = doc(db, "trees", name)
      const storageRef = ref(
        storage,
        `/growers/${Date.now()}${values.cover}`
      );
      const uploadImage = uploadBytesResumable(storageRef, values.cover);

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
            updateDoc(userCollectionRef, {
              treeName: values.name,
              treeDescription: values.description,
              showInApp: values.inStock,
              treePrice: values.priceSale,
              createdAt: Timestamp.now().toDate(),
            })
              .then(() => {
                new Promise((resolve) => setTimeout(resolve, 500))
                reset();
                enqueueSnackbar('Updated success!');
                navigate(PATH_DASHBOARD.eCommerce.list);

              })

              .catch((err) => {
                alert(
                  "There was An Error When Add The Grower Check Your Internet Or Contact Sygen"
                );
              });
          });
        }
      );

    }
    if (!isEdit) {
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
              treeName: values.name,
              treeDescription: values.description,
              showInApp: values.inStock,
              treePrice: values.priceSale,
              image: newImage,
              createdAt: Timestamp.now().toDate(),
            })
              .then(() => {
                new Promise((resolve) => setTimeout(resolve, 500))
                reset();
                enqueueSnackbar('Post success!');
                navigate(PATH_DASHBOARD.user.list);

              })

              .catch((err) => {
                alert(
                  "There was An Error When Add The Grower Check Your Internet Or Contact Sygen"
                );
              });
          });
        }
      );
    }
  };

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
    [setValue, values.cover]
  ); 

  const handleRemoveAll = () => {
    setValue('images', []);
  };

  const handleRemove = (file) => {
    const filteredItems = values.images?.filter((_file) => _file !== file);
    setValue('images', filteredItems);
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Stack spacing={3}>
              <RHFTextField name="name" label="Product Name" />

              <div>
                <LabelStyle>Description</LabelStyle>
                <RHFEditor simple name="description" />
              </div>

              {isEdit && (
                <div>
                <LabelStyle>Images</LabelStyle>
                <RHFUploadSingleFile name="cover" accept="image/*" maxSize={3145728} onDrop={handleDrop} />
              </div>
              )}
              
            </Stack>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Stack spacing={3}>
            <Card sx={{ p: 3 }}>
              <RHFSwitch name="inStock" label="Show In App" />

              
            </Card>

            <Card sx={{ p: 3 }}>
              <Stack spacing={3} mb={2}>
                

                <RHFTextField
                  name="priceSale"
                  label="Sale Price"
                  placeholder="0.00"
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">K</InputAdornment>,
                    type: 'number',
                  }}
                />
              </Stack>

              <RHFSwitch name="taxes" label="Price includes taxes" />
            </Card>
            {progress === 0 ? <LoadingButton type="submit" variant="contained" size="large" loading={isSubmitting}>
              {!isEdit ? 'Create Product' : 'Save Changes'}
            </LoadingButton> : (
             <CircularProgress disableShrink />
           
          )}
            
          </Stack>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
