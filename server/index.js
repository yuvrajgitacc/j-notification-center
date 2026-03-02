const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const Database = require('better-sqlite3');
const path = require('path');
const admin = require('firebase-admin');
require('dotenv').config();

// Initialize Firebase Admin
try {
  let serviceAccount;
  
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    // If we have a JSON string in Environment Variables (for Render/Vercel)
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    console.log("Firebase initialized from Environment Variable.");
  } else {
    // Fallback to local file
    serviceAccount = require('./serviceAccountKey.json');
    console.log("Firebase initialized from local file.");
  }

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
} catch (error) {
  console.error("Firebase Admin initialization failed:", error.message);
}

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Database Setup
const db = new Database(path.join(__dirname, 'notifications.db'));

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS notifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    icon TEXT,
    title TEXT,
    body TEXT,
    time DATETIME DEFAULT CURRENT_TIMESTAMP,
    category TEXT,
    status TEXT DEFAULT 'unread'
  );

  CREATE TABLE IF NOT EXISTS commands (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    text TEXT,
    time DATETIME DEFAULT CURRENT_TIMESTAMP,
    status TEXT DEFAULT 'pending'
  );

  CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT
  );

  CREATE TABLE IF NOT EXISTS fcm_tokens (
    token TEXT PRIMARY KEY,
    last_active DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  -- Default Settings
  INSERT OR IGNORE INTO settings (key, value) VALUES ('push_enabled', 'true');
  INSERT OR IGNORE INTO settings (key, value) VALUES ('quiet_mode', 'false');
  INSERT OR IGNORE INTO settings (key, value) VALUES ('priority_level', 'all');
`);

// API Endpoints

// Register FCM Token
app.post('/api/register-token', (req, res) => {
  const { token } = req.body;
  if (!token) return res.status(400).json({ error: 'Token is required' });

  try {
    db.prepare('INSERT OR REPLACE INTO fcm_tokens (token, last_active) VALUES (?, CURRENT_TIMESTAMP)').run(token);
    console.log(`[FCM] New Device Registered! Total tokens: ${db.prepare('SELECT COUNT(*) as count FROM fcm_tokens').get().count}`);
    res.json({ message: 'Token registered successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Debug Endpoint to see tokens
app.get('/api/debug/tokens', (req, res) => {
  try {
    const tokens = db.prepare('SELECT * FROM fcm_tokens').all();
    res.json({ count: tokens.length, tokens });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get notifications with optional status filter
app.get('/api/notifications', (req, res) => {
  const { status } = req.query;
  try {
    let query = 'SELECT * FROM notifications';
    const params = [];
    
    if (status) {
      query += ' WHERE status = ?';
      params.push(status);
    }
    
    query += ' ORDER BY time DESC';
    const notifications = db.prepare(query).all(...params);
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Send a new notification (Endpoint for J)
app.post('/api/notifications', async (req, res) => {
  const { icon, title, body, category } = req.body;

  if (!title || !body) {
    return res.status(400).json({ error: 'Title and Body are required' });
  }

  try {
    // 1. Save to DB
    const stmt = db.prepare('INSERT INTO notifications (icon, title, body, category) VALUES (?, ?, ?, ?)');
    const info = stmt.run(icon || '🔔', title, body, category || 'System');
    
    // 2. Check if Push is enabled
    const pushSetting = db.prepare("SELECT value FROM settings WHERE key = 'push_enabled'").get();
    
    if (pushSetting && pushSetting.value === 'true') {
    // 3. Get all registered tokens
      const tokens = db.prepare('SELECT token FROM fcm_tokens').all().map(t => t.token);
      console.log(`[Notification Center] Found ${tokens.length} registered tokens.`);
      
      if (tokens.length > 0) {
        const message = {
          notification: {
            title: title,
            body: body,
          },
          data: {
            category: category || 'System',
            icon: icon || '🔔'
          },
          tokens: tokens,
        };

        // 4. Send via FCM
        try {
          const response = await admin.messaging().sendEachForMulticast(message);
          console.log(`[FCM] Response: ${response.successCount} success, ${response.failureCount} failure`);
          
          if (response.failureCount > 0) {
            response.responses.forEach((resp, idx) => {
              if (!resp.success) {
                console.error(`[FCM] Token ${tokens[idx]} failed: ${resp.error.message}`);
              }
            });
          }
        } catch (fcmError) {
          console.error('[FCM] Critical Error:', fcmError);
        }
      } else {
         console.log('[Notification Center] ⚠️ No tokens found in database. Push skipped.');
      }
    }

    console.log(`[Notification Center] New Alert Logged: ${title} - ${body}`);
    res.status(201).json({ id: info.lastInsertRowid, message: 'Notification sent successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Get Stats
app.get('/api/stats', (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const totalToday = db.prepare("SELECT COUNT(*) as count FROM notifications WHERE date(time) = ?").get(today).count;
    const pending = db.prepare("SELECT COUNT(*) as count FROM notifications WHERE status = 'unread'").get().count;

    res.json({
      totalToday,
      pending,
      nextSync: 'Live'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Mark as read
app.post('/api/notifications/:id/read', (req, res) => {
  const { id } = req.params;
  try {
    db.prepare("UPDATE notifications SET status = 'read' WHERE id = ?").run(id);
    res.json({ message: 'Marked as read' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Send a command to J
app.post('/api/commands', (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: 'Command text is required' });

  try {
    const stmt = db.prepare('INSERT INTO commands (text) VALUES (?)');
    const info = stmt.run(text);
    console.log(`[Notification Center] New Command for J: ${text}`);
    res.status(201).json({ id: info.lastInsertRowid, message: 'Command sent to J' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// J fetches pending commands
app.get('/api/commands/pending', (req, res) => {
  try {
    const commands = db.prepare("SELECT * FROM commands WHERE status = 'pending'").all();
    db.prepare("UPDATE commands SET status = 'fetched' WHERE status = 'pending'").run();
    res.json(commands);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Settings Endpoints
app.get('/api/settings', (req, res) => {
  try {
    const rows = db.prepare('SELECT * FROM settings').all();
    const settings = {};
    rows.forEach(row => settings[row.key] = row.value);
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/settings', (req, res) => {
  const updates = req.body;
  try {
    const stmt = db.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)');
    const transaction = db.transaction((data) => {
      for (const [key, value] of Object.entries(data)) {
        stmt.run(key, String(value));
      }
    });
    transaction(updates);
    res.json({ message: 'Settings updated' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Relay Server running at http://localhost:${port}`);
});
