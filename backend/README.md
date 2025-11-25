# MQTT Manage Backend

Node.js Express backend for managing Mosquitto MQTT server on Ubuntu.

## Features
- Check Mosquitto status
- Start/Stop Mosquitto
- Add/Remove user (with password)
- View Mosquitto log

## Usage
1. Install dependencies:
   ```bash
   cd backend
   npm install
   ```
2. Run the server:
   ```bash
   npm start
   ```

> **Note:**
> - Requires Node.js 18+ and Ubuntu with Mosquitto installed.
> - Needs sudo privileges for some operations (start/stop, user management).
> - Adjust `/etc/mosquitto/passwd` path if your Mosquitto uses a different password file.

API endpoints:
- `GET /api/status` — Mosquitto status
- `POST /api/start` — Start Mosquitto
- `POST /api/stop` — Stop Mosquitto
- `GET /api/log` — View log
- `POST /api/user` — Add/Update user (body: `{ username, password }`)
- `DELETE /api/user/:username` — Delete user
