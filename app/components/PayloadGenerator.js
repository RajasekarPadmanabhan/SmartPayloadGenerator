'use client';

import { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  IconButton,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Grid
} from '@mui/material';
import {
  CloudUpload,
  Close,
  DataObject,
  Code,
  Download,
  ExpandMore,
  CheckCircle,
  Error,
  ContentCopy
} from '@mui/icons-material';

import XSDParser from '../utils/xsdParser';
import PayloadGeneratorUtil from '../utils/payloadGenerator';

export default function PayloadGeneratorComponent({ onClose = null }) {
  const [filterCondition, setFilterCondition] = useState('');
  const [schemaFile, setSchemaFile] = useState(null);
  const [outputFormat, setOutputFormat] = useState('json');
  const [generatedPayload, setGeneratedPayload] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.name.endsWith('.xsd')) {
      setSchemaFile(file);
      setError('');
      setSuccess(false);
    } else {
      setError('Please select a valid XSD file (.xsd extension required)');
      setSchemaFile(null);
    }
  };

  const handleGeneratePayload = async () => {
    if (!schemaFile) {
      setError('Please upload an XSD schema file first');
      return;
    }

    setLoading(true);
    setError('');
    setGeneratedPayload('');
    setSuccess(false);

    try {
      // Read the XSD file
      const fileContent = await readFileContent(schemaFile);

      // Parse the XSD schema
      const parser = new XSDParser();
      const schema = await parser.parse(fileContent);

      // Generate payload
      const generator = new PayloadGeneratorUtil();
      const payload = generator.generate(schema, filterCondition, outputFormat);

      setGeneratedPayload(payload);
      setSuccess(true);
    } catch (err) {
      setError(`Error generating payload: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const readFileContent = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = (e) => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  };

  const handleDownload = () => {
    if (!generatedPayload) return;

    const extension = outputFormat === 'json' ? 'json' : 'xml';
    const mimeType = outputFormat === 'json' ? 'application/json' : 'application/xml';

    const blob = new Blob([generatedPayload], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `generated-payload.${extension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleCopy = async () => {
    if (!generatedPayload) return;

    try {
      await navigator.clipboard.writeText(generatedPayload);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = generatedPayload;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (fallbackErr) {
        console.error('Fallback copy failed:', fallbackErr);
      }
      document.body.removeChild(textArea);
    }
  };

  const handleReset = () => {
    setFilterCondition('');
    setSchemaFile(null);
    setGeneratedPayload('');
    setError('');
    setSuccess(false);
    setCopied(false);
    // Reset file input
    const fileInput = document.getElementById('schema-file-input');
    if (fileInput) fileInput.value = '';
  };

  return (
    <Box sx={{ p: 4 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box
            sx={{
              width: 50,
              height: 50,
              borderRadius: '50%',
              background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mr: 2,
              color: 'white'
            }}
          >
            <DataObject sx={{ fontSize: 28 }} />
          </Box>
          <Box>
            <Typography variant="h4" component="h2" fontWeight="bold" color="text.primary">
              Payload Generator
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Transform XSD schemas into beautiful payloads
            </Typography>
          </Box>
        </Box>
        {onClose && (
          <IconButton
            onClick={onClose}
            size="large"
            sx={{
              background: 'rgba(0,0,0,0.05)',
              '&:hover': {
                background: 'rgba(0,0,0,0.1)',
              }
            }}
          >
            <Close />
          </IconButton>
        )}
      </Box>

      <Divider sx={{ mb: 4, opacity: 0.3 }} />

      {/* Form Section */}
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          {/* Filter Condition */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom fontWeight={600} color="text.primary">
              🎯 Filter Conditions
            </Typography>
            <TextField
              fullWidth
              label="Filter Condition (optional)"
              placeholder="e.g., price < 500 and inStock = true OR complex XPath expressions"
              value={filterCondition}
              onChange={(e) => setFilterCondition(e.target.value)}
              multiline
              rows={4}
              sx={{
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  background: 'rgba(102, 126, 234, 0.02)',
                }
              }}
              helperText="Enter simple conditions (price < 500) or complex XPath expressions for advanced filtering"
            />
          </Box>

          {/* Output Format */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom fontWeight={600} color="text.primary">
              📄 Output Format
            </Typography>
            <FormControl fullWidth>
              <InputLabel>Output Format</InputLabel>
              <Select
                value={outputFormat}
                onChange={(e) => setOutputFormat(e.target.value)}
                label="Output Format"
                sx={{
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(102, 126, 234, 0.3)',
                  }
                }}
              >
                <MenuItem value="json">
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <DataObject sx={{ mr: 1, color: 'primary.main' }} />
                    JSON
                  </Box>
                </MenuItem>
                <MenuItem value="xml">
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Code sx={{ mr: 1, color: 'secondary.main' }} />
                    XML
                  </Box>
                </MenuItem>
              </Select>
            </FormControl>
          </Box>

          {/* File Upload */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom fontWeight={600} color="text.primary">
              📁 Upload XSD Schema
            </Typography>
            <input
              id="schema-file-input"
              type="file"
              accept=".xsd"
              onChange={handleFileUpload}
              style={{ display: 'none' }}
            />
            <label htmlFor="schema-file-input">
              <Paper
                component="span"
                sx={{
                  p: 3,
                  display: 'block',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  border: '2px dashed',
                  borderColor: schemaFile ? 'success.main' : 'primary.main',
                  background: schemaFile
                    ? 'linear-gradient(45deg, rgba(76, 175, 80, 0.1), rgba(139, 195, 74, 0.1))'
                    : 'linear-gradient(45deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1))',
                  '&:hover': {
                    borderColor: schemaFile ? 'success.dark' : 'primary.dark',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                  }
                }}
              >
                <CloudUpload
                  sx={{
                    fontSize: 48,
                    color: schemaFile ? 'success.main' : 'primary.main',
                    mb: 2
                  }}
                />
                <Typography variant="h6" gutterBottom fontWeight={600}>
                  {schemaFile ? schemaFile.name : 'Choose XSD File'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {schemaFile ? 'File selected successfully!' : 'Click here or drag and drop your XSD schema file'}
                </Typography>
              </Paper>
            </label>
            {schemaFile && (
              <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Chip
                  icon={<CheckCircle />}
                  label={`${schemaFile.name} (${(schemaFile.size / 1024).toFixed(1)} KB)`}
                  color="success"
                  variant="filled"
                  sx={{ fontWeight: 500 }}
                />
              </Box>
            )}
          </Box>

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            <Button
              variant="contained"
              onClick={handleGeneratePayload}
              disabled={loading || !schemaFile}
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Code />}
              fullWidth
              size="large"
              sx={{
                py: 2,
                fontSize: '1.1rem',
                fontWeight: 600,
                background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                '&:disabled': {
                  background: 'rgba(0,0,0,0.12)',
                }
              }}
            >
              {loading ? 'Generating Magic...' : 'Generate Payload ✨'}
            </Button>
            <Button
              variant="outlined"
              onClick={handleReset}
              disabled={loading}
              size="large"
              sx={{
                borderWidth: 2,
                '&:hover': {
                  borderWidth: 2,
                }
              }}
            >
              Reset
            </Button>
          </Box>
        </Grid>

        <Grid item xs={12} md={6}>
          {/* Results Section */}
          <Box>
            <Typography variant="h6" gutterBottom fontWeight={600} color="text.primary">
              🎉 Generated Payload
            </Typography>

            {error && (
              <Alert
                severity="error"
                sx={{
                  mb: 2,
                  borderRadius: 2,
                  '& .MuiAlert-icon': {
                    fontSize: 24
                  }
                }}
                icon={<Error />}
              >
                {error}
              </Alert>
            )}

            {success && (
              <Alert
                severity="success"
                sx={{
                  mb: 2,
                  borderRadius: 2,
                  background: 'linear-gradient(45deg, rgba(76, 175, 80, 0.1), rgba(139, 195, 74, 0.1))',
                  border: '1px solid rgba(76, 175, 80, 0.3)',
                  '& .MuiAlert-icon': {
                    fontSize: 24
                  }
                }}
                action={
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      color="inherit"
                      size="small"
                      onClick={handleCopy}
                      startIcon={<ContentCopy />}
                      disabled={copied}
                      sx={{
                        fontWeight: 600,
                        background: copied ? 'rgba(76, 175, 80, 0.2)' : 'rgba(255,255,255,0.2)',
                        '&:hover': {
                          background: 'rgba(255,255,255,0.3)',
                        }
                      }}
                    >
                      {copied ? 'Copied! ✓' : 'Copy'}
                    </Button>
                    <Button
                      color="inherit"
                      size="small"
                      onClick={handleDownload}
                      startIcon={<Download />}
                      sx={{
                        fontWeight: 600,
                        background: 'rgba(255,255,255,0.2)',
                        '&:hover': {
                          background: 'rgba(255,255,255,0.3)',
                        }
                      }}
                    >
                      Download
                    </Button>
                  </Box>
                }
              >
                <Typography fontWeight={600}>
                  🎉 Payload generated successfully! Your data is ready to use.
                </Typography>
              </Alert>
            )}

            {generatedPayload && (
              <Paper
                variant="outlined"
                sx={{
                  background: 'linear-gradient(45deg, rgba(0,0,0,0.02), rgba(102, 126, 234, 0.02))',
                  border: '1px solid rgba(102, 126, 234, 0.2)',
                  borderRadius: 2,
                  overflow: 'hidden'
                }}
              >
                <Box sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  p: 2,
                  background: 'linear-gradient(45deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1))',
                  borderBottom: '1px solid rgba(102, 126, 234, 0.2)'
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Chip
                      label={outputFormat.toUpperCase()}
                      size="small"
                      sx={{
                        background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                        color: 'white',
                        fontWeight: 600
                      }}
                    />
                    <Typography variant="body2" color="text.secondary" fontWeight={500}>
                      Ready to use payload
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton
                      onClick={handleCopy}
                      size="small"
                      title="Copy to clipboard"
                      sx={{
                        background: 'rgba(102, 126, 234, 0.1)',
                        '&:hover': {
                          background: 'rgba(102, 126, 234, 0.2)',
                        }
                      }}
                    >
                      <ContentCopy fontSize="small" />
                    </IconButton>
                    <IconButton
                      onClick={handleDownload}
                      size="small"
                      title="Download payload"
                      sx={{
                        background: 'rgba(240, 147, 251, 0.1)',
                        '&:hover': {
                          background: 'rgba(240, 147, 251, 0.2)',
                        }
                      }}
                    >
                      <Download fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>
                <Box sx={{ p: 2, maxHeight: 400, overflow: 'auto' }}>
                  <pre style={{
                    margin: 0,
                    fontSize: '0.875rem',
                    fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                    lineHeight: 1.5,
                    color: '#2d3748'
                  }}>
                    {generatedPayload}
                  </pre>
                </Box>
              </Paper>
            )}

            {!generatedPayload && !loading && (
              <Paper
                variant="outlined"
                sx={{
                  p: 6,
                  textAlign: 'center',
                  background: 'linear-gradient(45deg, rgba(102, 126, 234, 0.05), rgba(118, 75, 162, 0.05))',
                  border: '2px dashed rgba(102, 126, 234, 0.3)',
                  borderRadius: 3,
                  transition: 'all 0.3s ease'
                }}
              >
                <DataObject sx={{ fontSize: 64, color: 'primary.main', mb: 2, opacity: 0.7 }} />
                <Typography variant="h6" color="text.primary" gutterBottom fontWeight={600}>
                  Your Generated Payload Will Appear Here
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Upload an XSD schema and click &quot;Generate Payload&quot; to see the magic happen ✨
                </Typography>
              </Paper>
            )}

            {loading && (
              <Paper
                variant="outlined"
                sx={{
                  p: 6,
                  textAlign: 'center',
                  background: 'linear-gradient(45deg, rgba(102, 126, 234, 0.05), rgba(118, 75, 162, 0.05))',
                  border: '1px solid rgba(102, 126, 234, 0.2)',
                  borderRadius: 3
                }}
              >
                <CircularProgress
                  size={60}
                  sx={{
                    mb: 2,
                    '& .MuiCircularProgress-circle': {
                      stroke: 'url(#gradient)',
                    }
                  }}
                />
                <svg width={0} height={0}>
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#667eea" />
                      <stop offset="100%" stopColor="#764ba2" />
                    </linearGradient>
                  </defs>
                </svg>
                <Typography variant="h6" color="text.primary" gutterBottom fontWeight={600}>
                  Generating Your Payload...
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Our AI is crafting the perfect payload for you 🎯
                </Typography>
              </Paper>
            )}
          </Box>
        </Grid>
      </Grid>

      {/* Help Section */}
      <Paper
        sx={{
          mt: 4,
          background: 'linear-gradient(45deg, rgba(102, 126, 234, 0.05), rgba(118, 75, 162, 0.05))',
          border: '1px solid rgba(102, 126, 234, 0.2)',
          borderRadius: 2,
          overflow: 'hidden'
        }}
      >
        <Accordion
          sx={{
            background: 'transparent',
            boxShadow: 'none',
            '&:before': {
              display: 'none',
            }
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMore />}
            sx={{
              background: 'linear-gradient(45deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1))',
              '& .MuiAccordionSummary-content': {
                alignItems: 'center',
              }
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mr: 2,
                  color: 'white'
                }}
              >
                ❓
              </Box>
              <Box>
                <Typography variant="h6" fontWeight={600}>
                  How to use this tool
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Step-by-step guide to generate perfect payloads
                </Typography>
              </Box>
            </Box>
          </AccordionSummary>
          <AccordionDetails sx={{ p: 3 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Box sx={{ display: 'flex', mb: 3 }}>
                  <Box
                    sx={{
                      width: 30,
                      height: 30,
                      borderRadius: '50%',
                      background: 'linear-gradient(45deg, #4caf50 30%, #8bc34a 90%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mr: 2,
                      color: 'white',
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      flexShrink: 0
                    }}
                  >
                    1
                  </Box>
                  <Box>
                    <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                      📁 Upload XSD Schema
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Select a valid XSD schema file (.xsd extension). Our system supports complex schemas with nested elements and data types.
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', mb: 3 }}>
                  <Box
                    sx={{
                      width: 30,
                      height: 30,
                      borderRadius: '50%',
                      background: 'linear-gradient(45deg, #2196f3 30%, #03a9f4 90%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mr: 2,
                      color: 'white',
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      flexShrink: 0
                    }}
                  >
                    2
                  </Box>
                  <Box>
                    <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                      🎯 Add Filter Conditions (Optional)
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Enter simple conditions like &quot;price {'<'} 500&quot; or complex XPath expressions like &quot;not(DeliveryType=&quot;ZLR&quot;) to control the generated data.
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              <Grid item xs={12} md={6}>
                <Box sx={{ display: 'flex', mb: 3 }}>
                  <Box
                    sx={{
                      width: 30,
                      height: 30,
                      borderRadius: '50%',
                      background: 'linear-gradient(45deg, #ff9800 30%, #ffc107 90%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mr: 2,
                      color: 'white',
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      flexShrink: 0
                    }}
                  >
                    3
                  </Box>
                  <Box>
                    <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                      📄 Choose Output Format
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Select JSON for modern APIs or XML for traditional systems. Both formats will be perfectly structured and valid.
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex' }}>
                  <Box
                    sx={{
                      width: 30,
                      height: 30,
                      borderRadius: '50%',
                      background: 'linear-gradient(45deg, #e91e63 30%, #f06292 90%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mr: 2,
                      color: 'white',
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      flexShrink: 0
                    }}
                  >
                    4
                  </Box>
                  <Box>
                    <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                      ✨ Generate & Download
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Click &quot;Generate Payload&quot; to create beautiful, valid payloads with realistic dummy data. Copy to clipboard or download instantly!
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>
      </Paper>
    </Box>
  );
}
