/**
 * Moonlit Jewelry - Authentication Layer
 */

const SESSION_TOKEN_KEY = 'moonlit_admin_session_auth_token';
export const ADMIN_PASSWORD = 'moonlit123';

export const authService = {
  async login(password: string): Promise<{ success: boolean; message: string }> {
    if (password.trim() === ADMIN_PASSWORD) {
      sessionStorage.setItem(SESSION_TOKEN_KEY, `mjs_${Date.now()}`);
      return { success: true, message: 'approved' };
    }
    return { success: false, message: 'Password mismatch' };
  },

  isAuthenticated(): boolean {
    const token = sessionStorage.getItem(SESSION_TOKEN_KEY);
    return Boolean(token && token.startsWith('mjs_'));
  },

  logout(): void {
    sessionStorage.removeItem(SESSION_TOKEN_KEY);
  }
};
