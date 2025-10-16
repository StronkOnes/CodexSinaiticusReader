'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useTheme } from './ThemeProvider';
import { Container, Box, Typography, Button } from '@mui/material';

export default function LandingPage() {
  const { isDarkMode } = useTheme();

  const logoSrc = isDarkMode ? '/Darklogo.png' : '/logo.png';

  return (
    <Container
      maxWidth="md"
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        p: 4,
      }}
    >
      <Box
        sx={{
          p: { xs: 4, md: 6 },
          maxWidth: 'lg',
          mx: 'auto',
          bgcolor: 'background.paper',
          borderRadius: '16px',
        }}
      >
        <Image
          src={logoSrc}
          alt="Codex Sinaiticus Reader Logo"
          width={128}
          height={128}
          style={{ margin: '0 auto 1.5rem' }}
        />
        <Typography variant="h2" component="h1" sx={{ mb: 2, color: 'primary.main', fontWeight: 'bold' }}>
          Codex Sinaiticus Reader
        </Typography>
        <Typography variant="h5" component="p" sx={{ mb: 4, lineHeight: 1.6, letterSpacing: '0.025em' }}>
          Explore the Codex Sinaiticus, one of the oldest and most complete manuscripts of the Bible.
          Dating from the mid-4th century, it offers a unique window into the early Christian text.
        </Typography>

        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 2 }}>
          <Button
            component={Link}
            href="/read?bookId=mat"
            variant="contained"
            color="primary"
            size="large"
          >
            Read Codex
          </Button>
          <Button
            component={Link}
            href="/download"
            variant="outlined"
            color="secondary"
            size="large"
          >
            Download App
          </Button>
        </Box>

        <Box sx={{ mt: 5, display: 'flex', justifyContent: 'center', gap: 2 }}>
          <Link href="/about" passHref>
            <Button variant="text" color="secondary">About</Button>
          </Link>
          <Link href="/contact" passHref>
            <Button variant="text" color="secondary">Contact</Button>
          </Link>
        </Box>
      </Box>
    </Container>
  );
}