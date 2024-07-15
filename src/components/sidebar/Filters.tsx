import React, { useState } from 'react';
import { Box, TextField, Select, MenuItem, FormControl, Checkbox, Slider, Typography, Button, IconButton, ListItemText, SelectChangeEvent } from '@mui/material';
import Sidebar from './Sidebar';
import ClearIcon from '@mui/icons-material/Clear';
import FuzzySearch from 'fuzzy-search';

interface FiltersSidebarProps {
  open: boolean;
  onClose: () => void;
  data: any[];
  onFilterChange: (filters: any) => void;
}

const Filters = ({ open, onClose, data, onFilterChange }: FiltersSidebarProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<{ min: number; max: number }>({ min: 0, max: Number.MAX_SAFE_INTEGER });
  const [createdAtRange, setCreatedAtRange] = useState<{ min: Date | null; max: Date | null }>({ min: null, max: null });
  const [updatedAtRange, setUpdatedAtRange] = useState<{ min: Date | null; max: Date | null }>({ min: null, max: null });

  const categories = Array.from(new Set(data.map((item) => item.category)));
  const subcategories = Array.from(new Set(data.map((item) => item.subcategory)));

  const searcher = new FuzzySearch(data, ['name'], {
    caseSensitive: false,
  });

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    applyFilters();
  };

  const handleCategoryChange = (event: SelectChangeEvent<string[]>, child: React.ReactNode) => {
    setSelectedCategories(event.target.value as string[]);
    applyFilters();
  };

  const handleSubcategoryChange = (event: SelectChangeEvent<string[]>, child: React.ReactNode) => {
    setSelectedSubcategories(event.target.value as string[]);
    applyFilters();
  };

  const handlePriceChange = (event: Event, newValue: number | number[]) => {
    if (Array.isArray(newValue)) {
      setPriceRange({ min: newValue[0], max: newValue[1] });
    }
    applyFilters();
  };

  const handleCreatedAtChange = (value: { startDate: Date | null; endDate: Date | null }) => {
    setCreatedAtRange({ min: value.startDate, max: value.endDate });
    applyFilters();
  };

  const handleUpdatedAtChange = (value: { startDate: Date | null; endDate: Date | null }) => {
    setUpdatedAtRange({ min: value.startDate, max: value.endDate });
    applyFilters();
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategories([]);
    setSelectedSubcategories([]);
    setPriceRange({ min: 0, max: Number.MAX_SAFE_INTEGER });
    setCreatedAtRange({ min: null, max: null });
    setUpdatedAtRange({ min: null, max: null });
    // applyFilters();
  };

  const applyFilters = () => {
    const filteredData = searcher.search(searchQuery)
      .filter((item: { category: string; subcategory: string; price: number; createdAt: string | number | Date; }) => {
        const categoryMatch = selectedCategories.length === 0 || selectedCategories.includes(item.category);
        const subcategoryMatch = selectedSubcategories.length === 0 || selectedSubcategories.includes(item.subcategory);
        const priceMatch = item.price >= priceRange.min && item.price <= priceRange.max;
        const createdAtMatch = (!createdAtRange.min || new Date(item.createdAt) >= createdAtRange.min) && (!createdAtRange.max || new Date(item.createdAt) <= createdAtRange.max);
        return categoryMatch && subcategoryMatch && priceMatch && createdAtMatch;
      });
    onFilterChange(filteredData);
  };

  return (
    <Sidebar open={open} onClose={onClose} title="Filters">
      <Box padding={2}>
        <Box border={1} borderRadius={1} borderColor="grey.300" padding={2} marginBottom={2}>
          <Typography variant="h6" gutterBottom>
            Name
          </Typography>
          <TextField
            fullWidth
            label="Search"
            value={searchQuery}
            onChange={handleSearchChange}
            InputProps={{
              endAdornment: (
                <IconButton onClick={() => setSearchQuery('')}>
                  <ClearIcon />
                </IconButton>
              ),
            }}
          />
        </Box>
        <Box border={1} borderRadius={1} borderColor="grey.300" padding={2} marginBottom={2}>
          <Typography variant="h6" gutterBottom>
            Categories
          </Typography>
          <FormControl fullWidth>
            <Select
              multiple
              value={selectedCategories}
              onChange={handleCategoryChange}
              renderValue={(selected) => (selected as string[]).join(', ')}
            >
              {categories.map((category) => (
                <MenuItem key={category} value={category}>
                  <Checkbox checked={selectedCategories.includes(category)} />
                  <ListItemText primary={category} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <Box border={1} borderRadius={1} borderColor="grey.300" padding={2} marginBottom={2}>
          <Typography variant="h6" gutterBottom>
            Subcategories
          </Typography>
          <FormControl fullWidth>
            <Select
              multiple
              value={selectedSubcategories}
              onChange={handleSubcategoryChange}
              renderValue={(selected) => (selected as string[]).join(', ')}
            >
              {subcategories.map((subcategory) => (
                <MenuItem key={subcategory} value={subcategory}>
                  <Checkbox checked={selectedSubcategories.includes(subcategory)} />
                  <ListItemText primary={subcategory} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <Box border={1} borderRadius={1} borderColor="grey.300" padding={2} marginBottom={2}>
          <Typography variant="h6" gutterBottom>
            Price Range
          </Typography>
          <Slider
            value={[priceRange.min, priceRange.max]}
            onChange={handlePriceChange}
            valueLabelDisplay="auto"
            min={0}
            max={1000}
          />
        </Box>
        <Box border={1} borderRadius={1} borderColor="grey.300" padding={2} marginBottom={2}>
          <Typography variant="h6" gutterBottom>
            Created At
          </Typography>
          <Box display="flex" alignItems="center">
            <Typography variant="body1">From:</Typography>
            <TextField
              type="date"
              value={createdAtRange.min ? createdAtRange.min.toISOString().split('T')[0] : ''}
              onChange={(e) => handleCreatedAtChange({ startDate: new Date(e.target.value), endDate: createdAtRange.max })}
            />
            <Typography variant="body1">To:</Typography>
            <TextField
              type="date"
              value={createdAtRange.max ? createdAtRange.max.toISOString().split('T')[0] : ''}
              onChange={(e) => handleCreatedAtChange({ startDate: createdAtRange.min, endDate: new Date(e.target.value) })}
            />
          </Box>
        </Box>
        <Box border={1} borderRadius={1} borderColor="grey.300" padding={2} marginBottom={2}>
          <Typography variant="h6" gutterBottom>
            Updated At
          </Typography>
          <Box display="flex" alignItems="center">
            <Typography variant="body1">From:</Typography>
            <TextField
              type="date"
              value={updatedAtRange.min ? updatedAtRange.min.toISOString().split('T')[0] : ''}
              onChange={(e) => handleUpdatedAtChange({ startDate: new Date(e.target.value), endDate: updatedAtRange.max })}
            />
            <Typography variant="body1">To:</Typography>
            <TextField
              type="date"
              value={updatedAtRange.max ? updatedAtRange.max.toISOString().split('T')[0] : ''}
              onChange={(e) => handleUpdatedAtChange({ startDate: updatedAtRange.min, endDate: new Date(e.target.value) })}
            />
          </Box>
        </Box>
        <Box marginTop={2}>
          <Button onClick={clearFilters} variant="outlined" color="primary" fullWidth>
            Clear All
          </Button>
        </Box>
      </Box>
    </Sidebar>
  );
};

export default Filters;
