import { useState } from 'react';
import {
  Box,
  TextField,
  Typography,
  Chip,
  Button,
  Stack,
} from '@mui/material';
import { WebsiteInfo } from '../types';
import AddIcon from '@mui/icons-material/Add';

interface WebsiteInfoInputProps {
  websiteInfo: WebsiteInfo;
  onWebsiteInfoChange: (info: WebsiteInfo) => void;
}

const WebsiteInfoInput = ({
  websiteInfo,
  onWebsiteInfoChange,
}: WebsiteInfoInputProps) => {
  const [newLink, setNewLink] = useState('');

  const handleAddLink = () => {
    if (newLink && !websiteInfo.internalLinks.includes(newLink)) {
      onWebsiteInfoChange({
        ...websiteInfo,
        internalLinks: [...websiteInfo.internalLinks, newLink],
      });
      setNewLink('');
    }
  };

  const handleDeleteLink = (linkToDelete: string) => {
    onWebsiteInfoChange({
      ...websiteInfo,
      internalLinks: websiteInfo.internalLinks.filter(
        (link) => link !== linkToDelete
      ),
    });
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Website Information
      </Typography>
      <Stack spacing={2}>
        <TextField
          fullWidth
          label="Website URL"
          value={websiteInfo.url}
          onChange={(e) =>
            onWebsiteInfoChange({ ...websiteInfo, url: e.target.value })
          }
          placeholder="https://example.com"
        />

        <Box>
          <Typography variant="subtitle1" gutterBottom>
            Internal Links (Optional)
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
            <TextField
              fullWidth
              label="Add internal link"
              value={newLink}
              onChange={(e) => setNewLink(e.target.value)}
              placeholder="https://example.com/page"
            />
            <Button
              variant="contained"
              onClick={handleAddLink}
              disabled={!newLink}
              startIcon={<AddIcon />}
            >
              Add
            </Button>
          </Box>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {websiteInfo.internalLinks.map((link) => (
              <Chip
                key={link}
                label={link}
                onDelete={() => handleDeleteLink(link)}
              />
            ))}
          </Box>
        </Box>
      </Stack>
    </Box>
  );
};

export default WebsiteInfoInput;
