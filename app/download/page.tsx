
import React from 'react';
import { Container, Typography, Button, Paper, Box } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';

const DownloadPage = () => {
  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4, backgroundColor: 'rgba(255, 255, 255, 0.9)' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Download the Codex Sinaticus Reader App
        </Typography>
        <Typography variant="body1" paragraph>
          Our mobile application offers a streamlined experience for accessing the digital scriptorium on your Android device. The app is a Progressive Web App (PWA) derivative, which means it's built with web technology and wrapped in a native container. This allows for a lightweight, fast, and secure experience.
        </Typography>
        <Typography variant="h6" gutterBottom>
          How to Install
        </Typography>
        <Typography variant="body1" paragraph>
          1.  Click the download button below to get the APK file.
        </Typography>
        <Typography variant="body1" paragraph>
          2.  Before you can install it, you may need to allow your device to install apps from "unknown sources". This is a standard Android security measure. You can usually find this setting in:
        </Typography>
        <Typography variant="body2" component="div" sx={{ pl: 2, mb: 2 }}>
            <Box component="ul" sx={{ m: 0, p: 0, pl: 2 }}>
                <li><strong>Settings &gt; Security</strong></li>
                <li><strong>Settings &gt; Apps &gt; Special app access &gt; Install unknown apps</strong></li>
            </Box>
        </Typography>
        <Typography variant="body1" paragraph>
          3.  Once you've enabled this setting, open the downloaded <code>.apk</code> file to install the application.
        </Typography>
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            href="/download/Codex_Sinaticus_Reader.apk"
            download
            startIcon={<DownloadIcon />}
          >
            Download Android App
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default DownloadPage;
