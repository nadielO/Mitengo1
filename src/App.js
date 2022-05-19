// routes
import Router from './routes';
// theme
import ThemeProvider from './theme';
// components
import ThemeSettings from './components/settings';
import { ChartStyle } from './components/chart';
import ScrollToTop from './components/ScrollToTop';
import { ProgressBarStyle } from './components/ProgressBar';
import NotistackProvider from './components/NotistackProvider';
import MotionLazyContainer from './components/animate/MotionLazyContainer';
import { collection, getDocs } from 'firebase/firestore';
import { db } from './config';
import { useEffect } from 'react';

// ----------------------------------------------------------------------

export default function App() {
  const growersCollectionRef = collection(db, "growers");
  const treesCollectionRef = collection(db, "trees");
  const gallaryCollectionRef = collection(db, "gallery");
  const usersCollectionRef = collection(db, "users");
  /// Load the LocalStorage with data from firestore
  useEffect(()=>{
    const getGrowers = async () => {
      const data = await getDocs(growersCollectionRef);
      localStorage.setItem('growers', JSON.stringify(data.docs));
    };
    getGrowers();
  },[]);
  useEffect(()=>{
    const getTrees = async () => {
      const data = await getDocs(treesCollectionRef);
      localStorage.setItem('trees', JSON.stringify(data.docs));
    };
    getTrees();
  },[]);
  useEffect(()=>{
    const getGallary = async () => {
      const data = await getDocs(gallaryCollectionRef);
      localStorage.setItem('gallary', JSON.stringify(data.docs));
    };
    getGallary();
  },[]);
  useEffect(()=>{
    const getUsers = async () => {
      const data = await getDocs(usersCollectionRef);
      localStorage.setItem('users', JSON.stringify(data.docs));
    };
    getUsers();
  },[]);

  return (
    <MotionLazyContainer>
      <ThemeProvider>
        <ThemeSettings>
          <NotistackProvider>
            <ProgressBarStyle />
            <ChartStyle />
            <ScrollToTop />
            <Router />
          </NotistackProvider>
        </ThemeSettings>
      </ThemeProvider>
    </MotionLazyContainer>
  );
}
