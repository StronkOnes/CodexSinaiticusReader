'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { AppBar, Toolbar, IconButton, Typography, Box, Switch, FormControlLabel, Button } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

interface TopbarProps {
  toggleDarkMode: () => void;
  isDarkMode: boolean;
  toggleSidebar: () => void;
}

export default function Topbar({ toggleDarkMode, isDarkMode, toggleSidebar }: TopbarProps) {
  const logoSrc = isDarkMode ? '/Darklogo.png' : '/logo.png';

  return (
    <AppBar position="fixed" sx={{ bgcolor: 'background.paper', backdropFilter: 'blur(16px)' }}>
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={toggleSidebar}
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>
        <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
          <Link href="/" passHref>
            <Box sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'inherit' }}>
              <Image src={logoSrc} alt="Codex Sinaiticus Reader Logo" width={32} height={32} />
              <Typography variant="h6" component="div" sx={{ ml: 1, color: 'primary.main', fontWeight: 'bold' }}>
                Codex Sinaiticus Reader
              </Typography>
            </Box>
          </Link>
        </Box>
        <Button href="/download" sx={{ my: 2, color: 'text.primary', display: 'block' }}>
            Download
        </Button>
        <FormControlLabel
          control={<Switch checked={isDarkMode} onChange={toggleDarkMode} />}
          label="Dark Mode"
        />
      </Toolbar>
    </AppBar>
  );
}