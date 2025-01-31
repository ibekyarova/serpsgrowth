import { Box, TextField, Typography } from '@mui/material';

interface BackgroundInfoProps {
  backgroundInfo: string;
  onBackgroundInfoChange: (info: string) => void;
}

const BackgroundInfo = ({
  backgroundInfo,
  onBackgroundInfoChange,
}: BackgroundInfoProps) => {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Background Information
      </Typography>
      <TextField
        fullWidth
        multiline
        rows={6}
        label="Enter background information"
        value={backgroundInfo}
        onChange={(e) => onBackgroundInfoChange(e.target.value)}
        placeholder="Paste your research, context, or any relevant information here (50,000 character limit)"
        inputProps={{ maxLength: 50000 }}
        helperText={`${backgroundInfo.length}/50000 characters`}
      />
    </Box>
  );
};

export default BackgroundInfo;
