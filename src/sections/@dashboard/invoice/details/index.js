import PropTypes from 'prop-types';
// @mui
import { styled, useTheme } from '@mui/material/styles';
import {
  Box,
  Card,
  Grid,
  Table,
  Divider,
  TableRow,
  TableBody,
  TableHead,
  TableCell,
  Typography,
  TableContainer,
} from '@mui/material';
// utils
import { fDate } from '../../../../utils/formatTime';
import { fCurrency } from '../../../../utils/formatNumber';
// components
import Label from '../../../../components/Label';
import Image from '../../../../components/Image';
import Scrollbar from '../../../../components/Scrollbar';
//
import InvoiceToolbar from './InvoiceToolbar';
import { useParams } from 'react-router';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from 'src/config';
import { useEffect, useState } from 'react';

// ----------------------------------------------------------------------

const RowResultStyle = styled(TableRow)(({ theme }) => ({
  '& td': {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
}));

// ----------------------------------------------------------------------

InvoiceDetails.propTypes = {
  invoice: PropTypes.object.isRequired,
};

export default function InvoiceDetails({ invoice }) {
  
  const theme = useTheme();

  if (!invoice) {
    return null;
  }

  const {
    items,
    taxes,
    status,
    logs,
    dueDate,
    discount,
    treeQuantity,
    growersNumber,
    invoiceTo,
    user,
    email,
    totalAmount,
    createDate,
    totalPrice,
    amount,
    invoiceFrom,
    invoiceNumber,
    buyerName,
    userID,
    purchaseDate,
    treeName,
    growerName,
    phoneNumber,
    subTotalPrice,
  } = invoice;

  

  return (
    <>
       <InvoiceToolbar invoice={invoice} />

      <Card sx={{ pt: 5, px: 5 }}>
        <Grid container>
          <Grid item xs={12} sm={6} sx={{ mb: 5 }}>
            <Typography variant="h1">Sygen</Typography>
          </Grid>

          <Grid item xs={12} sm={6} sx={{ mb: 5 }}>
            <Box sx={{ textAlign: { sm: 'right' } }}>
              <Label
                variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
                color={
                  (status === 'Sold' && 'success') ||
                  (status === 'Donated' && 'warning') ||
                  (status === 'overdue' && 'error') ||
                  'default'
                }
                sx={{ textTransform: 'uppercase', mb: 1 }}
              >
                {status}
              </Label>

              <Typography variant="h6">{`INV-${userID}`}</Typography>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} sx={{ mb: 5 }}>
            <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
              Invoice from
            </Typography>
            <Typography variant="body2">{buyerName}</Typography>
            <Typography variant="body2">{}</Typography>
            <Typography variant="body2">Phone: {phoneNumber}</Typography>
          </Grid>
          <Grid item xs={12} sm={6} sx={{ mb: 5 }}>
            <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
              Invoice to
            </Typography>
            <Typography variant="body2">{growerName}</Typography>
            <Typography variant="body2">{}</Typography>
            <Typography variant="body2">Phone: {growersNumber}</Typography>
          </Grid>

          

          <Grid item xs={12} sm={6} sx={{ mb: 5 }}>
            <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
              Itemns
            </Typography>
            <Typography variant="body2" sx={{ color: "text.disabled" }}>Tree Name: {treeName}</Typography>
            <Typography variant="body2" sx={{ color: "text.disabled" }}>Quantity: {treeQuantity}</Typography>
          </Grid>

          <Grid item xs={12} sm={6} sx={{ mb: 5 }}>
            <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
              Total
            </Typography>
            <Typography variant="body2">{amount * treeQuantity}</Typography>
          </Grid>
        </Grid>

        <Divider />

        <Divider sx={{ mt: 5 }} />

        <Grid container>
          <Grid item xs={12} md={9} sx={{ py: 3 }}>
            <Typography variant="subtitle2">NOTES</Typography>
            <Typography variant="body2">
              Note this invoice cant be updated after it has been created.
            </Typography>
          </Grid>
          <Grid item xs={12} md={3} sx={{ py: 3, textAlign: 'right' }}>
            <Typography variant="subtitle2">Have a Question?</Typography>
            <Typography variant="body2">support@sygen.com</Typography>
          </Grid>
        </Grid>
      </Card>
    </>
  );
}
