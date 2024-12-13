import type { AuthConfig, TokenInfo } from '../types/auth.types';
import { TokenService } from './token.service';

export class TokenSyncService {
  private static instance: TokenSyncService;
  private channel: BroadcastChannel | null = null;

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

    const method = this.config.tokenSync.method || 'localStorage';
    const eventName = this.config.tokenSync.eventName || 'auth:token:sync';

    if (method === 'broadcastChannel') {
      this.channel = new BroadcastChannel(eventName);
      this.channel.onmessage = event => {
        if (event.data.type === 'token:update') {
          this.tokenService.setToken(event.data.token);
        }
      };
    } else {
      window.addEventListener('storage', event => {
        if (event.key === eventName) {
          const token = JSON.parse(event.newValue || '{}');
          this.tokenService.setToken(token);
        }
      });
    }
  }

  syncToken(token: TokenInfo) {
    if (!this.config.tokenSync?.enabled) return;

    const method = this.config.tokenSync.method || 'localStorage';
    const eventName = this.config.tokenSync.eventName || 'auth:token:sync';

    if (method === 'broadcastChannel' && this.channel) {
      this.channel.postMessage({
        type: 'token:update',
        token
      });
    } else {
      localStorage.setItem(eventName, JSON.stringify(token));
    }
  }

  destroy() {
    if (this.channel) {
      this.channel.close();
      this.channel = null;
    }
  }
}
