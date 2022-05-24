// @mui
import { useTheme } from '@mui/material/styles';
import { Container, Grid, Stack, Button } from '@mui/material';
// hooks
import useAuth from '../../hooks/useAuth';
import useSettings from '../../hooks/useSettings';
// _mock_
import { _appFeatured, _appAuthors, _appInstalled, _appRelated, _appInvoices } from '../../_mock';
// components
import Page from '../../components/Page';
// sections
import {
  AppWidget,
  AppWelcome,
  AppFeatured,
  AppNewInvoice,
  AppTopAuthors,
  AppTopRelated,
  AppAreaInstalled,
  AppWidgetSummary,
  AppCurrentDownload,
  AppTopInstalledCountries,
} from '../../sections/@dashboard/general/app';
// assets
import { SeoIllustration } from '../../assets';
import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from 'src/config';

// ----------------------------------------------------------------------

export default function GeneralApp() {
  const [numOfGrowers, setNumOfGrowers] = useState(0);
  const [galleryImages, setGalleryImages] = useState([])
  const [ numOfTrees, setNumOfTrees] = useState(0);
  const [ numOfGallery, setNumOfGallery ] = useState(0);
  const [ numOfUsers, setNumOfUsers] = useState(0);

  useEffect(()=> {
    const listOfUsers = JSON.parse(localStorage.getItem('growers'));
    setNumOfGrowers(listOfUsers.length);
  },[]);

  const growersCollectionRef = collection(db, "gallery");

  useEffect(() => {
    const getGrowers = async () => {
      const data = await getDocs(growersCollectionRef);
      setGalleryImages(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };
    getGrowers();
  }, []);

  console.log(galleryImages)


  useEffect(()=> {
    const listOfTrees = JSON.parse(localStorage.getItem('trees'));
    setNumOfTrees(listOfTrees.length);
  },[]);

  useEffect(()=> {
    const listOfTrees = JSON.parse(localStorage.getItem('gallary'));
    setNumOfGallery(listOfTrees.length);
  },[]);
  useEffect(()=> {
    const listOfTrees = JSON.parse(localStorage.getItem('users'));
    setNumOfUsers(listOfTrees.length);
  },[]);
  const { user } = useAuth();

  const theme = useTheme();

  const { themeStretch } = useSettings();

  return (
    <Page title="General: App">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <AppWelcome
              title={`Welcome back! \n ${user?.displayName}`}
              description="If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything."
              img={
                <SeoIllustration
                  sx={{
                    p: 3,
                    width: 360,
                    margin: { xs: 'auto', md: 'inherit' },
                  }}
                />
              }
              
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <AppFeatured list={galleryImages} />
          </Grid>

          <Grid item xs={12} md={4}>
            <AppWidgetSummary
              title="Growers"
              percent={2.6}
              total={numOfGrowers}
              chartColor={theme.palette.primary.main}
              chartData={[5, 18, 12, 51, 68, 11, 39, 37, 27, 20]}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <AppWidgetSummary
              title="Trees"
              percent={0.2}
              total={numOfTrees}
              chartColor={theme.palette.chart.blue[0]}
              chartData={[20, 41, 63, 33, 28, 35, 50, 46, 11, 26]}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <AppWidgetSummary
              title="Users"
              percent={-0.1}
              total={numOfUsers}
              chartColor={theme.palette.chart.red[0]}
              chartData={[8, 9, 31, 8, 16, 37, 8, 33, 46, 31]}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppCurrentDownload
              title="Total Made"
              chartColors={[
                theme.palette.primary.main,
                theme.palette.primary.light,
                theme.palette.primary.main,
                theme.palette.primary.dark,
              ]}
              chartData={[
                { label: 'Donetion', value: 12244 },
                { label: 'Sales', value: 53345 },
                
              ]}
            />
          </Grid>

         

          <Grid item xs={12} lg={8}>
            <AppNewInvoice
              title="New Invoice"
              tableData={_appInvoices}
              tableLabels={[
                { id: 'id', label: 'Invoice ID' },
                { id: 'category', label: 'Category' },
                { id: 'price', label: 'Price' },
                { id: 'status', label: 'Status' },
                { id: '' },
              ]}
            />
          </Grid>

          

          <Grid item xs={12} md={6} lg={4}>
            <Stack spacing={3}>
              <AppWidget title="Conversion" total={38566} icon={'eva:person-fill'} chartData={48} />
              <AppWidget title="Applications" total={55566} icon={'eva:email-fill'} color="warning" chartData={75} />
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}
