import api from './axios';

// localStorage keys
const CART_ID_KEY = 'cart_id';
const SESSION_ID_KEY = 'cart_session_id';

export const cartStorage = {
  getCartId: () => localStorage.getItem(CART_ID_KEY),
  getSessionId: () => localStorage.getItem(SESSION_ID_KEY),
  save: (cartId, sessionId) => {
    if (cartId) localStorage.setItem(CART_ID_KEY, cartId);
    if (sessionId) localStorage.setItem(SESSION_ID_KEY, sessionId);
  },
  clear: () => {
    localStorage.removeItem(CART_ID_KEY);
    localStorage.removeItem(SESSION_ID_KEY);
  },
};

// Extract and persist cart_id / session_id from any cart response
export const persistCartIds = (responseData) => {
  const cartId = responseData?.cart_id;
  const sessionId = responseData?.session_id;
  cartStorage.save(cartId, sessionId);
};

export const cartAPI = {
  // GET /cart — pass cart_id for guests
  getCart: () => {
    const params = {};
    const hasToken = !!localStorage.getItem('access_token');
    if (!hasToken) {
      const cartId = cartStorage.getCartId();
      const sessionId = cartStorage.getSessionId();
      if (cartId) params.cart_id = cartId;
      if (sessionId) params.session_id = sessionId;
    }
    return api.get('/cart', { params });
  },

  // POST /cart/add
  addToCart: ({ product_id, quantity, cart_id, session_id } = {}) => {
    if (!product_id || !quantity) {
      return Promise.reject(new Error('product_id and quantity are required'));
    }
    const body = { product_id, quantity };

    const hasToken = !!localStorage.getItem('access_token');
    if (!hasToken) {
      // Pass existing cart_id/session_id if we have them
      const savedCartId = cart_id || cartStorage.getCartId();
      const savedSessionId = session_id || cartStorage.getSessionId();
      if (savedCartId) body.cart_id = savedCartId;
      if (savedSessionId) body.session_id = savedSessionId;
    }

    return api.post('/cart/add', body);
  },

  // PUT /cart/update/:cart_item_id  — item ID is a UUID string
  updateCartItem: (itemId, quantity) => {
    if (!itemId) return Promise.reject(new Error('cart_item_id is required'));
    return api.put(`/cart/update/${itemId}`, { quantity });
  },

  // DELETE /cart/remove/:cart_item_id  — item ID is a UUID string
  removeFromCart: (itemId) => {
    if (!itemId) return Promise.reject(new Error('cart_item_id is required'));
    return api.delete(`/cart/remove/${itemId}`);
  },

  // Clear saved cart IDs (call after successful checkout or login merge)
  clearGuestCart: () => cartStorage.clear(),
};
