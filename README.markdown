# Spotify Clone

Một ứng dụng phát nhạc tương tự Spotify được xây dựng bằng **ReactJS**, **Redux Toolkit Query**, **React Router** và **Tailwind CSS**. Dự án mô phỏng các tính năng cốt lõi của một nền tảng âm nhạc, bao gồm phát nhạc, tạo album, xác thực người dùng, quản lý hồ sơ, tìm kiếm và các chức năng quản trị. Dữ liệu được lưu trữ và lấy từ cơ sở dữ liệu backend, cung cấp tập dữ liệu phong phú về bài hát, album, nghệ sĩ, thể loại và người dùng.

## Mục Lục
- [Tính Năng](#tính-năng)
- [Cấu Trúc Dự Án](#cấu-trúc-dự-án)
- [Cài Đặt](#cài-đặt)
- [Hướng Dẫn Sử Dụng](#hướng-dẫn-sử-dụng)
- [Tổng Quan Thành Phần](#tổng-quan-thành-phần)
- [Xem Trước](#xem-trước)
- [Công Nghệ Sử Dụng](#công-nghệ-sử-dụng)
- [Hạn Chế](#hạn-chế)
- [Cải Tiến Trong Tương Lai](#cải-tiền-trong-tương-lai)
- [Đóng Góp](#đóng-góp)

## Tính Năng
- **Phát Nhạc**: Phát các video MP4 với trình phát tùy chỉnh, hỗ trợ phát/tạm dừng, bài tiếp theo/trước đó, điều chỉnh âm lượng và giao diện thu nhỏ/mở rộng.
- **Tạo Album**: Tạo album tùy chỉnh với các bài hát được chọn và hình ảnh, lưu vào hồ sơ người dùng.
- **Tìm Kiếm**: Tìm kiếm bài hát theo tên, hiển thị tất cả bài hát khi không nhập từ khóa.
- **Xác Thực Người Dùng**: Đăng ký và đăng nhập bằng email/mật khẩu, quản lý hồ sơ để chỉnh sửa tên/email và xem album đã tạo.
- **Thiết Kế Responsive**: Giao diện thân thiện với thiết bị di động nhờ Tailwind CSS, với trình phát thu nhỏ cố định ở dưới cùng.
- **Bảng Điều Khiển Quản Trị**: Giao diện dành riêng cho quản trị viên để xem thống kê (tổng số bài hát và album) bằng biểu đồ Chart.js và điều hướng đến tạo bài hát.
- **Tạo Bài Hát**: Quản trị viên có thể tạo bài hát mới với tên, thể loại (chọn nhiều), nghệ sĩ (chọn một), hình ảnh và video.
- **Quản Lý Nghệ Sĩ và Thể Loại**: Lấy và hiển thị danh sách nghệ sĩ và thể loại, sử dụng trong tạo bài hát và các tính năng khác.
- **Tích Hợp Backend**: Sử dụng cơ sở dữ liệu backend với axios để gọi API, hỗ trợ bài hát, album, nghệ sĩ, thể loại và người dùng.

## Cấu Trúc Dự Án
```
spotify-clone/
├── public/
│   ├── index.html
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── Controls.jsx
│   │   ├── Error.jsx
│   │   ├── ErrorBoundary.jsx
│   │   ├── Loader.jsx
│   │   ├── Player.jsx
│   │   ├── SongCard.jsx
│   │   ├── Track.jsx
│   │   └── VolumeBar.jsx
│   ├── pages/
│   │   ├── AdminDashboard.jsx
│   │   ├── ArtistList.jsx
│   │   ├── CreateAlbum.jsx
│   │   ├── CreateTrack.jsx
│   │   ├── Login.jsx
│   │   ├── Profile.jsx
│   │   ├── Register.jsx
│   │   └── Search.jsx
│   ├── redux/
│   │   ├── features/
│   │   │   └── playerSlice.js
│   │   ├── services/
│   │   │   └── spotifyApi.js
│   │   └── store.js
│   ├── assets/
│   │   └── logo.png
│   ├── App.jsx
│   ├── index.css
│   └── index.js
├── package.json
└── README.md
```

- **components/**: Các thành phần giao diện có thể tái sử dụng (ví dụ: `Player`, `Controls`, `SongCard`).
- **pages/**: Các thành phần cấp trang cho các tuyến đường (ví dụ: `Profile`, `Search`, `AdminDashboard`, `CreateTrack`).
- **redux/**: Redux store, slices và dịch vụ API sử dụng Redux Toolkit Query.
- **assets/**: Tài nguyên tĩnh như logo.
- **App.jsx**: Ứng dụng chính với thiết lập định tuyến.

## Cài Đặt
Hướng dẫn cài đặt và chạy dự án trên máy cục bộ.

### Yêu Cầu
- **Node.js** (phiên bản 16 trở lên)
- **npm** (phiên bản 7 trở lên) hoặc **yarn**
- Trình duyệt hiện đại (Chrome, Firefox, v.v.)
- **Server Backend**: Server Django chạy tại `http://127.0.0.1:8000` (cấu hình theo nhu cầu).

### Các Bước
1. **Sao Chép Kho Lưu Trữ**:
   ```bash
   git clone https://github.com/your-username/spotify-clone.git
   cd spotify-clone
   ```

2. **Cài Đặt Các Gói Phụ Thuộc**:
   ```bash
   npm install
   ```
   Cài đặt các gói cần thiết, bao gồm:
   - `react`, `react-dom`
   - `react-router-dom`
   - `@reduxjs/toolkit`, `react-redux`
   - `tailwindcss`, `postcss`, `autoprefixer`
   - `@heroicons/react`
   - `chart.js`, `react-chartjs-2`
   - `axios`

3. **Thiết Lập Tailwind CSS**:
   Đảm bảo file `tailwind.config.js` và `index.css` được cấu hình:
   ```css
   /* src/index.css */
   @tailwind base;
   @tailwind components;
   @tailwind utilities;
   ```
   Nếu chưa có, khởi tạo Tailwind:
   ```bash
   npx tailwindcss init
   ```

4. **Chạy Server Phát Triển**:
   ```bash
   npm start
   ```
   Ứng dụng sẽ mở tại `http://localhost:3000`.

5. **Build Cho Production** (tùy chọn):
   ```bash
   npm run build
   ```

6. **Thiết Lập Backend**:
   - Đảm bảo server Django đang chạy (`python manage.py runserver`).
   - Kiểm tra các endpoint API (ví dụ: `http://127.0.0.1:8000/api/music/artists/`, `/music/genre/`, `/music/tracks/create/`).
   - Nạp dữ liệu ban đầu cho nghệ sĩ, thể loại, bài hát và album nếu cần.

## Hướng Dẫn Sử Dụng
- **Đăng Ký/Đăng Nhập**: Truy cập `/register` để tạo tài khoản hoặc `/login` để đăng nhập (ví dụ: `alice@example.com`/`password123`).
- **Hồ Sơ**: Xem và chỉnh sửa thông tin người dùng, cũng như các album đã tạo tại `/profile`.
- **Tạo Album**: Truy cập `/create-album` để tạo album tùy chỉnh với bài hát và hình ảnh.
- **Tìm Kiếm**: Sử dụng `/search/:searchTerm` để tìm bài hát hoặc `/search` để xem tất cả bài hát.
- **Trình Phát Nhạc**: Phát bài hát qua thành phần `MusicPlayer`, hiển thị khi có bài hát đang hoạt động. Chuyển đổi giữa giao diện thu nhỏ và mở rộng.
- **Bảng Điều Khiển Quản Trị**: Quản trị viên (với `userRole: "admin"` trong `localStorage`) có thể truy cập `/admin` để xem thống kê bài hát và album, điều hướng đến tạo bài hát.
- **Tạo Bài Hát**: Quản trị viên truy cập `/admin/create-track` để tạo bài hát mới với lựa chọn thể loại và nghệ sĩ.
- **Danh Sách Nghệ Sĩ**: Xem tất cả nghệ sĩ tại `/artists`, hiển thị tên và các bài hát liên quan.

## Tổng Quan Thành Phần

### 1. **MusicPlayer**
- **Mục Đích**: Điều khiển phát nhạc với giao diện đầy đủ và thu nhỏ.
- **Tính Năng**:
  - Phát/tạm dừng, bài tiếp theo/trước đó, điều chỉnh âm lượng.
  - Nút thu nhỏ chuyển sang thanh gọn cố định ở dưới cùng, hiển thị thông tin bài hát và các nút điều khiển cơ bản.
  - Sử dụng `<video>` để phát video MP4 (ví dụ: URL từ backend media).
- **Props**: `activeSong`, `currentSongs`, `currentIndex`, `isActive`, `isPlaying`.
- **Vị Trí**: `src/components/MusicPlayer.jsx`

### 2. **Player**
- **Mục Đích**: Hiển thị trình phát video cho bài hát đang hoạt động.
- **Tính Năng**:
  - Phát video MP4 bằng thẻ HTML5 `<video>` với điều khiển mặc định.
  - Xử lý phát/tạm dừng, âm lượng, tua video và sự kiện kết thúc.
  - Hiển thị giao diện dự phòng nếu không có video.
- **Props**: `activeSong`, `isPlaying`, `volume`, `seekTime`, `onEnded`.
- **Vị Trí**: `src/components/Player.jsx`

### 3. **CreateAlbum**
- **Mục Đích**: Cho phép người dùng tạo album tùy chỉnh.
- **Tính Năng**:
  - Biểu mẫu nhập tên album, tải lên hình ảnh và chọn bài hát qua checkbox với bộ lọc tìm kiếm.
  - Lưu album vào hồ sơ người dùng trong cơ sở dữ liệu backend.
  - Yêu cầu đăng nhập; chuyển hướng đến `/login` nếu chưa xác thực.
- **Vị Trí**: `src/pages/CreateAlbum.jsx`

### 4. **Search**
- **Mục Đích**: Tìm kiếm bài hát theo tên hoặc hiển thị tất cả bài hát.
- **Tính Năng**:
  - Lọc bài hát dựa trên tham số URL (`/search/:searchTerm`).
  - Hiển thị tất cả bài hát duy nhất khi không có từ khóa (qua API `getAllSongs`).
  - Hiển thị kết quả bằng các thành phần `SongCard`.
- **Vị Trí**: `src/pages/Search.jsx`

### 5. **Profile**
- **Mục Đích**: Hiển thị và chỉnh sửa thông tin người dùng và album.
- **Tính Năng**:
  - Hiển thị tên, email và các album đã tạo.
  - Chế độ chỉnh sửa để cập nhật tên/email.
  - Nút đăng xuất xóa xác thực.
  - Yêu cầu đăng nhập; chuyển hướng đến `/login` nếu chưa xác thực.
- **Vị Trí**: `src/pages/Profile.jsx`

### 6. **Login**
- **Mục Đích**: Xác thực người dùng.
- **Tính Năng**:
  - Biểu mẫu nhập email và mật khẩu.
  - Lưu `userId` và `userRole` vào `localStorage` khi thành công.
  - Liên kết đến `/register` cho người dùng mới.
- **Vị Trí**: `src/pages/Login.jsx`

### 7. **Register**
- **Mục Đích**: Tạo tài khoản người dùng mới.
- **Tính Năng**:
  - Biểu mẫu nhập tên, email và mật khẩu với kiểm tra hợp lệ.
  - Thêm người dùng vào cơ sở dữ liệu và đăng nhập.
  - Liên kết đến `/login` cho người dùng hiện có.
- **Vị Trí**: `src/pages/Register.jsx`

### 8. **AdminDashboard**
- **Mục Đích**: Cung cấp giao diện quản trị viên để xem thống kê nền tảng.
- **Tính Năng**:
  - Hiển thị tổng số bài hát và album bằng biểu đồ cột (sử dụng Chart.js).
  - Nút điều hướng đến `/admin/create-track` để tạo bài hát.
  - Giới hạn cho người dùng có `userRole: "admin"`; chuyển hướng đến `/` nếu không được phép.
- **Vị Trí**: `src/pages/AdminDashboard.jsx`

### 9. **CreateTrack**
- **Mục Đích**: Cho phép quản trị viên tạo bài hát mới.
- **Tính N"s**Tính Năng**:
  - Biểu mẫu nhập tên bài hát, chọn nhiều thể loại (checkbox với tìm kiếm), chọn một nghệ sĩ (dropdown), tải lên hình ảnh/video.
  - Lấy danh sách thể loại và nghệ sĩ từ API (`getGenres`, `getArtists`).
  - Gửi dữ liệu đến `POST /music/tracks/create/` với `multipart/form-data`.
  - Giới hạn cho quản trị viên; chuyển hướng đến `/` nếu không được phép.
- **Vị Trí**: `src/pages/CreateTrack.jsx`

### 10. **ArtistList**
- **Mục Đích**: Hiển thị tất cả nghệ sĩ trong cơ sở dữ liệu.
- **Tính Năng**:
  - Lấy dữ liệu nghệ sĩ qua API `GET /music/artists/`.
  - Hiển thị tên nghệ sĩ và các bài hát liên quan trong bố cục lưới.
  - Có thể truy cập bởi tất cả người dùng đã xác thực.
- **Vị Trí**: `src/pages/ArtistList.jsx`

### 11. **Thành Phần Hỗ Trợ**
- **Controls**: Hiển thị các nút phát/tạm dừng, tiếp theo/trước đó; hỗ trợ chế độ `minimal` cho trình phát thu nhỏ.
- **SongCard**: Hiển thị chi tiết bài hát trong kết quả tìm kiếm.
- **Track**: Hiển thị thông tin bài hát đang hoạt động trong trình phát.
- **VolumeBar**: Điều chỉnh âm lượng trình phát.
- **Error/Loader/ErrorBoundary**: Xử lý lỗi và trạng thái tải trong ứng dụng.

## Xem Trước
Dưới đây là cái nhìn tổng quan về trải nghiệm người dùng:

- **Trang Chủ/Tìm Kiếm**:
  - Truy cập `/search/pop` để lọc bài hát hoặc `/search` để xem tất cả bài hát.
  - Nhấp vào `SongCard` để phát bài hát trong `MusicPlayer`.

- **Trình Phát Nhạc**:
  - Giao diện đầy đủ: Hiển thị trình phát video, chi tiết bài hát, điều khiển và thanh âm lượng.
  - Giao diện thu nhỏ: Thanh gọn với thông tin bài hát và điều khiển cơ bản, cố định ở dưới cùng.
  - Ví dụ: Phát bài hát với `video_url` từ backend (ví dụ: `/media/videos/song.mp4`).

- **Hồ Sơ**:
  - Xem thông tin người dùng (ví dụ: “Alice Nguyen”, “alice@example.com”) và album (ví dụ: “Album 1” với 2 bài hát).
  - Chỉnh sửa tên/email hoặc đăng xuất.

- **Tạo Album**:
  - Chọn bài hát, tải lên hình ảnh và lưu album vào hồ sơ.
  - Chuyển hướng đến `/profile` để xem album mới.

- **Bảng Điều Khiển Quản Trị**:
  - Truy cập `/admin` (chỉ dành cho quản trị viên) để xem biểu đồ cột về tổng số bài hát (ví dụ: 13) và album (ví dụ: 4).
  - Nhấp “Tạo Bài Hát Mới” để đến `/admin/create-track`.

- **Tạo Bài Hát**:
  - Điền chi tiết bài hát (ví dụ: tên: “New Song”, thể loại: “Pop, R&B”, nghệ sĩ: “Joji”, tải lên hình ảnh/video).
  - Gửi để tạo bài hát và chuyển hướng đến `/`.

- **Danh Sách Nghệ Sĩ**:
  - Truy cập `/artists` để xem tất cả nghệ sĩ (ví dụ: “Joji”, “D4vd”) và bài hát của họ.
  - Hiển thị trong bố cục lưới responsive.

- **Xác Thực**:
  - Đăng ký tài khoản mới hoặc đăng nhập (ví dụ: `bob@example.com`/`secret456`).
  - Chuyển hướng đến `/profile` hoặc `/admin` (cho quản trị viên) khi thành công.

## Công Nghệ Sử Dụng
- **ReactJS**: Khung chính để xây dựng giao diện.
- **Axios**: Quản lý API và trạng thái với `spotifyApi` cho dữ liệu backend.
- **React Router**: Xử lý định tuyến phía client (`/search`, `/profile`, `/admin`, v.v.).
- **Tailwind CSS**: Tạo kiểu với các lớp tiện ích cho thiết kế responsive.
- **@heroicons/react**: Biểu tượng cho các nút (ví dụ: phát, thu nhỏ).
- **Chart.js & react-chartjs-2**: Hiển thị biểu đồ thống kê trong bảng điều khiển quản trị.
- **Axios**: Client HTTP cho các yêu cầu API trong `spotifyApi.js`.
- **HTML5 Video**: Phát video MP4 trong thành phần `Player`.
- **Vite**: Công cụ xây dựng cho phát triển nhanh (giả định; điều chỉnh nếu dùng Create React App).

## Hạn Chế
- **Lưu Trữ Dữ Liệu**: Thay đổi được lưu trong cơ sở dữ liệu backend, yêu cầu server đang chạy.
- **Phát Video**: Phụ thuộc vào URL MP4 hỗ trợ CORS. URL không phải MP4 hoặc bị giới hạn CORS có thể thất bại.
- **Tự Động Phát**: Hạn chế của trình duyệt có thể chặn phát video tự động nếu không có tương tác người dùng.
- **Khả Năng Mở Rộng**: Việc lấy tất cả bài hát (`getAllSongs`) hoặc nghệ sĩ (`getArtists`) có thể chậm với tập dữ liệu lớn.
- **Bảo Mật Quản Trị**: Kiểm tra `userRole` phía client không an toàn nếu không có xác thực phía server.

## Cải Tiến Trong Tương Lai
- **Điều Khiển Video Tùy Chỉnh**: Thay điều khiển `<video>` mặc định bằng giao diện tùy chỉnh.
- **Quản Lý Thể Loại/Nghệ Sĩ**: Thêm giao diện quản trị để tạo/chỉnh sửa thể loại và nghệ sĩ.

## Đóng Góp
Chúng tôi hoan nghênh mọi đóng góp! Để tham gia:
1. Fork kho lưu trữ.
2. Tạo nhánh tính năng (`git checkout -b feature/tinh-nang-moi`).
3. Commit thay đổi (`git commit -m 'Thêm tính năng mới'`).
4. Push lên nhánh (`git push origin feature/tinh-nang-moi`).
5. Mở Pull Request.