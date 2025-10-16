'use client';

import React, { useState, useEffect } from 'react';
import Fuse, { FuseResult } from 'fuse.js';
import { useRouter } from 'next/navigation';
import { Box, TextField, IconButton, Paper, Typography, List, ListItem, ListItemButton, ListItemText } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

interface VerseResult {
  bookId: string;
  chapter: number;
  verse: number;
  text: string;
  version: 'sinaiticus';
}

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<FuseResult<VerseResult>[]>([]);
  const [sinaiticusFuse, setSinaiticusFuse] = useState<Fuse<VerseResult> | null>(null);
  const router = useRouter();

  useEffect(() => {
    const loadFuseData = async () => {
      const sinaiticusDataRes = await fetch('/data/search_indices/fuse_sinaiticus_data.json');
      const sinaiticusData = await sinaiticusDataRes.json();
      const sinaiticusOptionsRes = await fetch('/data/search_indices/fuse_sinaiticus_options.json');
      const sinaiticusOptions = await sinaiticusOptionsRes.json();
      setSinaiticusFuse(new Fuse(sinaiticusData, sinaiticusOptions));
    };

    loadFuseData();
  }, []);

  const handleSearch = () => {
    if (query.length > 2 && sinaiticusFuse) {
      const sinaiticusResults = sinaiticusFuse.search(query);
      setResults(sinaiticusResults);
    } else {
      setResults([]);
    }
  };

  const handleClickResult = (result: VerseResult) => {
    const { bookId, chapter, verse } = result;
    router.push(`/?version=sinaiticus&bookId=${bookId}&chapter=${chapter}&verse=${verse}`);
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 400, position: 'relative' }}>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <TextField
          variant="outlined"
          placeholder="Search Scripture..."
          fullWidth
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleSearch();
            }
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '50px',
              backgroundColor: 'background.paper',
              '& fieldset': {
                borderColor: 'primary.main',
              },
              '&:hover fieldset': {
                borderColor: 'primary.dark',
              },
            },
          }}
        />
        <IconButton onClick={handleSearch} sx={{ ml: 1 }}>
          <SearchIcon />
        </IconButton>
      </Box>

      {results.length > 0 && query.length > 2 && (
        <Paper
          sx={{
            position: 'absolute',
            zIndex: 10,
            mt: 1,
            width: '100%',
            maxHeight: 300,
            overflowY: 'auto',
            p: 2,
          }}
        >
          <Typography variant="h6" sx={{ mb: 1, color: 'primary.main' }}>
            Search Results:
          </Typography>
          <List>
            {results.map((result, index) => (
              <ListItem key={index} disablePadding>
                <ListItemButton onClick={() => handleClickResult(result.item)}>
                  <ListItemText
                    primary={
                      <Typography variant="body1">
                        <Typography component="span" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                          {result.item.bookId.toUpperCase()} {result.item.chapter}:{result.item.verse}
                        </Typography>
                        <Typography component="span" sx={{ ml: 1, fontSize: '0.8rem', color: 'secondary.main' }}>
                          ({result.item.version.toUpperCase()})
                        </Typography>
                      </Typography>
                    }
                    secondary={result.item.text}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Paper>
      )}
    </Box>
  );
}
