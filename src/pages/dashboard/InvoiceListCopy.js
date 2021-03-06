import sumBy from 'lodash/sumBy';
import { useEffect, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
// @mui
import { useTheme } from '@mui/material/styles';
import {
  Box,
  Tab,
  Tabs,
  Card,
  Table,
  Stack,
  Switch,
  Button,
  Tooltip,
  Divider,
  TableBody,
  Container,
  IconButton,
  TableContainer,
  TablePagination,
  FormControlLabel,
} from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useTabs from '../../hooks/useTabs';
import useSettings from '../../hooks/useSettings';
import useTable, { getComparator, emptyRows } from '../../hooks/useTable';
// _mock_
import { _invoices } from '../../_mock';
// components
import Page from '../../components/Page';
import Label from '../../components/Label';
import Iconify from '../../components/Iconify';
import Scrollbar from '../../components/Scrollbar';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import { TableNoData, TableEmptyRows, TableHeadCustom, TableSelectedActions } from '../../components/table';
// sections
import InvoiceAnalytic from '../../sections/@dashboard/invoice/InvoiceAnalytic';
import {InvoiceTableRow, InvoiceTableRowCopy, InvoiceTableToolbar} from '../../sections/@dashboard/invoice/list';
import { db } from 'src/config';
import { collection, deleteDoc, doc, getDocs, updateDoc} from 'firebase/firestore';
import { useSnackbar } from 'notistack';

// ----------------------------------------------------------------------

const SERVICE_OPTIONS = [
  'all',
  'full stack development',
  'backend development',
  'ui design',
  'ui/ux design',
  'front end development',
];

const TABLE_HEAD = [
  { id: 'invoiceNumber', label: 'Client', align: 'left' },
  { id: 'createDate', label: 'Create', align: 'left' },
  { id: 'treeName', label: 'Tree', align: 'left' },
  { id: 'price', label: 'Amount', align: 'left' },
  { id: 'status', label: 'Status', align: 'left' },
  { id: 'method', label: 'Payment', align: 'left' },

  { id: '', label: 'Action', align: 'left' },
];

// ----------------------------------------------------------------------

export default function InvoiceListCopy() {
  const [logs, setLogs] = useState([]);

  const theme = useTheme();

  const { themeStretch } = useSettings();

  const navigate = useNavigate();

  const {
    dense,
    page,
    order,
    orderBy,
    rowsPerPage,
    setPage,
    //
    selected,
    setSelected,
    onSelectRow,
    onSelectAllRows,
    //
    onSort,
    onChangeDense,
    onChangePage,
    onChangeRowsPerPage,
  } = useTable({ defaultOrderBy: 'createDate' });

  const [tableData, setTableData] = useState([]);

  const [filterName, setFilterName] = useState('');

  const [filterService, setFilterService] = useState('all');

  const [filterStartDate, setFilterStartDate] = useState(null);

  const [filterEndDate, setFilterEndDate] = useState(null);

  const { currentTab: filterStatus, onChangeTab: onFilterStatus } = useTabs('all');

  const handleFilterName = (filterName) => {
    setFilterName(filterName);
    setPage(0);
  };

  const handleFilterService = (event) => {
    setFilterService(event.target.value);
  };
  const { enqueueSnackbar } = useSnackbar();


  const deleteGrower = async (id) => {
    const growerDoc = doc(db, "users", id)
    await deleteDoc(growerDoc)
    deleteGrower()
    window.location.reload(false)
    enqueueSnackbar('Detete success!');

  }

  const handleDeleteRows = (selected) => {
    const deleteRows = tableData.filter((row) => !selected.includes(row.id));
    setSelected([]);
    setTableData(deleteRows);
  };

  const handleEditRow = async (id, paid) => {
    const updateLogs = doc(db, "logs", id);
    if (paid === true){
      await updateDoc(updateLogs, {
        paid: false
      });
      window.location.reload(false)
      enqueueSnackbar('marked as not Paid!');
    }else {
      await updateDoc(updateLogs, {
        paid: true
      });
      window.location.reload(false)
      enqueueSnackbar('marked as paid!');
    }
  };

  const handleViewRow = (id) => {
    navigate(PATH_DASHBOARD.sales.view(id));
  };

  const [dataD,setDataD] = useState([])



  const dataFiltered = applySortFilter({
    tableData,
    comparator: getComparator(order, orderBy),
    filterName,
    filterService,
    filterStatus,
    filterStartDate,
    filterEndDate,
  });

  const isNotFound =
    (!dataFiltered.length && !!filterName) ||
    (!dataFiltered.length && !!filterStatus) ||
    (!dataFiltered.length && !!filterService) ||
    (!dataFiltered.length && !!filterEndDate) ||
    (!dataFiltered.length && !!filterStartDate);

  const denseHeight = dense ? 56 : 76;

  const getLengthByStatus = (status) => tableData.filter((item) => item.status === status).length;

  const getTotalPriceByStatus = (status) =>
    sumBy(
      tableData.filter((item) => item.status === status),
      'totalPrice'
    );

  const getPercentByStatus = (status) => (getLengthByStatus(status) / tableData.length) * 100;

  const TABS = [
    { value: 'all', label: 'All', color: 'info', count: tableData.length },
    { value: 'sold', label: 'sold', color: 'success', count: getLengthByStatus('paid') },
    { value: 'doneted', label: 'doneted', color: 'warning', count: getLengthByStatus('unpaid') },

  ];
  const growersCollectionRef = collection(db, "logs");
  const growerNumberCollectionRef = collection(db, "growers");
  const locationsCollectionRef = collection(db, "users");
  const treesCollectionRef = collection(db, "trees");

  useEffect(() => {
    const createGrowerList = async () => {
      //fetch growers from firebase store
      const growersCollection = (await getDocs(growersCollectionRef)).docs.map((doc) => ({ ...doc.data(), id: doc.id }));
      const locationsCollection = (
        await getDocs(locationsCollectionRef)
      ).docs.map((doc) => ({ ...doc.data(), id: doc.id }));
      const treesCollection = (
        await getDocs(treesCollectionRef)
      ).docs.map((doc) => ({ ...doc.data(), id: doc.id }));
      const growerNumberCollection = (
        await getDocs(growerNumberCollectionRef)
      ).docs.map((doc) => ({ ...doc.data(), id: doc.id }));

      const growersTableData = growersCollection.map(
        ({
          buyEmail,
          buyerName,
          
          growerID,
          paid,
          userID,
          treeID,
          status,
          treeQuantity,
          treePrice,
          treeName,
          purchaseDate,
          paymentMethod,
          id,
        }) => ({
          buyEmail,
          buyerName,
          treePrice,
          growerID: growerNumberCollection.find(
            (grower) => grower.id === growerID
        )?.fullName,
          treeName,
          treeID: treesCollection.find(
            (tree) => tree.id === treeID
          )?.treeName,
          id,
          purchaseDate,
          treeQuantity,
          paid,
          status,
          userID: locationsCollection.find(
              (user) => user.id === userID
          )?.fullName
        })
      );
      setTableData(growersTableData);
    }

    createGrowerList();

  }, []);



  const logscollectionRef = collection(db, "users")
  useEffect(() => {
    const getGrowers = async () => {
      const data = await getDocs(logscollectionRef);
      setLogs(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };
    getGrowers();
  }, []);



  return (
    <Page title="Invoice: List">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Invoice List"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Invoices', href: PATH_DASHBOARD.invoice.root },
            { name: 'List' },
          ]}

        />



        <Card>
          <Divider />
          <Scrollbar>
            <TableContainer sx={{ minWidth: 800, position: 'relative' }}>
              {selected.length > 0 && (
                <TableSelectedActions
                  dense={dense}
                  numSelected={selected.length}
                  rowCount={tableData.length}
                  onSelectAllRows={(checked) =>
                    onSelectAllRows(
                      checked,
                      tableData.map((row) => row.id)
                    )
                  }
                  actions={
                    <Stack spacing={1} direction="row">
                      <Tooltip title="Sent">
                        <IconButton color="primary">
                          <Iconify icon={'ic:round-send'} />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Download">
                        <IconButton color="primary">
                          <Iconify icon={'eva:download-outline'} />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Print">
                        <IconButton color="primary">
                          <Iconify icon={'eva:printer-fill'} />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Delete">
                        <IconButton color="primary" onClick={() => handleDeleteRows(selected)}>
                          <Iconify icon={'eva:trash-2-outline'} />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  }
                />
              )}

              <Table size={dense ? 'small' : 'medium'}>
                <TableHeadCustom
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={tableData.length}
                  numSelected={selected.length}
                  onSort={onSort}
                  onSelectAllRows={(checked) =>
                    onSelectAllRows(
                      checked,
                      tableData.map((row) => row.id)
                    )
                  }
                />


                <TableBody>
                  {dataFiltered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                      <InvoiceTableRowCopy
                          key={row.id}
                          row={row}
                          selected={selected.includes(row.id)}
                          onSelectRow={() => onSelectRow(row.id)}
                          onViewRow={() => handleViewRow(row.id)}
                          onEditRow={() => handleEditRow(row.id, row.paid)}
                          onDeleteRow={() => deleteGrower(row.id)}
                      />
                  ))}

                  <TableEmptyRows height={denseHeight} emptyRows={emptyRows(page, rowsPerPage, tableData.length)} />

                  <TableNoData isNotFound={isNotFound} />
                </TableBody>

              </Table>
            </TableContainer>
          </Scrollbar>

          <Box sx={{ position: 'relative' }}>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={dataFiltered.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={onChangePage}
              onRowsPerPageChange={onChangeRowsPerPage}
            />

            <FormControlLabel
              control={<Switch checked={dense} onChange={onChangeDense} />}
              label="Dense"
              sx={{ px: 3, py: 1.5, top: 0, position: { md: 'absolute' } }}
            />
          </Box>
        </Card>

      </Container>
    </Page>
  );
}

// ----------------------------------------------------------------------

function applySortFilter({
  tableData,
  comparator,
  filterName,
  filterStatus,
  filterService,
  filterStartDate,
  filterEndDate,
}) {
  const stabilizedThis = tableData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  tableData = stabilizedThis.map((el) => el[0]);

  if (filterName) {
    tableData = tableData.filter(
      (item) =>
        item.invoiceNumber.toLowerCase().indexOf(filterName.toLowerCase()) !== -1 ||
        item.invoiceTo.name.toLowerCase().indexOf(filterName.toLowerCase()) !== -1
    );
  }

  if (filterStatus !== 'all') {
    tableData = tableData.filter((item) => item.status === filterStatus);
  }

  if (filterService !== 'all') {
    tableData = tableData.filter((item) => item.items.some((c) => c.service === filterService));
  }

  if (filterStartDate && filterEndDate) {
    tableData = tableData.filter(
      (item) =>
        item.createDate.getTime() >= filterStartDate.getTime() && item.createDate.getTime() <= filterEndDate.getTime()
    );
  }

  return tableData;
}
