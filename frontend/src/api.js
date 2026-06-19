const API_URL = 'http://localhost:3000/api';

function getToken() {
    return localStorage.getItem('token');
}

async function request(endpoint, options = {}) {
    const token = getToken();
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
    });

    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.error || 'Error en la petición');
    }

    return data;
}

export function login(email, password) {
    return request('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
    });
}

export function register(name, email, password) {
    return request('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password }),
    });
}

export function getTodos(userId) {
    const params = userId ? `?user_id=${userId}` : '';
    return request(`/todos${params}`);
}

export function createTodo(text, userId) {
    const body = { text };
    if (userId) body.user_id = userId;
    return request('/todos', {
        method: 'POST',
        body: JSON.stringify(body),
    });
}

export function toggleTodo(id) {
    return request(`/todos/${id}`, {
        method: 'PUT',
    });
}

export function deleteTodo(id) {
    return request(`/todos/${id}`, {
        method: 'DELETE',
    });
}
