// hooks/useAnalytics.js
import { useEffect } from 'react';
import axiosClient from '../axiosClient';
import { useStateContext } from '../contexts/contextProvider';

export const useAnalytics = () => {
  const { user } = useStateContext();

  const trackEvent = (eventName, eventData = {}) => {
    const payload = {
      event: eventName,
      userId: user?.id || 'anonymous',
      timestamp: new Date().toISOString(),
      ...eventData
    };

    // Send to your analytics endpoint
    axiosClient.post('/analytics/track', payload)
      .catch(err => console.error('Analytics error:', err));
    
    // Also log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Analytics] ${eventName}`, payload);
    }
  };

  const trackPageView = (pageName) => {
    trackEvent('PageView', { page: pageName });
  };

  return { trackEvent, trackPageView };
};