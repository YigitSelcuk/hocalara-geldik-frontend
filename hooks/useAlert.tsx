import { useState, useCallback, useEffect, useRef } from 'react';
import { AlertType } from '../components/Alert';

interface AlertState {
  show: boolean;
  type: AlertType;
  message: string;
}

export const useAlert = () => {
  const [alert, setAlert] = useState<AlertState>({
    show: false,
    type: 'info',
    message: '',
  });
  
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const showAlert = useCallback((type: AlertType, message: string) => {
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    setAlert({ show: true, type, message });
    
    // Auto-hide after 5 seconds
    timeoutRef.current = setTimeout(() => {
      setAlert((prev) => ({ ...prev, show: false }));
    }, 5000);
  }, []);

  const hideAlert = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setAlert((prev) => ({ ...prev, show: false }));
  }, []);
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return {
    alert,
    showAlert,
    hideAlert,
  };
};
