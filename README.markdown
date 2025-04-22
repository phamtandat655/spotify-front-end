# Spotify Clone

Một ứng dụng phát nhạc tương tự Spotify được xây dựng bằng **ReactJS**, **Redux Toolkit Query**, **React Router** và **Tailwind CSS**. Dự án mô phỏng các tính năng cốt lõi của một nền tảng âm nhạc, bao gồm phát nhạc, tạo album, xác thực người dùng, quản lý hồ sơ và tìm kiếm. Dữ liệu được lấy từ file `mockData.json`, cung cấp tập dữ liệu phong phú về bài hát, album, nghệ sĩ và người dùng.

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
- [Giấy Phép](#giấy-phép)

## Tính Năng
- **Phát Nhạc**: Phát các video MP4 với trình phát tùy chỉnh, hỗ trợ phát/tạm dừng, bài tiếp theo/trước đó, điều chỉnh âm lượng và giao diện thu nhỏ/mở rộng.
- **Tạo Album**: Tạo album tùy chỉnh với các bài hát được chọn và hình ảnh, lưu vào hồ sơ người dùng.
- **Tìm Kiếm**: Tìm kiếm bài hát theo tên, hiển thị tất cả bài hát khi không nhập từ khóa.
- **Xác Thực Người Dùng**: Đăng ký và đăng nhập bằng email/mật khẩu, quản lý hồ sơ để chỉnh sửa tên/email và xem album đã tạo.
- **Thiết Kế Responsive**: Giao diện thân thiện với thiết bị di động nhờ Tailwind CSS, bao gồm trình phát thu nhỏ cố định ở dưới cùng.
- **Backend Mô Phỏng**: Sử dụng `mockData.json` cho dữ liệu, với Redux Toolkit Query mô phỏng các cuộc gọi API.

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
│   ├── data/
│   │   └── mockData.json
│   ├── pages/
│   │   ├── CreateAlbum.jsx
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
│   ├── App.jsx
│   ├── index.css
│   └── index.js
├── package.json
└── README.md
```

- **components/**: Các thành phần giao diện có thể tái sử dụng (ví dụ: `Player`, `Controls`, `SongCard`).
- **data/**: File `mockData.json` chứa dữ liệu bài hát, album, nghệ sĩ và người dùng.
- **pages/**: Các thành phần cấp trang cho các tuyến đường (ví dụ: `Profile`, `Search`).
- **redux/**: Redux store, slices và dịch vụ API sử dụng Redux Toolkit Query.
- **App.jsx**: Ứng dụng chính với thiết lập định tuyến.

## Cài Đặt
Hướng dẫn cài đặt và chạy dự án trên máy cục bộ.

### Yêu Cầu
- **Node.js** (phiên bản 16 trở lên)
- **npm** (phiên bản 7 trở lên) hoặc **yarn**
- Trình duyệt hiện đại (Chrome, Firefox, v.v.)

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
   Lệnh này cài đặt các gói cần thiết, bao gồm:
   - `react`, `react-dom`
   - `react-router-dom`
   - `@reduxjs/toolkit`, `react-redux`
   - `tailwindcss`, `postcss`, `autoprefixer`
   - `@heroicons/react`

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

4. **Kiểm Tra `mockData.json`**:
   Đảm bảo file `src/data/mockData.json` tồn tại và chứa dữ liệu hợp lệ cho bài hát, album, nghệ sĩ và người dùng. Cập nhật các trường `video_url` để sử dụng URL MP4 (ví dụ: `https://cdn.pixabay.com/video/2022/09/30/133080-755975094_large.mp4`) thay vì URL YouTube.

5. **Chạy Server Phát Triển**:
   ```bash
   npm start
   ```
   Ứng dụng sẽ mở tại `http://localhost:3000`.

6. **Build Cho Production** (tùy chọn):
   ```bash
   npm run build
   ```

## Hướng Dẫn Sử Dụng
- **Đăng Ký/Đăng Nhập**: Truy cập `/register` để tạo tài khoản hoặc `/login` để đăng nhập (ví dụ: sử dụng `alice@example.com`/`password123` từ `mockData.json`).
- **Hồ Sơ**: Xem và chỉnh sửa thông tin người dùng, cũng như các album đã tạo tại `/profile`.
- **Tạo Album**: Truy cập `/create-album` để tạo album tùy chỉnh với bài hát và hình ảnh.
- **Tìm Kiếm**: Sử dụng `/search/:searchTerm` để tìm bài hát hoặc `/search` để xem tất cả bài hát.
- **Trình Phát Nhạc**: Phát bài hát qua thành phần `MusicPlayer`, hiển thị khi có bài hát đang hoạt động. Thu nhỏ/mở rộng trình phát bằng nút chuyển đổi.

## Tổng Quan Thành Phần

### 1. **MusicPlayer**
- **Mục Đích**: Điều khiển phát nhạc với giao diện đầy đủ và thu nhỏ.
- **Tính Năng**:
  - Phát/tạm dừng, bài tiếp theo/trước đó, điều chỉnh âm lượng.
  - Nút thu nhỏ chuyển sang thanh gọn cố định ở dưới cùng, hiển thị thông tin bài hát và các nút điều khiển cơ bản.
  - Sử dụng `<video>` để phát video MP4 (ví dụ: URL từ Pixabay).
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
  - Form nhập tên album, tải lên hình ảnh và chọn bài hát.
  - Lưu album vào hồ sơ người dùng trong `mockData.json`.
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
  - Form nhập email và mật khẩu.
  - Lưu `userId` vào `localStorage` khi thành công.
  - Liên kết đến `/register` cho người dùng mới.
- **Vị Trí**: `src/pages/Login.jsx`

### 7. **Register**
- **Mục Đích**: Tạo tài khoản người dùng mới.
- **Tính Năng**:
  - Form nhập tên, email và mật khẩu với kiểm tra hợp lệ.
  - Thêm người dùng vào `mockData.json` (trong bộ nhớ) và đăng nhập.
  - Liên kết đến `/login` cho người dùng hiện có.
- **Vị Trí**: `src/pages/Register.jsx`

### 8. **Thành Phần Hỗ Trợ**
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
  - Ví dụ: Phát bài hát với `video_url` như `https://cdn.pixabay.com/video/2022/09/30/133080-755975094_large.mp4`.

- **Hồ Sơ**:
  - Xem thông tin người dùng (ví dụ: “Alice Nguyen”, “alice@example.com”) và album (ví dụ: “Album 1” với 2 bài hát).
  - Chỉnh sửa tên/email hoặc đăng xuất.

- **Tạo Album**:
  - Chọn bài hát, tải lên hình ảnh và lưu album vào hồ sơ.
  - Chuyển hướng đến `/profile` để xem album mới.

- **Xác Thực**:
  - Đăng ký tài khoản mới hoặc đăng nhập với thông tin hiện có (ví dụ: `bob@example.com`/`secret456`).
  - Chuyển hướng đến `/profile` khi thành công.

## Công Nghệ Sử Dụng
- **ReactJS**: Khung chính để xây dựng giao diện.
- **Redux Toolkit Query**: Quản lý API và trạng thái với `mockApi` cho `mockData.json`.
- **React Router**: Xử lý định tuyến phía client (`/search`, `/profile`, v.v.).
- **Tailwind CSS**: Tạo kiểu với các lớp tiện ích cho thiết kế responsive.
- **@heroicons/react**: Biểu tượng cho các nút (ví dụ: phát, thu nhỏ).
- **HTML5 Video**: Phát video MP4 trong thành phần `Player`.
- **Vite**: Công cụ xây dựng cho phát triển nhanh (giả định; điều chỉnh nếu dùng Create React App).

## Hạn Chế
- **Lưu Trữ Dữ Liệu**: Thay đổi trong `mockData.json` (ví dụ: người dùng mới, album) chỉ tồn tại trong bộ nhớ và bị reset khi khởi động lại. Cần backend thực sự để lưu trữ.
- **Bảo Mật**: Mật khẩu được lưu dạng văn bản thuần trong `mockData.json`. Trong sản phẩm thực tế, sử dụng mật khẩu mã hóa và JWT/OAuth.
- **Phát Video**: Phụ thuộc vào URL MP4 hỗ trợ CORS. Các URL không phải MP4 hoặc bị giới hạn CORS có thể thất bại.
- **Tự Động Phát**: Hạn chế của trình duyệt có thể chặn phát video tự động nếu không có tương tác người dùng.
- **Khả Năng Mở Rộng**: Việc tổng hợp tất cả bài hát trong `getAllSongs` có thể chậm với tập dữ liệu lớn.

## Cải Tiến Trong Tương Lai
- **Tích Hợp Backend**: Thay `mockData.json` bằng backend thực (ví dụ: Node.js, MongoDB) để lưu trữ dữ liệu.
- **Xác Thực**: Triển khai JWT và mã hóa mật khẩu cho đăng nhập/đăng ký an toàn.
- **Điều Khiển Video Tùy Chỉnh**: Thay điều khiển `<video>` mặc định bằng giao diện tùy chỉnh.
- **Hình Thu Nhỏ Video**: Tạo hình thu nhỏ từ video MP4 cho trình phát thu nhỏ hoặc `SongCard`.
- **Phân Trang**: Thêm phân trang cho `Search` với danh sách bài hát lớn.
- **Hỗ Trợ Ngoại Tuyến**: Lưu trữ `mockData.json` hoặc video để sử dụng ngoại tuyến với Service Worker.

## Đóng Góp
Chúng tôi hoan nghênh mọi đóng góp! Để tham gia:
1. Fork kho lưu trữ.
2. Tạo nhánh tính năng (`git checkout -b feature/tinh-nang-moi`).
3. Commit thay đổi (`git commit -m 'Thêm tính năng mới'`).
4. Push lên nhánh (`git push origin feature/tinh-nang-moi`).
5. Mở Pull Request.

Vui lòng đảm bảo mã tuân theo chuẩn ESLint/Prettier và bao gồm bài kiểm tra nếu có.

## Giấy Phép
Dự án này được cấp phép theo Giấy Phép MIT. Xem file [LICENSE](LICENSE) để biết chi tiết.

---

Được xây dựng với 💖 bởi [Tên Bạn]