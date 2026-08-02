import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

export interface AuthState {
  isAuthenticated: boolean;
  username?: string;
  lastAuthTime?: number;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly TOKEN_SESSION_KEY = 'gh_token_session';
  private readonly AUTH_STATE_LOCAL_KEY = 'auth_state';
  private readonly TOKEN_EXPIRY_MS = 12 * 60 * 60 * 1000; // 12 hours
  private readonly MAX_TOKEN_LENGTH = 500; // GitHub tokens max length

  private readonly authStateSubject = new BehaviorSubject<AuthState>(this.loadAuthState());
  public authState$ = this.authStateSubject.asObservable();

  constructor(private readonly http: HttpClient) {
    this.cleanupExpiredToken();
  }

  loginWithGithub(): void {
    window.location.href = `${environment.authUrl}/github`;
  }

  loginWithGoogle(): void {
    window.location.href = `${environment.authUrl}/google`;
  }

  async setJwtToken(token: string): Promise<boolean> {
    try {
      sessionStorage.setItem(this.TOKEN_SESSION_KEY, this.obfuscateToken(token));
      
      // Fetch user profile from backend using the newly stored JWT
      const profile = await this.fetchUserProfile();
      
      const authState: AuthState = {
        isAuthenticated: true,
        username: profile?.username || 'OAuth User',
        lastAuthTime: Date.now(),
      };
      
      localStorage.setItem(this.AUTH_STATE_LOCAL_KEY, JSON.stringify(authState));
      this.authStateSubject.next(authState);
      return true;
    } catch (e) {
      console.error('Failed to set JWT token or fetch profile', e);
      return false;
    }
  }

  /**
   * Exchanges the one-time OAuth callback code for the real JWT. The token
   * itself never travels in a URL (browser history / proxy logs / Referer
   * headers) — only this opaque, single-use code does.
   */
  async exchangeCode(code: string): Promise<string | null> {
    try {
      const response = await this.http
        .post<{ token: string }>(`${environment.authUrl}/exchange`, { code })
        .toPromise();
      return response?.token ?? null;
    } catch (e) {
      console.error('Failed to exchange auth code', e);
      return null;
    }
  }

  private async fetchUserProfile(): Promise<any> {
    try {
      // The AuthInterceptor will attach the Bearer token automatically
      const response = await this.http.get(`${environment.authUrl}/me`).toPromise();
      return response;
    } catch {
      return null;
    }
  }

  /**
   * LOGIN: Store GitHub token securely in sessionStorage
   * - SessionStorage: Clears when browser closes (most secure)
   * - Tokens never logged to console or stored in localStorage
   * - Validates token format before storing
   */
  async loginWithToken(token: string): Promise<boolean> {
    try {
      // Validate token format
      if (!this.isValidTokenFormat(token)) {
        throw new Error('Invalid token format');
      }

      // Validate token with GitHub API (verify it works)
      const isValid = await this.verifyToken(token);
      if (!isValid) {
        throw new Error('Invalid or expired token');
      }

      // Store token ONLY in sessionStorage (not localStorage)
      sessionStorage.setItem(this.TOKEN_SESSION_KEY, this.obfuscateToken(token));

      // Store auth state in localStorage (non-sensitive)
      const authState: AuthState = {
        isAuthenticated: true,
        username: await this.fetchGitHubUsername(token),
        lastAuthTime: Date.now(),
      };
      localStorage.setItem(this.AUTH_STATE_LOCAL_KEY, JSON.stringify(authState));

      this.authStateSubject.next(authState);
      return true;
    } catch {
      console.error('Authentication failed (error details not logged for security)');
      return false;
    }
  }

  /**
   * LOGOUT: Clear all auth data safely
   */
  logout(): void {
    // Securely clear sensitive data
    sessionStorage.removeItem(this.TOKEN_SESSION_KEY);

    // Clear auth state
    const authState: AuthState = {
      isAuthenticated: false,
      lastAuthTime: undefined,
    };
    localStorage.removeItem(this.AUTH_STATE_LOCAL_KEY);

    this.authStateSubject.next(authState);
  }

  /**
   * GET TOKEN: Retrieve token from sessionStorage
   * - Returns undefined if session expired
   * - Never exposes token in console
   */
  getToken(): string | undefined {
    const encrypted = sessionStorage.getItem(this.TOKEN_SESSION_KEY);
    if (!encrypted) return undefined;

    try {
      return this.deobfuscateToken(encrypted);
    } catch {
      // Token corrupted or invalid, clear it
      this.logout();
      return undefined;
    }
  }

  /**
   * CHECK AUTH: Check if user is authenticated
   * - Verifies session hasn't expired
   * - Validates token still exists
   */
  isAuthenticated(): boolean {
    const token = this.getToken();
    const authState = this.authStateSubject.value;

    if (!token || !authState.isAuthenticated) {
      return false;
    }

    // Check if token has expired (12 hours)
    if (authState.lastAuthTime && Date.now() - authState.lastAuthTime > this.TOKEN_EXPIRY_MS) {
      this.logout();
      return false;
    }

    return true;
  }

  /**
   * VALIDATE TOKEN FORMAT: Basic format validation
   * GitHub tokens: ghp_* (45 chars), ghu_* (36 chars), ghs_* (40 chars), ghr_* (36 chars)
   */
  private isValidTokenFormat(token: string): boolean {
    if (!token || typeof token !== 'string') return false;
    if (token.length > this.MAX_TOKEN_LENGTH) return false;

    // Must start with valid GitHub token prefix
    const validPrefixes = ['ghp_', 'ghu_', 'ghs_', 'ghr_'];
    return validPrefixes.some((prefix) => token.startsWith(prefix));
  }

  /**
   * VERIFY TOKEN: Test token with GitHub API
   * Uses minimal permissions to verify token validity
   */
  private async verifyToken(token: string): Promise<boolean> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch('https://api.github.com/user', {
        headers: {
          Authorization: `token ${token}`,
          'User-Agent': 'DepVault',
          Accept: 'application/vnd.github.v3+json',
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // 401: Invalid token, 403: Token exists but permission issues, 200: Valid
      return response.status === 200 || response.status === 403;
    } catch {
      return false;
    }
  }

  /**
   * FETCH USERNAME: Get authenticated user's GitHub username
   * Used for UI display only (non-sensitive)
   */
  private async fetchGitHubUsername(token: string): Promise<string> {
    try {
      const response = await fetch('https://api.github.com/user', {
        headers: {
          Authorization: `token ${token}`,
          'User-Agent': 'DepVault',
          Accept: 'application/vnd.github.v3+json',
        },
      });

      if (response.ok) {
        const data = (await response.json()) as { login: string };
        return data.login;
      }
    } catch {
      // Silent fail - username is optional
    }
    return 'User';
  }

  /**
   * ENCRYPT TOKEN: Basic obfuscation (not cryptographic)
   * Prevents casual viewing of token in sessionStorage
   * Real encryption would require crypto library
   */
  private obfuscateToken(token: string): string {
    return btoa(token); // Base64 encode for obfuscation
  }

  /**
   * DECRYPT TOKEN: Decode encrypted token
   */
  private deobfuscateToken(encrypted: string): string {
    return atob(encrypted); // Base64 decode
  }

  /**
   * LOAD AUTH STATE: Restore auth state from localStorage on app init
   * Does NOT restore token (sessionStorage is lost on page reload)
   */
  private loadAuthState(): AuthState {
    try {
      const stored = localStorage.getItem(this.AUTH_STATE_LOCAL_KEY);
      if (!stored) {
        return { isAuthenticated: false };
      }

      const state = JSON.parse(stored) as AuthState;

      // Check if auth state is stale (older than 12 hours)
      if (state.lastAuthTime && Date.now() - state.lastAuthTime > this.TOKEN_EXPIRY_MS) {
        localStorage.removeItem(this.AUTH_STATE_LOCAL_KEY);
        return { isAuthenticated: false };
      }

      return state;
    } catch {
      return { isAuthenticated: false };
    }
  }

  /**
   * CLEANUP EXPIRED TOKEN: Remove stale sessions on app init
   */
  private cleanupExpiredToken(): void {
    const authState = this.loadAuthState();

    if (
      authState.isAuthenticated &&
      authState.lastAuthTime &&
      Date.now() - authState.lastAuthTime > this.TOKEN_EXPIRY_MS
    ) {
      this.logout();
    }
  }

  /**
   * GET TOKEN STATUS: Return sanitized auth info (no token exposed)
   */
  getTokenStatus(): { isValid: boolean; username?: string; expiresIn?: string } {
    const isValid = this.isAuthenticated();
    const authState = this.authStateSubject.value;

    if (!isValid) {
      return { isValid: false };
    }

    return {
      isValid: true,
      username: authState.username,
      expiresIn: this.getTokenExpiryTime(authState.lastAuthTime),
    };
  }

  /**
   * GET TOKEN EXPIRY TIME: Human-readable expiry time
   */
  private getTokenExpiryTime(authTime?: number): string {
    if (!authTime) return 'Unknown';

    const expiryTime = authTime + this.TOKEN_EXPIRY_MS;
    const now = Date.now();
    const remainingMs = expiryTime - now;

    if (remainingMs <= 0) return 'Expired';

    const hours = Math.floor(remainingMs / (60 * 60 * 1000));
    const minutes = Math.floor((remainingMs % (60 * 60 * 1000)) / (60 * 1000));

    return `${hours}h ${minutes}m`;
  }
}
