const SUPABASE_URL  = 'https://pwaoxghgitobsxuiqlut.supabase.co';
const SUPABASE_ANON = 'sb_publishable_biUSd_hIHmFdN0egFbyNCQ_MoTcNrdc';

console.log('[Supabase] Initializing with URL:', SUPABASE_URL);

// Check if supabase library is loaded
if (typeof supabase === 'undefined') {
  console.error('[Supabase] Library not loaded! CDN script may have failed.');
} else {
  console.log('[Supabase] Library loaded successfully');
}

// Initialize Supabase
let supabaseClient = null;
try {
  supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON);
  console.log('[Supabase] Client created successfully');
} catch (e) {
  console.error('[Supabase] Failed to create client:', e.message);
}

// ============================================================
// MISSIONS — Supabase Functions
// ============================================================

async function loadMissionsFromSupabase() {
  if (!supabaseClient) {
    console.warn('[Supabase] Client not initialized for loading missions');
    return [];
  }
  try {
    const { data, error } = await supabaseClient
      .from('missions')
      .select('*')
      .order('daystartts', { ascending: false });
    
    if (error) {
      console.warn('[Supabase] Error loading missions:', error.message);
      return [];
    }
    console.log('[Supabase] Loaded', data?.length || 0, 'missions from Supabase');
    return data || [];
  } catch (e) {
    console.warn('[Supabase] Mission load failed:', e.message);
    return [];
  }
}

async function saveMissionToSupabase(mission) {
  if (!supabaseClient) {
    console.warn('[Supabase] Client not initialized for saving mission');
    return false;
  }
  try {
    console.log('[Supabase] Saving mission:', mission.id, mission.driver);
    
    const { data, error } = await supabaseClient
      .from('missions')
      .upsert([
        {
          id: mission.id,
          driver: mission.driver,
          plate: mission.plate || '',
          date: mission.date,
          daystartts: mission.dayStartTs,
          dayendts: mission.dayEndTs || null,
          completed: mission.completed || false,
          stops: mission.stops || [],
          updatedat: new Date().toISOString()
        }
      ], { onConflict: 'id' });
    
    if (error) {
      console.error('[Supabase] ❌ Error saving mission:', {
        message: error.message,
        code: error.code,
        hint: error.hint,
        details: error.details
      });
      return false;
    }
    console.log('[Supabase] ✅ Mission saved successfully');
    return true;
  } catch (e) {
    console.error('[Supabase] ❌ Mission save exception:', e.message);
    return false;
  }
}

// ============================================================
// MESSAGES — Supabase Functions
// ============================================================

async function loadMessagesFromSupabase() {
  if (!supabaseClient) {
    console.warn('[Supabase] Client not initialized for loading messages');
    return [];
  }
  try {
    const { data, error } = await supabaseClient
      .from('messages')
      .select('*')
      .order('ts', { ascending: true });
    
    if (error) {
      console.warn('[Supabase] Error loading messages:', error.message);
      return [];
    }
    console.log('[Supabase] Loaded', data?.length || 0, 'messages from Supabase');
    return data || [];
  } catch (e) {
    console.warn('[Supabase] Message load failed:', e.message);
    return [];
  }
}

async function saveMessageToSupabase(message) {
  if (!supabaseClient) {
    console.warn('[Supabase] Client not initialized for saving message');
    return false;
  }
  try {
    console.log('[Supabase] Saving message:', message.id, 'from:', message.from);
    
    const { data, error } = await supabaseClient
      .from('messages')
      .insert([
        {
          id: message.id,
          from: message.from,
          fromName: message.fromName || '',
          to: message.to,
          toLabel: message.toLabel || '',
          text: message.text,
          ts: message.ts,
          read: message.read || false
        }
      ]);
    
    if (error) {
      console.error('[Supabase] ❌ Error saving message:', {
        message: error.message,
        code: error.code,
        hint: error.hint,
        details: error.details
      });
      return false;
    }
    console.log('[Supabase] ✅ Message saved successfully');
    return true;
  } catch (e) {
    console.error('[Supabase] ❌ Message save exception:', e.message);
    return false;
  }
}

async function updateMessageReadStatus(messageId, read) {
  if (!supabaseClient) {
    console.warn('[Supabase] Client not initialized for updating message');
    return false;
  }
  try {
    const { error } = await supabaseClient
      .from('messages')
      .update({ read })
      .eq('id', messageId);
    
    if (error) {
      console.warn('[Supabase] Error updating message:', error.message);
      return false;
    }
    return true;
  } catch (e) {
    console.warn('[Supabase] Message update failed:', e.message);
    return false;
  }
}

// ============================================================
// Initialization - Auto-load from Supabase
// ============================================================

async function initSupabase() {
  console.log('[Supabase] Starting initialization...');
  
  const sbMissions = await loadMissionsFromSupabase();
  const sbMessages = await loadMessagesFromSupabase();
  
  if (sbMissions.length > 0) {
    window.missionsFromSupabase = sbMissions;
    console.log('[Supabase] Missions loaded into window');
  }
  if (sbMessages.length > 0) {
    window.messagesFromSupabase = sbMessages;
    console.log('[Supabase] Messages loaded into window');
  }
  
  console.log('[Supabase] Initialization complete');
}

// Make functions globally accessible
window.saveMissionToSupabase = saveMissionToSupabase;
window.saveMessageToSupabase = saveMessageToSupabase;
window.updateMessageReadStatus = updateMessageReadStatus;
window.loadMissionsFromSupabase = loadMissionsFromSupabase;
window.loadMessagesFromSupabase = loadMessagesFromSupabase;
window.initSupabase = initSupabase;

console.log('[Supabase] Functions registered globally');

// Wait for Supabase library to load
if (typeof supabase !== 'undefined') {
  console.log('[Supabase] Starting initialization...');
  initSupabase().catch(e => console.warn('[Supabase] Init error:', e.message));
} else {
  console.error('[Supabase] Library still not loaded!');
}
