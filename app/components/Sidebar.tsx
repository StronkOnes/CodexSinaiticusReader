import React from 'react';
import Link from 'next/link';
import { Drawer, Box, Typography, List, ListItem, ListItemButton, ListItemText } from '@mui/material';

interface Book {
  name: string;
  id: string;
}

interface BookCategories {
  [category: string]: Book[];
}

interface SidebarProps {
  bookCategories: BookCategories;
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

export default function Sidebar({ bookCategories, isSidebarOpen, toggleSidebar }: SidebarProps) {
  const drawerContent = (
    <Box sx={{ p: 2, width: 250 }} role="presentation">
      <Typography variant="h6" component="h1" sx={{ mb: 2, color: 'primary.main', fontWeight: 'bold' }}>
        Codex Sinaiticus Reader
      </Typography>
      <List>
        {Object.entries(bookCategories).map(([category, books]) => (
          <React.Fragment key={category}>
            <ListItem>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: 'primary.main' }}>{category}</Typography>
            </ListItem>
            {books.map((book) => (
              <ListItem key={book.id} disablePadding>
                <ListItemButton component={Link} href={`/book/${book.id}`}>
                  <ListItemText primary={book.name} />
                </ListItemButton>
              </ListItem>
            ))}
          </React.Fragment>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      <Drawer
        variant="temporary"
        open={isSidebarOpen}
        onClose={toggleSidebar}
        sx={{
          display: { xs: 'block', lg: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 250, bgcolor: 'background.paper' },
        }}
      >
        {drawerContent}
      </Drawer>
      <Drawer
        variant="persistent"
        sx={{
          display: { xs: 'none', lg: 'block' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 250, bgcolor: 'background.paper' },
        }}
        open={isSidebarOpen}
      >
        {drawerContent}
      </Drawer>
    </>
  );
}
