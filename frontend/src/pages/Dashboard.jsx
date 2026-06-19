import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTodos, createTodo, toggleTodo, deleteTodo } from '../api';

function Dashboard() {
    const [todos, setTodos] = useState([]);
    const [text, setText] = useState('');
    const [error, setError] = useState('');
    const [targetUserId, setTargetUserId] = useState('');
    const navigate = useNavigate();

    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const loadTodos = async (userId) => {
        try {
            const data = await getTodos(userId || user.id);
            setTodos(data);
            setError('');
        } catch (err) {
            setError(err.message);
        }
    };

    useEffect(() => {
        loadTodos();
    }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        if (!text.trim()) return;
        try {
            await createTodo(text, targetUserId || user.id);
            setText('');
            loadTodos(targetUserId || user.id);
        } catch (err) {
            setError(err.message);
        }
    };

    const handleToggle = async (id) => {
        try {
            await toggleTodo(id);
            loadTodos(targetUserId || user.id);
        } catch (err) {
            setError(err.message);
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteTodo(id);
            loadTodos(targetUserId || user.id);
        } catch (err) {
            setError(err.message);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <div style={styles.container}>
            <div style={styles.navbar}>
                <h2>Todo App</h2>
                <div style={styles.navRight}>
                    <span>{user.name} ({user.email})</span>
                    <button onClick={handleLogout} style={styles.logoutBtn}>Cerrar sesión</button>
                </div>
            </div>

            <div style={styles.content}>
                {error && <p style={styles.error}>{error}</p>}

                <div style={styles.idorSection}>
                    <label>User ID para filtrar (IDOR):</label>
                    <input
                        type="text"
                        placeholder="user_id"
                        value={targetUserId}
                        onChange={(e) => setTargetUserId(e.target.value)}
                        style={styles.input}
                    />
                    <button onClick={() => loadTodos(targetUserId)} style={styles.smallBtn}>
                        Ver tareas de este usuario
                    </button>
                </div>

                <form onSubmit={handleCreate} style={styles.createForm}>
                    <input
                        type="text"
                        placeholder="Nueva tarea"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        style={{ ...styles.input, flex: 1 }}
                    />
                    <button type="submit" style={styles.button}>Agregar</button>
                </form>

                <div style={styles.todoList}>
                    {todos.map(todo => (
                        <div key={todo.id} style={styles.todoItem}>
                            <input
                                type="checkbox"
                                checked={todo.completed}
                                onChange={() => handleToggle(todo.id)}
                            />
                            <span style={{
                                ...styles.todoText,
                                textDecoration: todo.completed ? 'line-through' : 'none',
                                color: todo.completed ? '#888' : '#333'
                            }}>
                                {todo.text}
                            </span>
                            <button onClick={() => handleDelete(todo.id)} style={styles.deleteBtn}>
                                Eliminar
                            </button>
                        </div>
                    ))}
                    {todos.length === 0 && <p style={styles.empty}>No hay tareas</p>}
                </div>
            </div>
        </div>
    );
}

const styles = {
    container: {
        fontFamily: 'Arial, sans-serif',
        backgroundColor: '#f0f2f5',
        minHeight: '100vh',
    },
    navbar: {
        backgroundColor: '#1877f2',
        color: 'white',
        padding: '1rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    navRight: {
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
    },
    logoutBtn: {
        padding: '0.5rem 1rem',
        backgroundColor: 'rgba(255,255,255,0.2)',
        color: 'white',
        border: '1px solid white',
        borderRadius: '4px',
        cursor: 'pointer',
    },
    content: {
        maxWidth: '600px',
        margin: '2rem auto',
        padding: '0 1rem',
    },
    createForm: {
        display: 'flex',
        gap: '0.5rem',
        marginBottom: '1.5rem',
    },
    input: {
        padding: '0.75rem',
        border: '1px solid #ddd',
        borderRadius: '4px',
        fontSize: '1rem',
    },
    button: {
        padding: '0.75rem 1.5rem',
        backgroundColor: '#1877f2',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '1rem',
    },
    todoList: {
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        padding: '1rem',
    },
    todoItem: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        padding: '0.75rem 0',
        borderBottom: '1px solid #eee',
    },
    todoText: {
        flex: 1,
        fontSize: '1rem',
    },
    deleteBtn: {
        padding: '0.4rem 0.8rem',
        backgroundColor: '#dc3545',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
    },
    error: {
        color: 'red',
        textAlign: 'center',
        marginBottom: '1rem',
    },
    empty: {
        textAlign: 'center',
        color: '#888',
        padding: '2rem',
    },
    idorSection: {
        display: 'flex',
        gap: '0.5rem',
        alignItems: 'center',
        marginBottom: '1rem',
        padding: '1rem',
        backgroundColor: '#fff3cd',
        borderRadius: '4px',
        border: '1px solid #ffc107',
    },
    smallBtn: {
        padding: '0.5rem 1rem',
        backgroundColor: '#ffc107',
        color: '#333',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
    },
};

export default Dashboard;
