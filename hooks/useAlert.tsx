import { useState, useCallback } from 'react';
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

  const showAlert = useCallback((type: AlertType, message: string) => {
    setAlert({ show: true, type, message });
  }, []);

  const hideAlert = useCallback(() => {
    setAlert((prev) => ({ ...prev, show: false }));
  }, []);

  return {
    alert,
    showAlert,
    hideAlert,
  };
};
