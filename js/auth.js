/**
 * Authentication Module
 * =====================
 * Maneja login, registro y sesiones
 */

// Estado de autenticación
let currentUser = null;
let isGuest = false;

// Elementos del DOM
const tabBtns = document.querySelectorAll('.tab-btn');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const guestBtn = document.getElementById('guest-btn');
const authMessage = document.getElementById('auth-message');

/**
 * Inicialización
 */
document.addEventListener('DOMContentLoaded', () => {
    // Verificar si hay sesión activa
    checkSession();

    // Event listeners para tabs
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => switchTab(btn.dataset.tab));
    });

    // Event listeners para formularios
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }

    if (guestBtn) {
        guestBtn.addEventListener('click', handleGuestLogin);
    }
});

/**
 * Cambiar entre tabs de login/registro
 */
function switchTab(tab) {
    tabBtns.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === tab);
    });

    if (loginForm && registerForm) {
        loginForm.classList.toggle('active', tab === 'login');
        registerForm.classList.toggle('active', tab === 'register');
    }

    hideMessage();
}

/**
 * Verificar sesión existente
 */
async function checkSession() {
    // Verificar modo invitado
    const guestSession = localStorage.getItem('guestSession');
    if (guestSession) {
        isGuest = true;
        redirectToApp();
        return;
    }

    // Verificar sesión de Supabase
    if (window.SupabaseService && window.SupabaseService.supabase) {
        try {
            const { data: { session } } = await window.SupabaseService.supabase.auth.getSession();
            if (session) {
                currentUser = session.user;
                redirectToApp();
            }
        } catch (error) {
            console.error('Error verificando sesión:', error);
        }
    }
}

/**
 * Manejar login
 */
async function handleLogin(e) {
    e.preventDefault();

    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;

    if (!email || !password) {
        showMessage('Por favor completa todos los campos', 'error');
        return;
    }

    setLoading(true);

    if (window.SupabaseService && window.SupabaseService.supabase) {
        try {
            const { data, error } = await window.SupabaseService.supabase.auth.signInWithPassword({
                email,
                password
            });

            if (error) throw error;

            currentUser = data.user;
            showMessage('¡Bienvenido de vuelta! Cargando...', 'success');

            setTimeout(() => redirectToApp(), 1000);
        } catch (error) {
            showMessage(getErrorMessage(error), 'error');
        }
    } else {
        // Modo local: simular login
        const users = JSON.parse(localStorage.getItem('localUsers') || '{}');

        if (users[email] && users[email] === password) {
            currentUser = { id: email, email };
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            showMessage('¡Bienvenido! Cargando...', 'success');
            setTimeout(() => redirectToApp(), 1000);
        } else {
            showMessage('Email o contraseña incorrectos', 'error');
        }
    }

    setLoading(false);
}

/**
 * Manejar registro
 */
async function handleRegister(e) {
    e.preventDefault();

    const email = document.getElementById('register-email').value.trim();
    const password = document.getElementById('register-password').value;
    const confirm = document.getElementById('register-confirm').value;

    if (!email || !password || !confirm) {
        showMessage('Por favor completa todos los campos', 'error');
        return;
    }

    if (password !== confirm) {
        showMessage('Las contraseñas no coinciden', 'error');
        return;
    }

    if (password.length < 6) {
        showMessage('La contraseña debe tener al menos 6 caracteres', 'error');
        return;
    }

    setLoading(true);

    if (window.SupabaseService && window.SupabaseService.supabase) {
        try {
            const { data, error } = await window.SupabaseService.supabase.auth.signUp({
                email,
                password
            });

            if (error) throw error;

            if (data.user) {
                showMessage('¡Cuenta creada! Revisa tu email para confirmar.', 'success');
                // Algunos proyectos no requieren confirmación
                if (data.session) {
                    currentUser = data.user;
                    setTimeout(() => redirectToApp(), 1500);
                }
            }
        } catch (error) {
            showMessage(getErrorMessage(error), 'error');
        }
    } else {
        // Modo local: guardar usuario
        const users = JSON.parse(localStorage.getItem('localUsers') || '{}');

        if (users[email]) {
            showMessage('Este email ya está registrado', 'error');
        } else {
            users[email] = password;
            localStorage.setItem('localUsers', JSON.stringify(users));

            currentUser = { id: email, email };
            localStorage.setItem('currentUser', JSON.stringify(currentUser));

            showMessage('¡Cuenta creada! Cargando...', 'success');
            setTimeout(() => redirectToApp(), 1000);
        }
    }

    setLoading(false);
}

/**
 * Manejar login como invitado
 */
function handleGuestLogin() {
    isGuest = true;
    localStorage.setItem('guestSession', 'true');
    showMessage('Entrando como invitado...', 'success');
    setTimeout(() => redirectToApp(), 500);
}

/**
 * Cerrar sesión
 */
async function logout() {
    if (window.SupabaseService && window.SupabaseService.supabase) {
        await window.SupabaseService.supabase.auth.signOut();
    }

    currentUser = null;
    isGuest = false;
    localStorage.removeItem('guestSession');
    localStorage.removeItem('currentUser');

    window.location.href = 'index.html';
}

/**
 * Redirigir a la aplicación
 */
function redirectToApp() {
    window.location.href = 'app.html';
}

/**
 * Utilidades
 */
function showMessage(text, type) {
    if (authMessage) {
        authMessage.textContent = text;
        authMessage.className = `alert alert-${type}`;
        authMessage.classList.remove('hidden');
    }
}

function hideMessage() {
    if (authMessage) {
        authMessage.classList.add('hidden');
    }
}

function setLoading(loading) {
    const buttons = document.querySelectorAll('.btn-primary');
    buttons.forEach(btn => {
        btn.disabled = loading;
        if (loading) {
            btn.innerHTML = '<span class="spinner" style="width:20px;height:20px;border-width:2px;"></span>';
        } else {
            const isLogin = btn.closest('#login-form');
            btn.innerHTML = isLogin
                ? '<span>Entrar a la Aventura</span><span>→</span>'
                : '<span>Crear Cuenta</span><span>→</span>';
        }
    });
}

function getErrorMessage(error) {
    const messages = {
        'Invalid login credentials': 'Email o contraseña incorrectos',
        'User already registered': 'Este email ya está registrado',
        'Password should be at least 6 characters': 'La contraseña debe tener al menos 6 caracteres',
        'Invalid email': 'Email inválido'
    };

    return messages[error.message] || error.message || 'Ha ocurrido un error';
}

// Obtener usuario actual
function getCurrentUser() {
    if (currentUser) return currentUser;
    if (isGuest) return { id: 'guest', isGuest: true };

    const stored = localStorage.getItem('currentUser');
    if (stored) {
        return JSON.parse(stored);
    }

    return null;
}

// Exportar funciones
window.AuthService = {
    getCurrentUser,
    logout,
    isGuest: () => isGuest
};
