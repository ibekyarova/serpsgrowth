import { Box, TextField, Typography } from '@mui/material';

interface KeywordInputProps {
  keyword: string;
  onKeywordChange: (keyword: string) => void;
}

const KeywordInput = ({ keyword, onKeywordChange }: KeywordInputProps) => {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Main Keyword
      </Typography>
      <TextField
        fullWidth
        label="Enter your main keyword"
        value={keyword}
        onChange={(e) => onKeywordChange(e.target.value)}
        placeholder="e.g., Best SEO practices for 2025"
      />
    </Box>
  );
};

export default KeywordInput;
