import React, { useState } from 'react';
import { Button, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import Sidebar from './Sidebar';

interface GSProps {
    open: boolean;
    onClose: () => void;
    onGroupingChange: (grouping: string) => void;
    onApplyGrouping: () => void;
}

const GroupingSettings = ({ open, onClose, onGroupingChange, onApplyGrouping }: GSProps) => {
    const [grouping, setGrouping] = useState<string>('');

    const handleGrChange = (event: SelectChangeEvent<string>) => {
        const selectedGrouping = event.target.value;
        setGrouping(selectedGrouping);
        onGroupingChange(selectedGrouping);
    };

    const handleClearGr = () => {
        setGrouping('');
        onGroupingChange('');
    };

    return (
        <Sidebar title="Create Groups" open={open} onClose={onClose}>
            <Select
                value={grouping}
                onChange={handleGrChange}
                fullWidth
            >
                <MenuItem value="category">Category</MenuItem>
                <MenuItem value="subcategory">Subcategory</MenuItem>
            </Select>
            <Button onClick={handleClearGr} variant="outlined" color="primary" fullWidth sx={{ height: '50px', marginTop: '10px' }}>
                Clear Grouping
            </Button>
            <Button onClick={onApplyGrouping} variant="contained" color="primary" fullWidth sx={{ height: '50px', marginTop: '10px' }}>
                Apply Grouping
            </Button>
        </Sidebar>
    );
};

export default GroupingSettings;
