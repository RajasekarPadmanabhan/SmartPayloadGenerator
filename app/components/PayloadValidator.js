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
  Grid,
  Chip,
  Stack
} from '@mui/material';
import {
  CheckCircle,
  Close,
  Error,
  Warning,
  Code,
  DataObject,
  ContentPaste,
  Clear
} from '@mui/icons-material';

export default function PayloadValidator({ onClose = null }) {
  const [payloadContent, setPayloadContent] = useState('');
  const [payloadType, setPayloadType] = useState('auto');
  const [validationResult, setValidationResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleValidate = () => {
    if (!payloadContent.trim()) {
      setValidationResult({
        isValid: false,
        type: 'error',
        message: 'Please enter JSON or XML content to validate'
      });
      return;
    }

    setLoading(true);
    setValidationResult(null);

    // Simulate validation with a small delay for better UX
    setTimeout(() => {
      try {
        const trimmedContent = payloadContent.trim();

        // Auto-detect format if set to auto
        let detectedType = payloadType;
        if (payloadType === 'auto') {
          detectedType = trimmedContent.startsWith('<') ? 'xml' : 'json';
        }

        if (detectedType === 'json') {
          // Validate JSON
          JSON.parse(trimmedContent);
          setValidationResult({
            isValid: true,
            type: 'success',
            format: 'JSON',
            message: 'Valid JSON format! The payload structure is correct.',
            details: {
              size: new Blob([trimmedContent]).size,
              lines: trimmedContent.split('\n').length,
              characters: trimmedContent.length
            }
          });
        } else if (detectedType === 'xml') {
          // Validate XML
          const parser = new DOMParser();
          const doc = parser.parseFromString(trimmedContent, 'application/xml');
          const errors = doc.getElementsByTagName('parsererror');

          if (errors.length > 0) {
            const errorText = errors[0].textContent || 'Invalid XML structure';
            throw new Error(errorText);
          }

          // Count elements for additional stats
          const allElements = doc.getElementsByTagName('*');

          setValidationResult({
            isValid: true,
            type: 'success',
            format: 'XML',
            message: 'Valid XML format! The payload structure is correct and well-formed.',
            details: {
              size: new Blob([trimmedContent]).size,
              lines: trimmedContent.split('\n').length,
              characters: trimmedContent.length,
              rootElement: doc.documentElement?.tagName || 'Unknown',
              elementCount: allElements.length
            }
          });
        }
      } catch (error) {
        const detectedType = payloadContent.trim().startsWith('<') ? 'XML' : 'JSON';
        let errorMessage = error.message;

        // Provide more helpful error messages
        if (detectedType === 'JSON') {
          if (errorMessage.includes('Unexpected token')) {
            errorMessage = 'Syntax error: Check for missing commas, quotes, or brackets';
          } else if (errorMessage.includes('Unexpected end')) {
            errorMessage = 'Incomplete JSON: Missing closing brackets or braces';
          }
        } else if (detectedType === 'XML') {
          if (errorMessage.includes('unclosed')) {
            errorMessage = 'XML error: Unclosed tag detected';
          } else if (errorMessage.includes('mismatched')) {
            errorMessage = 'XML error: Mismatched opening and closing tags';
          }
        }

        setValidationResult({
          isValid: false,
          type: 'error',
          format: detectedType,
          message: `Invalid ${detectedType} format detected`,
          error: errorMessage
        });
      } finally {
        setLoading(false);
      }
    }, 800);
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setPayloadContent(text);
      setValidationResult(null);

      // Auto-detect format immediately on paste if currently set to auto
      if (payloadType === 'auto') {
        detectAndSetFormat(text);
      }
    } catch (err) {
      console.error('Failed to read clipboard:', err);
    }
  };

  const handleClear = () => {
    setPayloadContent('');
    setValidationResult(null);
    // Reset to auto-detect when cleared
    setPayloadType('auto');
  };

  // Function to detect format and update payloadType
  const detectAndSetFormat = (content) => {
    if (!content.trim()) {
      return; // Don't change if empty
    }

    const trimmedContent = content.trim();

    // Check for XML first (starts with < or <?xml)
    if (trimmedContent.startsWith('<')) {
      setPayloadType('xml');
      return;
    }

    // Check for JSON by trying to parse
    try {
      JSON.parse(trimmedContent);
      setPayloadType('json');
      return;
    } catch {
      // If neither XML nor valid JSON, keep auto-detect
      // This allows users to still manually select if auto-detection fails
    }
  };

  // Handle content change in textarea
  const handleContentChange = (event) => {
    const newContent = event.target.value;
    setPayloadContent(newContent);
    setValidationResult(null);

    // Only auto-detect format on significant content changes and if currently set to auto
    if (payloadType === 'auto' && newContent.trim().length > 5) {
      // Debounce format detection for typing
      if (window.formatDetectionTimeout) {
        clearTimeout(window.formatDetectionTimeout);
      }

      window.formatDetectionTimeout = setTimeout(() => {
        detectAndSetFormat(newContent);
      }, 1000); // 1 second delay for typing
    }
  };

  // Advanced XML Pretty Printer (similar to Notepad++)
  const prettyPrintXML = (xml) => {
    let formatted = '';
    let indent = 0;
    const tab = '  '; // 2 spaces for indentation

    // Remove extra whitespace
    xml = xml.replace(/>\s*</g, '><');

    // Split by tags
    const tokens = xml.split(/(<[^>]*>)/);

    tokens.forEach(token => {
      if (token.trim() === '') return;

      if (token.startsWith('<')) {
        // This is a tag
        const isClosingTag = token.startsWith('</');
        const isSelfClosing = token.endsWith('/>') || token.includes('xml version') || token.includes('DOCTYPE');
        const isComment = token.startsWith('<!--');
        const isProcessingInstruction = token.startsWith('<?');

        if (isClosingTag) {
          indent--;
        }

        // Add indentation
        formatted += tab.repeat(Math.max(0, indent)) + token;

        // Add newline after tag (except for text content)
        if (!isComment || token.endsWith('-->')) {
          formatted += '\n';
        }

        if (!isClosingTag && !isSelfClosing && !isComment && !isProcessingInstruction) {
          indent++;
        }
      } else {
        // This is text content
        const trimmedToken = token.trim();
        if (trimmedToken) {
          // Only add indentation if this is the only content on the line
          if (formatted.endsWith('\n')) {
            formatted += tab.repeat(Math.max(0, indent)) + trimmedToken + '\n';
          } else {
            formatted += trimmedToken;
          }
        }
      }
    });

    return formatted.trim();
  };

  const formatPayload = () => {
    if (!payloadContent.trim()) return;

    try {
      const trimmedContent = payloadContent.trim();

      if (trimmedContent.startsWith('<')) {
        // Format XML using advanced pretty printer
        const parser = new DOMParser();
        const doc = parser.parseFromString(trimmedContent, 'application/xml');

        // Check for parsing errors
        const errors = doc.getElementsByTagName('parsererror');
        if (errors.length > 0) {
          // If there are parsing errors, try basic formatting
          const formatted = prettyPrintXML(trimmedContent);
          setPayloadContent(formatted);
        } else {
          // Use DOM serializer and then pretty print
          const serializer = new XMLSerializer();
          let serialized = serializer.serializeToString(doc);
          const formatted = prettyPrintXML(serialized);
          setPayloadContent(formatted);
        }
      } else {
        // Format JSON
        const parsed = JSON.parse(trimmedContent);
        const formatted = JSON.stringify(parsed, null, 2);
        setPayloadContent(formatted);
      }
    } catch (error) {
      // If formatting fails, keep original content
      console.error('Failed to format:', error);
    }
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
              background: 'linear-gradient(45deg, #4caf50 30%, #8bc34a 90%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mr: 2,
              color: 'white'
            }}
          >
            <CheckCircle sx={{ fontSize: 28 }} />
          </Box>
          <Box>
            <Typography variant="h4" component="h2" fontWeight="bold" color="text.primary">
              Payload Validator
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Validate & beautify JSON and XML payloads
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

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          {/* Input Section */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom fontWeight={600} color="text.primary">
              📝 Payload Content
            </Typography>

            <Box sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'flex-start' }}>
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Format</InputLabel>
                <Select
                  value={payloadType}
                  onChange={(e) => setPayloadType(e.target.value)}
                  label="Format"
                  sx={{
                    '& .MuiSelect-select': {
                      display: 'flex',
                      alignItems: 'center',
                    }
                  }}
                >
                  <MenuItem value="auto">
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      Auto-detect
                    </Box>
                  </MenuItem>
                  <MenuItem value="json">
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <DataObject sx={{ mr: 1, fontSize: 18 }} />
                      JSON
                    </Box>
                  </MenuItem>
                  <MenuItem value="xml">
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Code sx={{ mr: 1, fontSize: 18 }} />
                      XML
                    </Box>
                  </MenuItem>
                </Select>
              </FormControl>

              <Button
                variant="outlined"
                size="small"
                onClick={handlePaste}
                startIcon={<ContentPaste />}
                sx={{ fontWeight: 500 }}
              >
                Paste
              </Button>

              <Button
                variant="outlined"
                size="small"
                onClick={handleClear}
                startIcon={<Clear />}
                sx={{ fontWeight: 500 }}
              >
                Clear
              </Button>

              <Button
                variant="contained"
                size="small"
                onClick={formatPayload}
                startIcon={<Code />}
                sx={{
                  fontWeight: 500,
                  background: 'linear-gradient(45deg, #4caf50 30%, #8bc34a 90%)',
                  color: 'white',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #45a049 30%, #7cb342 90%)',
                  }
                }}
                disabled={!payloadContent.trim()}
              >
                Beautify
              </Button>
            </Box>

            <TextField
              fullWidth
              multiline
              rows={14}
              value={payloadContent}
              onChange={handleContentChange}
              placeholder="Paste your JSON or XML payload here..."
              sx={{
                '& .MuiOutlinedInput-root': {
                  fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
                  fontSize: '0.875rem',
                  background: 'rgba(0,0,0,0.02)',
                }
              }}
            />
          </Box>

          <Button
            variant="contained"
            onClick={handleValidate}
            disabled={loading || !payloadContent.trim()}
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <CheckCircle />}
            fullWidth
            size="large"
            sx={{
              py: 2,
              fontSize: '1.1rem',
              fontWeight: 600,
              background: 'linear-gradient(45deg, #4caf50 30%, #8bc34a 90%)',
              '&:disabled': {
                background: 'rgba(0,0,0,0.12)',
              }
            }}
          >
            {loading ? 'Validating...' : 'Validate Payload'}
          </Button>
        </Grid>

        <Grid item xs={12} md={6}>
          {/* Results Section */}
          <Box>
            <Typography variant="h6" gutterBottom fontWeight={600} color="text.primary">
              ✅ Validation Result
            </Typography>

            {validationResult && (
              <Alert
                severity={validationResult.type}
                sx={{
                  mb: 2,
                  borderRadius: 2,
                  '& .MuiAlert-icon': {
                    fontSize: 24
                  }
                }}
                icon={
                  validationResult.type === 'success' ? <CheckCircle /> :
                    validationResult.type === 'error' ? <Error /> : <Warning />
                }
              >
                <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                  {validationResult.isValid ?
                    `✅ Valid ${validationResult.format}` :
                    `❌ Invalid ${validationResult.format}`
                  }
                </Typography>
                <Typography variant="body2" sx={{ mb: validationResult.error ? 1 : 0 }}>
                  {validationResult.message}
                </Typography>
                {validationResult.error && (
                  <Typography
                    variant="body2"
                    sx={{
                      fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
                      background: 'rgba(0,0,0,0.1)',
                      p: 1,
                      borderRadius: 1,
                      mt: 1
                    }}
                  >
                    {validationResult.error}
                  </Typography>
                )}
              </Alert>
            )}

            {validationResult?.isValid && validationResult.details && (
              <Paper
                sx={{
                  p: 3,
                  background: 'linear-gradient(45deg, rgba(76, 175, 80, 0.05), rgba(139, 195, 74, 0.05))',
                  border: '1px solid rgba(76, 175, 80, 0.2)',
                  borderRadius: 2
                }}
              >
                <Typography variant="subtitle1" fontWeight={600} gutterBottom color="success.main">
                  📊 Payload Statistics
                </Typography>

                <Stack spacing={2}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">Size:</Typography>
                    <Chip
                      label={`${validationResult.details.size} bytes`}
                      size="small"
                      color="success"
                      variant="outlined"
                    />
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">Lines:</Typography>
                    <Chip
                      label={validationResult.details.lines}
                      size="small"
                      color="success"
                      variant="outlined"
                    />
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">Characters:</Typography>
                    <Chip
                      label={validationResult.details.characters}
                      size="small"
                      color="success"
                      variant="outlined"
                    />
                  </Box>

                  {validationResult.details.rootElement && (
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">Root Element:</Typography>
                      <Chip
                        label={validationResult.details.rootElement}
                        size="small"
                        color="success"
                        variant="outlined"
                      />
                    </Box>
                  )}

                  {validationResult.details.elementCount && (
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">XML Elements:</Typography>
                      <Chip
                        label={validationResult.details.elementCount}
                        size="small"
                        color="success"
                        variant="outlined"
                      />
                    </Box>
                  )}
                </Stack>
              </Paper>
            )}

            {!validationResult && !loading && (
              <Paper
                sx={{
                  p: 4,
                  textAlign: 'center',
                  background: 'linear-gradient(45deg, rgba(76, 175, 80, 0.05), rgba(139, 195, 74, 0.05))',
                  border: '2px dashed rgba(76, 175, 80, 0.3)',
                  borderRadius: 3
                }}
              >
                <CheckCircle sx={{ fontSize: 64, color: 'success.main', mb: 2, opacity: 0.7 }} />
                <Typography variant="h6" color="text.primary" gutterBottom fontWeight={600}>
                  Ready to Validate
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Paste your JSON or XML payload and click &quot;Validate&quot; to check its structure
                </Typography>
              </Paper>
            )}

            {loading && (
              <Paper
                sx={{
                  p: 4,
                  textAlign: 'center',
                  background: 'linear-gradient(45deg, rgba(76, 175, 80, 0.05), rgba(139, 195, 74, 0.05))',
                  border: '1px solid rgba(76, 175, 80, 0.2)',
                  borderRadius: 3
                }}
              >
                <CircularProgress
                  size={60}
                  sx={{
                    mb: 2,
                    color: 'success.main'
                  }}
                />
                <Typography variant="h6" color="text.primary" gutterBottom fontWeight={600}>
                  Validating Payload...
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Checking your payload structure and syntax
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
          p: 3,
          background: 'linear-gradient(45deg, rgba(76, 175, 80, 0.05), rgba(139, 195, 74, 0.05))',
          border: '1px solid rgba(76, 175, 80, 0.2)',
          borderRadius: 2
        }}
      >
        <Typography variant="h6" gutterBottom fontWeight={600} color="success.main">
          💡 Validation Tips
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography variant="body2" color="text.secondary" paragraph>
              <strong>JSON Validation:</strong> Checks for proper syntax, balanced brackets, valid strings, and correct data types.
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="body2" color="text.secondary" paragraph>
              <strong>XML Validation:</strong> Verifies well-formed structure, properly closed tags, and valid character encoding.
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}
