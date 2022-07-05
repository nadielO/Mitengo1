import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
// form
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
// @mui
import { Stack, Card } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import { FormProvider, RHFTextField } from '../../../../components/hook-form';
import {getAuth, updatePassword} from "firebase/auth";
import {initializeApp} from "firebase/app";
import {FIREBASE_API} from "../../../../config";
import {current} from "@reduxjs/toolkit";

// ----------------------------------------------------------------------

export default function AccountChangePassword() {
  const firebaseApp = initializeApp(FIREBASE_API);
  const { enqueueSnackbar } = useSnackbar();

  const ChangePassWordSchema = Yup.object().shape({

    newPassword: Yup.string().min(6, 'Password must be at least 6 characters').required('New Password is required'),
    confirmNewPassword: Yup.string().oneOf([Yup.ref('newPassword'), null], 'Passwords must match'),
  });

  const defaultValues = {
    oldPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  };

  const methods = useForm({
    resolver: yupResolver(ChangePassWordSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    handleSubmit,
    setValue,
    formState: { isSubmitting },
  } = methods;

  const values = watch()
  const auth = getAuth(firebaseApp);
  const newPassword = values.newPassword;
  const onSubmit = async () => {

    const user = auth.currentUser;
    await updatePassword(user, newPassword).then(() => {
      enqueueSnackbar('success!');
      reset()
    }).catch((error) => {
      enqueueSnackbar(error);
      alert("please logout and login again")
      // An error ocurred
      // ...
    });
  };
  console.log(newPassword)

  return (
    <Card sx={{ p: 3 }}>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={3} alignItems="flex-end">


          <RHFTextField name="newPassword" type="password" label="New Password" />

          <RHFTextField name="confirmNewPassword" type="password" label="Confirm New Password" />

          <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
            Save Changes
          </LoadingButton>
        </Stack>
      </FormProvider>
    </Card>
  );
}
