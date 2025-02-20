'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastProps {
  message: string;
  type?: ToastType;
  duration?: number;
  onClose: () => void;
  isVisible: boolean;
}

const getToastStyles = (type: ToastType): string => {
  const baseStyles = 'fixed top-16 right-4 px-4 py-3 rounded-lg shadow-lg z-50 transition-all duration-200 max-w-[90%] min-w-[300px] text-center transform-gpu';

  switch (type) {
    case 'success':
      return `${baseStyles} bg-[#4CAF50] text-white`;
    case 'error':
      return `${baseStyles} bg-[#E53935] text-white`;
    case 'warning':
      return `${baseStyles} bg-[#FFA726] text-white`;
    case 'info':
      return `${baseStyles} bg-[#3390EC] text-white`;
    default:
      return `${baseStyles} bg-[#3390EC] text-white`;
  }
};

const getIcon = (type: ToastType) => {
  switch (type) {
    case 'success':
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      );
    case 'error':
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      );
    case 'warning':
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      );
    case 'info':
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
  }
};

export const Toast: React.FC<ToastProps> = ({
  message,
  type = 'info',
  duration = 2000,
  onClose,
  isVisible
}) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  if (!isVisible) return null;

  return createPortal(
    <div
      className={`
        ${getToastStyles(type)}
        animate-slide-in
        ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'}
      `}
    >
      <div className="flex items-center justify-start gap-2">
        {getIcon(type)}
        <span className="text-sm font-medium">{message}</span>
      </div>
    </div>,
    document.body
  );
};

// Хук для управления состоянием уведомления
export const useToast = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [type, setType] = useState<ToastType>('info');

  const showToast = (newMessage: string, newType: ToastType = 'info') => {
    setMessage(newMessage);
    setType(newType);
    setIsVisible(true);
  };

  const hideToast = () => {
    setIsVisible(false);
  };

  return {
    isVisible,
    message,
    type,
    showToast,
    hideToast,
  };
};
