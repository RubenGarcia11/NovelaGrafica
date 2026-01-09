/**
 * Main Application Controller
 * ===========================
 * Controla el flujo de la novela gráfica
 */

// Estado de la aplicación
let appState = {
    currentScene: 'prologo',
    decisions: [],
    completedEndings: [],
    inventory: [], // Nuevo: Estado del inventario
    userId: null
};

// Definición de Objetos del Inventario
const ITEM_DEFINITIONS = {
    'mapa': { name: 'Mapa Secreto', icon: '🗺️', description: 'Un plano antiguo que revela túneles secretos y rutas de escape olvidadas.' },
    'llave': { name: 'Llave Maestra', icon: '🗝️', description: 'Una llave de hierro forjado capaz de abrir las cerraduras más complejas.' },
    'diario': { name: 'Diario del Abuelo', icon: '📔', description: 'Bitácora personal que oculta la verdad sobre la desaparición de los Vega.' },
    'antidoto': { name: 'Antídoto', icon: '🧪', description: 'Un suero experimental. La única esperanza contra el gas neurotóxico.' }
};

// Elementos del DOM
let comicContainer;
let progressBar;

/**
 * Inicialización
 */

document.addEventListener('DOMContentLoaded', async () => {
    // 1. Verificar sesión primero
    await checkAuth();
});

/**
 * Inicializar juego (llamado después de auth exitoso o invitado)
 */
async function initGame() {
    console.log('🎮 Iniciando juego...');
    try {
        // Inicializar elementos DOM
        comicContainer = document.getElementById('comic-container');
        progressBar = document.querySelector('.progress-bar-fill');

        if (!comicContainer) throw new Error('Contenedor del cómic no encontrado');

        // Cargar progreso guardado
        console.log('📥 Cargando progreso...');
        await loadSavedProgress();

        // Asegurar que hay una escena válida
        if (!appState.currentScene || !window.STORY[appState.currentScene]) {
            console.warn('⚠️ Escena inválida o no encontrada:', appState.currentScene);
            appState.currentScene = 'prologo';
        }

        // Renderizar escena actual
        console.log('🎬 Renderizando escena:', appState.currentScene);
        renderScene(appState.currentScene);

        // Event listeners
        setupEventListeners();

        // Mostrar tutorial si es la primera vez
        checkTutorial();
    } catch (error) {
        console.error('❌ Error fatal al iniciar juego:', error);
        alert('Hubo un error al iniciar la aventura. Reiniciando...');
        // Fallback de emergencia
        appState.currentScene = 'prologo';
        if (comicContainer) {
            comicContainer.innerHTML = `<div style="padding:2rem; text-align:center; color:white;">
            <h2>Error de carga</h2>
            <p>${error.message}</p>
            <button class="btn btn-primary" onclick="location.reload()">Reintentar</button>
          </div>`;
        }
    }
}


/**
 * Verificar autenticación
 */
async function checkAuth() {
    // 1. Verificar si hay usuario logueado en Supabase
    const user = await window.SupabaseService.getCurrentUser();
    if (user) {
        appState.userId = user.id;
        console.log('Usuario autenticado:', user.email);
        updateAuthUI(true);
        initGame(); // Iniciar juego
        return;
    }

    // 2. Verificar sesión de invitado local
    const guestSession = localStorage.getItem('guestSession');
    if (guestSession) {
        appState.userId = 'guest';
        updateAuthUI(false);
        initGame(); // Iniciar juego
        return;
    }

    // 3. Si no hay nada, mostrar modal de login
    showLoginModal();
}

/**
 * Mostrar Modal de Login
 */
function showLoginModal() {
    const modal = document.getElementById('login-modal');
    modal.classList.add('active');

    // Configurar botones del modal
    document.getElementById('login-submit-btn').onclick = async () => handleAuthAction('login');
    document.getElementById('register-submit-btn').onclick = async () => handleAuthAction('register');

    document.getElementById('guest-btn').onclick = () => {
        localStorage.setItem('guestSession', 'true');
        appState.userId = 'guest';
        updateAuthUI(false);
        modal.classList.remove('active');
        initGame(); // Iniciar juego
    };
}

/**
 * Manejar Login/Registro
 */
async function handleAuthAction(action) {
    const email = document.getElementById('auth-email').value;
    const password = document.getElementById('auth-password').value;
    const errorEl = document.getElementById('auth-error');

    if (!email || !password) {
        errorEl.textContent = 'Por favor, introduce correo y contraseña.';
        errorEl.style.display = 'block';
        return;
    }

    errorEl.style.display = 'none';
    let result;

    if (action === 'login') {
        result = await window.SupabaseService.login(email, password);
    } else {
        result = await window.SupabaseService.register(email, password);
    }

    if (result.error) {
        errorEl.textContent = result.error.message || 'Error en autenticación.';
        errorEl.style.display = 'block';
    } else {
        // Éxito
        document.getElementById('login-modal').classList.remove('active');
        appState.userId = result.user.id;
        updateAuthUI(true);
        initGame(); // Iniciar juego
    }
}

/**
 * Actualizar UI según estado de auth
 */
function updateAuthUI(isLoggedIn) {
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.innerHTML = isLoggedIn ?
            '<span class="btn-icon">🚪</span><span>Cerrar Sesión</span>' :
            '<span class="btn-icon">👤</span><span>Salir (Invitado)</span>';

        logoutBtn.onclick = async () => {
            if (isLoggedIn) {
                await window.SupabaseService.logout();
            } else {
                localStorage.removeItem('guestSession');
            }
            window.location.reload();
        };
    }
}

/**
 * Cargar progreso guardado
 */
async function loadSavedProgress() {
    if (!appState.userId) return;

    const { data, error } = await window.SupabaseService.loadProgress(appState.userId);

    if (data && !error) {
        appState.currentScene = data.current_scene || window.STORY_META?.startNode || 'prologo';
        appState.decisions = data.decisions || [];
        appState.completedEndings = data.completed_endings || [];
        appState.inventory = data.inventory || []; // Cargar inventario
        updateInventoryUI(); // Actualizar UI
    }
}

/**
 * Guardar progreso actual
 */
async function saveCurrentProgress() {
    if (!appState.userId) return;

    await window.SupabaseService.saveProgress(appState.userId, {
        currentScene: appState.currentScene,
        decisions: appState.decisions,
        completedEndings: appState.completedEndings,
        inventory: appState.inventory // Guardar inventario
    });
}

/**
 * Renderizar una escena
 */
function renderScene(sceneId) {
    const scene = window.STORY[sceneId];
    if (!scene) {
        console.error('Escena no encontrada:', sceneId);
        return;
    }

    appState.currentScene = sceneId;

    // Verificar recompensas de la escena
    if (scene.rewards) {
        scene.rewards.forEach(item => addToInventory(item));
    }

    // Actualizar barra de progreso
    updateProgressBar();

    // Limpiar contenedor con animación
    comicContainer.classList.add('scene-transition');

    setTimeout(() => {
        try {
            comicContainer.innerHTML = '';

            // Título del capítulo
            const chapterTitle = document.createElement('div');
            chapterTitle.className = 'chapter-title fade-in';
            chapterTitle.innerHTML = `
          <h2>${scene.chapter}</h2>
          <p class="subtitle">${scene.title}</p>
        `;
            comicContainer.appendChild(chapterTitle);

            // Página de cómic
            const comicPage = document.createElement('div');
            // FIX: Manejar layout por defecto si no existe
            const layoutClass = scene.layout || 'grid-layout';
            comicPage.className = `comic-page ${layoutClass} fade-in`;
            comicPage.style.animationDelay = '0.2s';

            // Renderizar paneles
            if (scene.panels) {
                scene.panels.forEach((panel, index) => {
                    const panelEl = createPanel(panel, index);
                    comicPage.appendChild(panelEl);
                });
            }

            comicContainer.appendChild(comicPage);

            // Si es un final
            if (scene.isEnding) {
                renderEnding(scene);
            } else if (scene.choices) {
                // Renderizar opciones
                const choicesSection = createChoicesSection(scene.choices);
                comicContainer.appendChild(choicesSection);
            }

            // Guardar progreso
            saveCurrentProgress();

            // Scroll al inicio
            window.scrollTo({ top: 0, behavior: 'smooth' });

            // Ocultar pantalla de carga inicial si todavía existe
            const loadingScreen = document.getElementById('loading-screen');
            if (loadingScreen && !loadingScreen.classList.contains('hidden')) {
                loadingScreen.classList.add('hidden');
            }

        } catch (error) {
            console.error('Error renderizando escena:', error);
            comicContainer.innerHTML = `<div style="color:white;text-align:center;padding:2rem;">
                                        <h3>Error visual</h3>
                                        <p>${error.message}</p>
                                        </div>`;
        } finally {
            // SIEMPRE quitar la transición para que se vea el contenido (o el error)
            comicContainer.classList.remove('scene-transition');
        }
    }, 400);
}

/**
 * Crear un panel de cómic
 */
function createPanel(panel, index) {
    const panelEl = document.createElement('div');
    panelEl.className = `panel panel-enter`;
    panelEl.style.animationDelay = `${0.1 * (index + 1)}s`;

    // Contenedor de imagen
    const imageContainer = document.createElement('div');
    imageContainer.className = 'panel-image-container';

    // Imagen (usando placeholder o imagen real)
    const imageSrc = window.generatedImages?.[panel.image] ||
        window.IMAGE_PLACEHOLDERS?.[panel.image] ||
        `assets/images/${panel.image}.png`;

    // Crear gradiente de fondo como fallback visual
    imageContainer.style.background = `
    linear-gradient(135deg, 
      var(--bg-dark) 0%, 
      var(--bg-panel) 50%, 
      var(--primary) 100%)
  `;

    // Intentar cargar la imagen
    const img = document.createElement('img');
    img.className = 'panel-image';
    img.src = imageSrc;
    img.alt = panel.narration || 'Viñeta del cómic';
    img.loading = 'lazy';
    img.onerror = () => {
        // Si falla, el gradiente de fondo sirve como fallback
        img.style.display = 'none';
    };
    imageContainer.appendChild(img);

    // Bocadillo de diálogo
    if (panel.speech) {
        const bubble = createSpeechBubble(panel.speech);
        imageContainer.appendChild(bubble);
    }

    // Efecto de sonido
    if (panel.sfx) {
        const sfx = document.createElement('div');
        sfx.className = `sfx ${panel.sfx.type}`;
        sfx.textContent = panel.sfx.text;
        sfx.style.cssText = getSfxPosition(panel.sfx.position);
        imageContainer.appendChild(sfx);
    }

    panelEl.appendChild(imageContainer);

    // Narración
    if (panel.narration) {
        const narration = document.createElement('div');
        narration.className = 'narration-box';
        narration.textContent = panel.narration;
        panelEl.appendChild(narration);
    }

    return panelEl;
}

/**
 * Crear bocadillo de diálogo
 */
function createSpeechBubble(speech) {
    const bubble = document.createElement('div');
    bubble.className = speech.type === 'thought' ? 'thought-bubble' : 'speech-bubble left';
    bubble.textContent = speech.text;
    bubble.style.cssText = getBubblePosition(speech.position);
    return bubble;
}

/**
 * Obtener posición CSS para bocadillo
 */
function getBubblePosition(position) {
    const positions = {
        'top-left': 'top: 15%; left: 10%;',
        'top-center': 'top: 15%; left: 50%; transform: translateX(-50%);',
        'top-right': 'top: 15%; right: 10%;',
        'bottom-left': 'bottom: 25%; left: 10%;',
        'bottom-center': 'bottom: 25%; left: 50%; transform: translateX(-50%);',
        'bottom-right': 'bottom: 25%; right: 10%;',
        'center': 'top: 50%; left: 50%; transform: translate(-50%, -50%);'
    };
    return positions[position] || positions['top-left'];
}

/**
 * Obtener posición CSS para SFX
 */
function getSfxPosition(position) {
    const positions = {
        'top-left': 'top: 10%; left: 10%;',
        'top-center': 'top: 10%; left: 50%; transform: translateX(-50%);',
        'top-right': 'top: 10%; right: 10%;',
        'center': 'top: 50%; left: 50%; transform: translate(-50%, -50%);',
        'bottom-left': 'bottom: 30%; left: 10%;',
        'bottom-right': 'bottom: 30%; right: 10%;'
    };
    return positions[position] || positions['center'];
}

/**
 * Crear sección de opciones
 */
function createChoicesSection(choices) {
    const section = document.createElement('div');
    section.className = 'choices-section fade-in';
    section.style.animationDelay = '0.5s';

    const container = document.createElement('div');
    container.className = 'choices-container';

    choices.forEach((choice, index) => {
        const btn = document.createElement('button');
        btn.className = 'choice-btn';
        btn.textContent = choice.text;
        btn.style.animationDelay = `${0.6 + (index * 0.1)}s`;
        btn.addEventListener('click', () => makeChoice(choice));
        container.appendChild(btn);
    });

    section.appendChild(container);
    return section;
}

/**
 * Realizar una elección
 */
function makeChoice(choice) {
    // Registrar decisión
    appState.decisions.push({
        scene: appState.currentScene,
        choice: choice.text,
        consequence: choice.consequence,
        timestamp: new Date().toISOString()
    });

    // Ir a la siguiente escena
    renderScene(choice.next);
}

/**
 * Renderizar pantalla de final
 */
function renderEnding(scene) {
    // Agregar final a completados si no existe
    if (!appState.completedEndings.includes(scene.endingId)) {
        appState.completedEndings.push(scene.endingId);
    }

    const endingMeta = window.STORY_META.endings[scene.endingId];

    const endingScreen = document.createElement('div');
    endingScreen.className = 'ending-screen fade-in';
    endingScreen.style.animationDelay = '0.4s';

    // Mostrar logros si existen
    const logrosHTML = scene.stats.logros ? `
      <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; justify-content: center; margin-bottom: 1.5rem;">
        ${scene.stats.logros.map(logro => `
          <span style="background: linear-gradient(135deg, var(--primary), var(--secondary)); padding: 0.5rem 1rem; border-radius: 20px; font-size: 0.85rem; font-weight: 600;">🏅 ${logro}</span>
        `).join('')}
      </div>
    ` : '';

    // Determinar si es final secreto
    const isSecretEnding = scene.endingId === 'secreto';
    const secretClass = isSecretEnding ? 'secret-ending' : '';

    endingScreen.innerHTML = `
    <h2 style="${isSecretEnding ? 'background: linear-gradient(135deg, #ec4899, #f59e0b); -webkit-background-clip: text; -webkit-text-fill-color: transparent;' : ''}">${endingMeta.icon} ${isSecretEnding ? '¡FINAL SECRETO!' : '¡FIN!'}</h2>
    <p class="ending-type">${scene.stats.titulo}</p>
    ${logrosHTML}
    <p class="ending-description">${scene.description}</p>
    <p style="color: var(--accent); font-style: italic; margin-bottom: 2rem;">
      "${scene.stats.moral}"
    </p>
    
    <div class="endings-unlocked">
      <p style="width: 100%; margin-bottom: 1rem; color: var(--text-secondary);">
        Finales desbloqueados: ${appState.completedEndings.length}/${window.STORY_META.totalEndings}
      </p>
      ${Object.entries(window.STORY_META.endings).map(([id, ending]) => `
        <div class="ending-badge ${appState.completedEndings.includes(id) ? 'unlocked' : ''}" 
             title="${ending.name}">
          ${appState.completedEndings.includes(id) ? ending.icon : '?'}
        </div>
      `).join('')}
    </div>
    
    <div style="margin-top: 2rem; display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
      <button class="btn btn-primary" onclick="restartStory()">
        Jugar de nuevo
      </button>
      <button class="btn btn-secondary" onclick="restartFromBeginning()">
        Desde el inicio
      </button>
    </div>
  `;

    comicContainer.appendChild(endingScreen);

    // Guardar progreso con el final
    saveCurrentProgress();
}

/**
 * Añadir item al inventario
 */
function addToInventory(itemId) {
    if (!appState.inventory.includes(itemId) && ITEM_DEFINITIONS[itemId]) {
        appState.inventory.push(itemId);
        updateInventoryUI();

        // Mostrar notificación visual (opcional)
        console.log(`¡Has conseguido: ${ITEM_DEFINITIONS[itemId].name}!`);

        // Feedback visual en el item recién añadido
        setTimeout(() => {
            const newItemEl = document.querySelector(`[data-item-id="${itemId}"]`);
            if (newItemEl) newItemEl.classList.add('new-item');
        }, 100);
    }
}

/**
 * Actualizar UI del inventario
 */
function updateInventoryUI() {
    const container = document.getElementById('inventory-grid');
    if (!container) return;

    if (appState.inventory.length === 0) {
        container.innerHTML = '<div class="inventory-empty">Sin objetos</div>';
        return;
    }

    container.innerHTML = appState.inventory.map(itemId => {
        const item = ITEM_DEFINITIONS[itemId];
        return `
            <div class="inventory-item" data-item-id="${itemId}" data-tooltip="${item.name}">
                ${item.icon}
            </div>
        `;
    }).join('');
}

/**
 * Reiniciar historia (mantener progreso de finales)
 */
function restartStory() {
    const startNode = window.STORY_META?.startNode || 'prologo';
    appState.currentScene = startNode;
    appState.decisions = [];
    appState.inventory = []; // Reiniciar inventario
    updateInventoryUI();
    renderScene(startNode);
}

/**
 * Reiniciar todo desde el principio
 */
async function restartFromBeginning() {
    const startNode = window.STORY_META?.startNode || 'prologo';
    appState.currentScene = startNode;
    appState.decisions = [];
    appState.decisions = [];
    appState.completedEndings = [];
    appState.inventory = []; // Reiniciar inventario
    updateInventoryUI();

    await window.SupabaseService.resetProgress(appState.userId);
    renderScene(startNode);
}

/**
 * Actualizar barra de progreso
 */
function updateProgressBar() {
    if (!progressBar) return;

    const totalScenes = Object.keys(window.STORY).length;
    const visitedScenes = new Set(appState.decisions.map(d => d.scene));
    visitedScenes.add(appState.currentScene);

    const progress = (visitedScenes.size / totalScenes) * 100;
    progressBar.style.width = `${Math.min(progress, 100)}%`;
}

/**
 * Configurar event listeners
 */
/**
 * Configurar event listeners
 */
function setupEventListeners() {
    // Botón de cerrar sesión
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            if (window.SupabaseService) {
                window.SupabaseService.logout().then(() => {
                    localStorage.removeItem('guestSession');
                    window.location.reload();
                });
            } else {
                localStorage.removeItem('guestSession');
                window.location.reload();
            }
        });
    }

    // Botón de menú y Overlay
    const menuBtn = document.getElementById('menu-btn');
    const sideMenu = document.getElementById('side-menu');
    const menuOverlay = document.getElementById('menu-overlay');

    if (menuBtn && sideMenu && menuOverlay) {
        menuBtn.addEventListener('click', () => {
            sideMenu.classList.toggle('open');
            menuOverlay.classList.toggle('active');
            updateMenuStats();
        });

        menuOverlay.addEventListener('click', () => {
            sideMenu.classList.remove('open');
            menuOverlay.classList.remove('active');
        });
    }
}

/**
 * Actualizar estadísticas del menú
 */
function updateMenuStats() {
    const decisionsCount = document.getElementById('decisions-count');
    const endingsCount = document.getElementById('endings-count');
    const endingList = document.getElementById('ending-list');

    if (decisionsCount) {
        decisionsCount.textContent = appState.decisions.length;
    }

    if (endingsCount && window.STORY_META) {
        endingsCount.textContent = `${appState.completedEndings.length}/${window.STORY_META.totalEndings || 4}`;
    }

    // Actualizar lista de finales
    if (window.STORY_META && endingList) {
        endingList.innerHTML = Object.entries(window.STORY_META.endings).map(([id, ending]) => {
            const isUnlocked = appState.completedEndings.includes(id);
            return `
    <div class="ending-item ${isUnlocked ? 'unlocked' : ''}">
      <span class="ending-icon" style="font-size: 1.5rem;">${isUnlocked ? ending.icon : '❓'}</span>
      <span class="ending-name" style="margin-left: 10px;">${isUnlocked ? ending.name : '???'}</span>
    </div>
  `;
        }).join('');
    }
}

// Exponer appState a la ventana global para depuración
window.appState = appState;

// Exponer funciones globales
window.restartStory = restartStory;
window.restartFromBeginning = restartFromBeginning;

/**
 * Lógica del Tutorial
 */
function checkTutorial() {
    const tutorialSeen = localStorage.getItem('tutorialSeen');
    if (!tutorialSeen) {
        const modal = document.getElementById('tutorial-modal');
        if (modal) {
            // Pequeño retraso para animación
            setTimeout(() => {
                modal.classList.remove('hidden');
                // Forzar reflow
                void modal.offsetWidth;
                modal.classList.add('active');
            }, 1000);
        }
    }
}

// Event listener para cerrar tutorial
document.getElementById('close-tutorial-btn')?.addEventListener('click', () => {
    const modal = document.getElementById('tutorial-modal');
    modal.classList.remove('active');
    setTimeout(() => {
        modal.classList.add('hidden');
    }, 300);
    localStorage.setItem('tutorialSeen', 'true');
});
