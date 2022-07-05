import PropTypes from 'prop-types';
import { useState } from 'react';
// @mui
import { useTheme } from '@mui/material/styles';
import { Checkbox, TableRow, TableCell, Typography, Stack, Link, MenuItem } from '@mui/material';
// utils
import { fDate } from '../../../../utils/formatTime';
import createAvatar from '../../../../utils/createAvatar';
import { fCurrency } from '../../../../utils/formatNumber';
// components
import Label from '../../../../components/Label';
import Avatar from '../../../../components/Avatar';
import Iconify from '../../../../components/Iconify';
import { TableMoreMenu } from '../../../../components/table';
import {sentenceCase} from "change-case";

// ----------------------------------------------------------------------

InvoiceTableRowCopy.propTypes = {
  row: PropTypes.object.isRequired,
  selected: PropTypes.bool,
  onSelectRow: PropTypes.func,
  onViewRow: PropTypes.func,
  onEditRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
};

export default function InvoiceTableRowCopy({ row, selected, onSelectRow, onViewRow, onEditRow, onDeleteRow }) {
  const theme = useTheme();

  const { sent, id, buyerName,treeQuantity, amount, timestamp, paid, status, userID, totalCost } = row;

  const [openMenu, setOpenMenuActions] = useState(null);

  const handleOpenMenu = (event) => {
    setOpenMenuActions(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpenMenuActions(null);
  };

  return (
    <TableRow hover selected={selected}>
        <TableCell padding="checkbox">

        </TableCell>
      <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
        <Avatar alt={userID} color={createAvatar(userID).color} sx={{ mr: 2 }}>
          {createAvatar(userID).name}
        </Avatar>

        <Stack>
            <Typography variant="subtitle2" noWrap>
            {userID}
            </Typography>
            <Link noWrap variant="body2" onClick={onViewRow} sx={{ color: 'text.disabled', cursor: 'pointer' }}>
                click For Invoice
            </Link>
        </Stack>
      </TableCell>

      <TableCell align="left">{timestamp.toDate().toDateString()}</TableCell>



      <TableCell align="left">{fCurrency(amount * treeQuantity)}</TableCell>
      <TableCell align="left">{status}</TableCell>
      <TableCell align="left">
          <Label
              variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
              color={
                  (paid === false && 'error') || (paid === true && 'success') || 'success'
              }
              sx={{ textTransform: 'capitalize' }}
          >
              {paid ? "paid" : "not paid"}
          </Label>
      </TableCell>





      <TableCell align="left">
        <TableMoreMenu
          open={openMenu}
          onOpen={handleOpenMenu}
          onClose={handleCloseMenu}
          actions={
            <>
                <MenuItem
                    onClick={() => {
                        onEditRow();
                        handleCloseMenu();
                    }}
                >
                    <Iconify icon={'eva:edit-fill'} />

                    {paid ? "Not Paid" : "Paid"}
                </MenuItem>
              <MenuItem
                onClick={() => {
                  onDeleteRow();
                  handleCloseMenu();
                }}
                sx={{ color: 'error.main' }}
              >
                <Iconify icon={'eva:trash-2-outline'} />
                Delete
              </MenuItem>



            </>
          }
        />
      </TableCell>
    </TableRow>
  );
}
