# รัน MQTT Manage Backend/Frontend ด้วย pm2

## ติดตั้ง pm2 (ถ้ายังไม่มี)
```bash
sudo npm install -g pm2
```

## Build frontend (Vue)
```bash
cd frontend
npm install
npm run build
```

## Start backend ด้วย pm2
```bash
cd ../backend
npm install
pm2 start index.js --name mqtt-manage-backend
```

## Serve frontend (static) ด้วย pm2 + serve
```bash
cd ../frontend
npm install -g serve
pm2 start serve --name mqtt-manage-frontend -- -s dist -l 8080
```

## ตรวจสอบสถานะ
```bash
pm2 status
```

## ตั้ง pm2 ให้ start อัตโนมัติหลัง reboot
```bash
pm2 startup
pm2 save
```

---

- backend: http://localhost:4000
- frontend: http://localhost:8080

> สามารถปรับพอร์ต serve ได้ตามต้องการ
