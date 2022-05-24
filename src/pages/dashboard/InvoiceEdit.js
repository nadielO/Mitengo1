import { useParams } from 'react-router-dom';
// @mui
import { Container } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
// _mock_
import { _invoices } from '../../_mock';
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
// sections
import InvoiceNewEditForm from '../../sections/@dashboard/invoice/new-edit-form/indexCopy';

// ----------------------------------------------------------------------

export default function InvoiceEdit() {
  const { themeStretch } = useSettings();

  const { id } = useParams();

  

  const currentInvoice = _invoices.find((invoice) => invoice.id === id);

  return (
    <Page title="Location: Edit">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Edit location"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Location', href: PATH_DASHBOARD.invoice.list },
            { name: `INV-${currentInvoice?.invoiceNumber}` || '' },
          ]}
        />

        <InvoiceNewEditForm isEdit currentInvoice={currentInvoice} />
      </Container>
    </Page>
  );
}
