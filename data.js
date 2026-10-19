// Dữ liệu giả lập cho bản prototype (không có DB thật)

const SUBJECTS = [
  { id: 'ctdl', code: 'IT3011', name: 'Cấu trúc dữ liệu và giải thuật', faculty: 'Công nghệ thông tin', credits: 3, icon: '🌳',
    desc: 'Các cấu trúc dữ liệu cơ bản (mảng, danh sách liên kết, cây, đồ thị) và kỹ thuật thiết kế, phân tích giải thuật.',
    topics: [
      { t: 'Độ phức tạp thuật toán', p: 'Ký hiệu O lớn mô tả cận trên của thời gian chạy khi kích thước đầu vào n tăng dần. Khi phân tích, ta bỏ qua hằng số và các số hạng bậc thấp. Các lớp độ phức tạp thường gặp: O(1), O(log n), O(n), O(n log n), O(n²).', x: 'T(n) = 3n² + 5n + 2   ⇒   T(n) = O(n²)', q: 'Phân tích độ phức tạp của thuật toán sắp xếp chèn trong trường hợp tốt nhất và xấu nhất.' },
      { t: 'Danh sách liên kết', p: 'Mỗi nút lưu dữ liệu và con trỏ tới nút kế tiếp. Chèn/xóa ở đầu danh sách tốn O(1), nhưng truy cập phần tử thứ k tốn O(k). Danh sách liên kết đôi cho phép duyệt hai chiều.', x: 'struct Node {\n  int data;\n  Node* next;\n};', q: 'Viết hàm đảo ngược một danh sách liên kết đơn không dùng thêm bộ nhớ phụ.' },
      { t: 'Cây nhị phân tìm kiếm', p: 'Với mọi nút, khóa ở cây con trái nhỏ hơn và khóa ở cây con phải lớn hơn khóa của nút. Thao tác tìm kiếm, chèn, xóa có độ phức tạp O(h) với h là chiều cao cây.', x: 'search(x, k):\n  if x == null or k == x.key: return x\n  if k < x.key: return search(x.left, k)\n  return search(x.right, k)', q: 'Cho dãy khóa 50, 30, 70, 20, 40, 60, 80. Vẽ cây BST và trình bày kết quả duyệt trung thứ tự.' },
      { t: 'Đồ thị, BFS và DFS', p: 'Đồ thị G = (V, E) có thể biểu diễn bằng ma trận kề hoặc danh sách kề. BFS dùng hàng đợi, DFS dùng ngăn xếp hoặc đệ quy; cả hai có độ phức tạp O(V + E).', x: 'BFS(s):\n  Q ← {s}; visited[s] ← true\n  while Q ≠ ∅:\n    u ← pop(Q)\n    for v in adj[u]: if not visited[v]: push(Q, v)', q: 'Trình bày thuật toán Dijkstra và chạy tay trên đồ thị 5 đỉnh cho trước.' },
    ] },
  { id: 'csdl', code: 'IT3090', name: 'Cơ sở dữ liệu', faculty: 'Công nghệ thông tin', credits: 3, icon: '🗄️',
    desc: 'Mô hình dữ liệu quan hệ, ngôn ngữ SQL, thiết kế và chuẩn hóa cơ sở dữ liệu.',
    topics: [
      { t: 'Mô hình thực thể – liên kết', p: 'Mô hình ER mô tả dữ liệu dưới dạng thực thể, thuộc tính và mối liên kết. Từ sơ đồ ER ta chuyển đổi sang lược đồ quan hệ theo các quy tắc ánh xạ.', x: 'SINHVIEN(MaSV, HoTen, NgaySinh)\nMONHOC(MaMH, TenMH, SoTC)\nDANGKY(MaSV, MaMH, Diem)', q: 'Thiết kế sơ đồ ER cho hệ thống quản lý thư viện gồm sách, độc giả và phiếu mượn.' },
      { t: 'Đại số quan hệ', p: 'Các phép toán cơ bản gồm chọn (σ), chiếu (π), hợp, hiệu, tích Descartes và phép nối (⋈). Mọi câu truy vấn SQL đều có thể biểu diễn bằng đại số quan hệ.', x: 'π HoTen ( σ Diem > 8 ( SINHVIEN ⋈ DANGKY ) )', q: 'Viết biểu thức đại số quan hệ tìm tên sinh viên đăng ký tất cả các môn học.' },
      { t: 'Ngôn ngữ truy vấn SQL', p: 'SQL gồm DDL (CREATE, ALTER), DML (SELECT, INSERT, UPDATE, DELETE) và DCL (GRANT, REVOKE). Mệnh đề GROUP BY kết hợp HAVING dùng để lọc theo nhóm.', x: 'SELECT MaMH, AVG(Diem) AS DiemTB\nFROM DANGKY\nGROUP BY MaMH\nHAVING AVG(Diem) > 7;', q: 'Viết câu lệnh SQL liệt kê 3 môn học có điểm trung bình cao nhất.' },
      { t: 'Phụ thuộc hàm và chuẩn hóa', p: 'Chuẩn hóa nhằm loại bỏ dư thừa dữ liệu và dị thường khi cập nhật. Các dạng chuẩn: 1NF, 2NF, 3NF, BCNF. Bao đóng thuộc tính giúp xác định khóa của lược đồ.', x: 'R(A, B, C, D),  F = { A → B, B → C, C → D }', q: 'Tìm khóa và xác định dạng chuẩn cao nhất của lược đồ R; tách R về 3NF.' },
    ] },
  { id: 'mmt', code: 'IT3080', name: 'Mạng máy tính', faculty: 'Công nghệ thông tin', credits: 3, icon: '🌐',
    desc: 'Kiến trúc phân tầng, giao thức TCP/IP, địa chỉ IP, định tuyến và các dịch vụ mạng phổ biến.',
    topics: [
      { t: 'Mô hình OSI và TCP/IP', p: 'Mô hình OSI gồm 7 tầng, trong khi TCP/IP gộp lại còn 4 tầng. Mỗi tầng cung cấp dịch vụ cho tầng trên và sử dụng dịch vụ của tầng dưới.', x: 'Application  →  Transport  →  Internet  →  Link', q: 'So sánh mô hình OSI và TCP/IP. Nêu ví dụ giao thức ở mỗi tầng.' },
      { t: 'Địa chỉ IP và chia mạng con', p: 'Địa chỉ IPv4 dài 32 bit, được chia thành phần mạng và phần host thông qua subnet mask. CIDR cho phép phân bổ địa chỉ linh hoạt hơn so với phân lớp truyền thống.', x: '192.168.10.0/26  →  4 mạng con, mỗi mạng 62 host', q: 'Chia mạng 172.16.0.0/16 thành 8 mạng con bằng nhau. Liệt kê dải địa chỉ của từng mạng.' },
      { t: 'TCP và UDP', p: 'TCP là giao thức hướng kết nối, đảm bảo tin cậy nhờ cơ chế bắt tay 3 bước, đánh số thứ tự và báo nhận. UDP không kết nối, nhẹ và phù hợp ứng dụng thời gian thực.', x: 'Client ── SYN ──▶ Server\nClient ◀─ SYN-ACK ─ Server\nClient ── ACK ──▶ Server', q: 'Giải thích cơ chế điều khiển tắc nghẽn của TCP (slow start, congestion avoidance).' },
      { t: 'Định tuyến', p: 'Router chọn đường đi cho gói tin dựa trên bảng định tuyến. Giao thức trạng thái liên kết (OSPF) dùng Dijkstra, giao thức vector khoảng cách (RIP) dùng Bellman-Ford.', x: 'OSPF: link-state  · Dijkstra\nRIP : distance-vector · Bellman-Ford', q: 'Xây dựng bảng định tuyến cho router R1 trong sơ đồ mạng cho trước.' },
    ] },
  { id: 'oop', code: 'IT3100', name: 'Lập trình hướng đối tượng', faculty: 'Công nghệ thông tin', credits: 2, icon: '🧩',
    desc: 'Các khái niệm lớp, đối tượng, đóng gói, kế thừa, đa hình và thiết kế hướng đối tượng với Java.',
    topics: [
      { t: 'Lớp và đối tượng', p: 'Lớp là bản thiết kế mô tả thuộc tính và hành vi; đối tượng là thể hiện cụ thể của lớp. Tính đóng gói che giấu dữ liệu bên trong và chỉ cho truy cập qua phương thức.', x: 'class SinhVien {\n  private String ten;\n  public String getTen() { return ten; }\n}', q: 'Xây dựng lớp PhanSo với các phương thức cộng, trừ, nhân, chia và rút gọn.' },
      { t: 'Kế thừa', p: 'Lớp con kế thừa thuộc tính và phương thức của lớp cha, có thể mở rộng hoặc ghi đè. Java chỉ hỗ trợ đơn kế thừa với lớp nhưng đa kế thừa với interface.', x: 'class HinhTron extends Hinh {\n  @Override\n  double dienTich() { return Math.PI * r * r; }\n}', q: 'Thiết kế cây kế thừa cho các loại nhân viên trong công ty và tính lương tương ứng.' },
      { t: 'Đa hình', p: 'Đa hình cho phép cùng một lời gọi phương thức thực hiện hành vi khác nhau tùy kiểu thực của đối tượng (liên kết động).', x: 'Hinh h = new HinhTron(5);\nh.dienTich(); // gọi HinhTron.dienTich()', q: 'Phân biệt overloading và overriding. Cho ví dụ minh họa.' },
      { t: 'Lớp trừu tượng và Interface', p: 'Lớp trừu tượng có thể chứa cả phương thức có thân và không có thân; interface định nghĩa hợp đồng hành vi mà lớp cài đặt phải tuân theo.', x: 'interface Comparable<T> {\n  int compareTo(T o);\n}', q: 'Khi nào nên dùng abstract class thay vì interface? Phân tích ưu nhược điểm.' },
    ] },
  { id: 'gt1', code: 'MI1111', name: 'Giải tích 1', faculty: 'Toán ứng dụng', credits: 4, icon: '∫',
    desc: 'Giới hạn, liên tục, đạo hàm, tích phân hàm một biến và chuỗi số.',
    topics: [
      { t: 'Giới hạn hàm số', p: 'Giới hạn mô tả giá trị mà hàm số tiến tới khi biến tiến tới một điểm. Các giới hạn cơ bản và quy tắc L’Hôpital giúp khử dạng vô định 0/0 và ∞/∞.', x: 'lim (x→0)  sin x / x = 1', q: 'Tính giới hạn lim (x→0) (eˣ − 1 − x) / x².' },
      { t: 'Đạo hàm và vi phân', p: 'Đạo hàm biểu diễn tốc độ biến thiên tức thời. Khai triển Taylor xấp xỉ hàm số bằng đa thức quanh một điểm.', x: "(f·g)' = f'g + fg'\nf(x) ≈ f(a) + f'(a)(x − a) + f''(a)(x − a)²/2!", q: 'Viết khai triển Maclaurin của ln(1 + x) đến cấp 4.' },
      { t: 'Tích phân', p: 'Tích phân bất định là họ nguyên hàm; tích phân xác định tính diện tích dưới đồ thị. Các phương pháp: đổi biến, từng phần, phân thức hữu tỉ.', x: '∫ x·eˣ dx = (x − 1)eˣ + C', q: 'Tính tích phân ∫₀¹ x² ln(1 + x) dx.' },
      { t: 'Chuỗi số', p: 'Chuỗi số hội tụ nếu dãy tổng riêng có giới hạn hữu hạn. Các tiêu chuẩn hội tụ: so sánh, D’Alembert, Cauchy, tích phân.', x: 'Σ (n=1→∞) 1/n² = π²/6', q: 'Xét sự hội tụ của chuỗi Σ n! / nⁿ.' },
    ] },
  { id: 'dsk', code: 'MI1141', name: 'Đại số tuyến tính', faculty: 'Toán ứng dụng', credits: 4, icon: '🔢',
    desc: 'Ma trận, định thức, hệ phương trình tuyến tính, không gian vector, trị riêng và dạng toàn phương.',
    topics: [
      { t: 'Ma trận và định thức', p: 'Định thức là một số gắn với ma trận vuông, cho biết ma trận có khả nghịch hay không. Có thể tính bằng khai triển Laplace hoặc biến đổi sơ cấp.', x: 'det(AB) = det(A) · det(B)\nA khả nghịch  ⇔  det(A) ≠ 0', q: 'Tính định thức của ma trận cấp 4 cho trước bằng biến đổi sơ cấp.' },
      { t: 'Hệ phương trình tuyến tính', p: 'Định lý Kronecker–Capelli cho biết điều kiện có nghiệm. Phương pháp Gauss đưa ma trận bổ sung về dạng bậc thang.', x: 'Ax = b có nghiệm  ⇔  rank(A) = rank(A | b)', q: 'Giải và biện luận hệ phương trình theo tham số m.' },
      { t: 'Không gian vector', p: 'Không gian vector là tập hợp đóng với phép cộng và nhân vô hướng. Cơ sở là hệ độc lập tuyến tính sinh ra toàn không gian; số vector trong cơ sở là số chiều.', x: 'dim(U + W) = dim U + dim W − dim(U ∩ W)', q: 'Tìm cơ sở và số chiều của không gian nghiệm của hệ thuần nhất.' },
      { t: 'Trị riêng và vector riêng', p: 'λ là trị riêng của A nếu tồn tại x ≠ 0 sao cho Ax = λx. Ma trận chéo hóa được khi có đủ n vector riêng độc lập tuyến tính.', x: 'det(A − λI) = 0\nA = P D P⁻¹', q: 'Chéo hóa ma trận A cấp 3 và tính A¹⁰.' },
    ] },
  { id: 'xstk', code: 'MI2020', name: 'Xác suất thống kê', faculty: 'Toán ứng dụng', credits: 3, icon: '🎲',
    desc: 'Xác suất, biến ngẫu nhiên, các phân phối thông dụng, ước lượng và kiểm định giả thuyết.',
    topics: [
      { t: 'Xác suất và công thức Bayes', p: 'Xác suất có điều kiện P(A|B) là xác suất A xảy ra khi biết B đã xảy ra. Công thức xác suất đầy đủ và Bayes được dùng nhiều trong bài toán chẩn đoán.', x: 'P(A|B) = P(B|A) · P(A) / P(B)', q: 'Một xét nghiệm có độ nhạy 95%, độ đặc hiệu 90%, tỉ lệ mắc bệnh 2%. Tính xác suất người dương tính thực sự mắc bệnh.' },
      { t: 'Biến ngẫu nhiên', p: 'Biến ngẫu nhiên rời rạc được mô tả bằng bảng phân phối, liên tục bằng hàm mật độ. Kỳ vọng và phương sai là hai đặc trưng quan trọng nhất.', x: 'E(X) = Σ xᵢ · pᵢ\nV(X) = E(X²) − [E(X)]²', q: 'Cho hàm mật độ f(x) = kx² trên [0, 2]. Tìm k, E(X), V(X).' },
      { t: 'Phân phối chuẩn', p: 'Phân phối chuẩn N(μ, σ²) có dạng hình chuông, đối xứng qua μ. Định lý giới hạn trung tâm giải thích vì sao nó xuất hiện phổ biến.', x: 'Z = (X − μ) / σ  ~  N(0, 1)', q: 'Chiều cao sinh viên ~ N(165, 36). Tính tỉ lệ sinh viên cao trên 170 cm.' },
      { t: 'Ước lượng và kiểm định', p: 'Khoảng tin cậy cho biết miền chứa tham số với độ tin cậy cho trước. Kiểm định giả thuyết so sánh giá trị quan sát với miền bác bỏ.', x: 'x̄ ± z(α/2) · σ / √n', q: 'Với mẫu n = 36, x̄ = 52, s = 6, kiểm định H₀: μ = 50 với mức ý nghĩa 5%.' },
    ] },
  { id: 'vl1', code: 'PH1110', name: 'Vật lý đại cương 1', faculty: 'Vật lý kỹ thuật', credits: 3, icon: '⚛️',
    desc: 'Cơ học chất điểm, cơ học vật rắn, dao động, sóng và nhiệt động lực học.',
    topics: [
      { t: 'Động học chất điểm', p: 'Động học nghiên cứu chuyển động mà không xét nguyên nhân. Vận tốc là đạo hàm của vị trí, gia tốc là đạo hàm của vận tốc theo thời gian.', x: 'v = v₀ + at\ns = v₀t + ½at²', q: 'Một vật ném xiên góc 30° với vận tốc 20 m/s. Tính tầm xa và độ cao cực đại.' },
      { t: 'Định luật Newton', p: 'Ba định luật Newton là nền tảng của cơ học cổ điển. Khi giải bài toán cần phân tích lực và chọn hệ quy chiếu phù hợp.', x: 'ΣF = m · a', q: 'Hai vật nối qua ròng rọc trên mặt phẳng nghiêng có ma sát. Tính gia tốc hệ và lực căng dây.' },
      { t: 'Công và năng lượng', p: 'Công của lực bằng tích phân của lực theo quãng đường. Định luật bảo toàn cơ năng áp dụng khi chỉ có lực thế tác dụng.', x: 'W = ∫ F · ds\nWđ = ½ m v²', q: 'Tính vận tốc của vật ở chân dốc cao 5 m, bỏ qua ma sát.' },
      { t: 'Nhiệt động lực học', p: 'Nguyên lý I là định luật bảo toàn năng lượng cho hệ nhiệt; nguyên lý II khẳng định không thể chế tạo động cơ vĩnh cửu loại hai.', x: 'ΔU = Q − A\nη = 1 − T₂ / T₁', q: 'Tính hiệu suất chu trình Carnot hoạt động giữa 400 K và 300 K.' },
    ] },
  { id: 'ktct', code: 'SSH1121', name: 'Kinh tế chính trị Mác – Lênin', faculty: 'Lý luận chính trị', credits: 2, icon: '📕',
    desc: 'Hàng hóa, giá trị thặng dư, tích lũy tư bản và kinh tế thị trường định hướng xã hội chủ nghĩa.',
    topics: [
      { t: 'Hàng hóa và hai thuộc tính', p: 'Hàng hóa là sản phẩm của lao động thỏa mãn nhu cầu con người thông qua trao đổi. Hàng hóa có hai thuộc tính: giá trị sử dụng và giá trị.', x: 'Giá trị hàng hóa = c + v + m', q: 'Phân tích mối quan hệ giữa hai thuộc tính của hàng hóa.' },
      { t: 'Giá trị thặng dư', p: 'Giá trị thặng dư là phần giá trị mới dôi ra ngoài giá trị sức lao động do công nhân tạo ra. Có hai phương pháp: tuyệt đối và tương đối.', x: "m' = (m / v) × 100%", q: 'So sánh phương pháp sản xuất giá trị thặng dư tuyệt đối và tương đối.' },
      { t: 'Tích lũy tư bản', p: 'Tích lũy tư bản là quá trình chuyển hóa một phần giá trị thặng dư thành tư bản. Các nhân tố ảnh hưởng: tỉ suất giá trị thặng dư, năng suất lao động, quy mô tư bản ứng trước.', x: 'Tích tụ tư bản  vs.  Tập trung tư bản', q: 'Trình bày các nhân tố ảnh hưởng đến quy mô tích lũy tư bản.' },
      { t: 'Kinh tế thị trường định hướng XHCN', p: 'Là nền kinh tế vận hành theo các quy luật thị trường, đồng thời hướng tới mục tiêu dân giàu, nước mạnh, dân chủ, công bằng, văn minh.', x: 'Nhà nước · Thị trường · Xã hội', q: 'Liên hệ thực tiễn về vai trò của Nhà nước trong nền kinh tế thị trường ở Việt Nam.' },
    ] },
  { id: 'tacn', code: 'FL1100', name: 'Tiếng Anh chuyên ngành CNTT', faculty: 'Ngoại ngữ', credits: 2, icon: '🗣️',
    desc: 'Đọc hiểu tài liệu kỹ thuật, từ vựng chuyên ngành, viết email/báo cáo và kỹ năng thuyết trình.',
    topics: [
      { t: 'Reading technical documents', p: 'Effective reading combines skimming for the main idea, scanning for specific information and detailed reading for understanding. Pay attention to headings, diagrams and code samples.', x: 'Skimming  →  Scanning  →  Detailed reading', q: 'Read the passage about cloud computing and answer questions 1–5.' },
      { t: 'Technical vocabulary', p: 'IT vocabulary is often formed with prefixes and suffixes (multi-, inter-, -ware, -ize). Learning word families helps you guess unfamiliar terms.', x: 'algorithm · bandwidth · compile · deploy · latency', q: 'Match the terms with their definitions and use each in a sentence.' },
      { t: 'Writing emails and reports', p: 'A professional email has a clear subject line, a polite greeting, a concise body and an appropriate closing. Reports should follow a logical structure: introduction, findings, conclusion.', x: 'Dear Mr. Smith,\nI am writing to inform you that…\nBest regards,', q: 'Write an email (120–150 words) reporting a bug to your project manager.' },
      { t: 'Presentation skills', p: 'Good presentations have a clear structure, signposting language and confident delivery. Visual aids should support, not replace, the speaker.', x: '"Let me start by…"  ·  "Moving on to…"  ·  "To sum up…"', q: 'Prepare a 3-minute presentation introducing a software product.' },
    ] },
];

const TEACHERS = [
  { id: 't1', name: 'TS. Nguyễn Văn An', faculty: 'Công nghệ thông tin', subjects: ['ctdl', 'oop'], bio: '15 năm giảng dạy, hướng nghiên cứu thuật toán và tối ưu tổ hợp.' },
  { id: 't2', name: 'ThS. Trần Thị Bích', faculty: 'Công nghệ thông tin', subjects: ['csdl'], bio: 'Từng làm DBA tại doanh nghiệp trước khi về trường giảng dạy.' },
  { id: 't3', name: 'PGS.TS. Lê Minh Hoàng', faculty: 'Công nghệ thông tin', subjects: ['mmt', 'ctdl'], bio: 'Chuyên gia về mạng và hệ phân tán, chủ nhiệm nhiều đề tài cấp Bộ.' },
  { id: 't4', name: 'TS. Phạm Thu Hà', faculty: 'Toán ứng dụng', subjects: ['gt1', 'dsk'], bio: 'Giảng dạy các học phần toán cơ sở cho sinh viên năm nhất.' },
  { id: 't5', name: 'ThS. Đỗ Quang Huy', faculty: 'Toán ứng dụng', subjects: ['xstk', 'gt1'], bio: 'Quan tâm đến thống kê ứng dụng và khoa học dữ liệu.' },
  { id: 't6', name: 'TS. Vũ Thanh Tùng', faculty: 'Vật lý kỹ thuật', subjects: ['vl1'], bio: 'Nghiên cứu vật liệu nano, nổi tiếng với các thí nghiệm minh họa trên lớp.' },
  { id: 't7', name: 'ThS. Hoàng Lan Anh', faculty: 'Ngoại ngữ', subjects: ['tacn'], bio: 'IELTS 8.5, nhiều năm giảng dạy tiếng Anh chuyên ngành kỹ thuật.' },
  { id: 't8', name: 'TS. Bùi Đức Thắng', faculty: 'Lý luận chính trị', subjects: ['ktct'], bio: 'Giảng viên lý luận chính trị với phong cách liên hệ thực tiễn sinh động.' },
  { id: 't9', name: 'ThS. Ngô Thị Mai', faculty: 'Công nghệ thông tin', subjects: ['oop', 'csdl'], bio: 'Phụ trách các lớp thực hành lập trình Java và cơ sở dữ liệu.' },
  { id: 't10', name: 'PGS.TS. Đặng Văn Khoa', faculty: 'Toán ứng dụng', subjects: ['dsk', 'xstk'], bio: 'Tác giả giáo trình Đại số tuyến tính được dùng tại nhiều trường.' },
];

const DOC_TYPES = ['Giáo trình', 'Slide bài giảng', 'Đề thi', 'Bài tập', 'Ghi chú', 'Đề cương'];

function mkDoc(id, title, subjectId, teacherId, type, format, year, uploader, date, downloads, likes, views, desc, tags, extra) {
  return Object.assign({ id, title, subjectId, teacherId, type, format, year, uploader, date, downloads, likes, views, desc, tags }, extra || {});
}

const DOCS = [
  mkDoc('d1', 'Giáo trình Cấu trúc dữ liệu và giải thuật (bản đầy đủ)', 'ctdl', 't1', 'Giáo trình', 'pdf', 2025, 'minhtri.k66', '2025-09-12', 1840, 312, 5210, 'Giáo trình chính thức của học phần, gồm đầy đủ lý thuyết và ví dụ minh họa bằng C++.', ['c++', 'thuật toán', 'cây', 'đồ thị']),
  mkDoc('d2', 'Đề thi cuối kỳ CTDL&GT 2024 – có đáp án', 'ctdl', 't1', 'Đề thi', 'pdf', 2024, 'lananh_hust', '2025-01-08', 2310, 455, 6120, 'Đề thi cuối kỳ học kỳ 1 năm 2024, kèm đáp án gợi ý do nhóm ôn thi tổng hợp.', ['đề thi', 'đáp án', 'cuối kỳ'], { term: 'CK', solution: true }),
  mkDoc('d3', 'Slide bài giảng: Cây và đồ thị', 'ctdl', 't3', 'Slide bài giảng', 'pptx', 2025, 'ducanh99', '2025-10-02', 760, 98, 1900, 'Slide các chương cây nhị phân, cây AVL, đồ thị và các thuật toán tìm đường.', ['slide', 'cây', 'đồ thị']),
  mkDoc('d4', 'Tổng hợp bài tập CTDL có lời giải', 'ctdl', 't1', 'Bài tập', 'docx', 2025, 'hoangnam', '2025-05-20', 1220, 201, 3300, '50 bài tập từ cơ bản đến nâng cao kèm gợi ý lời giải.', ['bài tập', 'lời giải']),
  mkDoc('d5', 'Ghi chú ôn thi CSDL – SQL & chuẩn hóa', 'csdl', 't2', 'Ghi chú', 'pdf', 2025, 'thuytrang', '2025-06-03', 980, 176, 2650, 'Ghi chú viết tay đã số hóa, tập trung vào SQL nâng cao và bài tập chuẩn hóa.', ['sql', 'chuẩn hóa', 'ôn thi']),
  mkDoc('d6', 'Đề thi giữa kỳ Cơ sở dữ liệu 2025', 'csdl', 't9', 'Đề thi', 'pdf', 2025, 'phuongvy', '2025-04-11', 870, 132, 2010, 'Đề giữa kỳ gồm 4 câu: ER, đại số quan hệ, SQL, chuẩn hóa.', ['đề thi', 'giữa kỳ'], { term: 'GK', solution: false }),
  mkDoc('d7', 'Slide Cơ sở dữ liệu – Chương 1 đến 4', 'csdl', 't2', 'Slide bài giảng', 'pptx', 2024, 'quanglinh', '2024-09-15', 640, 77, 1500, 'Slide bài giảng chính thức trên lớp.', ['slide']),
  mkDoc('d8', 'Đề cương ôn tập Mạng máy tính', 'mmt', 't3', 'Đề cương', 'docx', 2025, 'baongoc', '2025-06-25', 1105, 190, 2800, 'Đề cương 40 câu hỏi lý thuyết thường gặp kèm trả lời ngắn gọn.', ['đề cương', 'lý thuyết']),
  mkDoc('d9', 'Bài tập chia subnet có lời giải chi tiết', 'mmt', 't3', 'Bài tập', 'pdf', 2025, 'ducanh99', '2025-03-14', 1430, 260, 3900, 'Các dạng bài chia mạng con, VLSM và tổng hợp địa chỉ.', ['subnet', 'ip', 'vlsm']),
  mkDoc('d10', 'Đề thi cuối kỳ Mạng máy tính 2024', 'mmt', 't3', 'Đề thi', 'pdf', 2024, 'minhtri.k66', '2024-12-28', 990, 140, 2400, 'Đề thi cuối kỳ, có đáp án phần trắc nghiệm.', ['đề thi', 'cuối kỳ'], { term: 'CK', solution: true }),
  mkDoc('d11', 'Slide Lập trình hướng đối tượng với Java', 'oop', 't9', 'Slide bài giảng', 'pptx', 2025, 'hoangnam', '2025-08-30', 720, 115, 1700, 'Slide toàn bộ học phần, có ví dụ code Java.', ['java', 'slide']),
  mkDoc('d12', 'Ghi chú OOP: 4 tính chất + design pattern cơ bản', 'oop', 't1', 'Ghi chú', 'pdf', 2025, 'lananh_hust', '2025-10-10', 530, 121, 1200, 'Tóm tắt ngắn gọn, dễ nhớ, có sơ đồ UML.', ['java', 'uml', 'design pattern']),
  mkDoc('d13', 'Giáo trình Giải tích 1', 'gt1', 't4', 'Giáo trình', 'pdf', 2023, 'thuytrang', '2023-09-05', 3020, 402, 8100, 'Giáo trình chuẩn dùng cho sinh viên năm nhất các ngành kỹ thuật.', ['giải tích', 'tích phân']),
  mkDoc('d14', 'Đề thi cuối kỳ Giải tích 1 (2020–2024)', 'gt1', 't5', 'Đề thi', 'pdf', 2024, 'baongoc', '2025-01-02', 2650, 389, 7000, 'Tuyển tập 5 năm đề cuối kỳ, kèm đáp án.', ['đề thi', 'tuyển tập'], { term: 'CK', solution: true }),
  mkDoc('d15', 'Bài tập Giải tích 1 – chương tích phân', 'gt1', 't4', 'Bài tập', 'docx', 2025, 'phuongvy', '2025-02-18', 860, 99, 2100, 'Bài tập tích phân bất định, xác định, suy rộng.', ['tích phân', 'bài tập']),
  mkDoc('d16', 'Slide Đại số tuyến tính – PGS. Khoa', 'dsk', 't10', 'Slide bài giảng', 'pptx', 2025, 'quanglinh', '2025-09-22', 690, 88, 1650, 'Slide trên lớp học kỳ 1 năm học 2025–2026.', ['slide', 'ma trận']),
  mkDoc('d17', 'Đề thi giữa kỳ Đại số tuyến tính 2025', 'dsk', 't4', 'Đề thi', 'pdf', 2025, 'minhtri.k66', '2025-04-02', 1300, 170, 3100, 'Đề giữa kỳ kèm lời giải chi tiết.', ['đề thi', 'giữa kỳ'], { term: 'GK', solution: true }),
  mkDoc('d18', 'Tóm tắt công thức Xác suất thống kê', 'xstk', 't5', 'Ghi chú', 'pdf', 2025, 'thuytrang', '2025-05-30', 1980, 350, 4700, '2 trang tóm tắt toàn bộ công thức – mang vào phòng thi (nếu được phép).', ['công thức', 'cheatsheet']),
  mkDoc('d19', 'Bài tập Xác suất thống kê có lời giải', 'xstk', 't10', 'Bài tập', 'docx', 2024, 'hoangnam', '2024-11-11', 1150, 160, 2900, 'Bài tập theo từng chương, có lời giải.', ['bài tập', 'lời giải']),
  mkDoc('d20', 'Đề cương ôn tập Vật lý đại cương 1', 'vl1', 't6', 'Đề cương', 'pdf', 2025, 'baongoc', '2025-06-01', 940, 120, 2300, 'Tổng hợp lý thuyết và các dạng bài tập chính.', ['đề cương', 'cơ học']),
  mkDoc('d21', 'Đề thi cuối kỳ Vật lý 1 – 2024', 'vl1', 't6', 'Đề thi', 'pdf', 2024, 'ducanh99', '2024-12-30', 1010, 133, 2600, 'Đề thi tự luận 4 câu.', ['đề thi'], { term: 'CK', solution: false }),
  mkDoc('d22', 'Đề cương ôn thi Kinh tế chính trị', 'ktct', 't8', 'Đề cương', 'docx', 2025, 'phuongvy', '2025-06-12', 2200, 280, 5100, 'Đề cương 30 câu hỏi tự luận có gợi ý trả lời.', ['đề cương', 'tự luận']),
  mkDoc('d23', 'Slide Tiếng Anh chuyên ngành – Unit 1–4', 'tacn', 't7', 'Slide bài giảng', 'pptx', 2025, 'lananh_hust', '2025-09-05', 410, 64, 900, 'Slide 4 unit đầu kèm từ vựng.', ['english', 'vocabulary']),
  mkDoc('d24', 'Bài tập Reading & Writing tiếng Anh CNTT', 'tacn', 't7', 'Bài tập', 'pdf', 2025, 'quanglinh', '2025-10-14', 280, 41, 620, 'Bài tập đọc hiểu và viết email kỹ thuật.', ['reading', 'writing']),
];

// Đánh giá: teacher -> {clarity, enthusiasm, leniency}; subject -> {difficulty, workload, usefulness}
function mkReview(id, targetType, targetId, subjectId, rating, c, tags, text, author, semester, date, helpful) {
  const criteria = targetType === 'teacher'
    ? { clarity: c[0], enthusiasm: c[1], leniency: c[2] }
    : { difficulty: c[0], workload: c[1], usefulness: c[2] };
  return { id, targetType, targetId, subjectId, rating, criteria, tags, text, author, semester, date, helpful };
}

const REVIEWS = [
  mkReview('r1', 'teacher', 't1', 'ctdl', 5, [5, 5, 3], ['Giảng dễ hiểu', 'Có đề cương ôn tập'], 'Thầy giảng rất kỹ, có ví dụ minh họa trực quan. Bài tập về nhà hơi nhiều nhưng làm xong thì thi rất ổn.', 'Ẩn danh', 'HK1 2024–2025', '2025-01-15', 42),
  mkReview('r2', 'teacher', 't1', 'oop', 4, [4, 5, 3], ['Nhiệt tình', 'Bài tập nhiều'], 'Thầy nhiệt tình, trả lời câu hỏi trên nhóm cả buổi tối. Chấm bài tập lớn khá kỹ.', 'khanh.dev', 'HK2 2024–2025', '2025-06-20', 18),
  mkReview('r3', 'teacher', 't2', 'csdl', 4, [4, 4, 4], ['Giảng dễ hiểu', 'Cho điểm rộng'], 'Cô dạy SQL rất thực tế, hay lấy ví dụ từ dự án thật. Điểm quá trình cho khá thoáng.', 'Ẩn danh', 'HK2 2024–2025', '2025-06-28', 25),
  mkReview('r4', 'teacher', 't2', 'csdl', 3, [3, 4, 3], ['Điểm danh thường xuyên'], 'Bài giảng ổn nhưng điểm danh gần như mọi buổi. Slide hơi nhiều chữ.', 'Ẩn danh', 'HK1 2024–2025', '2025-01-10', 9),
  mkReview('r5', 'teacher', 't3', 'mmt', 5, [5, 4, 2], ['Giảng dễ hiểu', 'Chấm chặt'], 'Thầy giỏi chuyên môn, kiến thức sâu. Tuy nhiên chấm thi khá chặt, phải học thật mới qua.', 'tuan.nguyen', 'HK1 2024–2025', '2025-01-22', 37),
  mkReview('r6', 'teacher', 't3', 'ctdl', 4, [4, 3, 3], ['Bài tập nhiều'], 'Học khó nhưng ra trường thấy rất có ích. Nên làm hết bài tập thầy giao.', 'Ẩn danh', 'HK2 2023–2024', '2024-06-30', 14),
  mkReview('r7', 'teacher', 't4', 'gt1', 5, [5, 5, 4], ['Giảng dễ hiểu', 'Hỗ trợ ngoài giờ', 'Có đề cương ôn tập'], 'Cô dạy chậm, chắc, rất hợp với các bạn mất gốc. Trước thi cô có buổi ôn tập riêng.', 'mai.phuong', 'HK1 2024–2025', '2025-01-05', 51),
  mkReview('r8', 'teacher', 't4', 'dsk', 4, [4, 5, 4], ['Nhiệt tình'], 'Cô dễ thương, bài giảng có cấu trúc rõ ràng.', 'Ẩn danh', 'HK2 2024–2025', '2025-06-15', 12),
  mkReview('r9', 'teacher', 't5', 'xstk', 4, [4, 4, 4], ['Hài hước', 'Cho điểm rộng'], 'Thầy vui tính, hay kể chuyện ứng dụng thống kê ngoài đời. Đề thi vừa sức.', 'Ẩn danh', 'HK2 2024–2025', '2025-06-25', 20),
  mkReview('r10', 'teacher', 't5', 'gt1', 3, [3, 3, 4], ['Điểm danh thường xuyên'], 'Giảng hơi nhanh, cần tự đọc thêm giáo trình.', 'Ẩn danh', 'HK1 2023–2024', '2024-01-12', 6),
  mkReview('r11', 'teacher', 't6', 'vl1', 5, [5, 5, 3], ['Hài hước', 'Giảng dễ hiểu'], 'Thí nghiệm minh họa trên lớp cực hay, nhớ bài rất lâu. Đi học đầy đủ là được cộng điểm.', 'hai.vl', 'HK1 2024–2025', '2025-01-18', 33),
  mkReview('r12', 'teacher', 't7', 'tacn', 4, [5, 4, 4], ['Nhiệt tình', 'Đúng giờ'], 'Cô phát âm chuẩn, cho thuyết trình nhiều nên tự tin hơn hẳn.', 'Ẩn danh', 'HK1 2025–2026', '2025-10-01', 8),
  mkReview('r13', 'teacher', 't8', 'ktct', 4, [4, 4, 5], ['Cho điểm rộng', 'Có đề cương ôn tập'], 'Thầy liên hệ thực tế rất thú vị, không khô khan như mình nghĩ. Có đề cương rõ ràng.', 'Ẩn danh', 'HK2 2024–2025', '2025-06-30', 29),
  mkReview('r14', 'teacher', 't9', 'oop', 4, [4, 4, 4], ['Hỗ trợ ngoài giờ'], 'Cô hướng dẫn thực hành tận tình, sửa code từng bạn.', 'linh.java', 'HK2 2024–2025', '2025-06-18', 11),
  mkReview('r15', 'teacher', 't10', 'dsk', 3, [3, 3, 2], ['Chấm chặt', 'Bài tập nhiều'], 'Thầy giỏi nhưng dạy nhanh và chấm rất chặt. Phải tự học nhiều.', 'Ẩn danh', 'HK1 2024–2025', '2025-01-20', 19),
  mkReview('r16', 'subject', 'ctdl', null, 4, [4, 4, 5], ['Cần học đều', 'Hữu ích cho nghề', 'Có bài tập lớn'], 'Môn nền tảng cực quan trọng, phỏng vấn đi làm hỏi rất nhiều. Nên luyện thêm trên LeetCode.', 'Ẩn danh', 'HK1 2024–2025', '2025-01-16', 40),
  mkReview('r17', 'subject', 'ctdl', null, 3, [5, 5, 5], ['Đề thi khó'], 'Khó thật sự, phần đồ thị cần dành nhiều thời gian.', 'Ẩn danh', 'HK2 2023–2024', '2024-07-01', 15),
  mkReview('r18', 'subject', 'csdl', null, 5, [3, 3, 5], ['Nhiều thực hành', 'Hữu ích cho nghề'], 'Học xong là dùng được ngay khi làm project. Phần chuẩn hóa hơi trừu tượng.', 'Ẩn danh', 'HK2 2024–2025', '2025-06-29', 22),
  mkReview('r19', 'subject', 'mmt', null, 4, [4, 3, 4], ['Nhiều lý thuyết'], 'Nhiều lý thuyết cần học thuộc, nhưng phần subnet thì luyện là quen.', 'Ẩn danh', 'HK1 2024–2025', '2025-01-21', 13),
  mkReview('r20', 'subject', 'gt1', null, 4, [4, 4, 3], ['Nên học sớm', 'Cần học đều'], 'Môn năm nhất nhưng ảnh hưởng nhiều môn sau, đừng để nợ.', 'Ẩn danh', 'HK1 2024–2025', '2025-01-07', 26),
  mkReview('r21', 'subject', 'xstk', null, 4, [3, 3, 5], ['Hữu ích cho nghề'], 'Rất cần cho ai theo data/AI.', 'data.girl', 'HK2 2024–2025', '2025-06-26', 18),
  mkReview('r22', 'subject', 'ktct', null, 3, [2, 2, 2], ['Nhiều lý thuyết', 'Dễ qua môn'], 'Học thuộc đề cương là qua, nhưng hơi nặng phần ghi nhớ.', 'Ẩn danh', 'HK2 2024–2025', '2025-07-01', 10),
  mkReview('r23', 'subject', 'vl1', null, 3, [4, 3, 3], ['Đề thi khó'], 'Đề thi có câu vận dụng khá lắt léo.', 'Ẩn danh', 'HK1 2024–2025', '2025-01-19', 7),
  mkReview('r24', 'subject', 'oop', null, 5, [3, 4, 5], ['Có bài tập lớn', 'Nhiều thực hành'], 'Bài tập lớn giúp hiểu OOP rõ hơn rất nhiều.', 'Ẩn danh', 'HK2 2024–2025', '2025-06-22', 16),
  mkReview('r25', 'subject', 'dsk', null, 3, [4, 4, 4], ['Cần học đều'], 'Chương trị riêng khá khó, nên làm nhiều bài tập.', 'Ẩn danh', 'HK1 2024–2025', '2025-01-14', 9),
  mkReview('r26', 'subject', 'tacn', null, 4, [2, 3, 5], ['Dễ qua môn', 'Hữu ích cho nghề'], 'Không khó, giúp đọc tài liệu tiếng Anh tốt hơn.', 'Ẩn danh', 'HK1 2025–2026', '2025-10-03', 5),
];

const TEACHER_TAGS = ['Giảng dễ hiểu', 'Nhiệt tình', 'Hài hước', 'Có đề cương ôn tập', 'Hỗ trợ ngoài giờ', 'Đúng giờ', 'Cho điểm rộng', 'Chấm chặt', 'Bài tập nhiều', 'Điểm danh thường xuyên'];
const SUBJECT_TAGS = ['Nhiều lý thuyết', 'Nhiều thực hành', 'Có bài tập lớn', 'Đề thi khó', 'Cần học đều', 'Dễ qua môn', 'Nên học sớm', 'Hữu ích cho nghề'];

const COMMENTS = {
  d2: [
    { author: 'hoangnam', text: 'Câu 3 đáp án hình như thiếu trường hợp cây rỗng nhé mọi người.', date: '2025-01-10' },
    { author: 'lananh_hust', text: 'Cảm ơn bạn, mình sẽ cập nhật bản sửa!', date: '2025-01-11' },
  ],
  d13: [{ author: 'phuongvy', text: 'Giáo trình chuẩn, đọc kèm slide của cô Hà là đủ.', date: '2025-02-01' }],
  d18: [{ author: 'ducanh99', text: 'Cheatsheet quá xịn, cứu mình kỳ này 🙏', date: '2025-06-05' }],
};

const REQUESTS = [
  { id: 'q1', subjectId: 'ctdl', text: 'Xin đề thi giữa kỳ CTDL&GT 2025 của thầy An', author: 'k67.student', date: '2025-10-12', votes: 23, done: false },
  { id: 'q2', subjectId: 'vl1', text: 'Có ai có lời giải đề cuối kỳ Vật lý 1 năm 2024 không?', author: 'Ẩn danh', date: '2025-10-08', votes: 17, done: false },
  { id: 'q3', subjectId: 'csdl', text: 'Cần bài tập SQL nâng cao (subquery, window function)', author: 'thuytrang', date: '2025-09-28', votes: 11, done: false },
  { id: 'q4', subjectId: 'xstk', text: 'Bảng tra phân phối chuẩn & Student bản đẹp', author: 'Ẩn danh', date: '2025-09-15', votes: 8, done: true },
  { id: 'q5', subjectId: 'oop', text: 'Đề bài tập lớn OOP các năm trước', author: 'linh.java', date: '2025-10-15', votes: 5, done: false },
];
