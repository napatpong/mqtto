# MQTT Manage (Node.js + Vue)

ระบบจัดการ Mosquitto MQTT Server ผ่านเว็บ (Node.js + Vue.js)

## คุณสมบัติ
- ดูสถานะ Mosquitto (active/inactive)
- Start/Stop Mosquitto
- สร้าง/ลบ User และ Password
- ดู Log ล่าสุด

---

## วิธีติดตั้งและใช้งาน (สำหรับ Ubuntu)

### 1. Clone โค้ดจาก GitHub
```bash
sudo apt update && sudo apt install git -y
cd /opt
sudo git clone https://github.com/napatpong/mqtto.git
sudo chown -R $USER:$USER mqtto
cd mqtto
```

### 2. ติดตั้ง Mosquitto (ถ้ายังไม่มี)
```bash
sudo apt install mosquitto mosquitto-clients -y
```

### 3. ติดตั้ง backend (Node.js 18+)
```bash
cd backend
npm install
```

### 4. ติดตั้ง frontend (Vue.js)
```bash
cd ../frontend
npm install
npm run build
```

### 5. รัน backend server
```bash
cd ../backend
npm start
```

### 6. ตั้งค่า reverse proxy (เช่น nginx) หรือเปิด backend port 4000

### 7. เปิดหน้าเว็บ
- เปิดไฟล์ `frontend/dist/index.html` ในเบราว์เซอร์
- หรือ deploy frontend/dist ไปยัง web server ที่ต้องการ

---

## หมายเหตุ
- Backend ต้องรันด้วยสิทธิ์ที่สามารถใช้ `sudo` (สำหรับ start/stop และ user management)
- ปรับ path `/etc/mosquitto/passwd` ใน backend ถ้าไฟล์ password อยู่ที่อื่น
- หากต้องการใช้งานผ่าน public network แนะนำตั้ง reverse proxy และ SSL

---

## ตัวอย่าง API (สำหรับนักพัฒนา)
- `GET /api/status` — ดูสถานะ Mosquitto
- `POST /api/start` — สั่ง start
- `POST /api/stop` — สั่ง stop
- `GET /api/log` — ดู log
- `POST /api/user` — เพิ่ม/แก้ไข user (body: `{ username, password }`)
- `DELETE /api/user/:username` — ลบ user

---

## ผู้พัฒนา
- https://github.com/napatpong/mqtto
