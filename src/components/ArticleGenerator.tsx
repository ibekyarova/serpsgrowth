import { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  CircularProgress,
  Paper,
  ImageList,
  ImageListItem,
  ImageListItemBar,
} from '@mui/material';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { materialDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { ApiConfig, GenerationOptions, ArticleImage } from '../types';
import { generateArticle, generateImages } from '../services/api';

interface ArticleGeneratorProps {
  apiConfig: ApiConfig;
  selectedModel: string;
  keyword: string;
  backgroundInfo: string;
  outline: string[];
  article: string;
  generationOptions: GenerationOptions;
  onArticleChange: (article: string) => void;
}

const ArticleGenerator = ({
  apiConfig,
  selectedModel,
  keyword,
  backgroundInfo,
  outline,
  article,
  generationOptions,
  onArticleChange,
}: ArticleGeneratorProps) => {
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [images, setImages] = useState<ArticleImage[]>([]);
  const [loadingImages, setLoadingImages] = useState(false);

  const handleGenerateArticle = async () => {
    if (!keyword || !outline.length) return;

    setLoading(true);
    try {
      const generatedArticle = await generateArticle(
        apiConfig,
        selectedModel,
        keyword,
        backgroundInfo,
        outline,
        generationOptions
      );
      onArticleChange(generatedArticle);

      if (generationOptions.generateImages) {
        setLoadingImages(true);
        try {
          const generatedImages = await generateImages(
            apiConfig,
            selectedModel,
            keyword,
            outline
          );
          setImages(generatedImages);
        } catch (error) {
          console.error('Error generating images:', error);
        } finally {
          setLoadingImages(false);
        }
      }
    } catch (error) {
      console.error('Error generating article:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyArticle = async () => {
    try {
      await navigator.clipboard.writeText(article);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy article:', error);
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h6">Generated Article</Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          {article && (
            <Button
              variant="outlined"
              onClick={handleCopyArticle}
              startIcon={<ContentCopyIcon />}
            >
              {copied ? 'Copied!' : 'Copy Article'}
            </Button>
          )}
          <Button
            variant="contained"
            onClick={handleGenerateArticle}
            disabled={loading || !keyword || !outline.length || !selectedModel}
            startIcon={loading ? <CircularProgress size={20} /> : null}
          >
            Generate Article
          </Button>
        </Box>
      </Box>

      {article && (
        <>
          <Paper
            sx={{
              p: 3,
              maxHeight: '600px',
              overflow: 'auto',
              backgroundColor: 'background.paper',
              mb: 2,
            }}
          >
            <ReactMarkdown
              components={{
                code({ node, inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || '');
                  return !inline && match ? (
                    <SyntaxHighlighter
                      style={materialDark}
                      language={match[1]}
                      PreTag="div"
                      {...props}
                    >
                      {String(children).replace(/\n$/, '')}
                    </SyntaxHighlighter>
                  ) : (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  );
                },
              }}
            >
              {article}
            </ReactMarkdown>
          </Paper>

          {generationOptions.generateImages && (
            <Box>
              <Typography variant="h6" gutterBottom sx={{
                background: 'linear-gradient(135deg, #4776E6 0%, #8E54E9 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
                Generated Images
              </Typography>
              {loadingImages ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                  <CircularProgress sx={{
                    color: '#4776E6',
                  }} />
                </Box>
              ) : (
                <ImageList sx={{ width: '100%', mt: 2 }} cols={3} gap={16}>
                  {images.map((image, index) => (
                    <ImageListItem 
                      key={index}
                      sx={{
                        overflow: 'hidden',
                        borderRadius: '12px',
                        boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
                        transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                        },
                      }}
                    >
                      <img
                        src={image.url}
                        alt={image.alt}
                        loading="lazy"
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          aspectRatio: '1',
                        }}
                      />
                      <ImageListItemBar
                        title={image.caption}
                        position="below"
                        sx={{
                          '& .MuiImageListItemBar-title': {
                            fontSize: '0.875rem',
                            color: '#4776E6',
                            textAlign: 'center',
                            padding: '8px',
                          },
                        }}
                      />
                    </ImageListItem>
                  ))}
                </ImageList>
              )}
            </Box>
          )}
        </>
      )}
    </Box>
  );
};

export default ArticleGenerator;
