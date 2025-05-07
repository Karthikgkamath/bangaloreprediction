import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface ConnectionStatus {
  api: 'loading' | 'success' | 'error';
  auth: 'loading' | 'success' | 'error';
  database: 'loading' | 'success' | 'error';
}

const ConnectionTest: React.FC = () => {
  const [status, setStatus] = useState<ConnectionStatus>({
    api: 'loading',
    auth: 'loading',
    database: 'loading'
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    const testConnections = async () => {
      try {
        // Test 1: Basic API Connection
        try {
          const response = await axios.get('http://localhost:5000/api/health');
          setStatus(prev => ({ ...prev, api: 'success' }));
        } catch (error) {
          setStatus(prev => ({ ...prev, api: 'error' }));
          throw new Error('API connection failed');
        }

        // Test 2: Authentication Service
        try {
          const authResponse = await axios.post('http://localhost:5000/api/login', {
            email: 'test@example.com',
            password: 'test123'
          });
          if (authResponse.data.success) {
            setStatus(prev => ({ ...prev, auth: 'success' }));
          } else {
            setStatus(prev => ({ ...prev, auth: 'error' }));
            throw new Error('Authentication failed: ' + authResponse.data.message);
          }
        } catch (error: any) {
          setStatus(prev => ({ ...prev, auth: 'error' }));
          if (error.response?.data?.message) {
            throw new Error('Authentication failed: ' + error.response.data.message);
          }
          throw new Error('Authentication service failed');
        }

        // Test 3: Database Connection
        try {
          const dbResponse = await axios.get('http://localhost:5000/api/users');
          if (Array.isArray(dbResponse.data)) {
            setStatus(prev => ({ ...prev, database: 'success' }));
          } else {
            setStatus(prev => ({ ...prev, database: 'error' }));
            throw new Error('Invalid database response');
          }
        } catch (error) {
          setStatus(prev => ({ ...prev, database: 'error' }));
          throw new Error('Database connection failed');
        }

        setMessage('All systems connected successfully!');
      } catch (error) {
        setMessage(error instanceof Error ? error.message : 'Connection test failed');
      }
    };

    testConnections();
  }, []);

  const getStatusColor = (status: 'loading' | 'success' | 'error') => {
    switch (status) {
      case 'loading': return 'bg-yellow-100 text-yellow-800';
      case 'success': return 'bg-green-100 text-green-800';
      case 'error': return 'bg-red-100 text-red-800';
    }
  };

  const getStatusIcon = (status: 'loading' | 'success' | 'error') => {
    switch (status) {
      case 'loading': return '⟳';
      case 'success': return '✓';
      case 'error': return '✗';
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 border border-gray-200 dark:border-gray-700">
        <h3 className="font-bold mb-2 text-gray-800 dark:text-white">Connection Status</h3>
        
        <div className="space-y-2">
          <div className={`flex items-center justify-between p-2 rounded ${getStatusColor(status.api)}`}>
            <span>API Server</span>
            <span className="font-mono">{getStatusIcon(status.api)}</span>
          </div>
          
          <div className={`flex items-center justify-between p-2 rounded ${getStatusColor(status.auth)}`}>
            <span>Authentication</span>
            <span className="font-mono">{getStatusIcon(status.auth)}</span>
          </div>
          
          <div className={`flex items-center justify-between p-2 rounded ${getStatusColor(status.database)}`}>
            <span>Database</span>
            <span className="font-mono">{getStatusIcon(status.database)}</span>
          </div>
        </div>

        {message && (
          <div className={`mt-4 p-2 rounded ${
            status.api === 'error' || status.auth === 'error' || status.database === 'error'
              ? 'bg-red-100 text-red-800'
              : 'bg-green-100 text-green-800'
          }`}>
            <p className="text-sm">{message}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConnectionTest; 