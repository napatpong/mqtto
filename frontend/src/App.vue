<template>
  <div class="container py-4" style="max-width:700px;">
    <h1 class="mb-4 text-center">MQTT Manage <small class="text-muted" style="font-size:0.5em">(Mosquitto)</small></h1>
    <div class="card mb-4">
      <div class="card-body d-flex align-items-center justify-content-between">
        <div>
          <span class="fw-bold">สถานะ Mosquitto:</span>
          <span :class="statusClass" style="font-size:1.1em; margin-left:8px;">{{ statusLabel }}</span>
        </div>
        <div>
          <button class="btn btn-success me-2" @click="handleStart">เริ่ม (Start)</button>
          <button class="btn btn-danger" @click="handleStop">หยุด (Stop)</button>
        </div>
      </div>
    </div>
    <div class="card mb-4">
      <div class="card-header">User Management</div>
      <div class="card-body">
        <div class="row g-2 align-items-end mb-3">
          <div class="col-md-4">
            <label class="form-label">Username</label>
            <input class="form-control" placeholder="Username" v-model="username" />
          </div>
          <div class="col-md-4">
            <label class="form-label">Password</label>
            <input class="form-control" placeholder="Password" type="password" v-model="password" />
          </div>
          <div class="col-md-4 d-flex gap-2">
            <button class="btn btn-primary flex-fill" @click="handleAddUser">เพิ่ม/เปลี่ยนรหัสผ่าน</button>
            <button class="btn btn-outline-danger flex-fill" @click="handleDeleteUser">ลบ User</button>
          </div>
        </div>
        <div class="col-12 mt-2">
          <div v-if="message" class="alert" :class="messageClass">{{ message }}</div>
        </div>
        <hr />
        <h6>รายชื่อผู้ใช้ในระบบ</h6>
        <table class="table table-bordered table-sm align-middle bg-white">
          <thead class="table-light">
            <tr>
              <th style="width:1%">#</th>
              <th>Username</th>
              <th style="width:1%"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(user, idx) in users" :key="user">
              <td>{{ idx+1 }}</td>
              <td>{{ user }}</td>
              <td>
                <button class="btn btn-outline-secondary btn-sm" @click="selectUser(user)">เลือก</button>
              </td>
            </tr>
            <tr v-if="users.length === 0"><td colspan="3" class="text-center text-muted">ไม่มีผู้ใช้</td></tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="card">
      <div class="card-header">Log (last 100 lines)</div>
      <div class="card-body" style="background:#f8f9fa;">
        <pre style="background:none;padding:0;max-height:300px;overflow:auto;">{{ log }}</pre>
      </div>
    </div>
  </div>
</template>

<script setup>
const users = ref([]);

const fetchUsers = async () => {
  try {
    const res = await axios.get(`${API_BASE}/api/users`);
    users.value = res.data.users || [];
  } catch (e) {
    users.value = [];
  }
};

const selectUser = (user) => {
  username.value = user;
  password.value = '';
};
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';

const status = ref('');
const log = ref('');
const username = ref('');
const password = ref('');
const message = ref('');


const API_BASE = 'http://mqtto.itc.in.th:4000';

const fetchStatus = async () => {
  const res = await axios.get(`${API_BASE}/api/status`);
  status.value = res.data.status;
};

const fetchLog = async () => {
  const res = await axios.get(`${API_BASE}/api/log`);
  log.value = res.data.log;
};

const handleStart = async () => {
  await axios.post(`${API_BASE}/api/start`);
  fetchStatus();
};

const handleStop = async () => {
  await axios.post(`${API_BASE}/api/stop`);
  fetchStatus();
};

const handleAddUser = async () => {
  if (!username.value || !password.value) {
    message.value = 'กรุณากรอก Username และ Password';
    return;
  }
  try {
    await axios.post(`${API_BASE}/api/user`, { username: username.value, password: password.value });
    message.value = 'เพิ่ม/เปลี่ยนรหัสผ่านผู้ใช้สำเร็จ';
    fetchUsers();
  } catch (e) {
    message.value = 'Error: ' + (e.response?.data?.error || e.message);
  }
};

const handleDeleteUser = async () => {
  if (!username.value) {
    message.value = 'กรุณาเลือกหรือกรอก Username ที่ต้องการลบ';
    return;
  }
  try {
    await axios.delete(`${API_BASE}/api/user/${username.value}`);
    message.value = 'ลบผู้ใช้สำเร็จ';
    fetchUsers();
    username.value = '';
    password.value = '';
  } catch (e) {
    message.value = 'Error: ' + (e.response?.data?.error || e.message);
  }
};


const statusLabel = computed(() => {
  if (status.value === 'active') return 'กำลังทำงาน';
  if (status.value === 'inactive') return 'หยุดทำงาน';
  if (status.value === 'failed') return 'ล้มเหลว';
  if (status.value === 'unknown') return 'ไม่ทราบสถานะ';
  return status.value;
});

const statusClass = computed(() => {
  if (status.value === 'active') return 'badge bg-success';
  if (status.value === 'inactive') return 'badge bg-secondary';
  if (status.value === 'failed') return 'badge bg-danger';
  if (status.value === 'unknown') return 'badge bg-warning text-dark';
  return 'badge bg-light text-dark';
});

const messageClass = computed(() => {
  if (message.value.startsWith('Error')) return 'alert-danger';
  if (message.value) return 'alert-success';
  return '';
});

onMounted(() => {
  fetchStatus();
  fetchLog();
  fetchUsers();
});
</script>
