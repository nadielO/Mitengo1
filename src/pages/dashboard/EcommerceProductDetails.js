import { sentenceCase } from 'change-case';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
// @mui
import { alpha, styled } from '@mui/material/styles';
import { Box, Tab, Card, Grid, Divider, Container, Typography, ImageList, ImageListItem } from '@mui/material';
import { TabContext, TabList, TabPanel } from '@mui/lab';
// redux
import { useDispatch, useSelector } from '../../redux/store';
import { getProduct, addCart, onGotoStep } from '../../redux/slices/product';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
import Iconify from '../../components/Iconify';
import Markdown from '../../components/Markdown';
import { SkeletonProduct } from '../../components/skeleton';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
// sections
import {
  ProductDetailsSummary,
  ProductDetailsReview,
  ProductDetailsCarousel,
} from '../../sections/@dashboard/e-commerce/product-details';
import CartWidget from '../../sections/@dashboard/e-commerce/CartWidget';
import { db } from 'src/config';
import { doc, onSnapshot } from '@firebase/firestore';
import ReactPlayer from 'react-player/lazy'


// ----------------------------------------------------------------------

const PRODUCT_DESCRIPTION = [
  {
    title: '100% Original',
    description: 'Chocolate bar candy canes ice cream toffee cookie halvah.',
    icon: 'ic:round-verified',
  },
  {
    title: '10 Day Replacement',
    description: 'Marshmallow biscuit donut dragée fruitcake wafer.',
    icon: 'eva:clock-fill',
  },
  {
    title: 'Year Warranty',
    description: 'Cotton candy gingerbread cake I love sugar sweet.',
    icon: 'ic:round-verified-user',
  },
];

const IconWrapperStyle = styled('div')(({ theme }) => ({
  margin: 'auto',
  display: 'flex',
  borderRadius: '50%',
  alignItems: 'center',
  width: theme.spacing(8),
  justifyContent: 'center',
  height: theme.spacing(8),
  marginBottom: theme.spacing(3),
  color: theme.palette.primary.main,
  backgroundColor: `${alpha(theme.palette.primary.main, 0.08)}`,
}));

// ----------------------------------------------------------------------

export default function EcommerceProductDetails() {
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
  const [value, setValue] = useState('1');
  const { name } = useParams();
  const { product, error, checkout } = useSelector((state) => state.product);

  const { id } = useParams();
  const growersCollectionRef = doc(db, "gallery", name);
  const [growers, setGrowers] = useState([]);
  const [logs, setLogs] = useState([]);
  const [imagesList, setImagesList] = useState([]);
  useEffect(() => {
    const currentUser = onSnapshot(growersCollectionRef, (doc) => {
      setLogs(doc.data(), doc.id);
      setImagesList(doc.data().imagesList);

    })
    console.log(growers);

  }, [])


  useEffect(() => {
    dispatch(getProduct(name));
  }, [dispatch, name]);

  const handleAddCart = (product) => {
    dispatch(addCart(product));
  };

  const handleGotoStep = (step) => {
    dispatch(onGotoStep(step));
  };
  

  return (
    <Page title="Ecommerce: Product Details">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Product Details"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            {
              name: 'Gallery',
              href: PATH_DASHBOARD.gallery.posts,
            },
            {
              name: 'gallery list',
              href: PATH_DASHBOARD.gallery.posts,
            },
            { name: name },
          ]}
        />

        <CartWidget />

        {logs && (
          <>
            <Card>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6} pb={2}>
                <ReactPlayer width={1155} height={500} url={logs.youTubeLink} />
                </Grid>
              </Grid>
            
              <Grid container>
                <Divider />
                <Grid item xs={12} md={12} lg={12}>

                  <ImageList  cols={3}>
                    {imagesList.map((item) => (
                      <ImageListItem key={item.img}>
                        <img
                          src={item}
                          alt={item}
                          loading="lazy"
                        />
                      </ImageListItem>
                    ))}
                  </ImageList>

                </Grid>
                <Grid item xs={12} md={6} lg={5}>
                 <Typography pt={3} variant="h6" gutterBottom>
                    {logs.description}
                 </Typography>
                </Grid>
              </Grid>
            </Card>




          </>
        )}

        {!itemData && <SkeletonProduct />}

        
      </Container>
    </Page>
  );

}
const itemData = [
  {
    img: 'https://images.unsplash.com/photo-1549388604-817d15aa0110',
    title: 'Bed',
  },
  {
    img: 'https://images.unsplash.com/photo-1525097487452-6278ff080c31',
    title: 'Books',
  },
  {
    img: 'https://images.unsplash.com/photo-1523413651479-597eb2da0ad6',
    title: 'Sink',
  },
  {
    img: 'https://images.unsplash.com/photo-1563298723-dcfebaa392e3',
    title: 'Kitchen',
  },
  {
    img: 'https://images.unsplash.com/photo-1588436706487-9d55d73a39e3',
    title: 'Blinds',
  },
  {
    img: 'https://images.unsplash.com/photo-1574180045827-681f8a1a9622',
    title: 'Chairs',
  },
  {
    img: 'https://images.unsplash.com/photo-1530731141654-5993c3016c77',
    title: 'Laptop',
  },
  {
    img: 'https://images.unsplash.com/photo-1481277542470-605612bd2d61',
    title: 'Doors',
  },
  {
    img: 'https://images.unsplash.com/photo-1517487881594-2787fef5ebf7',
    title: 'Coffee',
  },
  {
    img: 'https://images.unsplash.com/photo-1516455207990-7a41ce80f7ee',
    title: 'Storage',
  },
  {
    img: 'https://images.unsplash.com/photo-1597262975002-c5c3b14bbd62',
    title: 'Candle',
  },
  {
    img: 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4',
    title: 'Coffee table',
  },
];