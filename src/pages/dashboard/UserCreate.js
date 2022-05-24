import { paramCase, capitalCase } from 'change-case';
import { useParams, useLocation } from 'react-router-dom';
// @mui
import { Container } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
// _mock_
import { _userList } from '../../_mock';
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
// sections
import UserNewEditForm from '../../sections/@dashboard/user/UserNewEditForm';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from 'src/config';
import { useEffect, useState } from 'react';

// ----------------------------------------------------------------------

export default function UserCreate() {
  const { themeStretch } = useSettings();

  const { pathname } = useLocation();

  const { name } = useParams();

  const isEdit = pathname.includes('edit');
  const growersCollectionRef = doc(db, "growers", name);

  const [growers, setGrowers] = useState([]);

  useEffect(() => {
    const currentUser = onSnapshot(growersCollectionRef, (doc) => {
      setGrowers(doc.data(), doc.id);
    })
    console.log(growers);
  }, [])

  const currentUser = growers


  return (
    <Page title="Grower: Create a new grower">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={!isEdit ? 'Create a new grower' : 'Grower user'}
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Grower', href: PATH_DASHBOARD.user.list },
            { name: !isEdit ? 'New Grower' : capitalCase(name) },
          ]}
        />

        <UserNewEditForm isEdit={isEdit} currentUser={currentUser} />
      </Container>
    </Page>
  );
}
