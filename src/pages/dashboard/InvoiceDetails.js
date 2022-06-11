import { useParams } from 'react-router-dom';
// @mui
import { Container } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// _mock_
import { _invoices } from '../../_mock';
// hooks
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
// sections
import Invoice from '../../sections/@dashboard/invoice/details';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from 'src/config';
import { useEffect, useState } from 'react';

// ----------------------------------------------------------------------

export default function InvoiceDetails() {
  const { themeStretch } = useSettings();

  const { id } = useParams();
  const growersCollectionRef = doc(db, "logs", id);
  const [growers, setGrowers] = useState([]);
  const [logs, setLogs] = useState([]);
  useEffect(() => {
    const currentUser = onSnapshot(growersCollectionRef, (doc) => {
      setGrowers(doc.data(), doc.id);
    })
    console.log(growers);
    
  }, [])


  const invoice = growers;
  
  

  return (
    <Page title="Invoice: View">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Invoice Details"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            {
              name: 'Invoices',
              href: PATH_DASHBOARD.sales.list,
            },
            { name: `INV-${invoice?.userId}` || '' },
          ]}
        />

        <Invoice invoice={growers} />
      </Container>
    </Page>
  );
}
