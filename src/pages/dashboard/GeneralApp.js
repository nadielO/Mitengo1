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
import { collection, getDocs, onSnapshot } from 'firebase/firestore';
import { db } from 'src/config';

// ----------------------------------------------------------------------

export default function GeneralApp() {
  const [numOfGrowers, setNumOfGrowers] = useState(0);
  const [galleryImages, setGalleryImages] = useState([])
  const [numOfTrees, setNumOfTrees] = useState(0);
  const [numOfGallery, setNumOfGallery] = useState(0);
  const [numOfUsers, setNumOfUsers] = useState(0);
  const [ logs, setLogs ] = useState([]);
  const [donetionValue, setDonetionValue] = useState([]);
  const [newVData, setNewVData] = useState([]);

  useEffect(() => {
    const listOfUsers = JSON.parse(localStorage.getItem('growers'));
    setNumOfGrowers(listOfUsers.length);
  }, []);

  const growersCollectionRef = collection(db, "gallery");

  useEffect(() => {
    const getGrowers = async () => {
      const data = await getDocs(growersCollectionRef);
      setGalleryImages(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };
    getGrowers();
  }, []);

  const growersCollectionRef1 = collection(db, "logs");

  useEffect(() => {
    const getGrowers = async () => {
      const data = await getDocs(growersCollectionRef1);
      setLogs(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };
    getGrowers();
  }, []);
  



  useEffect(() => {
    const listOfTrees = JSON.parse(localStorage.getItem('trees'));
    setNumOfTrees(listOfTrees.length);
  }, []);

  useEffect(() => {
    const listOfTrees = JSON.parse(localStorage.getItem('gallary'));
    setNumOfGallery(listOfTrees.length);
  }, []);
  useEffect(() => {
    const listOfTrees = JSON.parse(localStorage.getItem('users'));
    setNumOfUsers(listOfTrees.length);

  }, []);
  const UsersCollectionRef = collection(db, "users")

  

  
  const { user } = useAuth();
  const theme = useTheme();


  const { themeStretch } = useSettings();

  let sum = 0
  logs.forEach(function(value, index, arry){
    if (value.status === "Sold"){
       sum += value.treePrice * value.treeQuantity;
    }
  });

   let Donetions = 0
   logs.forEach(function(value, index, arry){
     if (value.status === "Donated"){
        Donetions += value.treePrice * value.treeQuantity;
     }
   });
   
   console.log(Donetions);

  return (
    <Page title="General: App">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <AppWelcome
              title={`Welcome back! \n ${user?.email}`}
              description=""
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
                { label: 'Sales', value: sum },
                { label: 'Donation', value: Donetions },
                
              ]}
            />
          </Grid>

          



          
        </Grid>
      </Container>
    </Page>
  );
}
