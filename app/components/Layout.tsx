'use client';

import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { SINAITICUS_BOOKS } from '@/lib/books';
import { useTheme } from './ThemeProvider';
import { Box } from '@mui/material';

interface LayoutProps {
  children: React.ReactNode;
}

// Dynamically generate bookCategories from SINAITICUS_BOOKS
const bookCategories = SINAITICUS_BOOKS.reduce((acc, book) => {
  const { section, name, id } = book;
  if (!acc[section]) {
    acc[section] = [];
  }
  acc[section].push({ name, id });
  return acc;
}, {} as Record<string, { name: string; id: string }[]>);


export default function Layout({ children }: LayoutProps) {
  const { isDarkMode, toggleDarkMode } = useTheme();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); 

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', bgcolor: 'background.default', color: 'text.primary' }}>
      <Topbar toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} toggleSidebar={toggleSidebar} />
      <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden', mt: '64px' }}>
        <Sidebar bookCategories={bookCategories} isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            transition: (theme) => theme.transitions.create('margin', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen,
            }),
            marginLeft: { lg: isSidebarOpen ? 0 : '-250px' },
            overflowY: 'auto',
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
}
