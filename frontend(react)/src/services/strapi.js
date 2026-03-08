const API_URL = process.env.REACT_APP_API_URL;

class StrapiService {
  constructor() {
    this.token = localStorage.getItem('token');
  }

  async request(path, options = {}) {
    const headers = {
      'Content-Type': 'application/json',
      ...(this.token && { Authorization: `Bearer ${this.token}` }),
    };

    const response = await fetch(`${API_URL}${path}`, {
      ...options,
      headers,
    });

    let data = null;
    const text = await response.text();
    if (text) {
      try {
        data = JSON.parse(text);
      } catch (e) {
        data = null;
      }
    }

    if (!response.ok) {
      throw new Error(data?.error?.message || 'Erreur API');
    }

    return data;
  }

  async register(email, password, username) {
    const data = await this.request('/auth/local/register', {
      method: 'POST',
      body: JSON.stringify({
        username: username || email.split('@')[0],
        email,
        password,
      }),
    });

    this.token = data.jwt;
    localStorage.setItem('token', data.jwt);
    localStorage.setItem('user', JSON.stringify(data.user));

    return data;
  }

  async login(email, password) {
    const data = await this.request('/auth/local', {
      method: 'POST',
      body: JSON.stringify({
        identifier: email,
        password,
      }),
    });

    this.token = data.jwt;
    localStorage.setItem('token', data.jwt);
    localStorage.setItem('user', JSON.stringify(data.user));

    return data;
  }

  logout() {
    this.token = null;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  isAuthenticated() {
    return !!this.token;
  }

  async getBoards() {
    const res = await this.request('/boards');
    return (res.data || []).map((b) => ({
      id: b.id,
      title: b.attributes?.title ?? b.title ?? 'Sans titre',
    }));
  }

  async getBoard(boardId) {
    const res = await this.request(`/boards/${boardId}`);
    if (!res) throw new Error('Réponse vide du serveur');
    const board = res.data || res;
    const lists = (board.lists || []).sort((a, b) => a.order - b.order);
    return {
      id: board.id,
      title: board.attributes?.title ?? board.title ?? 'Sans titre',
      lists: lists.map((list) => ({
        id: list.id,
        title: list.title,
        order: list.order,
        cards: (list.cards || []).sort((a, b) => a.order - b.order).map((card) => ({
          id: card.id,
          title: card.title,
          description: card.description || '',
          order: card.order,
          dueDate: card.dueDate || null,
          labels: card.labels || [],
        })),
      })),
    };
  }

  async createBoard(title) {
    const res = await this.request('/boards', {
      method: 'POST',
      body: JSON.stringify({ data: { title } }),
    });
    const board = res.data || res;
    return {
      id: board.id,
      title: board.attributes?.title ?? board.title ?? title,
    };
  }

  async updateBoard(boardId, title) {
    await this.request(`/boards/${boardId}`, {
      method: 'PUT',
      body: JSON.stringify({ data: { title } }),
    });
  }

  async deleteBoard(boardId) {
    await this.request(`/boards/${boardId}`, { method: 'DELETE' });
    return true;
  }

  async createList(boardId, listTitle, order) {
    await this.request('/lists', {
      method: 'POST',
      body: JSON.stringify({
        data: {
          title: listTitle,
          order: order,
          board: Number(boardId),
        },
      }),
    });
  }

  async updateList(listId, title) {
    await this.request(`/lists/${listId}`, {
      method: 'PUT',
      body: JSON.stringify({ data: { title } }),
    });
  }

  async deleteList(listId) {
    await this.request(`/lists/${listId}`, { method: 'DELETE' });
  }

  async updateListOrder(listId, order) {
    await this.request(`/lists/${listId}`, {
      method: 'PUT',
      body: JSON.stringify({ data: { order } }),
    });
  }

  async createCard(listId, title, description, order, dueDate, labelIds) {
    await this.request('/cards', {
      method: 'POST',
      body: JSON.stringify({
        data: {
          title,
          description: description || '',
          order,
          list: Number(listId),
          ...(dueDate && { dueDate }),
          ...(labelIds && labelIds.length > 0 && { labels: labelIds }),
        },
      }),
    });
  }

  async updateCard(cardId, data) {
    await this.request(`/cards/${cardId}`, {
      method: 'PUT',
      body: JSON.stringify({ data }),
    });
  }

  async deleteCard(cardId) {
    await this.request(`/cards/${cardId}`, { method: 'DELETE' });
  }

  async moveCard(cardId, targetListId, newOrder) {
    await this.request(`/cards/${cardId}`, {
      method: 'PUT',
      body: JSON.stringify({
        data: {
          list: Number(targetListId),
          order: newOrder,
        },
      }),
    });
  }

  async createLabel(name, color) {
    const res = await this.request('/labels', {
      method: 'POST',
      body: JSON.stringify({ data: { name, color } }),
    });
    const label = res.data || res;
    return {
      id: label.id,
      name: label.attributes?.name ?? label.name ?? name,
      color: label.attributes?.color ?? label.color ?? color,
    };
  }
}

export default new StrapiService();
