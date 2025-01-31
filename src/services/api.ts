import axios from 'axios';
import { ApiConfig, Model, GenerationOptions, ArticleImage } from '../types';

const API_ENDPOINTS = {
  openai: 'https://api.openai.com/v1',
  anthropic: 'https://api.anthropic.com/v1',
  google: 'https://generativelanguage.googleapis.com/v1',
  stability: 'https://api.stability.ai/v1',
};

const POPULAR_MODELS = {
  openai: ['gpt-4', 'gpt-3.5-turbo'],
  anthropic: ['claude-2', 'claude-instant'],
  google: ['gemini-pro'],
};

export const fetchModels = async (apiConfig: ApiConfig): Promise<Model[]> => {
  const endpoint = API_ENDPOINTS[apiConfig.provider as keyof typeof API_ENDPOINTS];
  const popularModels = POPULAR_MODELS[apiConfig.provider as keyof typeof POPULAR_MODELS] || [];
  
  try {
    let models: Model[] = [];
    
    switch (apiConfig.provider) {
      case 'openai':
        const openaiResponse = await axios.get(`${endpoint}/models`, {
          headers: {
            'Authorization': `Bearer ${apiConfig.apiKey}`,
          },
        });
        models = openaiResponse.data.data
          .filter((model: any) => model.id.includes('gpt'))
          .map((model: any) => ({
            id: model.id,
            name: model.id,
            provider: 'openai',
            isPopular: popularModels.includes(model.id),
          }));
        break;
        
      case 'anthropic':
        models = [
          { id: 'claude-2', name: 'Claude 2', provider: 'anthropic', isPopular: true },
          { id: 'claude-instant', name: 'Claude Instant', provider: 'anthropic', isPopular: true },
          { id: 'claude-1', name: 'Claude 1', provider: 'anthropic', isPopular: false },
        ];
        break;
        
      case 'google':
        models = [
          { id: 'gemini-pro', name: 'Gemini Pro', provider: 'google', isPopular: true },
          { id: 'gemini-pro-vision', name: 'Gemini Pro Vision', provider: 'google', isPopular: false },
          { id: 'palm-2', name: 'PaLM 2', provider: 'google', isPopular: false },
        ];
        break;
    }
    
    return models;
  } catch (error) {
    console.error('Error fetching models:', error);
    throw error;
  }
};

export const generateOutline = async (
  apiConfig: ApiConfig,
  model: string,
  keyword: string,
  backgroundInfo: string
): Promise<string[]> => {
  const endpoint = API_ENDPOINTS[apiConfig.provider as keyof typeof API_ENDPOINTS];
  const prompt = `Based on the main keyword "${keyword}" ${
    backgroundInfo ? `and the following background information:\n\n${backgroundInfo}\n\n` : ''
  }generate an SEO-optimized outline that perfectly and directly addresses the search intent of a user searching for the main keyword. The outline should be concise and to the point, with no fluff.`;

  try {
    let outline: string[] = [];
    
    switch (apiConfig.provider) {
      case 'openai':
        const openaiResponse = await axios.post(
          `${endpoint}/chat/completions`,
          {
            model,
            messages: [
              {
                role: 'user',
                content: prompt,
              },
            ],
            temperature: 0.7,
          },
          {
            headers: {
              'Authorization': `Bearer ${apiConfig.apiKey}`,
              'Content-Type': 'application/json',
            },
          }
        );
        outline = openaiResponse.data.choices[0].message.content
          .split('\n')
          .filter((line: string) => line.trim());
        break;
        
      // Add similar cases for other providers
    }
    
    return outline;
  } catch (error) {
    console.error('Error generating outline:', error);
    throw error;
  }
};

export const generateArticle = async (
  apiConfig: ApiConfig,
  model: string,
  keyword: string,
  backgroundInfo: string,
  outline: string[],
  options: GenerationOptions
): Promise<string> => {
  const endpoint = API_ENDPOINTS[apiConfig.provider as keyof typeof API_ENDPOINTS];
  
  // Parse the word count range
  const [minWords, maxWords] = options.articleLength.split('-').map(Number);
  const targetWords = Math.floor((minWords + maxWords) / 2);
  
  const prompt = `Write an article with EXACTLY ${targetWords} words (this is very important) based on the keyword "${keyword}" and the following outline:

Outline:
${outline.join('\n')}

${backgroundInfo ? `Background Information:
${backgroundInfo}

` : ''}Requirements:
1. Write EXACTLY ${targetWords} words - this is crucial and non-negotiable
2. Write in ${options.language.name} and optimize for readers in ${options.country.name}
3. Use markdown formatting including:
   - Bold text for important points
   - Bullet points and numbered lists where appropriate
   - Headers for each section (##)
   - Tables if relevant
4. Make the content comprehensive, engaging, and SEO-optimized
5. Include a clear introduction and conclusion
6. Ensure each section from the outline is properly addressed
7. Use natural, flowing language appropriate for the target audience
8. Include relevant examples and explanations

Please ensure the article is EXACTLY ${targetWords} words long - no more, no less.`;

  try {
    let article = '';
    
    switch (apiConfig.provider) {
      case 'openai':
        const openaiResponse = await axios.post(
          `${endpoint}/chat/completions`,
          {
            model,
            messages: [
              {
                role: 'system',
                content: `You are a professional content writer. Your task is to write an article with EXACTLY the specified number of words. The word count is crucial and non-negotiable.`,
              },
              {
                role: 'user',
                content: prompt,
              },
            ],
            temperature: 0.7,
          },
          {
            headers: {
              'Authorization': `Bearer ${apiConfig.apiKey}`,
              'Content-Type': 'application/json',
            },
          }
        );
        article = openaiResponse.data.choices[0].message.content;
        break;
        
      case 'anthropic':
        const anthropicResponse = await axios.post(
          `${endpoint}/messages`,
          {
            model,
            messages: [{
              role: 'user',
              content: prompt,
            }],
            max_tokens: Math.max(targetWords * 6, 4000), // Estimate tokens needed
          },
          {
            headers: {
              'x-api-key': apiConfig.apiKey,
              'Content-Type': 'application/json',
            },
          }
        );
        article = anthropicResponse.data.content;
        break;
        
      case 'google':
        const googleResponse = await axios.post(
          `${endpoint}/models/${model}:generateContent`,
          {
            contents: [{
              parts: [{
                text: prompt,
              }],
            }],
          },
          {
            headers: {
              'Authorization': `Bearer ${apiConfig.apiKey}`,
              'Content-Type': 'application/json',
            },
          }
        );
        article = googleResponse.data.candidates[0].content;
        break;
    }

    // Count words in the generated article
    const wordCount = article.trim().split(/\s+/).length;
    
    // If the word count is off by more than 10%, regenerate with adjusted prompt
    if (Math.abs(wordCount - targetWords) > targetWords * 0.1) {
      const adjustment = wordCount > targetWords ? 'shorter' : 'longer';
      const adjustedPrompt = `${prompt}\n\nNOTE: Your previous response was too ${adjustment}. It had ${wordCount} words instead of the required ${targetWords} words. Please adjust the length accordingly.`;
      
      // Recursive call with adjusted prompt
      return generateArticle(apiConfig, model, keyword, backgroundInfo, outline, options);
    }
    
    return article;
  } catch (error) {
    console.error('Error generating article:', error);
    throw error;
  }
};

export const generateImages = async (
  apiConfig: ApiConfig,
  model: string,
  keyword: string,
  outline: string[]
): Promise<ArticleImage[]> => {
  // We'll use OpenAI's DALL-E API for image generation
  const endpoint = API_ENDPOINTS.openai;
  const numberOfImages = 3; // Generate 3 images per article

  try {
    const imagePrompts = outline
      .filter((_, index) => index < numberOfImages) // Take first 3 sections
      .map((section) => ({
        prompt: `Professional, high-quality image representing: ${section}. Context: ${keyword}. Style: modern, clean, professional, suitable for a blog or article.`,
      }));

    const responses = await Promise.all(
      imagePrompts.map((prompt) =>
        axios.post(
          `${endpoint}/images/generations`,
          {
            prompt: prompt.prompt,
            n: 1,
            size: '1024x1024',
            response_format: 'url',
          },
          {
            headers: {
              'Authorization': `Bearer ${apiConfig.apiKey}`,
              'Content-Type': 'application/json',
            },
          }
        )
      )
    );

    return responses.map((response, index) => ({
      url: response.data.data[0].url,
      alt: outline[index],
      caption: outline[index],
    }));
  } catch (error) {
    console.error('Error generating images:', error);
    throw error;
  }
};
