import { useState, useEffect, useRef } from 'react';

interface WebSocketMessage {
  type: string;
  data: any;
}

export const useWebSocket = (url: string) => {
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null);
  const ws = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const connect = () => {
    try {
      // In a real implementation, this would connect to a WebSocket server
      // For now, we'll simulate a connection
      console.log(`Connecting to WebSocket: ${url}`);
      
      // Simulate successful connection after a delay
      setTimeout(() => {
        setIsConnected(true);
        console.log('WebSocket connected');
      }, 500);
      
      return true;
    } catch (error) {
      console.error('WebSocket connection error:', error);
      return false;
    }
  };

  const disconnect = () => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    
    setIsConnected(false);
    console.log('WebSocket disconnected');
  };

  const sendMessage = (message: any) => {
    if (!isConnected) {
      console.warn('Cannot send message, WebSocket is not connected');
      return false;
    }
    
    console.log('Sending message:', message);
    // In a real implementation, this would send a message to the WebSocket server
    return true;
  };

  useEffect(() => {
    const connected = connect();
    
    // Simulate receiving messages
    const interval = setInterval(() => {
      if (isConnected) {
        const mockMessage: WebSocketMessage = {
          type: 'update',
          data: {
            timestamp: Date.now(),
            tokens: [
              {
                mint: 'web4-social-monies',
                price: 0.000012456 * (1 + (Math.random() * 0.02 - 0.01)),
                volume: 87100 * (1 + (Math.random() * 0.05))
              }
            ]
          }
        };
        
        setLastMessage(mockMessage);
      }
    }, 5000);
    
    return () => {
      clearInterval(interval);
      disconnect();
    };
  }, [url]);

  return {
    isConnected,
    lastMessage,
    sendMessage
  };
};