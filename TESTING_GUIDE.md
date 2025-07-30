# Hướng dẫn Test Hệ thống Phân quyền

## Bước 1: Khởi động Backend

```bash
cd backend
npm start
```

Server sẽ tự động tạo:
- Các permissions mặc định
- Roles admin và employee
- Gán permissions cho các roles

## Bước 2: Tạo User Test

### Tạo Admin User
```bash
cd backend
npm run create-admin
```

Thông tin đăng nhập:
- Email: `admin@example.com`
- Password: `admin123`
- Role: `admin`

### Tạo Employee User
```bash
cd backend
npm run create-employee
```

Thông tin đăng nhập:
- Email: `employee@example.com`
- Password: `employee123`
- Role: `employee`

## Bước 3: Khởi động Frontend

```bash
cd frontend
npm run dev
```

## Bước 4: Test Hệ thống

### Test với Admin User

1. **Đăng nhập với admin@example.com**
   - Vào `/login`
   - Đăng nhập với thông tin admin
   - Chuyển hướng đến `/admin`

2. **Kiểm tra Dashboard**
   - Xem thông tin user và role
   - Xem danh sách permissions (tất cả permissions)

3. **Kiểm tra Sidebar**
   - Tất cả menu items hiển thị
   - Có thể truy cập tất cả chức năng

4. **Test Quản lý Permissions**
   - Vào `/admin/permissions`
   - Tạo permission mới
   - Chọn role employee
   - Gán permissions cho employee

### Test với Employee User

1. **Đăng nhập với employee@example.com**
   - Vào `/login`
   - Đăng nhập với thông tin employee
   - Chuyển hướng đến `/admin`

2. **Kiểm tra Dashboard**
   - Xem thông tin user và role
   - Xem danh sách permissions (chỉ permissions được gán)

3. **Kiểm tra Sidebar**
   - Chỉ hiển thị menu Dashboard và các chức năng có quyền
   - Không thấy menu quản lý users, roles, permissions

4. **Test Truy cập Trang**
   - Có thể truy cập Dashboard
   - Có thể truy cập các trang có quyền
   - Không thể truy cập trang không có quyền (hiển thị thông báo)

## Bước 5: Test Quản lý Permissions

### Thêm Permissions cho Employee

1. **Đăng nhập với Admin**
2. **Vào `/admin/permissions`**
3. **Chọn role "employee"**
4. **Gán thêm permissions:**
   - `create_product`
   - `edit_product`
   - `view_attributes`

### Test Employee với Permissions mới

1. **Đăng nhập lại với Employee**
2. **Kiểm tra Sidebar**
   - Thấy menu "Sản phẩm" và "Thuộc tính"
3. **Truy cập các trang mới**
   - Có thể vào `/admin/product`
   - Có thể vào `/admin/attribute`

## Bước 6: Test Protected Routes

### Test với User không có quyền

1. **Tạo user client thông thường**
2. **Cố gắng truy cập `/admin`**
3. **Kết quả:** Chuyển hướng về trang chủ

### Test với Employee không có quyền

1. **Đăng nhập với Employee**
2. **Cố gắng truy cập `/admin/users`** (nếu không có quyền)
3. **Kết quả:** Hiển thị trang "Không có quyền truy cập"

## Bước 7: Test API Endpoints

### Test User Permissions API

```bash
# Lấy thông tin user và permissions
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:5000/user/permissions

# Kiểm tra quyền cụ thể
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:5000/user/check-permission/view_users
```

### Test Role-Permissions API

```bash
# Lấy permissions của role
curl http://localhost:5000/roles/ROLE_ID/permissions

# Gán permission cho role
curl -X POST -H "Content-Type: application/json" \
  -d '{"role_id": "ROLE_ID", "permission_id": "PERMISSION_ID"}' \
  http://localhost:5000/roles/assign-permission
```

## Kết quả mong đợi

### Admin User
- ✅ Truy cập được tất cả chức năng
- ✅ Thấy tất cả menu trong sidebar
- ✅ Có tất cả permissions
- ✅ Có thể quản lý permissions cho các role khác

### Employee User
- ✅ Chỉ thấy menu có quyền
- ✅ Chỉ có permissions được gán
- ✅ Không thể truy cập trang không có quyền
- ✅ Dashboard luôn hiển thị

### Hệ thống
- ✅ Sidebar động dựa trên permissions
- ✅ Protected routes hoạt động đúng
- ✅ API trả về đúng thông tin permissions
- ✅ Giao diện không thay đổi (giữ nguyên Tailwind)

## Troubleshooting

### Lỗi thường gặp

1. **Không thấy menu trong sidebar**
   - Refresh trang
   - Kiểm tra token có hợp lệ không
   - Kiểm tra user có role không

2. **Không thể đăng nhập**
   - Kiểm tra server có chạy không
   - Kiểm tra database connection
   - Kiểm tra user có tồn tại không

3. **Permissions không load**
   - Kiểm tra API `/user/permissions`
   - Kiểm tra role có được gán permissions không
   - Kiểm tra token có chứa thông tin user không

### Debug

1. **Kiểm tra Console Browser**
   - Xem lỗi JavaScript
   - Xem network requests

2. **Kiểm tra Server Logs**
   - Xem lỗi API
   - Xem database queries

3. **Kiểm tra Database**
   - Xem collections: users, roles, permissions, role_permissions
   - Kiểm tra relationships giữa các collections 