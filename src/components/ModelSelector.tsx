import { useEffect, useState } from 'react';
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  CircularProgress,
  FormControlLabel,
  Switch,
  Divider,
} from '@mui/material';
import { ApiConfig, Model } from '../types';
import { fetchModels } from '../services/api';

interface ModelSelectorProps {
  apiConfig: ApiConfig;
  selectedModel: string;
  onModelSelect: (model: string) => void;
}

const ModelSelector = ({
  apiConfig,
  selectedModel,
  onModelSelect,
}: ModelSelectorProps) => {
  const [models, setModels] = useState<Model[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAllModels, setShowAllModels] = useState(false);

  useEffect(() => {
    const loadModels = async () => {
      if (!apiConfig.apiKey || !apiConfig.provider) return;
      
      setLoading(true);
      try {
        const availableModels = await fetchModels(apiConfig);
        setModels(availableModels.sort((a, b) => a.name.localeCompare(b.name)));
      } catch (error) {
        console.error('Error loading models:', error);
      } finally {
        setLoading(false);
      }
    };

    loadModels();
  }, [apiConfig]);

  const popularModels = models.filter((model) => model.isPopular);
  const otherModels = models.filter((model) => !model.isPopular);

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Model Selection
      </Typography>
      <FormControl fullWidth>
        <InputLabel>Select Model</InputLabel>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
            <CircularProgress size={24} />
          </Box>
        ) : (
          <>
            <Select
              value={selectedModel}
              label="Select Model"
              onChange={(e) => onModelSelect(e.target.value)}
              disabled={!apiConfig.apiKey || !apiConfig.provider}
            >
              <MenuItem disabled>
                <Typography variant="subtitle2" color="primary">
                  Popular Models
                </Typography>
              </MenuItem>
              {popularModels.map((model) => (
                <MenuItem key={model.id} value={model.id}>
                  {model.name}
                </MenuItem>
              ))}
              
              {showAllModels && otherModels.length > 0 && (
                <>
                  <Divider sx={{ my: 1 }} />
                  <MenuItem disabled>
                    <Typography variant="subtitle2" color="primary">
                      Other Models
                    </Typography>
                  </MenuItem>
                  {otherModels.map((model) => (
                    <MenuItem key={model.id} value={model.id}>
                      {model.name}
                    </MenuItem>
                  ))}
                </>
              )}
            </Select>
            
            {otherModels.length > 0 && (
              <FormControlLabel
                control={
                  <Switch
                    checked={showAllModels}
                    onChange={(e) => setShowAllModels(e.target.checked)}
                  />
                }
                label="Show all models"
                sx={{ mt: 1 }}
              />
            )}
          </>
        )}
      </FormControl>
    </Box>
  );
};

export default ModelSelector;
