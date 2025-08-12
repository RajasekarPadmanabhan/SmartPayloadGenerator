'use client';

import { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Modal,
  Paper,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Chip,
  IconButton,
  Fade,
  Backdrop,
  useTheme,
  Divider,
  Stack,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import {
  CloudUpload,
  DataObject,
  Code,
  FilterList,
  AutoFixHigh,
  Security,
  Speed,
  Close,
  MoreVert,
  CheckCircle
} from '@mui/icons-material';

import PayloadGenerator from './components/PayloadGenerator';
import PayloadValidator from './components/PayloadValidator';

export default function Home() {
  const [generatorModalOpen, setGeneratorModalOpen] = useState(false);
  const [validatorModalOpen, setValidatorModalOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const menuOpen = Boolean(anchorEl);
  const theme = useTheme();

  const handleOpenGeneratorModal = () => {
    setGeneratorModalOpen(true);
    setAnchorEl(null); // Close menu
  };
  const handleCloseGeneratorModal = () => setGeneratorModalOpen(false);
  
  const handleOpenValidatorModal = () => {
    setValidatorModalOpen(true);
    setAnchorEl(null); // Close menu
  };
  const handleCloseValidatorModal = () => setValidatorModalOpen(false);
  
  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const features = [
    {
      icon: <Code />,
      title: "XSD Schema Support",
      description: "Upload any XSD schema file",
      color: theme.palette.primary.main
    },
    {
      icon: <DataObject />,
      title: "JSON & XML Output",
      description: "Generate in your preferred format",
      color: theme.palette.secondary.main
    },
    {
      icon: <FilterList />,
      title: "Smart Filtering",
      description: "Apply complex filter conditions",
      color: theme.palette.success.main
    },
    {
      icon: <AutoFixHigh />,
      title: "Realistic Data",
      description: "Intelligent dummy data generation",
      color: theme.palette.warning.main
    }
  ];

  return (
    <Box 
      sx={{ 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Animated Background Elements */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.1,
          background: `
            radial-gradient(circle at 20% 80%, #fff 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, #fff 0%, transparent 50%),
            radial-gradient(circle at 40% 40%, #fff 0%, transparent 50%)
          `,
        }}
      />

      {/* Menu Button */}
      <Box sx={{ position: 'absolute', top: 24, right: 24, zIndex: 10 }}>
        <IconButton
          onClick={handleMenuClick}
          sx={{
            background: 'rgba(255,255,255,0.2)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.3)',
            color: 'white',
            '&:hover': {
              background: 'rgba(255,255,255,0.3)',
            }
          }}
        >
          <MoreVert />
        </IconButton>
        
        <Menu
          anchorEl={anchorEl}
          open={menuOpen}
          onClose={handleMenuClose}
          PaperProps={{
            sx: {
              background: 'rgba(255,255,255,0.95)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.3)',
              borderRadius: 2,
              minWidth: 240,
              boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
            }
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <MenuItem 
            onClick={handleOpenGeneratorModal}
            sx={{
              py: 1.5,
              '&:hover': {
                background: 'rgba(102, 126, 234, 0.1)',
              }
            }}
          >
            <ListItemIcon>
              <DataObject sx={{ color: 'primary.main' }} />
            </ListItemIcon>
            <ListItemText 
              primary={
                <Typography fontWeight={600}>
                  Payload Generator
                </Typography>
              }
              secondary="Generate payloads from XSD schemas"
            />
          </MenuItem>
          
          <MenuItem 
            onClick={handleOpenValidatorModal}
            sx={{
              py: 1.5,
              '&:hover': {
                background: 'rgba(76, 175, 80, 0.1)',
              }
            }}
          >
            <ListItemIcon>
              <CheckCircle sx={{ color: 'success.main' }} />
            </ListItemIcon>
            <ListItemText 
              primary={
                <Typography fontWeight={600}>
                  Payload Validator
                </Typography>
              }
              secondary="Validate & beautify JSON/XML"
            />
          </MenuItem>
        </Menu>
      </Box>

      {/* Hero Section */}
      <Container maxWidth="lg" sx={{ position: 'relative', py: 4 }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Fade in timeout={1000}>
            <Box>
              <Typography 
                variant="h1" 
                component="h1" 
                sx={{ 
                  background: 'linear-gradient(45deg, #fff 30%, #f0f4ff 90%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 3,
                  textShadow: '0 4px 20px rgba(255,255,255,0.3)'
                }}
              >
                Smart Payload Generator/Validator
              </Typography>
              
              <Typography 
                variant="h5" 
                sx={{ 
                  color: 'rgba(255,255,255,0.9)',
                  mb: 4, 
                  lineHeight: 1.6,
                  fontWeight: 400,
                  maxWidth: 800,
                  mx: 'auto'
                }}
              >
                Transform XSD schemas into beautiful, valid JSON or XML payloads 
                with intelligent data generation and advanced filtering.
              </Typography>

              <Stack direction="row" spacing={2} sx={{ justifyContent: 'center', flexWrap: 'wrap', gap: 2 }}>
                <Chip 
                  icon={<Security />} 
                  label="Schema Validated" 
                  sx={{ 
                    background: 'rgba(255,255,255,0.2)', 
                    color: 'white',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.3)'
                  }}
                />
                <Chip 
                  icon={<Speed />} 
                  label="Lightning Fast" 
                  sx={{ 
                    background: 'rgba(255,255,255,0.2)', 
                    color: 'white',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.3)'
                  }}
                />
                <Chip 
                  icon={<Speed />} 
                  label="Production Ready" 
                  sx={{ 
                    background: 'rgba(255,255,255,0.2)', 
                    color: 'white',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.3)'
                  }}
                />
              </Stack>
            </Box>
          </Fade>
        </Box>

        {/* Action Buttons Section */}
        <Grid container spacing={4} justifyContent="center" sx={{ mt: 4 }}>
          <Grid item xs={12} sm={6} md={4}>
            <Fade in timeout={1200}>
              <Button
                variant="contained"
                fullWidth
                size="large"
                onClick={handleOpenGeneratorModal}
                startIcon={<DataObject />}
                sx={{
                  py: 3,
                  fontSize: '1.2rem',
                  fontWeight: 600,
                  background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                  borderRadius: 3,
                  textTransform: 'none',
                  boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #5a6fd8 30%, #6a4190 90%)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 12px 40px rgba(102, 126, 234, 0.4)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                Payload Generator
              </Button>
            </Fade>
          </Grid>
          
          <Grid item xs={12} sm={6} md={4}>
            <Fade in timeout={1400}>
              <Button
                variant="contained"
                fullWidth
                size="large"
                onClick={handleOpenValidatorModal}
                startIcon={<CheckCircle />}
                sx={{
                  py: 3,
                  fontSize: '1.2rem',
                  fontWeight: 600,
                  background: 'linear-gradient(45deg, #4caf50 30%, #8bc34a 90%)',
                  borderRadius: 3,
                  textTransform: 'none',
                  boxShadow: '0 8px 32px rgba(76, 175, 80, 0.3)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #45a049 30%, #7cb342 90%)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 12px 40px rgba(76, 175, 80, 0.4)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                Payload Validator
              </Button>
            </Fade>
          </Grid>
        </Grid>

        {/* Quick Info Section */}
        <Fade in timeout={1500}>
          <Box sx={{ mt: 8, textAlign: 'center' }}>
            <Typography 
              variant="h5" 
              sx={{ 
                color: 'rgba(255,255,255,0.9)',
                mb: 3,
                fontWeight: 600
              }}
            >
              Features at a Glance
            </Typography>
            
            <Grid container spacing={4} justifyContent="center">
              <Grid item xs={12} md={6}>
                <Box sx={{ 
                  background: 'rgba(255,255,255,0.1)', 
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: 2,
                  p: 3,
                  color: 'white'
                }}>
                  <DataObject sx={{ fontSize: 40, mb: 2, color: '#667eea' }} />
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    Payload Generator
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Upload XSD schemas • Apply smart filters • Generate realistic data • Export JSON/XML
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Box sx={{ 
                  background: 'rgba(255,255,255,0.1)', 
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: 2,
                  p: 3,
                  color: 'white'
                }}>
                  <CheckCircle sx={{ fontSize: 40, mb: 2, color: '#4caf50' }} />
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    Payload Validator
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Validate JSON/XML • Auto-detect format • Beautify & format • Detailed error reports
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Fade>

        {/* Quick Info Section */}
        <Fade in timeout={1500}>
          <Box sx={{ mt: 6, mb: 4, textAlign: 'center' }}>
            <Typography 
              variant="h6" 
              sx={{ 
                color: 'rgba(255,255,255,0.9)',
                mb: 2,
                fontWeight: 400
              }}
            >
              Use the tools above or access them via the menu for a full-screen experience
            </Typography>
          </Box>
        </Fade>
      </Container>

      {/* Generator Modal */}
      <Modal
        open={generatorModalOpen}
        onClose={handleCloseGeneratorModal}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 2
        }}
      >
        <Fade in={generatorModalOpen}>
          <Paper
            sx={{
              width: '100%',
              maxWidth: 900,
              maxHeight: '95vh',
              overflow: 'auto',
              borderRadius: 3,
              background: 'rgba(255,255,255,0.98)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.3)',
              boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
            }}
          >
            <PayloadGenerator onClose={handleCloseGeneratorModal} />
          </Paper>
        </Fade>
      </Modal>

      {/* Validator Modal */}
      <Modal
        open={validatorModalOpen}
        onClose={handleCloseValidatorModal}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 2
        }}
      >
        <Fade in={validatorModalOpen}>
          <Paper
            sx={{
              width: '100%',
              maxWidth: 800,
              maxHeight: '95vh',
              overflow: 'auto',
              borderRadius: 3,
              background: 'rgba(255,255,255,0.98)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.3)',
              boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
            }}
          >
            <PayloadValidator onClose={handleCloseValidatorModal} />
          </Paper>
        </Fade>
      </Modal>

      {/* Footer */}
      <Box 
        component="footer" 
        sx={{ 
          background: 'rgba(255,255,255,0.1)', 
          backdropFilter: 'blur(20px)',
          py: 3,
          borderTop: '1px solid rgba(255,255,255,0.2)',
          position: 'relative'
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="body2" color="rgba(255,255,255,0.8)" align="center">
            © 2025 Smart Payload Generator • Transform XSD schemas into beautiful payloads with ease ✨
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}
