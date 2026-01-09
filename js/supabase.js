/**
 * Supabase Client Configuration
 * =============================
 * Configura aquí tus credenciales de Supabase
 */

// ⚠️ IMPORTANTE: Reemplaza estos valores con tus credenciales de Supabase
const SUPABASE_URL = 'https://gcpvmpwhshmxajermwfb.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdjcHZtcHdoc2hteGFqZXJtd2ZiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc4NzY0NDMsImV4cCI6MjA4MzQ1MjQ0M30.sh1THvmV-MSNopAAY8i-6wL-yaz-2Alsk_7D9k479jA';

// Inicializar cliente de Supabase
let supabase;

try {
  // Check if library loaded successfully
  if (typeof window.supabase === 'undefined' || !window.supabase.createClient) {
    console.warn('⚠️ Librería Supabase no disponible. Se usará almacenamiento local.');
    supabase = null;
  }
  else if (SUPABASE_URL !== 'TU_SUPABASE_URL' && SUPABASE_ANON_KEY !== 'TU_SUPABASE_ANON_KEY') {
    supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    console.log('✅ Supabase inicializado correctamente.');
  } else {
    console.warn('⚠️ Credenciales de Supabase no configuradas.');
    supabase = null;
  }
} catch (error) {
  console.error('Error inicializando Supabase:', error);
  supabase = null;
}


/**
 * Funciones de Autenticación
 */
async function login(email, password) {
  if (!supabase) return { user: null, error: 'Supabase no configurado' };
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  return { user: data.user, error };
}

async function register(email, password) {
  if (!supabase) return { user: null, error: 'Supabase no configurado' };
  const { data, error } = await supabase.auth.signUp({ email, password });
  return { user: data.user, error };
}

async function logout() {
  if (!supabase) return;
  await supabase.auth.signOut();
}


async function getCurrentUser() {
  if (!supabase) {
    console.warn('⚠️ Supabase no está inicializado.');
    return null;
  }

  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      console.error('⚠️ Error obteniendo sesión:', error.message);
      return null; // Asumir no logueado si hay error de red/auth
    }
    return data.session?.user || null;
  } catch (err) {
    console.error('❌ Excepción crítica en getCurrentUser:', err);
    return null;
  }
}

/**
 * Funciones de Progreso del Usuario
 */

// Guardar progreso del usuario
async function saveProgress(userId, progressData) {
  // Verificar si hay usuario autenticado realmente
  const currentUser = await getCurrentUser();
  const isGuest = !currentUser;

  // Si es invitado o no hay supabase, usar localStorage
  if (!supabase || isGuest) {
    const localProgress = {
      ...progressData,
      user_id: 'guest',
      updated_at: new Date().toISOString()
    };
    localStorage.setItem('novelaProgress', JSON.stringify(localProgress));
    return { data: localProgress, error: null };
  }

  // Si es usuario autenticado, guardar en nube
  try {
    const { data, error } = await supabase
      .from('user_progress')
      .upsert({
        user_id: currentUser.id, // Usar ID real de auth
        current_scene: progressData.currentScene,
        decisions: progressData.decisions,
        completed_endings: progressData.completedEndings,
        inventory: progressData.inventory,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id'
      })
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error guardando progreso en nube:', error);
    return { data: null, error };
  }
}

// Cargar progreso del usuario
async function loadProgress(userId) {
  const currentUser = await getCurrentUser();
  const isGuest = !currentUser;

  if (!supabase || isGuest) {
    // Modo local: cargar de localStorage
    const localData = localStorage.getItem('novelaProgress');
    if (localData) {
      const parsed = JSON.parse(localData);
      return {
        data: {
          current_scene: parsed.currentScene || parsed.current_scene || 'prologo',
          decisions: parsed.decisions || [],
          completed_endings: parsed.completedEndings || parsed.completed_endings || [],
          inventory: parsed.inventory || []
        },
        error: null
      };
    }
    return { data: null, error: null };
  }

  try {
    const { data, error } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', currentUser.id)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error cargando progreso de nube:', error);
    return { data: null, error };
  }
}

// Reiniciar progreso
async function resetProgress(userId) {
  const currentUser = await getCurrentUser();

  if (!supabase || !currentUser) {
    localStorage.removeItem('novelaProgress');
    return { error: null };
  }

  try {
    const { error } = await supabase
      .from('user_progress')
      .delete()
      .eq('user_id', currentUser.id);

    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error('Error reiniciando progreso:', error);
    return { error };
  }
}

// Obtener finales desbloqueados
async function getUnlockedEndings(userId) {
  const { data, error } = await loadProgress(userId);
  if (error || !data) {
    return [];
  }
  return data.completed_endings || [];
}

// Agregar un final desbloqueado
async function addUnlockedEnding(userId, endingId) {
  const { data: currentData } = await loadProgress(userId);
  const currentEndings = currentData?.completed_endings || [];

  if (!currentEndings.includes(endingId)) {
    const updatedEndings = [...currentEndings, endingId];
    await saveProgress(userId, {
      currentScene: 'ending_' + endingId, // Store context but redundant with endingId
      decisions: currentData?.decisions || [],
      completedEndings: updatedEndings,
      inventory: currentData?.inventory || []
    });
    return updatedEndings;
  }
  return currentEndings;
}

// Exportar funciones
window.SupabaseService = {
  supabase,
  login,
  register,
  logout,
  getCurrentUser,
  saveProgress,
  loadProgress,
  resetProgress,
  getUnlockedEndings,
  addUnlockedEnding
};
