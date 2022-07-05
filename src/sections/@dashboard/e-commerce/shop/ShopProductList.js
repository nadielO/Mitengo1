import PropTypes from 'prop-types';
// @mui
import { Box } from '@mui/material';
// components
import { SkeletonProductItem } from '../../../../components/skeleton';
//
import ShopProductCard from './ShopProductCard';
import { db } from 'src/config';
import { deleteDoc, doc } from 'firebase/firestore';
import { useSnackbar } from 'notistack';
import {PATH_DASHBOARD} from "../../../../routes/paths";
import {useNavigate} from "react-router-dom";

// ----------------------------------------------------------------------

ShopProductList.propTypes = {
  products: PropTypes.array.isRequired,
  handleDelete: PropTypes.func,
  loading: PropTypes.bool,
};

export default function ShopProductList({ products, loading }) {
    const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
    const handleDelete = async (id) => {
      const growerDoc = doc(db, "gallery", id)
      await deleteDoc(growerDoc)
      window.location.reload(false)
      enqueueSnackbar('Post Deleted!');
    }
    const handleEdit = async (id) => {
        navigate(PATH_DASHBOARD.gallery.edit(id));
    }
  return (
    <Box
      sx={{
        display: 'grid',
        gap: 3,
        gridTemplateColumns: {
          xs: 'repeat(1, 1fr)',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(3, 1fr)',
          lg: 'repeat(4, 1fr)',
        },
      }}
    >
      {(loading ? [...Array(12)] : products).map((product, index,) =>
        product ? <ShopProductCard key={product.id} handleEdit={() => handleEdit(product.id)} handleDelete={() => handleDelete(product.id)} product={product} /> : <SkeletonProductItem key={index} />
      )}
    </Box>
  );
}
