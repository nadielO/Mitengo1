// form
import { useFormContext, useFieldArray } from 'react-hook-form';
// @mui
import PropTypes from 'prop-types';

import { Box, Stack, Button, Divider, Typography, InputAdornment, MenuItem } from '@mui/material';
// utils
import { fNumber } from '../../../../utils/formatNumber';
// components
import Iconify from '../../../../components/Iconify';
import { RHFSelect, RHFTextField } from '../../../../components/hook-form';
import { useEffect, useState } from 'react';
import { collection, doc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db } from 'src/config';
import { Navigate, useParams } from 'react-router';
import { PATH_DASHBOARD } from 'src/routes/paths';
import { useSnackbar } from 'notistack';

// ----------------------------------------------------------------------

const SERVICE_OPTIONS = [
  'Northern',
  'Southern',
  'Cenral',
];
InvoiceNewEditDetails.propTypes = {
  isEdit: PropTypes.bool,
  currentInvoice: PropTypes.object,
};


export default function InvoiceNewEditDetails({ isEdit, currentInvoice }) {

  const [locations, setLocations] = useState("");
  const [region, setRegion] = useState("");

  const { id } = useParams();

  const [growers, setGrowers] = useState([]);
  const growersCollectionRef = doc(db, "locations", id);

  useEffect(() => {
    onSnapshot(growersCollectionRef, (doc) => {
      setGrowers(doc.data(), doc.id);
    })
    console.log(growers);
  }, [])
  


  

  
  const { control, setValue, watch } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  });

  const values = watch();

  const handleAdd = () => {
    append({
      title: '',
      description: '',
      service: '',
      quantity: '',
      price: '',
      total: '',
    });
  };

  const handleRemove = (index) => {
    remove(index);
  };
  const { enqueueSnackbar } = useSnackbar();


  console.log(region)

  const handleUpdate = () => {
    updateDoc(growersCollectionRef, {
      region: region,
      district: locations,
    })
    enqueueSnackbar('Updated success!');
    Navigate(PATH_DASHBOARD.invoice.list);
  }

  

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ color: 'text.disabled', mb: 3 }}>
        Details:
      </Typography>

      <Stack divider={<Divider flexItem sx={{ borderStyle: 'dashed' }} />} spacing={3}>

          <Stack alignItems="flex-end" spacing={1.5}>
          
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ width: 1 }}>
              <RHFTextField
                size="small"
                name="name"
                placeholder={growers.district}
                label="Title"
                InputLabelProps={{ shrink: true }}
                onChange={(event) => {
                  setLocations(event.target.value);
                }}
              />

              <RHFSelect
                name="region"
                label="Region"
                size="small"
                InputLabelProps={{ shrink: true }}
                
                SelectProps={{ native: false, sx: { textTransform: 'capitalize' } }}
                onChange={(event) => {
                  setRegion(event.target.value);
                }}
                
              >
                <MenuItem
                  value=""
                  sx={{
                    mx: 1,
                    borderRadius: 0.75,
                    typography: 'body2',
                    fontStyle: 'italic',
                    color: 'text.secondary',
                  }}
                >
                  None
                </MenuItem>
                <Divider />
                {SERVICE_OPTIONS.map((option) => (
                  <MenuItem
                    key={option}
                    value={option}
                    sx={{
                      mx: 1,
                      my: 0.5,
                      borderRadius: 0.75,
                      typography: 'body2',
                      textTransform: 'capitalize',
                    }}
                  >
                    {option}
                  </MenuItem>
                ))}
              </RHFSelect>

              
            </Stack>
          
            

            <Divider  />
            <Divider  />
            <Divider  />
          </Stack>
      </Stack>
      <Stack justifyContent="flex-end" direction="row" spacing={2} sx={{ mt: 3 }}>

        <Button
          size="large"
          variant="contained"
          onClick={handleUpdate}
        >
          {isEdit ? 'Update' : 'Create'} & Send
        </Button>
      </Stack>

    </Box>
  );
}
