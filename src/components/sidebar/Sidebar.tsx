import React from 'react';
import { Box, Drawer, Typography, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface SidebarProps {
  title: string;
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Sidebar = ({ title, open, onClose, children }: SidebarProps) => {
  return (
    <Drawer open={open} onClose={onClose} anchor="right" PaperProps={{
        sx: { width: "400px" },
    }}>
        <Box p={2}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h6">{title}</Typography>
                <IconButton onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            </Box>
            {children}
        </Box>
    </Drawer>
  );
};

export default Sidebar;
