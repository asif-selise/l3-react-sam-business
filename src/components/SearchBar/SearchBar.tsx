import { useDebounce } from 'use-debounce';
import React, { useState, useEffect, type SetStateAction } from 'react';

import { Clear, Search } from '@mui/icons-material';
import { Box, TextField, InputAdornment, type SxProps } from '@mui/material';

export interface SearchBarProps {
  placeholder: string;
  onSearch: (value: string) => void;
  searchValue?: string;
  fullwidth?: boolean;
  variant?: 'standard' | 'outlined';
  size?: 'small' | 'medium';
  sx?: SxProps;
}

const SearchBar = ({
  placeholder,
  onSearch,
  searchValue,
  fullwidth,
  variant,
  size,
  sx,
}: SearchBarProps) => {
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (event: { target: { value: SetStateAction<string> } }) => {
    setInputValue(event.target.value);
  };

  const handleClearClick = () => {
    setInputValue('');
  };

  const [debouncedValue] = useDebounce(inputValue, 300);

  useEffect(() => {
    onSearch(debouncedValue);
  }, [debouncedValue]);

  useEffect(() => {
    setInputValue(searchValue ?? '');
  }, [searchValue]);

  return (
    <Box sx={{ display: 'flex', alignItems: 'flex-end', p: 2, ...sx }} aria-label="search-bar">
      <TextField
        onChange={handleInputChange}
        value={inputValue}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search sx={{ my: 0.5 }} />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end" onClick={handleClearClick} sx={{ cursor: 'pointer' }}>
              {inputValue && <Clear sx={{ mx: 1, my: 0.5 }} />}
            </InputAdornment>
          ),
          sx: { pr: 0 },
        }}
        fullWidth={fullwidth ?? true}
        placeholder={placeholder}
        variant={variant ?? 'outlined'}
        size={size ?? 'medium'}
      />
    </Box>
  );
};

export default SearchBar;
