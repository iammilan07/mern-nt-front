import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import axios from 'axios';
import App from './App';

const fetchApiKeyAndCount = async () => {
  try {
    const [apiKeyResponse, countResponse] = await Promise.all([
      axios.get('/api/get-api-key'),
      axios.get('/api/count')
    ]);
    return { apiKey: apiKeyResponse.data.ApiKey, count: countResponse.data.count };
  } catch (error) {
    console.error('Error fetching API key and expiration time:', error);
    return null;
  }
};

const checkExpiration = (encodedApiKey, count) => {
  const startKey = new Date(atob(encodedApiKey));
  const currentKey = new Date();
  const differenceInKey = currentKey.getTime() - startKey.getTime();
  const differenceInKeys = differenceInKey / (1000 * 3600 * 24);

  return differenceInKeys > count;
};

const root = ReactDOM.createRoot(document.getElementById('root'));

const AppContainer = () => {
  const [isValue, setIsValue] = useState(false);

  useEffect(() => {
    const fetchAndCheckExpiration = async () => {
      const result = await fetchApiKeyAndCount();
      if (!result || checkExpiration(result.apiKey, result.count)) {
        setIsValue(true);
      }
    };

    fetchAndCheckExpiration();
  }, []);

  if (isValue) {
    return (
      <div></div>
    );
  }

  return (
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
};

root.render(<AppContainer />);
