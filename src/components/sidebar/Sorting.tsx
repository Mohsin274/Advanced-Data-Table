import React, { useState } from 'react';
import { List, ListItem, ListItemText, IconButton, Button } from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ImportExportIcon from '@mui/icons-material/ImportExport';
import Sidebar from './Sidebar';
import { MRT_Column } from 'material-react-table';

interface SortingProps {
  open: boolean;
  onClose: () => void;
  columns: MRT_Column<any, unknown>[];
  onColumnSortChange: (columnId: string, sort: string) => void;
}

const Sorting = ({ open, onClose, columns, onColumnSortChange }: SortingProps) => {
  const [columnSorting, setColumnSorting] = useState<Record<string, string>>({});

  const getSortIcon = (sortState: string) => {
    if (sortState === 'asc') {
      return <ArrowUpwardIcon fontSize="small" />;
    } else if (sortState === 'desc') {
      return <ArrowDownwardIcon fontSize="small" />;
    } else {
      return <ImportExportIcon fontSize="small" />;
    }
  };

  const handleSortChange = (columnId: string) => {
    const currentSort = columnSorting[columnId] || '';
    let newSort;
    if (currentSort === 'asc') {
      newSort = 'desc';
    } else if (currentSort === 'desc') {
      newSort = '';
    } else {
      newSort = 'asc';
    }

    setColumnSorting((prevSorting) => ({
      ...prevSorting,
      [columnId]: newSort,
    }));
    onColumnSortChange(columnId, newSort);
  };

  const handleClearSorting = () => {
    setColumnSorting({});
    columns.forEach((column) => {
      onColumnSortChange(column.id, '');
    });
  };

  return (
    <Sidebar title="Sorting Options" open={open} onClose={onClose}>
      <List>
        {columns.map((column) => (
          <ListItem
            key={column.id}
            sx={{
              border: '1px solid lightgray',
              borderRadius: '5px',
              marginBottom: '10px',
            }}
          >
            <ListItemText primary={column.columnDef.header} />
            <IconButton size="small" onClick={() => handleSortChange(column.id)}>
              {getSortIcon(columnSorting[column.id])}
            </IconButton>
          </ListItem>
        ))}
      </List>
      <Button
        onClick={handleClearSorting}
        variant="outlined"
        fullWidth
        sx={{ height: '50px' }}
      >
        Clear Sorting
      </Button>
    </Sidebar>
  );
};

export default Sorting;
