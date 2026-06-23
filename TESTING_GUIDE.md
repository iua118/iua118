# 🧪 CRM System Testing Guide

## 🚀 Cài Đặt Nhanh

### Bước 1: Clone & Cài Đặt Dependencies
```bash
# Cài đặt tất cả dependencies
npm install

# Copy environment file
cp .env.example .env
```

### Bước 2: Khởi Động Docker Services
```bash
# Khởi động PostgreSQL, Redis, MinIO
npm run docker:up

# Chờ 10-15 giây để services khởi động
sleep 15

# Kiểm tra services
docker ps
```

### Bước 3: Setup Database
```bash
# Chạy Prisma migrations
npm run db:migrate

# Tùy chọn: Seed demo data
npm run db:seed
```

### Bước 4: Khởi Động Backend & Frontend
```bash
# Terminal 1: Backend API (port 3001)
npm run backend:dev

# Terminal 2: Frontend (port 3000)
npm run web:dev
```

### Bước 5: Truy Cập Ứng Dụng
- 🌐 **Web**: http://localhost:3000
- 🔌 **API**: http://localhost:3001/api
- 📊 **Database**: http://localhost:5050 (PgAdmin)
- 🪣 **File Storage**: http://localhost:9001 (MinIO)

---

## 📚 Test User Accounts

### Tài khoản Demo Sẵn Có

**Admin Account**:
```
Email: admin@example.com
Password: Admin@123456
Role: ADMIN
```

**Sales Manager**:
```
Email: manager@example.com
Password: Manager@123456
Role: MANAGER
```

**Sales Representative**:
```
Email: sales@example.com
Password: Sales@123456
Role: USER
```

---

## 🔐 Authentication Testing

### Đăng Ký User Mới
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test@123456",
    "firstName": "Nguyễn",
    "lastName": "Văn A",
    "phone": "0912345678",
    "department": "Sales"
  }'

# Response:
{
  "access_token": "eyJhbGc...",
  "user": {
    "id": "clr...",
    "email": "test@example.com",
    "firstName": "Nguyễn",
    "lastName": "Văn A",
    "role": "USER"
  }
}
```

### Đăng Nhập
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test@123456"
  }'
```

### Lấy Thông Tin User Hiện Tại
```bash
curl -X GET http://localhost:3001/api/auth/me \
  -H "Authorization: Bearer <access_token>"
```

---

## 🎯 Lead Management Testing

### Tạo Lead Mới
```bash
curl -X POST http://localhost:3001/api/leads \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <access_token>" \
  -d '{
    "firstName": "Tôn",
    "lastName": "Nữ Tây",
    "email": "tontaynu@example.com",
    "phone": "0987654321",
    "company": "Tech Solutions Inc",
    "jobTitle": "Sales Director",
    "source": "WEBSITE",
    "notes": "Khách hàng tiềm năng cao, budget lớn",
    "tags": ["VIP", "Hot", "B2B"]
  }'
```

### Lấy Danh Sách Leads (Không Filter)
```bash
curl -X GET http://localhost:3001/api/leads \
  -H "Authorization: Bearer <access_token>"

# Response:
{
  "data": [
    {
      "id": "cuid123",
      "firstName": "Tôn",
      "lastName": "Nữ Tây",
      "email": "tontaynu@example.com",
      "company": "Tech Solutions Inc",
      "source": "WEBSITE",
      "status": "NEW",
      "score": 0,
      "createdAt": "2024-06-23T10:00:00Z"
    }
  ],
  "total": 1,
  "page": 1,
  "limit": 20,
  "pages": 1
}
```

### Lấy Leads với Filter
```bash
# Filter theo status
curl -X GET "http://localhost:3001/api/leads?status=NEW" \
  -H "Authorization: Bearer <access_token>"

# Filter theo source
curl -X GET "http://localhost:3001/api/leads?source=WEBSITE" \
  -H "Authorization: Bearer <access_token>"

# Tìm kiếm
curl -X GET "http://localhost:3001/api/leads?search=Tôn" \
  -H "Authorization: Bearer <access_token>"

# Combo: status + source + search
curl -X GET "http://localhost:3001/api/leads?page=1&limit=10&status=NEW&source=WEBSITE&search=Tôn" \
  -H "Authorization: Bearer <access_token>"
```

### Lấy Chi Tiết Lead
```bash
curl -X GET http://localhost:3001/api/leads/cuid123 \
  -H "Authorization: Bearer <access_token>"

# Response:
{
  "id": "cuid123",
  "firstName": "Tôn",
  "lastName": "Nữ Tây",
  "email": "tontaynu@example.com",
  "phone": "0987654321",
  "company": "Tech Solutions Inc",
  "jobTitle": "Sales Director",
  "source": "WEBSITE",
  "status": "NEW",
  "score": 0,
  "notes": "Khách hàng tiềm năng cao, budget lớn",
  "tags": ["VIP", "Hot", "B2B"],
  "assignedTo": null,
  "contact": null,
  "deal": null,
  "activities": [],
  "createdAt": "2024-06-23T10:00:00Z"
}
```

### Cập Nhật Lead
```bash
curl -X PUT http://localhost:3001/api/leads/cuid123 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <access_token>" \
  -d '{
    "jobTitle": "CTO",
    "notes": "Updated: Đã liên hệ, rất hứa hẹn"
  }'
```

### Cập Nhật Trạng Thái Lead
```bash
curl -X PUT http://localhost:3001/api/leads/cuid123/status \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <access_token>" \
  -d '{
    "status": "CONTACTED"
  }'

# Các status có thể:
# NEW, CONTACTED, QUALIFIED, UNQUALIFIED, NURTURING, CONVERTED, LOST
```

### Cập Nhật Điểm Số Lead (0-100)
```bash
curl -X PUT http://localhost:3001/api/leads/cuid123/score \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <access_token>" \
  -d '{
    "score": 85
  }'
```

### Gán Lead Cho Nhân Viên
```bash
# Trước tiên lấy ID của user
curl -X GET http://localhost:3001/api/users \
  -H "Authorization: Bearer <access_token>"

# Gán lead
curl -X PUT http://localhost:3001/api/leads/cuid123/assign \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <access_token>" \
  -d '{
    "assignedToId": "user-id-here"
  }'
```

### Xóa Lead
```bash
curl -X DELETE http://localhost:3001/api/leads/cuid123 \
  -H "Authorization: Bearer <access_token>"
```

### Lấy Thống Kê Leads
```bash
# Overview stats
curl -X GET http://localhost:3001/api/leads/stats/overview \
  -H "Authorization: Bearer <access_token>"

# Response:
{
  "totalLeads": 5,
  "byStatus": {
    "NEW": 2,
    "CONTACTED": 1,
    "QUALIFIED": 1,
    "CONVERTED": 1,
    "LOST": 0
  },
  "conversionRate": "20.00"
}

# By source
curl -X GET http://localhost:3001/api/leads/stats/by-source \
  -H "Authorization: Bearer <access_token>"

# Response:
[
  { "source": "WEBSITE", "_count": 3 },
  { "source": "GOOGLE_ADS", "_count": 2 }
]
```

---

## 🎨 Frontend Testing

### Đăng Ký & Đăng Nhập
1. Vào http://localhost:3000/register
2. Điền form:
   ```
   Họ: Nguyễn
   Tên: Văn A
   Email: user@example.com
   Password: User@123456
   Confirm: User@123456
   ```
3. Click "Đăng Ký"
4. Tự động redirect đến /dashboard

### Đăng Nhập Lại
1. Vào http://localhost:3000/login
2. Nhập:
   ```
   Email: user@example.com
   Password: User@123456
   ```
3. Click "Đăng Nhập"

### Quản Lý Leads
1. Click "🎯 Khách hàng tiềm năng" ở sidebar
2. Vào trang danh sách leads
3. **Thử tính năng**:
   - ✅ Click "+ Thêm Lead"
   - ✅ Điền form và tạo lead
   - ✅ Xem lead trong bảng
   - ✅ Dùng search để tìm lead
   - ✅ Lọc theo status
   - ✅ Lọc theo source
   - ✅ Click "Chi tiết" để xem full info
   - ✅ Click "Xóa" để xóa lead

### Dashboard
1. Click "📊 Dashboard" ở sidebar
2. Xem thống kê:
   - Khách hàng tiềm năng
   - Thương vụ đang xử lý
   - Công việc chưa hoàn thành
   - Doanh thu tháng này

---

## 🔄 Test Scenarios

### Scenario 1: Tạo & Quản Lý Lead Mới
```
1. Đăng ký account: test.user@example.com
2. Tạo 3 leads:
   - Lead 1: Từ WEBSITE, status NEW
   - Lead 2: Từ FACEBOOK_ADS, status CONTACTED
   - Lead 3: Từ GOOGLE_ADS, status QUALIFIED
3. Filter theo status=NEW → chỉ thấy Lead 1
4. Filter theo source=FACEBOOK_ADS → chỉ thấy Lead 2
5. Tìm kiếm → thấy được leads phù hợp
6. Cập nhật Lead 1: status = CONTACTED
7. Cập nhật Lead 1: score = 75
8. Xóa Lead 3 → Lead 3 biến mất
```

### Scenario 2: Role-Based Access
```
1. Login as ADMIN
   → Thấy tất cả leads
   → Có quyền assign leads

2. Login as USER
   → Chỉ thấy leads được gán cho mình
   → Không thể xem leads của người khác
```

### Scenario 3: Pagination
```
1. Tạo 25 leads
2. Vào /dashboard/leads
3. Trang 1 hiển thị 20 leads
4. Click page 2 → hiển thị 5 leads còn lại
5. Click "← Trước" → quay lại page 1
```

---

## 🐛 Debugging Tips

### Xem Backend Logs
```bash
# Terminal chạy backend:dev sẽ hiển thị tất cả logs
# Ví dụ:
[Nest] 1234  - 06/23/2024, 10:00:00 AM     LOG [TypeOrmModule] TypeORM connected
[Nest] 1234  - 06/23/2024, 10:00:01 AM     LOG [AppModule] Application started
```

### Xem Database
```bash
# Vào PgAdmin: http://localhost:5050
# Login: admin@crm.local / admin
# Chọn: Servers > PostgreSQL > crm_db
# Xem tables: leads, users, activities, etc.
```

### Test API với Postman
```
1. Download Postman
2. Import collection từ file (nếu có)
3. Set environment variables:
   - base_url: http://localhost:3001/api
   - token: <access_token từ login>
4. Test từng endpoint
```

### Browser DevTools
```
1. Mở http://localhost:3000
2. Press F12 để mở DevTools
3. Xem:
   - Network tab: API requests
   - Console tab: JavaScript errors
   - Storage tab: localStorage (access_token)
```

---

## ✅ Checklist Testing

- [ ] **Auth**
  - [ ] Register new user
  - [ ] Login with correct credentials
  - [ ] Login with wrong password (error)
  - [ ] Get current user info
  
- [ ] **Leads CRUD**
  - [ ] Create lead with valid data
  - [ ] Create lead with missing required fields (error)
  - [ ] Create lead with duplicate email (error)
  - [ ] Get all leads (paginated)
  - [ ] Get single lead by ID
  - [ ] Update lead data
  - [ ] Delete lead
  
- [ ] **Leads Filtering**
  - [ ] Filter by status
  - [ ] Filter by source
  - [ ] Search by name, email, company
  - [ ] Combine multiple filters
  
- [ ] **Leads Status**
  - [ ] Change status from NEW to CONTACTED
  - [ ] Change status from CONTACTED to QUALIFIED
  - [ ] Change status to CONVERTED
  - [ ] Change status to LOST
  
- [ ] **Leads Scoring**
  - [ ] Update score to 25
  - [ ] Update score to 75
  - [ ] Try invalid score > 100 (error)
  - [ ] Try negative score (error)
  
- [ ] **Leads Assignment**
  - [ ] Assign lead to user
  - [ ] Change assigned user
  - [ ] Unassign lead
  
- [ ] **Frontend UI**
  - [ ] Login page loads correctly
  - [ ] Register page works
  - [ ] Dashboard displays stats
  - [ ] Leads list displays data
  - [ ] Create form validates input
  - [ ] Pagination works
  - [ ] Responsive on mobile
  - [ ] Filter dropdown works
  - [ ] Search input works

---

## 🔗 Useful Links

- **Backend Docs**: http://localhost:3001/api
- **Frontend**: http://localhost:3000
- **Database Manager**: http://localhost:5050
- **File Storage**: http://localhost:9001
- **API Health Check**: http://localhost:3001/api/health

---

## 💡 Tips

1. **Lưu Access Token**: Sau khi login, token được lưu ở localStorage
2. **CORS Issues**: Nếu có CORS error, check `app.module.ts` enableCors config
3. **Database Connection**: Nếu DB error, kiểm tra DATABASE_URL ở `.env`
4. **Port Conflicts**: Nếu port 3000 hoặc 3001 đang sử dụng, change PORT env var

---

## 🆘 Troubleshooting

### Backend không khởi động
```bash
# Kiểm tra lỗi
npm run backend:dev

# Common issues:
# - Port 3001 đang sử dụng: lsof -i :3001
# - Database không kết nối: check DATABASE_URL
# - Dependencies lỗi: rm -rf node_modules && npm install
```

### Frontend không load
```bash
# Check logs
npm run web:dev

# Clear cache
rm -rf .next
npm run web:dev
```

### Database issues
```bash
# Reset database (careful!)
npm run db:reset

# Rerun migrations
npm run db:migrate
```

---

**Happy Testing!** 🚀
