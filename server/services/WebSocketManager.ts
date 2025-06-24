import { WebSocketServer, WebSocket } from 'ws';
import { EventEmitter } from 'events';

export interface WebSocketMessage {
  type: string;
  data: any;
  timestamp: number;
}

export class WebSocketManager extends EventEmitter {
  private wss: WebSocketServer;
  private clients: Map<string, WebSocket> = new Map();
  private subscriptions: Map<string, Set<string>> = new Map();

  constructor(wss: WebSocketServer) {
    super();
    this.wss = wss;
    this.setupWebSocketServer();
  }

  private setupWebSocketServer() {
    this.wss.on('connection', (ws: WebSocket, request) => {
      const clientId = this.generateClientId();
      this.clients.set(clientId, ws);

      console.log(`WebSocket client connected: ${clientId}`);

      ws.on('message', (data) => {
        try {
          const message = JSON.parse(data.toString());
          this.handleClientMessage(clientId, message);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      });

      ws.on('close', () => {
        this.clients.delete(clientId);
        this.subscriptions.delete(clientId);
        console.log(`WebSocket client disconnected: ${clientId}`);
      });

      ws.on('error', (error) => {
        console.error(`WebSocket error for client ${clientId}:`, error);
      });

      // Send welcome message
      this.sendToClient(clientId, {
        type: 'welcome',
        data: { clientId },
        timestamp: Date.now()
      });
    });
  }

  private generateClientId(): string {
    return `client_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private handleClientMessage(clientId: string, message: any) {
    switch (message.type) {
      case 'subscribe':
        this.handleSubscription(clientId, message.channel);
        break;
      case 'unsubscribe':
        this.handleUnsubscription(clientId, message.channel);
        break;
      case 'ping':
        this.sendToClient(clientId, {
          type: 'pong',
          data: {},
          timestamp: Date.now()
        });
        break;
      default:
        console.log(`Unknown message type: ${message.type}`);
    }
  }

  private handleSubscription(clientId: string, channel: string) {
    if (!this.subscriptions.has(clientId)) {
      this.subscriptions.set(clientId, new Set());
    }
    
    this.subscriptions.get(clientId)!.add(channel);
    
    this.sendToClient(clientId, {
      type: 'subscribed',
      data: { channel },
      timestamp: Date.now()
    });

    console.log(`Client ${clientId} subscribed to ${channel}`);
  }

  private handleUnsubscription(clientId: string, channel: string) {
    const clientSubs = this.subscriptions.get(clientId);
    if (clientSubs) {
      clientSubs.delete(channel);
    }

    this.sendToClient(clientId, {
      type: 'unsubscribed',
      data: { channel },
      timestamp: Date.now()
    });

    console.log(`Client ${clientId} unsubscribed from ${channel}`);
  }

  private sendToClient(clientId: string, message: WebSocketMessage) {
    const client = this.clients.get(clientId);
    if (client && client.readyState === WebSocket.OPEN) {
      try {
        client.send(JSON.stringify(message));
      } catch (error) {
        console.error(`Error sending message to client ${clientId}:`, error);
      }
    }
  }

  // Public methods for broadcasting data
  broadcastToChannel(channel: string, data: any) {
    const message: WebSocketMessage = {
      type: 'data',
      data: { channel, ...data },
      timestamp: Date.now()
    };

    for (const [clientId, subscriptions] of this.subscriptions) {
      if (subscriptions.has(channel)) {
        this.sendToClient(clientId, message);
      }
    }
  }

  broadcastPriceUpdate(mint: string, price: number, change24h: number) {
    this.broadcastToChannel('price-updates', {
      mint,
      price,
      change24h
    });
  }

  broadcastNewToken(tokenData: any) {
    this.broadcastToChannel('fresh-tokens', tokenData);
  }

  broadcastRuggerAlert(walletAddress: string, activity: any) {
    this.broadcastToChannel('rugger-alerts', {
      wallet: walletAddress,
      activity
    });
  }

  broadcastSniperActivity(userId: string, activity: any) {
    this.broadcastToChannel(`sniper-${userId}`, activity);
  }

  broadcastCopyTradeActivity(userId: string, activity: any) {
    this.broadcastToChannel(`copy-trade-${userId}`, activity);
  }

  getConnectedClients(): number {
    return this.clients.size;
  }

  getChannelSubscriptions(): Map<string, number> {
    const channelCounts = new Map<string, number>();
    
    for (const subscriptions of this.subscriptions.values()) {
      for (const channel of subscriptions) {
        channelCounts.set(channel, (channelCounts.get(channel) || 0) + 1);
      }
    }
    
    return channelCounts;
  }
}