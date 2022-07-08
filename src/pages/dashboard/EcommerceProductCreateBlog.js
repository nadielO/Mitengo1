import { useEffect, useState } from 'react';
import { paramCase } from 'change-case';
import { useParams, useLocation } from 'react-router-dom';
// @mui
import { Container } from '@mui/material';
// redux
import { useDispatch, useSelector } from '../../redux/store';
import { getProducts } from '../../redux/slices/product';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import ProductNewEditFormBlog from '../../sections/@dashboard/e-commerce/ProductNewEditFormBlog';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from 'src/config';

// ----------------------------------------------------------------------

export default function EcommerceProductCreateBlog() {
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const { id } = useParams();
  const { products } = useSelector((state) => state.product);
  const isEdit = pathname.includes('edit');

  const growersCollectionRef = doc(db, "gallery", id);

  const [growers, setGrowers] = useState([]);

  useEffect(() => {
    const currentUser = onSnapshot(growersCollectionRef, (doc) => {
      setGrowers(doc.data(), doc.id);
    })
    console.log(growers);
  }, [])

  const currentProduct = growers

  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

  return (
    <Page title="gallery: edit">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={!isEdit ? 'edit post' : 'Edit post'}
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            {
              name:"gallery",
              href: PATH_DASHBOARD.gallery.posts,
            },
            { name: !isEdit ? 'edit post' : id },
          ]}
        />

        <ProductNewEditFormBlog isEdit={isEdit} currentProduct={currentProduct} />
      </Container>
    </Page>
  );
}
