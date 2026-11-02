# Ứng dụng Quản lý Học tập - Thực hành 4 (API & Offline Mode)

Ứng dụng Quản lý Học tập cá nhân trên thiết bị di động sử dụng React Native + TypeScript, kết nối REST API (json-server) và hỗ trợ chế độ hoạt động không có mạng (Offline Cache & Outbox Sync).

## 1. Công nghệ sử dụng

- React Native (TypeScript) & React Navigation (@react-navigation/native, @react-navigation/bottom-tabs, @react-navigation/native-stack)
- @react-native-async-storage/async-storage (Lưu trữ Cache và Hàng đợi Outbox)
- @react-native-community/netinfo (Theo dõi trạng thái kết nối mạng)
- json-server (Mock REST API từ file db.json)

## 2. Hướng dẫn cài đặt và chạy ứng dụng

### Bước 1: Cài đặt thư viện
`ash
npm install
`

### Bước 2: Chạy Mock Server (json-server)
Mở một cửa sổ terminal tại thư mục gốc của dự án và chạy:
`ash
npm run api
`
Hoặc chạy trực tiếp bằng lệnh:
`ash
npx json-server --watch db.json --host 0.0.0.0 --port 3000 --delay 800
`
- Máy ảo Android kết nối qua địa chỉ mặc định trong src/config.ts: http://10.0.2.2:3000
- Nếu dùng máy thật cùng mạng Wi-Fi, đổi BASE_URL trong src/config.ts thành http://<IP-LAN-máy-tính>:3000

### Bước 3: Chạy ứng dụng React Native
Mở cửa sổ terminal thứ hai và chạy:
`ash
npm start
`
Sau đó mở terminal thứ ba để chạy trên máy ảo Android:
`ash
npm run android
`

## 3. Sơ đồ luồng dữ liệu

`	ext
+-------------------------------------------------------------------+
|                             MÀN HÌNH                              |
|    (Home, Courses, Schedule, Assignments, Profile & Details)      |
+-------------------------------------------------------------------+
                                 |
                                 v
+-------------------------------------------------------------------+
|                        CONTEXT & CUSTOM HOOKS                     |
|   AppDataContext / SyncContext                                    |
|   useCachedQuery() | useNetworkStatus() | useOutboxSync()         |
+-------------------------------------------------------------------+
               |                                   |
      (Đọc/Ghi Cache & Outbox)              (Khi Online gọi)
               v                                   v
+------------------------------+     +------------------------------+
|       STORAGE LAYER          |     |         SERVICE LAYER        |
|  src/storage/cache.ts        |     |  studentService, course...   |
|  src/storage/outbox.ts       |     |  src/api/client.ts           |
|  (AsyncStorage)              |     |  (fetch + timeout 10s)       |
+------------------------------+     +------------------------------+
                                                   |
                                                   v
                                     +------------------------------+
                                     |      REST API (db.json)      |
                                     |   json-server (port 3000)    |
                                     +------------------------------+
`

- **Khi đọc dữ liệu (GET):** Màn hình -> AppDataContext / useCachedQuery -> đọc cache.ts hiển thị ngay lập tức -> nếu isOnline = true thì gọi *Service.ts -> client.ts -> API -> lưu kết quả mới kèm savedAt vào cache.ts.
- **Khi thêm/sửa dữ liệu lúc Offline (POST/PATCH):** Màn hình -> AppDataContext cập nhật ngay giao diện và cache.ts -> đẩy thao tác { id, method, url, body, createdAt } vào outbox.ts -> hiện nhãn "Chưa đồng bộ".
- **Khi có mạng trở lại:** useNetworkStatus phát hiện isOnline = true -> useOutboxSync đọc tuần tự từng mục trong outbox.ts -> gửi lên API qua client.ts -> xóa mục thành công khỏi outbox.ts -> làm mới dữ liệu và báo "Đã đồng bộ X thay đổi".

## 4. Giải thích cách xử lý xung đột dữ liệu (Mục B5)

Khi người dùng thực hiện chỉnh sửa dữ liệu lúc đang **offline** (ví dụ: sửa thông tin cá nhân PATCH /students/1 hoặc đổi trạng thái bài tập PATCH /assignments/:id), ứng dụng lưu thời điểm tạo thao tác vào trường createdAt của phần tử trong hàng đợi outbox.

Khi có mạng trở lại, trước khi gửi lệnh PATCH lên server trong src/hooks/useOutboxSync.ts:
1. Ứng dụng gửi một yêu cầu GET tới chính đường dẫn tài nguyên đó (ví dụ /students/1) để lấy bản ghi hiện tại trên server.
2. So sánh mốc thời gian serverItem.updatedAt (trên server) với item.createdAt (thời điểm người dùng thao tác offline trên máy):
   - **Nếu 
ew Date(serverItem.updatedAt) > new Date(item.createdAt):** Dữ liệu trên server đã được cập nhật mới hơn thời điểm thao tác offline. Ứng dụng **ưu tiên giữ dữ liệu của server**, bỏ qua lệnh PATCH cũ trong hàng đợi, xóa thao tác đó khỏi outbox, tải lại dữ liệu mới từ server về cache và hiển thị hộp thoại Alert thông báo cho người dùng biết có xung đột dữ liệu.
   - **Nếu serverItem.updatedAt <= item.createdAt:** Không có xung đột, ứng dụng thực hiện PATCH dữ liệu offline lên server như bình thường.