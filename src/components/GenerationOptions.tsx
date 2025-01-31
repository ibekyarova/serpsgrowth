import { useState } from 'react';
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  FormControlLabel,
  Typography,
} from '@mui/material';
import { GenerationOptions as GenerationOptionsType } from '../types';

interface GenerationOptionsProps {
  options: GenerationOptionsType;
  onOptionsChange: (options: GenerationOptionsType) => void;
}

const articleLengths = [
  { value: '700-1200', label: '700 - 1,200 words' },
  { value: '1200-2000', label: '1,200 - 2,000 words' },
  { value: '2000-3500', label: '2,000 - 3,500 words' },
];

const languages = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'it', name: 'Italian' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'nl', name: 'Dutch' },
  { code: 'pl', name: 'Polish' },
  { code: 'ru', name: 'Russian' },
];

const countries = [
  { code: 'US', name: 'United States' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'CA', name: 'Canada' },
  { code: 'AU', name: 'Australia' },
  { code: 'DE', name: 'Germany' },
  { code: 'FR', name: 'France' },
  { code: 'ES', name: 'Spain' },
  { code: 'IT', name: 'Italy' },
  { code: 'BR', name: 'Brazil' },
];

const GenerationOptionsPanel = ({
  options,
  onOptionsChange,
}: GenerationOptionsProps) => {
  const handleChange = (field: keyof GenerationOptionsType, value: any) => {
    onOptionsChange({
      ...options,
      [field]: value,
    });
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Generation Options
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <FormControl fullWidth>
          <InputLabel>Article Length</InputLabel>
          <Select
            value={options.articleLength}
            label="Article Length"
            onChange={(e) => handleChange('articleLength', e.target.value)}
          >
            {articleLengths.map((length) => (
              <MenuItem key={length.value} value={length.value}>
                {length.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel>Language</InputLabel>
          <Select
            value={options.language.code}
            label="Language"
            onChange={(e) => {
              const language = languages.find((l) => l.code === e.target.value);
              if (language) {
                handleChange('language', language);
              }
            }}
          >
            {languages.map((language) => (
              <MenuItem key={language.code} value={language.code}>
                {language.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel>Target Country</InputLabel>
          <Select
            value={options.country.code}
            label="Target Country"
            onChange={(e) => {
              const country = countries.find((c) => c.code === e.target.value);
              if (country) {
                handleChange('country', country);
              }
            }}
          >
            {countries.map((country) => (
              <MenuItem key={country.code} value={country.code}>
                {country.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControlLabel
          control={
            <Switch
              checked={options.generateImages}
              onChange={(e) => handleChange('generateImages', e.target.checked)}
            />
          }
          label="Generate Images"
        />
      </Box>
    </Box>
  );
};

export default GenerationOptionsPanel;
