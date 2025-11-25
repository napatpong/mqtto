// List all users
app.get('/api/users', (req, res) => {
  exec('cat /etc/mosquitto/passwd', (err, stdout) => {
    if (err) return res.status(500).json({ error: err.message });
    // Each line: username:hash
    const users = stdout
      .split('\n')
      .filter(line => line.trim() && line.includes(':'))
      .map(line => line.split(':')[0]);
    res.json({ users });
  });
});
import express from 'express';
import cors from 'cors';
import { exec } from 'child_process';

const app = express();
app.use(cors());
app.use(express.json());

// Health check
app.get('/', (req, res) => {
  res.send('MQTT Manage Backend Running');
});

// Mosquitto status
app.get('/api/status', (req, res) => {
  exec('systemctl is-active mosquitto', (err, stdout) => {
    if (err) return res.json({ status: 'unknown', error: err.message });
    res.json({ status: stdout.trim() });
  });
});

// Start Mosquitto
app.post('/api/start', (req, res) => {
  exec('sudo systemctl start mosquitto', (err) => {
    if (err) return res.status(500).json({ success: false, error: err.message });
    res.json({ success: true });
  });
});

// Stop Mosquitto
app.post('/api/stop', (req, res) => {
  exec('sudo systemctl stop mosquitto', (err) => {
    if (err) return res.status(500).json({ success: false, error: err.message });
    res.json({ success: true });
  });
});

// View Mosquitto log (last 100 lines)
app.get('/api/log', (req, res) => {
  exec('journalctl -u mosquitto -n 100 --no-pager', (err, stdout) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ log: stdout });
  });
});

// Add/Update user
app.post('/api/user', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'username and password required' });
  exec(`sudo mosquitto_passwd -b /etc/mosquitto/passwd ${username} ${password}`, (err) => {
    if (err) return res.status(500).json({ success: false, error: err.message });
    res.json({ success: true });
  });
});

// Delete user
app.delete('/api/user/:username', (req, res) => {
  const { username } = req.params;
  exec(`sudo mosquitto_passwd -D /etc/mosquitto/passwd ${username}`, (err) => {
    if (err) return res.status(500).json({ success: false, error: err.message });
    res.json({ success: true });
  });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`MQTT Manage Backend listening on port ${PORT}`);
});
