'use client';
import jsonData from '@/data/sample-data.json';
import { useMemo, useState } from 'react';
import {
  MaterialReactTable,
  MRT_SortingState,
  useMaterialReactTable,
  type MRT_ColumnDef,
} from 'material-react-table';
import moment from 'moment';
import { Box, IconButton, Tooltip } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import GroupWorkIcon from '@mui/icons-material/GroupWork';
import SortIcon from '@mui/icons-material/Sort';
import ColumnToggle from '../sidebar/ColumnToggle';
import GroupingSettings from '../sidebar/GroupingSettings';
import Sorting from '../sidebar/Sorting';
import Filters from '../sidebar/Filters';
import FilterListIcon from '@mui/icons-material/FilterList';

type Data = {
  id: number;
  name: string;
  category: string;
  subcategory: string;
  createdAt: string;
  updatedAt: string;
  price: number;
  sale_price: number;
};

const data: Data[] = jsonData as Data[];

const Table = () => {
  const [filteredData, setFilteredData] = useState<Data[]>(data);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [grouping, setGrouping] = useState<string[]>([]);
  const [groupingOpen, setGroupingOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sorting, setSorting] = useState<MRT_SortingState>([]);
  const [sortingOpen, setSortingOpen] = useState(false);


  const columns = useMemo<MRT_ColumnDef<Data>[]>(
    () => [
      {
        accessorKey: 'id',
        header: 'ID',
        enableGrouping: false,
      },
      {
        accessorKey: 'name',
        header: 'Name',
        enableGrouping: false,
      },
      {
        accessorKey: 'category',
        header: 'Category',
        enableGrouping: true,
      },
      {
        accessorKey: 'subcategory',
        header: 'Subcategory',
        enableGrouping: true,
      },
      {
        accessorKey: 'createdAt',
        header: 'Created At',
        enableGrouping: false,
        Cell: ({ cell }) => moment(cell.getValue<string>()).format('DD-MMM-YYYY HH:mm'),
      },
      {
        accessorKey: 'updatedAt',
        header: 'Updated At',
        enableGrouping: false,
        Cell: ({ cell }) => moment(cell.getValue<string>()).format('DD-MMM-YYYY HH:mm'),
      },
      {
        accessorKey: 'price',
        header: 'Price',
        enableGrouping: false,
      },
      {
        accessorKey: 'sale_price',
        header: 'Sale Price',
        enableGrouping: false,
      },
    ],
    []
  );

  const table = useMaterialReactTable({
    columns,
    data: filteredData,
    muiPaginationProps: {
      color: 'primary',
      shape: 'rounded',
      showRowsPerPage: false,
      variant: 'outlined',
    },
    paginationDisplayMode: 'pages',
    initialState: { pagination: { pageSize: 10, pageIndex: 0 }, expanded: true, },
    state: { sorting },
    enableSorting: true,
    onSortingChange: setSorting,
    enableGrouping: true,
    renderTopToolbarCustomActions: () => (
      <Box>
        <Tooltip title="Show/Hide Columns">
          <IconButton onClick={() => setSidebarOpen(true)}>
            <VisibilityIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Grouping Settings">
          <IconButton onClick={() => setGroupingOpen(true)}>
            <GroupWorkIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Sorting Settings">
          <IconButton onClick={() => setSortingOpen(true)}>
            <SortIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Filters">
          <IconButton onClick={() => setFiltersOpen(true)}>
            <FilterListIcon />
          </IconButton>
        </Tooltip>
      </Box>
    ),
  });

  const handleColumnVisibilityChange = (columnId: string, isHidden: boolean) => {
    table.setColumnVisibility((prevVisibility) => ({
      ...prevVisibility,
      [columnId]: !isHidden,
    }));
  };

  const handleGroupingChange = (grouping: string) => {
    setGrouping(grouping !== '' ? [grouping] : []);
  };

  const handleApplyGrouping = () => {
    table.setGrouping(grouping);
  };


  const handleSortingChange = (columnId: string, sort: string) => {
    setSorting((prev) => {
      if (sort === '') {
        return prev.filter((s) => s.id !== columnId);
      }
      const existingSort = prev.find((s) => s.id === columnId);
      if (existingSort) {
        return prev.map((s) => (s.id === columnId ? { id: columnId, desc: sort === 'desc' } : s));
      } else {
        return [...prev, { id: columnId, desc: sort === 'desc' }];
      }
    });
  };

  const handleFilterChange = (filters: Data[]) => {
    setFilteredData(filters);
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <ColumnToggle
        columns={table.getAllColumns()}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onColumnVisibilityChange={handleColumnVisibilityChange}
      />
      <GroupingSettings
        open={groupingOpen}
        onClose={() => setGroupingOpen(false)}
        onGroupingChange={handleGroupingChange}
        onApplyGrouping={handleApplyGrouping}
      />
      <Sorting
        columns={table.getAllColumns()}
        open={sortingOpen}
        onClose={() => setSortingOpen(false)}
        onColumnSortChange={handleSortingChange}
      />
      <Filters
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        data={data}
        onFilterChange={handleFilterChange}
      />
      <MaterialReactTable table={table} />
    </Box>
  );
};

export default Table;