# 🚀 Quick Start - CRM System

## ⚡ Setup trong 5 phút

### 1️⃣ Cài đặt & Khởi động (Terminal 1)
```bash
# Cài dependencies
npm install

# Khởi động Docker (PostgreSQL, Redis, MinIO)
npm run docker:up

# Chờ 10s rồi setup database
npm run db:migrate

# (Tùy chọn) Seed demo data
npm run db:seed
```

### 2️⃣ Khởi động Backend (Terminal 2)
```bash
npm run backend:dev
```
✅ Truy cập: http://localhost:3001/api

### 3️⃣ Khởi động Frontend (Terminal 3)
```bash
npm run web:dev
```
✅ Truy cập: http://localhost:3000

---

## 🔐 Login Ngay

Vào http://localhost:3000/login và đăng nhập:

| Email | Password | Role |
|-------|----------|------|
| admin@example.com | Admin@123456 | ADMIN |
| manager@example.com | Manager@123456 | MANAGER |
| sales1@example.com | Sales@123456 | USER |

---

## 📋 Demo Data

Nếu chạy `npm run db:seed`, hệ thống sẽ có:

- ✅ 4 users (admin, manager, 2 sales)
- ✅ 6 leads (với status khác nhau)
- ✅ 2 accounts
- ✅ 2 contacts
- ✅ 2 deals
- ✅ 2 tasks
- ✅ Activities log

---

## 🧪 Quick Test

### Tạo Lead từ UI
1. Login: http://localhost:3000
2. Click "🎯 Khách hàng tiềm năng"
3. Click "+ Thêm Lead"
4. Điền form và click "Tạo Lead"
5. Xem lead trong danh sách

### Kiểm Tra API
```bash
# Get token
TOKEN=$(curl -s -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"Admin@123456"}' \
  | jq -r '.access_token')

# Test API
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:3001/api/leads
```

---

## 🔍 Các Tính Năng Để Test

- [ ] **Login/Register** - Đăng ký và đăng nhập
- [ ] **Dashboard** - Xem thống kê
- [ ] **Create Lead** - Tạo lead mới
- [ ] **List Leads** - Xem danh sách
- [ ] **Search** - Tìm kiếm leads
- [ ] **Filter** - Lọc by status, source
- [ ] **Update Status** - Thay đổi trạng thái
- [ ] **Update Score** - Cập nhật điểm số
- [ ] **Pagination** - Phân trang
- [ ] **Delete** - Xóa leads

---

## 📊 Useful Links

| Link | Purpose |
|------|---------|
| http://localhost:3000 | Frontend |
| http://localhost:3001/api | Backend |
| http://localhost:5050 | PgAdmin (Database) |
| http://localhost:9001 | MinIO (File Storage) |

---

## 🐛 Troubleshoot

**Backend không khởi động?**
```bash
# Check logs
npm run backend:dev

# Port 3001 đang sử dụng?
lsof -i :3001
```

**Database error?**
```bash
# Reset database
npm run db:reset

# Rerun migrations
npm run db:migrate
```

**Frontend không load?**
```bash
# Clear cache
rm -rf .next

# Restart
npm run web:dev
```

---

**Xong rồi!** 🎉 Bạn đã có một CRM system đầy đủ để test. Chúc vui!
