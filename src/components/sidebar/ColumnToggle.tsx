import React, { useState } from 'react';
import { List, ListItem, ListItemText, Button, Switch } from '@mui/material';
import { MRT_Column } from 'material-react-table';
import Sidebar from './Sidebar';

interface ColumnToggleProps {
  columns: MRT_Column<any>[];
  open: boolean;
  onClose: () => void;
  onColumnVisibilityChange: (columnId: string, isHidden: boolean) => void;
}

const ColumnToggle = ({ columns, open, onClose, onColumnVisibilityChange }: ColumnToggleProps) => {
  const [selectedColumns, setSelectedColumns] = useState<string[]>(columns.map((column) => column.id));

  const handleToggleChange = (columnId: string) => {
    setSelectedColumns((prevSelected) => {
      if (prevSelected.includes(columnId)) {
        return prevSelected.filter((id) => id !== columnId);
      } else {
        return [...prevSelected, columnId];
      }
    });
  };

  const handleShowAll = () => {
    setSelectedColumns(columns.map((column) => column.id));
    columns.forEach((column) => {
      onColumnVisibilityChange(column.id, false);
    });
  };

  const handleApply = () => {
    columns.forEach((column) => {
      const isHidden = !selectedColumns.includes(column.id);
      onColumnVisibilityChange(column.id, isHidden);
    });
    onClose();
  };

  return (
    <Sidebar open={open} onClose={onClose} title='Show/Hide Columns'>
      <List>
      {columns.map((column) => (
        <ListItem key={column.id} sx={{ border: '1px solid lightgray', borderRadius: '5px', marginBottom: '10px' }}>
          <ListItemText primary={column.columnDef.header} />
        <Switch
          checked={selectedColumns.includes(column.id)}
          onChange={() => handleToggleChange(column.id)}
        />
        </ListItem>
      ))}
      </List>
      <Button onClick={handleShowAll} variant="outlined" color="primary" fullWidth sx={{
        marginBottom: '15px', height: '50px'
      }}>Show All Columns</Button>
      <Button onClick={handleApply} variant="contained" color="primary" fullWidth sx={{
        height: '50px'
      }}>Apply</Button>
  </Sidebar>
  );
};

export default ColumnToggle;

