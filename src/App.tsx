import { useState } from 'react';
import {
  Container,
  Box,
  Paper,
  Typography,
  ThemeProvider,
  createTheme,
  CssBaseline,
  alpha,
} from '@mui/material';

import ApiKeyInput from './components/ApiKeyInput';
import ModelSelector from './components/ModelSelector';
import KeywordInput from './components/KeywordInput';
import WebsiteInfoInput from './components/WebsiteInfoInput';
import BackgroundInfo from './components/BackgroundInfo';
import OutlineGenerator from './components/OutlineGenerator';
import ArticleGenerator from './components/ArticleGenerator';
import GenerationOptionsPanel from './components/GenerationOptions';
import { ApiConfig, WebsiteInfo, GenerationOptions as GenerationOptionsType } from './types';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#4776E6',
      light: '#8E54E9',
      dark: '#2F5BE7',
    },
    secondary: {
      main: '#FF4B6B',
      light: '#FF8E53',
      dark: '#E63E5D',
    },
    background: {
      default: '#f8f9ff',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
      background: 'linear-gradient(135deg, #4776E6 0%, #8E54E9 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      textAlign: 'center',
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          padding: '20px',
          marginBottom: '20px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
          borderRadius: '16px',
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(8px)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          textTransform: 'none',
          fontWeight: 600,
        },
        contained: {
          background: 'linear-gradient(135deg, #4776E6 0%, #8E54E9 100%)',
          color: '#ffffff',
          boxShadow: '0 4px 16px rgba(71, 118, 230, 0.25)',
          '&:hover': {
            background: 'linear-gradient(135deg, #3665D5 0%, #7D43D8 100%)',
            boxShadow: '0 6px 20px rgba(71, 118, 230, 0.35)',
          },
        },
        outlined: {
          borderColor: '#4776E6',
          color: '#4776E6',
          '&:hover': {
            borderColor: '#8E54E9',
            color: '#8E54E9',
            background: 'linear-gradient(135deg, rgba(71, 118, 230, 0.08) 0%, rgba(142, 84, 233, 0.08) 100%)',
          },
        },
      },
    },
    MuiContainer: {
      styleOverrides: {
        root: {
          '&.MuiContainer-maxWidthLg': {
            position: 'relative',
            '&::before': {
              content: '""',
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(135deg, rgba(71, 118, 230, 0.1) 0%, rgba(142, 84, 233, 0.1) 100%)',
              zIndex: -1,
            },
          },
        },
      },
    },
  },
});

function App() {
  const [apiConfig, setApiConfig] = useState<ApiConfig>({ provider: '', apiKey: '' });
  const [selectedModel, setSelectedModel] = useState('');
  const [keyword, setKeyword] = useState('');
  const [websiteInfo, setWebsiteInfo] = useState<WebsiteInfo>({ url: '', internalLinks: [] });
  const [backgroundInfo, setBackgroundInfo] = useState('');
  const [outline, setOutline] = useState<string[]>([]);
  const [article, setArticle] = useState('');
  const [generationOptions, setGenerationOptions] = useState<GenerationOptionsType>({
    articleLength: '1200-2000',
    generateImages: false,
    language: { code: 'en', name: 'English' },
    country: { code: 'US', name: 'United States' },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4 }}>
          SerpsGrowth Writing Tool
        </Typography>

        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: 3,
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: -100,
            right: -200,
            width: 400,
            height: 400,
            background: 'radial-gradient(circle, rgba(142, 84, 233, 0.15) 0%, rgba(142, 84, 233, 0) 70%)',
            borderRadius: '50%',
            zIndex: -1,
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            bottom: -100,
            left: -200,
            width: 400,
            height: 400,
            background: 'radial-gradient(circle, rgba(71, 118, 230, 0.15) 0%, rgba(71, 118, 230, 0) 70%)',
            borderRadius: '50%',
            zIndex: -1,
          },
        }}>
          <Paper elevation={1}>
            <ApiKeyInput apiConfig={apiConfig} onApiConfigChange={setApiConfig} />
          </Paper>

          <Paper elevation={1}>
            <ModelSelector
              apiConfig={apiConfig}
              selectedModel={selectedModel}
              onModelSelect={setSelectedModel}
            />
          </Paper>

          <Paper elevation={1}>
            <KeywordInput keyword={keyword} onKeywordChange={setKeyword} />
          </Paper>

          <Paper elevation={1}>
            <WebsiteInfoInput websiteInfo={websiteInfo} onWebsiteInfoChange={setWebsiteInfo} />
          </Paper>

          <Paper elevation={1}>
            <BackgroundInfo
              backgroundInfo={backgroundInfo}
              onBackgroundInfoChange={setBackgroundInfo}
            />
          </Paper>

          <Paper elevation={1}>
            <GenerationOptionsPanel
              options={generationOptions}
              onOptionsChange={setGenerationOptions}
            />
          </Paper>

          <Paper elevation={1}>
            <OutlineGenerator
              apiConfig={apiConfig}
              selectedModel={selectedModel}
              keyword={keyword}
              backgroundInfo={backgroundInfo}
              outline={outline}
              onOutlineChange={setOutline}
            />
          </Paper>

          <Paper elevation={1}>
            <ArticleGenerator
              apiConfig={apiConfig}
              selectedModel={selectedModel}
              keyword={keyword}
              backgroundInfo={backgroundInfo}
              outline={outline}
              article={article}
              generationOptions={generationOptions}
              onArticleChange={setArticle}
            />
          </Paper>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default App;
