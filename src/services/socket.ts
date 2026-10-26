import { getBaseUrl } from './api';

type SocketCallback = (data: any) => void;

class WebSocketService {
  private ws: WebSocket | null = null;
  private listeners: Map<string, Set<SocketCallback>> = new Map();
  private isConnected = false;
  private reconnectAttempts = 0;
  private reconnectTimer: any = null;
  private currentShopId = '';
  private currentShopName = '';
  private currentUserId = '';

  constructor() {
    this.listeners.set('NEW_ORDER', new Set());
    this.listeners.set('ORDER_UPDATED', new Set());
    this.listeners.set('CONNECTED', new Set());
  }

  private getWsUrl(): string {
    const httpUrl = getBaseUrl();
    // Replace http:// with ws:// and https:// with wss://
    let wsBase = httpUrl.replace(/^http/, 'ws');
    // Remove /api suffix if present and append /ws
    wsBase = wsBase.replace(/\/api\/?$/, '');
    return `${wsBase}/ws`;
  }

  public connect(shopId?: string, shopName?: string, userId?: string) {
    if (shopId) this.currentShopId = shopId;
    if (shopName) this.currentShopName = shopName;
    if (userId) this.currentUserId = userId;

    if (this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) {
      this.registerWithServer();
      return;
    }

    try {
      const url = this.getWsUrl();
      this.ws = new WebSocket(url);

      this.ws.onopen = () => {
        this.isConnected = true;
        this.reconnectAttempts = 0;
        this.registerWithServer();
        this.emit('CONNECTED', { status: 'connected' });
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data && data.type) {
            this.emit(data.type, data);
          }
        } catch (e) {}
      };

      this.ws.onclose = () => {
        this.isConnected = false;
        this.scheduleReconnect();
      };

      this.ws.onerror = () => {
        this.isConnected = false;
      };
    } catch (err) {
      this.scheduleReconnect();
    }
  }

  private registerWithServer() {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({
        type: 'REGISTER',
        shopId: this.currentShopId,
        shopName: this.currentShopName,
        userId: this.currentUserId,
        role: 'TAILOR'
      }));
    }
  }

  private scheduleReconnect() {
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    const delay = Math.min(10000, 2000 * Math.pow(1.5, this.reconnectAttempts));
    this.reconnectAttempts++;
    this.reconnectTimer = setTimeout(() => {
      this.connect();
    }, delay);
  }

  public onNewOrder(cb: (data: { order: any; message: string; timestamp: string }) => void) {
    return this.subscribe('NEW_ORDER', cb);
  }

  public onOrderUpdated(cb: (data: { order: any; updateType: string; message: string; timestamp: string }) => void) {
    return this.subscribe('ORDER_UPDATED', cb);
  }

  public subscribe(eventType: string, cb: SocketCallback): () => void {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, new Set());
    }
    this.listeners.get(eventType)?.add(cb);

    return () => {
      this.listeners.get(eventType)?.delete(cb);
    };
  }

  private emit(eventType: string, data: any) {
    const callbacks = this.listeners.get(eventType);
    if (callbacks) {
      callbacks.forEach(cb => {
        try {
          cb(data);
        } catch (err) {}
      });
    }
  }

  public disconnect() {
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.isConnected = false;
  }
}

export const socketService = new WebSocketService();
export default socketService;
