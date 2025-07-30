# Hệ thống Phân quyền

## Tổng quan

Hệ thống phân quyền được xây dựng với các tính năng sau:

### 1. Roles (Vai trò)
- **Admin**: Quản trị viên hệ thống, có tất cả quyền
- **Employee**: Nhân viên, có quyền hạn chế
- **Client**: Khách hàng (mặc định)

### 2. Permissions (Quyền)
Hệ thống có các nhóm quyền chính:

#### User Management
- `view_users`: Xem danh sách người dùng
- `create_user`: Tạo người dùng mới
- `edit_user`: Chỉnh sửa thông tin người dùng
- `delete_user`: Xóa người dùng

#### Category Management
- `view_categories`: Xem danh sách danh mục
- `create_category`: Tạo danh mục mới
- `edit_category`: Chỉnh sửa danh mục
- `delete_category`: Xóa danh mục

#### Product Management
- `view_products`: Xem danh sách sản phẩm
- `create_product`: Tạo sản phẩm mới
- `edit_product`: Chỉnh sửa sản phẩm
- `delete_product`: Xóa sản phẩm

#### Attribute Management
- `view_attributes`: Xem danh sách thuộc tính
- `create_attribute`: Tạo thuộc tính mới
- `edit_attribute`: Chỉnh sửa thuộc tính
- `delete_attribute`: Xóa thuộc tính

#### Order Management
- `view_orders`: Xem danh sách đơn hàng
- `edit_order`: Chỉnh sửa đơn hàng
- `delete_order`: Xóa đơn hàng

#### Role & Permission Management
- `view_roles`: Xem danh sách vai trò
- `create_role`: Tạo vai trò mới
- `edit_role`: Chỉnh sửa vai trò
- `delete_role`: Xóa vai trò
- `view_permissions`: Xem danh sách quyền
- `create_permission`: Tạo quyền mới
- `edit_permission`: Chỉnh sửa quyền
- `delete_permission`: Xóa quyền
- `assign_permission`: Gán quyền cho vai trò

#### Voucher Management
- `view_vouchers`: Xem danh sách mã giảm giá
- `create_voucher`: Tạo mã giảm giá mới
- `edit_voucher`: Chỉnh sửa mã giảm giá
- `delete_voucher`: Xóa mã giảm giá

## Cách sử dụng

### 1. Truy cập Admin Panel
- Admin và Employee có thể truy cập `/admin`
- Chỉ hiển thị menu mà user có quyền

### 2. Quản lý Permissions
- Vào `/admin/permissions`
- Tạo permissions mới
- Chọn role để gán permissions
- Gán/xóa permissions cho role

### 3. Kiểm tra quyền trong code

#### Frontend (React)
```typescript
import { usePermissions } from '../hooks/usePermissions';

const MyComponent = () => {
  const { hasPermission, hasAnyPermission, hasAllPermissions } = usePermissions();

  // Kiểm tra một quyền
  if (hasPermission('view_users')) {
    // Hiển thị nội dung
  }

  // Kiểm tra một trong nhiều quyền
  if (hasAnyPermission(['view_users', 'edit_users'])) {
    // Hiển thị nội dung
  }

  // Kiểm tra tất cả quyền
  if (hasAllPermissions(['view_users', 'edit_users'])) {
    // Hiển thị nội dung
  }
};
```

#### Backend (Node.js)
```javascript
import { requirePermission } from '../middleware/auth.js';

// Bảo vệ route với permission cụ thể
app.get('/admin/users', requirePermission('view_users'), getUsers);
```

### 4. Protected Routes
```typescript
import ProtectedRoute from '../components/Admin/ProtectedRoute';

// Bảo vệ component với permission
<ProtectedRoute requiredPermission="view_users">
  <UserList />
</ProtectedRoute>
```

## Cấu trúc Database

### Collections

#### users
```javascript
{
  _id: ObjectId,
  name: String,
  email: String,
  password: String,
  role_id: ObjectId (ref: roles),
  // ... other fields
}
```

#### roles
```javascript
{
  _id: ObjectId,
  name: String,
  description: String,
  // ... timestamps
}
```

#### permissions
```javascript
{
  _id: ObjectId,
  name: String,
  description: String,
  // ... timestamps
}
```

#### role_permissions
```javascript
{
  _id: ObjectId,
  role_id: ObjectId (ref: roles),
  permission_id: ObjectId (ref: permissions),
  // ... timestamps
}
```

## API Endpoints

### Permissions
- `GET /permissions` - Lấy danh sách permissions
- `POST /permissions/create` - Tạo permission mới
- `PUT /permissions/:id` - Cập nhật permission
- `DELETE /permissions/:id` - Xóa permission

### Roles
- `GET /roles` - Lấy danh sách roles
- `POST /roles/create` - Tạo role mới
- `PUT /roles/:id` - Cập nhật role
- `DELETE /roles/:id` - Xóa role

### Role-Permissions
- `GET /roles/:roleId/permissions` - Lấy permissions của role
- `POST /roles/assign-permission` - Gán permission cho role
- `DELETE /roles/:roleId/permissions/:permissionId` - Xóa permission khỏi role
- `GET /roles/:roleId/available-permissions` - Lấy permissions có thể gán

### User Permissions
- `GET /user/permissions` - Lấy thông tin user và permissions
- `GET /user/check-permission/:permissionName` - Kiểm tra quyền cụ thể

## Khởi tạo dữ liệu

Khi khởi động server, hệ thống sẽ tự động:
1. Tạo các permissions mặc định
2. Tạo roles admin và employee
3. Gán tất cả permissions cho admin
4. Gán một số permissions cơ bản cho employee

## Lưu ý

1. **Dashboard luôn hiển thị** cho tất cả user có quyền truy cập admin
2. **Sidebar menu** chỉ hiển thị các chức năng mà user có quyền
3. **Protected routes** sẽ chuyển hướng hoặc hiển thị thông báo nếu không có quyền
4. **Employee** có thể truy cập admin nhưng chỉ thấy các chức năng được cấp quyền

## Troubleshooting

### Không thấy menu trong sidebar
- Kiểm tra user có role không
- Kiểm tra role có được gán permissions không
- Refresh trang để load lại permissions

### Không thể truy cập trang
- Kiểm tra user có permission cần thiết không
- Kiểm tra token có hợp lệ không
- Kiểm tra role có được cấu hình đúng không 