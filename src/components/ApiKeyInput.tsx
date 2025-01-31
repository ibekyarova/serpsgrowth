import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { ApiConfig } from '../types';

interface ApiKeyInputProps {
  apiConfig: ApiConfig;
  onApiConfigChange: (config: ApiConfig) => void;
}

const providers = [
  { id: 'openai', name: 'OpenAI' },
  { id: 'anthropic', name: 'Anthropic' },
  { id: 'google', name: 'Google AI' },
];

const ApiKeyInput = ({ apiConfig, onApiConfigChange }: ApiKeyInputProps) => {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        API Configuration
      </Typography>
      <Box sx={{ display: 'flex', gap: 2 }}>
        <FormControl fullWidth>
          <InputLabel>AI Provider</InputLabel>
          <Select
            value={apiConfig.provider}
            label="AI Provider"
            onChange={(e) =>
              onApiConfigChange({ ...apiConfig, provider: e.target.value })
            }
          >
            {providers.map((provider) => (
              <MenuItem key={provider.id} value={provider.id}>
                {provider.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          fullWidth
          label="API Key"
          type="password"
          value={apiConfig.apiKey}
          onChange={(e) =>
            onApiConfigChange({ ...apiConfig, apiKey: e.target.value })
          }
          sx={{ flexGrow: 1 }}
        />
      </Box>
    </Box>
  );
};

export default ApiKeyInput;
