import PropTypes from 'prop-types';
import { useState } from 'react';
// @mui
import { useTheme } from '@mui/material/styles';
import { Avatar, Checkbox, TableRow, TableCell, Typography, MenuItem } from '@mui/material';
// components
import Label from '../../../../components/Label';
import Iconify from '../../../../components/Iconify';
import createAvatar from '../../../../utils/createAvatar';
import { TableMoreMenu } from '../../../../components/table';

// ----------------------------------------------------------------------

UserTableRow_copy.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onEditRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
};

export default function UserTableRow_copy({ row, selected, onEditRow, onSelectRow, onDeleteRow }) {
  const theme = useTheme();

  const { name, location, showInApp, fullName, createdAt, totalTreesPlanted, totalAmount, phone, growerImage, email, role, isVerified } = row;

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
        <Checkbox checked={selected} onClick={onSelectRow} />
      </TableCell>

      <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
        <Avatar alt={fullName} color={createAvatar(fullName).color} sx={{ mr: 2 }}>{createAvatar(fullName).name}</Avatar>
        <Typography variant="subtitle2" noWrap>
          {fullName}
        </Typography>
      </TableCell>

      <TableCell align="left">{email}</TableCell>

      <TableCell align="center" sx={{ textTransform: 'capitalize' }}>
        {totalTreesPlanted}
      </TableCell>

      <TableCell align="center">
       K {totalAmount}
      </TableCell>

      <TableCell align="left">
          {createdAt.toDate().toDateString()}
        
      </TableCell>

      <TableCell align="right">
        <TableMoreMenu
          open={openMenu}
          onOpen={handleOpenMenu}
          onClose={handleCloseMenu}
          actions={
            <>
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
