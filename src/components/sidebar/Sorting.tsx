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
  columns: MRT_Column<any>[];
  onColumnSortChange: (columnId: string, sort: string) => void;
}

const Sorting = ({ open, onClose, columns, onColumnSortChange }: SortingProps) => {
  const [columnSorting, setColumnSorting] = useState<Record<string, string>>({});

  const handleSortChange = (columnId: string) => {
    const currentSort = columnSorting[columnId] || '';
    const newSort = currentSort === 'asc' ? 'desc' : (currentSort === 'desc' ? '' : 'asc');
    setColumnSorting((prevSorting) => ({
      ...prevSorting,
      [columnId]: newSort,
    }));
    onColumnSortChange(columnId, newSort);
  };

  const handleClearSorting = () => {
    setColumnSorting({});
    columns.forEach((column) => {
      onColumnSortChange(column.id as string, '');
    });
  };

  return (
    <Sidebar title="Sorting Options" open={open} onClose={onClose}>
      <List>
        {columns.map((column) => (
          <ListItem
            key={column.id as string}
            sx={{
              border: '1px solid lightgray',
              borderRadius: '5px',
              marginBottom: '10px',
            }}
          >
            <ListItemText primary={column.columnDef.header} />
            <IconButton size="small" onClick={() => handleSortChange(column.id as string)}>
              {columnSorting[column.id as string] === 'asc' ? (
                <ArrowUpwardIcon fontSize="small" />
              ) : columnSorting[column.id as string] === 'desc' ? (
                <ArrowDownwardIcon fontSize="small" />
              ) : (
                <ImportExportIcon fontSize="small" />
              )}
            </IconButton>
          </ListItem>
        ))}
      </List>
      <Button
        onClick={handleClearSorting}
        variant="outlined"
        fullWidth
        sx={{ marginBottom: '15px', height: '50px' }}
      >
        Clear Sorting
      </Button>
    </Sidebar>
  );
};

export default Sorting;
