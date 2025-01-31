import { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  TextField,
  IconButton,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import EditIcon from '@mui/icons-material/Edit';
import { ApiConfig } from '../types';
import { generateOutline } from '../services/api';

interface OutlineGeneratorProps {
  apiConfig: ApiConfig;
  selectedModel: string;
  keyword: string;
  backgroundInfo: string;
  outline: string[];
  onOutlineChange: (outline: string[]) => void;
}

const OutlineGenerator = ({
  apiConfig,
  selectedModel,
  keyword,
  backgroundInfo,
  outline,
  onOutlineChange,
}: OutlineGeneratorProps) => {
  const [loading, setLoading] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editValue, setEditValue] = useState('');
  const [copied, setCopied] = useState(false);

  const handleGenerateOutline = async () => {
    if (!keyword) return;

    setLoading(true);
    try {
      const generatedOutline = await generateOutline(
        apiConfig,
        selectedModel,
        keyword,
        backgroundInfo
      );
      onOutlineChange(generatedOutline);
    } catch (error) {
      console.error('Error generating outline:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyOutline = async () => {
    try {
      await navigator.clipboard.writeText(outline.join('\n'));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy outline:', error);
    }
  };

  const handleOpenEditDialog = () => {
    setEditValue(outline.join('\n'));
    setEditDialogOpen(true);
  };

  const handleSaveEdit = () => {
    const newOutline = editValue.split('\n').filter(line => line.trim());
    onOutlineChange(newOutline);
    setEditDialogOpen(false);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h6">Article Outline</Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          {outline.length > 0 && (
            <>
              <Button
                variant="outlined"
                onClick={handleCopyOutline}
                startIcon={<ContentCopyIcon />}
              >
                {copied ? 'Copied!' : 'Copy Outline'}
              </Button>
              <Button
                variant="outlined"
                onClick={handleOpenEditDialog}
                startIcon={<EditIcon />}
              >
                Edit Outline
              </Button>
            </>
          )}
          <Button
            variant="contained"
            onClick={handleGenerateOutline}
            disabled={loading || !keyword || !selectedModel}
            startIcon={loading ? <CircularProgress size={20} /> : null}
          >
            Generate Outline
          </Button>
        </Box>
      </Box>

      <Box sx={{ pl: 2 }}>
        {outline.map((item, index) => (
          <Typography
            key={index}
            sx={{
              mb: 1,
              pl: 2,
              borderLeft: '2px solid',
              borderColor: 'primary.main',
            }}
          >
            {item}
          </Typography>
        ))}
      </Box>

      <Dialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Edit Outline</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            multiline
            rows={10}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            placeholder="Enter each outline point on a new line"
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSaveEdit} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default OutlineGenerator;
