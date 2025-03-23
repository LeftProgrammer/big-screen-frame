import type { AuthConfig, TokenInfo } from '../types/auth.types';
import { TokenService } from './token.service';

export class TokenSyncService {
  private static instance: TokenSyncService;
  private channel: BroadcastChannel | null = null;
  private intervalId: number | null = null;
  private eventName = 'auth:token:sync';

  constructor(
    private config: AuthConfig,
    private tokenService: TokenService
  ) {
    this.initSync();
  }

  static getInstance(config: AuthConfig, tokenService: TokenService): TokenSyncService {
    if (!TokenSyncService.instance) {
      TokenSyncService.instance = new TokenSyncService(config, tokenService);
    }
    return TokenSyncService.instance;
  }

  private initSync() {
    if (!this.config.tokenSync?.enabled) return;

    // 默认使用localStorage方式
    const useChannel = false; // 默认不使用BroadcastChannel，简化同步机制

    if (useChannel) {
      this.channel = new BroadcastChannel(this.eventName);
      this.channel.onmessage = event => {
        if (event.data.type === 'token:update') {
          // 确保token符合TokenInfo接口要求
          if (typeof event.data.token === 'object' && event.data.token.token) {
            this.tokenService.setToken(event.data.token);
          } else {
            console.error('Invalid token format in broadcastChannel event:', event.data);
          }
        }
      };
    } else {
      window.addEventListener('storage', event => {
        if (event.key === this.eventName) {
          try {
            const parsedValue = JSON.parse(event.newValue || '{"token":""}');
            this.tokenService.setToken(parsedValue);
          } catch (error) {
            console.error('Error parsing token from storage event:', error);
          }
        }
      });
    }

    // 使用interval定时同步
    if (this.config.tokenSync.interval) {
      this.intervalId = window.setInterval(() => {
        this.checkAndSyncToken();
      }, this.config.tokenSync.interval);
    }
  }

  private checkAndSyncToken() {
    // 在多标签页环境下检查token并同步
    const currentToken = this.tokenService.getToken();
    const storedToken = localStorage.getItem(this.eventName);
    
    if (currentToken && (!storedToken || JSON.parse(storedToken).token !== currentToken)) {
      // 当前token与存储的不同，需要同步
      this.syncToken({
        token: currentToken
      });
    }
  }

  syncToken(token: TokenInfo) {
    if (!this.config.tokenSync?.enabled) return;

    // 默认使用localStorage方式
    const useChannel = false; // 默认不使用BroadcastChannel，简化同步机制

    if (useChannel && this.channel) {
      this.channel.postMessage({
        type: 'token:update',
        token
      });
    } else {
      localStorage.setItem(this.eventName, JSON.stringify(token));
    }
  }

  dispose() {
    if (this.channel) {
      this.channel.close();
      this.channel = null;
    }
    
    if (this.intervalId !== null) {
      window.clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
}
