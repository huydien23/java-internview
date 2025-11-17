# Java Interview 

Một ứng dụng web nâng cao giúp người dùng chuẩn bị cho các cuộc phỏng vấn lập trình Java. Ứng dụng cung cấp nhiều chế độ học tập bao gồm ôn tập lý thuyết, flashcards, và chế độ phỏng vấn thử với phản hồi được cung cấp bởi AI (Gemini) để chấm điểm và đưa ra gợi ý cải thiện.

## Chức năng chính

*   **Học lý thuyết:**
    *   Xem lại toàn bộ câu hỏi và câu trả lời theo từng chủ đề.
    *   Theo dõi tiến độ học tập với các trạng thái: "Đã học", "Cần xem lại", "Quan trọng".
    *   Lọc câu hỏi theo độ khó (Dễ, Trung bình, Khó) và tìm kiếm theo từ khóa.
    *   Hỗ trợ phân trang để duyệt danh sách câu hỏi dài một cách dễ dàng.

*   **Flashcards:**
    *   Luyện tập kiến thức một cách nhanh chóng và hiệu quả.
    *   Lật thẻ để xem câu trả lời và ghi nhớ tốt hơn.
    *   Chức năng xáo trộn câu hỏi để tăng tính ngẫu nhiên.

*   **Phỏng vấn thử với AI:**
    *   Mô phỏng một buổi phỏng vấn thực tế với một bộ câu hỏi ngẫu nhiên.
    *   Người dùng nhập câu trả lời và gửi cho AI để đánh giá.
    *   Nhận điểm số từ 1-10 và phản hồi chi tiết về điểm mạnh cũng như các điểm cần cải thiện cho từng câu trả lời.
    *   Tính năng "Xem gợi ý" giúp người dùng học hỏi ngay cả khi không chắc chắn về câu trả lời.

*   **Theo dõi tiến độ:**
    *   Trang chủ hiển thị tổng quan tiến độ học tập của người dùng.
    *   Dữ liệu được lưu vào Local Storage của trình duyệt, giúp người dùng không bị mất tiến độ khi tải lại trang.

*   **Thiết kế đáp ứng (Responsive):**
    *   Giao diện được thiết kế để hoạt động tốt trên cả máy tính để bàn và thiết bị di động.

## Công nghệ sử dụng

*   **Frontend:** React, TypeScript, Tailwind CSS
*   **AI:** Google Gemini API (`@google/genai`)

## Cài đặt và Chạy dự án

Dự án được thiết kế để chạy trực tiếp trên trình duyệt mà không cần bước build phức tạp.

**Yêu cầu:**

1.  Một trình duyệt web hiện đại (Chrome, Firefox, Edge, Safari).
2.  Một khóa API (API Key) của Google Gemini.

**Các bước chạy:**

1.  **Tải mã nguồn:** Tải toàn bộ các file của dự án về máy tính của bạn.
2.  **Cấu hình API Key:**
    *   Ứng dụng này yêu cầu một khóa API từ Google AI Studio để có thể sử dụng tính năng chấm điểm bằng AI.
    *   Khóa API này cần được cung cấp dưới dạng biến môi trường có tên là `API_KEY`. Trong môi trường phát triển như AI Studio, biến này thường được cấu hình sẵn.
3.  **Mở ứng dụng:**
    *   Mở file `index.html` bằng trình duyệt web của bạn.

Sau khi hoàn thành các bước trên, ứng dụng sẽ chạy và bạn có thể bắt đầu sử dụng.

## Tác giả

Dự án được phát triển bởi **Nguyền Huy Điền** - Lập trình viên Freelancer.