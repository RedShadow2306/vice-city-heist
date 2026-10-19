/**
 * admin_server/server.js
 * Standalone Admin Command Server running on a separate port (default: 5176)
 * Built with Node.js built-in http & fs modules - ZERO external dependencies required!
 *
 * Provides:
 *   1. Serves the dedicated Admin Command HTML interface on http://localhost:5176/
 *   2. REST API with CORS enabled for real-time synchronization with player clients (on port 5173):
 *      - GET  /api/state           -> Returns global game state and live player roster
 *      - POST /api/player/register -> Register player from waiting lobby
 *      - POST /api/player/update   -> Player heartbeat & progress updates
 *      - POST /api/admin/command   -> Admin actions (START_STORY_MODE, FREEZE, UNFREEZE, RESET)
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 5176;

// Shared in-memory state
let gameState = {
  activeCommand: null,     // { action: 'START_STORY_MODE', timestamp: 123456 }
  globalFreeze: false,
  timestamp: Date.now(),
  announcement: null,
};

let players = {}; // { [playerId]: { id, name, alias, college, status, currentLevel, rulesCleared, timeLeft, isBreached, isFrozen, currentPassword, lastSeen } }
let ejectedPlayers = {}; // { [playerId]: { id, name, alias, college, reason, time, level, score, rulesCleared } }
let securityViolations = []; // [ { id, playerId, alias, name, college, type, reason, level, timestamp, formattedTime, eliminated } ]
let removedPlayers = new Set(); // Track ejected player IDs

// Helper to send JSON responses with CORS headers
function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  });
  res.end(JSON.stringify(data));
}

// Clean up stale players (not seen for > 35 seconds)
setInterval(() => {
  const now = Date.now();
  for (const id in players) {
    if (now - players[id].lastSeen > 35000) {
      players[id].status = 'DISCONNECTED';
    }
  }
}, 5000);

const server = http.createServer((req, res) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    });
    res.end();
    return;
  }

  const url = new URL(req.url, `http://${req.headers.host}`);

  // 1. GET /api/state - Live status for both Admin and Players (Strictly registered real names only)
  if (req.method === 'GET' && url.pathname === '/api/state') {
    const validPlayers = Object.values(players).filter(p => {
      const n = (p.name || '').trim();
      return n && n !== 'Anonymous Agent' && !n.startsWith('Station ') && p.status !== 'NAME_ENTRY' && p.isRegistered !== false;
    });

    sendJson(res, 200, {
      gameState,
      players: validPlayers,
      ejectedPlayers: Object.values(ejectedPlayers),
      securityViolations,
    });
    return;
  }

  // 1b. POST /api/player/violation - Anti-Cheat Security Violation
  if (req.method === 'POST' && url.pathname === '/api/player/violation') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const v = JSON.parse(body);
        securityViolations.unshift(v);
        if (securityViolations.length > 100) securityViolations.pop();

        if (v.eliminated && v.playerId) {
          const p = players[v.playerId] || {};
          ejectedPlayers[v.playerId] = {
            id: v.playerId,
            name: v.name || p.name || 'Anonymous Agent',
            alias: v.alias || p.alias || `Station ${v.playerId.slice(-4)}`,
            college: v.college || p.college || 'Vice City Division',
            reason: v.reason || 'Eliminated due to security breach',
            time: v.formattedTime || new Date().toLocaleTimeString(),
            level: v.level || p.currentLevel || 1,
            score: p.score || 0,
            rulesCleared: p.rulesCleared || 0,
          };
          removedPlayers.add(v.playerId);
          delete players[v.playerId];
        }
        sendJson(res, 200, { success: true });
      } catch (err) {
        sendJson(res, 400, { error: 'Invalid JSON' });
      }
    });
    return;
  }

  // 2. POST /api/player/register - Player registers from lobby
  if (req.method === 'POST' && url.pathname === '/api/player/register') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        const id = data.id || ('P_' + Math.random().toString(36).substring(2, 8));
        removedPlayers.delete(id);
        players[id] = {
          id,
          name: data.name || 'Anonymous Agent',
          alias: data.alias || 'Station Alpha',
          college: data.college || 'Vice City Division',
          status: 'IN_LOBBY',
          currentLevel: 1,
          rulesCleared: 0,
          score: 0,
          timeLeft: 600,
          isBreached: false,
          isFrozen: false,
          currentPassword: data.currentPassword || '',
          lastSeen: Date.now(),
        };
        sendJson(res, 200, { success: true, player: players[id], gameState });
      } catch (err) {
        sendJson(res, 400, { error: 'Invalid JSON' });
      }
    });
    return;
  }

  // 2b. POST /api/player/unregister - Remove player returning to registration input
  if (req.method === 'POST' && url.pathname === '/api/player/unregister') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        if (data.id && players[data.id]) {
          delete players[data.id];
        }
        sendJson(res, 200, { success: true });
      } catch (err) {
        sendJson(res, 400, { error: 'Invalid JSON' });
      }
    });
    return;
  }

  // 3. POST /api/player/update - Heartbeat & progress report (including live password)
  if (req.method === 'POST' && url.pathname === '/api/player/update') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        if (data.id && removedPlayers.has(data.id)) {
          sendJson(res, 200, { success: false, removed: true, error: 'PLAYER_REMOVED', gameState });
          return;
        }

        const name = (data.name || '').trim();
        // STRICT: Only list players from the lobby onwards who have registered with their real name
        if (!name || name === 'Anonymous Agent' || name.startsWith('Station ') || data.status === 'NAME_ENTRY' || data.isRegistered === false) {
          if (data.id && players[data.id]) {
            delete players[data.id];
          }
          sendJson(res, 200, { success: false, ignored: true, reason: 'UNREGISTERED_OR_NO_NAME', gameState });
          return;
        }

        if (data.id && players[data.id]) {
          players[data.id] = {
            ...players[data.id],
            ...data,
            name,
            currentPassword: data.currentPassword !== undefined ? data.currentPassword : (data.password !== undefined ? data.password : players[data.id].currentPassword),
            lastSeen: Date.now(),
          };
          sendJson(res, 200, { success: true, gameState });
        } else if (data.id) {
          // New / re-registered player with valid name
          players[data.id] = {
            ...data,
            name,
            currentPassword: data.currentPassword || data.password || '',
            lastSeen: Date.now(),
          };
          sendJson(res, 200, { success: true, gameState });
        } else {
          sendJson(res, 400, { error: 'Missing player ID' });
        }
      } catch (err) {
        sendJson(res, 400, { error: 'Invalid JSON' });
      }
    });
    return;
  }

  // 4. POST /api/admin/command - Admin executes actions
  if (req.method === 'POST' && url.pathname === '/api/admin/command') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        const { action, playerId, level } = data;

        if (action === 'START_STORY_MODE') {
          gameState.activeCommand = {
            action: 'START_STORY_MODE',
            timestamp: Date.now(),
          };
          for (const id in players) {
            if (players[id].status === 'IN_LOBBY') {
              players[id].status = 'STORY_CUTSCENE';
            }
          }
        } else if (action === 'GLOBAL_FREEZE') {
          gameState.globalFreeze = true;
        } else if (action === 'GLOBAL_UNFREEZE') {
          gameState.globalFreeze = false;
        } else if (action === 'FREEZE_PLAYER' && playerId) {
          if (players[playerId]) {
            players[playerId].isFrozen = true;
          }
          gameState.activeCommand = {
            action: 'FREEZE_PLAYER',
            playerId,
            timestamp: Date.now(),
          };
        } else if (action === 'UNFREEZE_PLAYER' && playerId) {
          if (players[playerId]) {
            players[playerId].isBreached = false;
            players[playerId].isFrozen = false;
            players[playerId].status = 'ACTIVE_DEFENSE';
          }
          gameState.activeCommand = {
            action: 'UNFREEZE_PLAYER',
            playerId,
            timestamp: Date.now(),
          };
        } else if (action === 'ADVANCE_PLAYER' && playerId) {
          const nextLvl = Number(level || data.targetLevel) || (players[playerId] ? Math.min((players[playerId].currentLevel || 1) + 1, 4) : 2);
          if (players[playerId]) {
            players[playerId].currentLevel = nextLvl;
          }
          gameState.activeCommand = {
            action: 'ADVANCE_PLAYER',
            playerId,
            level: nextLvl,
            targetLevel: nextLvl,
            timestamp: Date.now(),
          };
        } else if (action === 'REMOVE_PLAYER' && playerId) {
          removedPlayers.add(playerId);
          const p = players[playerId] || {};
          ejectedPlayers[playerId] = {
            id: playerId,
            name: p.name || data.name || 'Anonymous Agent',
            alias: p.alias || data.alias || `Station ${playerId.slice(-4)}`,
            college: p.college || data.college || 'Vice City Division',
            reason: data.reason || 'Clearance revoked by Chief Director Bennett',
            time: new Date().toLocaleTimeString(),
            level: p.currentLevel || 1,
            score: p.score || 0,
            rulesCleared: p.rulesCleared || 0,
          };
          securityViolations.unshift({
            id: 'VIO_' + Date.now(),
            playerId,
            alias: ejectedPlayers[playerId].alias,
            name: ejectedPlayers[playerId].name,
            college: ejectedPlayers[playerId].college,
            type: 'ADMIN_EJECT',
            reason: 'Security clearance manually revoked by Chief Director Bennett',
            level: ejectedPlayers[playerId].level,
            timestamp: Date.now(),
            formattedTime: new Date().toLocaleTimeString(),
            eliminated: true,
          });
          if (securityViolations.length > 100) securityViolations.pop();

          if (players[playerId]) {
            delete players[playerId];
          }
          gameState.activeCommand = {
            action: 'REMOVE_PLAYER',
            playerId,
            timestamp: Date.now(),
          };
        } else if (action === 'RESET_TO_LOBBY') {
          removedPlayers.clear();
          ejectedPlayers = {};
          gameState.activeCommand = {
            action: 'RESET_TO_LOBBY',
            timestamp: Date.now(),
          };
          for (const id in players) {
            players[id].status = 'IN_LOBBY';
            players[id].currentLevel = 1;
            players[id].rulesCleared = 0;
            players[id].isBreached = false;
          }
        } else if (action === 'RESET_TO_NAME_INPUT') {
          if (data.target === 'ejected') {
            removedPlayers.clear();
            ejectedPlayers = {};
          } else if (playerId) {
            removedPlayers.delete(playerId);
            delete ejectedPlayers[playerId];
          }
          gameState.activeCommand = {
            action: 'RESET_TO_NAME_INPUT',
            playerId: playerId || null,
            target: data.target || 'ejected',
            timestamp: Date.now(),
          };
          if (playerId && players[playerId]) {
            delete players[playerId];
          }
        } else if (action === 'DELETE_RECORD' || action === 'PURGE_PLAYER' || action === 'DELETE_PLAYER_RECORD') {
          if (playerId) {
            delete players[playerId];
            delete ejectedPlayers[playerId];
            removedPlayers.delete(playerId);
            securityViolations = securityViolations.filter(v => v.playerId !== playerId);
          }
          gameState.activeCommand = {
            action: 'PURGE_PLAYER',
            playerId: playerId || null,
            timestamp: Date.now(),
          };
        } else if (action === 'PURGE_ALL_DATA' || action === 'CLEAR_ALL_PLAYERS' || action === 'PURGE_ROSTER') {
          players = {};
          ejectedPlayers = {};
          securityViolations = [];
          removedPlayers.clear();
          gameState.activeCommand = {
            action: 'PURGE_ALL_DATA',
            timestamp: Date.now(),
          };
        } else if (action === 'TRIGGER_SIREN') {
          gameState.activeCommand = {
            action: 'TRIGGER_SIREN',
            timestamp: Date.now(),
          };
        }

        gameState.timestamp = Date.now();
        sendJson(res, 200, { success: true, gameState, players: Object.values(players) });
      } catch (err) {
        sendJson(res, 400, { error: 'Invalid JSON' });
      }
    });
    return;
  }

  // 5. Serve Static Admin HTML on http://localhost:5176/
  if (req.method === 'GET' && (url.pathname === '/' || url.pathname === '/index.html' || url.pathname === '/admin')) {
    const htmlPath = path.join(__dirname, 'index.html');
    fs.readFile(htmlPath, 'utf8', (err, html) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Error loading admin page: ' + err.message);
        return;
      }
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(html);
    });
    return;
  }

  // Fallback 404
  res.writeHead(404, { 'Content-Type': 'text/plain' });
  res.end('Not Found');
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`=======================================================`);
  console.log(`🚔 VCPD CENTRAL DISPATCH & ADMIN SERVER RUNNING!`);
  console.log(`🌐 Dedicated Admin URL: http://localhost:${PORT}/`);
  console.log(`🎯 Synchronizing with Player terminals on port 5173`);
  console.log(`=======================================================`);
});
