import React from 'react';
import { StyleProvider } from '@ant-design/cssinjs';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

import 'antd/dist/reset.css';
import './index.css';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

const rootElement = document.getElementById('root');
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <StyleProvider hashPriority="high">
        <BrowserRouter>
          <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID">
            <ThemeProvider>
            {/* ✅ Global theme */}
              <AuthProvider> {/* ✅ Auth context */}
                <App />
              </AuthProvider>
            </ThemeProvider>
          </GoogleOAuthProvider>
        </BrowserRouter>
      </StyleProvider>
    </React.StrictMode>
  );
}
