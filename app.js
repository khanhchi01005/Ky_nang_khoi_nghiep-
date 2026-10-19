// StudyShare – prototype SPA (hash router, dữ liệu giả lập + localStorage)

/* ---------- Tiện ích ---------- */
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const norm = (s) => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase();
const fmtNum = (n) => (n >= 1000 ? (n / 1000).toFixed(1).replace('.0', '') + 'k' : String(n));
const fmtDate = (s) => { const d = new Date(s); return isNaN(d) ? '' : d.toLocaleDateString('vi-VN'); };
const today = () => new Date().toISOString().slice(0, 10);
const avg = (arr, f) => (arr.length ? arr.reduce((a, x) => a + f(x), 0) / arr.length : 0);
const fmtSize = (b) => (b > 1048576 ? (b / 1048576).toFixed(1) + ' MB' : Math.max(1, Math.round(b / 1024)) + ' KB');

const store = {
  get(k, d) { try { const v = localStorage.getItem('ss_' + k); return v ? JSON.parse(v) : d; } catch { return d; } },
  set(k, v) { try { localStorage.setItem('ss_' + k, JSON.stringify(v)); return true; } catch { return false; } },
};

const FORMATS = {
  pdf: { label: 'PDF', color: '#e5484d' },
  docx: { label: 'DOCX', color: '#2f6fed' },
  pptx: { label: 'PPTX', color: '#e8772e' },
  img: { label: 'ẢNH', color: '#12a594' },
  txt: { label: 'TXT', color: '#6b7280' },
};
const TYPE_ICON = { 'Giáo trình': '📘', 'Slide bài giảng': '📊', 'Đề thi': '📝', 'Bài tập': '✏️', 'Ghi chú': '🗒️', 'Đề cương': '📋' };
const ME = 'Bạn';

/* ---------- State ---------- */
const state = {
  docs: [...store.get('userDocs', []), ...DOCS.map((d) => ({ ...d }))],
  reviews: [...store.get('userReviews', []), ...REVIEWS],
  comments: Object.assign({}, COMMENTS, store.get('comments', {})),
  requests: store.get('requests', null) || REQUESTS.map((r) => ({ ...r })),
  saved: new Set(store.get('saved', [])),
  liked: new Set(store.get('liked', [])),
  helpful: new Set(store.get('helpful', [])),
  voted: new Set(store.get('voted', [])),
  stats: store.get('stats', {}),
  recent: store.get('recent', []),
  blobs: {}, // id -> objectURL (chỉ trong phiên)
};
// áp dụng lượt xem/tải/thích đã lưu
state.docs.forEach((d) => {
  const s = state.stats[d.id];
  if (s) { d.views += s.v || 0; d.downloads += s.d || 0; d.likes += s.l || 0; }
});

const subj = (id) => SUBJECTS.find((s) => s.id === id);
const teacher = (id) => TEACHERS.find((t) => t.id === id);
const docById = (id) => state.docs.find((d) => d.id === id);
const reviewsFor = (type, id) => state.reviews.filter((r) => r.targetType === type && r.targetId === id);
const docsOf = (subjectId) => state.docs.filter((d) => d.subjectId === subjectId);
const FACULTIES = [...new Set(SUBJECTS.map((s) => s.faculty))];

function bumpStat(doc, key, delta = 1) {
  const map = { v: 'views', d: 'downloads', l: 'likes' };
  doc[map[key]] += delta;
  const s = (state.stats[doc.id] ||= {});
  s[key] = (s[key] || 0) + delta;
  store.set('stats', state.stats);
}
const saveSet = (name) => store.set(name, [...state[name]]);

/* ---------- Thành phần UI dùng chung ---------- */
function stars(v, cls = '') {
  let h = '';
  for (let i = 1; i <= 5; i++) h += `<span class="${v >= i - 0.25 ? 'on' : v >= i - 0.75 ? 'half' : ''}">★</span>`;
  return `<span class="stars ${cls}" title="${v.toFixed(1)}/5">${h}</span>`;
}

function docCard(d) {
  const s = subj(d.subjectId);
  const f = FORMATS[d.format] || FORMATS.pdf;
  const saved = state.saved.has(d.id);
  return `<article class="doc-card" data-href="#/doc/${d.id}">
    <div class="doc-icon" style="--c:${f.color}"><span class="ti">${TYPE_ICON[d.type] || '📄'}</span><span class="fl">${f.label}</span></div>
    <div class="doc-body">
      <h3><a href="#/doc/${d.id}">${esc(d.title)}</a></h3>
      <div class="chips">
        <a class="chip" href="#/subject/${s.id}" title="${esc(s.name)}">${esc(s.code)}</a>
        <span class="chip type">${esc(d.type)}</span>
        ${d.year ? `<span class="chip ghost">${d.year}</span>` : ''}
        ${d.user ? '<span class="chip new">Của bạn</span>' : ''}
      </div>
      <div class="meta">👤 ${esc(d.uploader)} · ${fmtDate(d.date)} · ${d.pageCount} trang</div>
      <div class="stats"><span title="Lượt tải">⬇ ${fmtNum(d.downloads)}</span><span title="Lượt thích">♥ ${fmtNum(d.likes)}</span><span title="Lượt xem">👁 ${fmtNum(d.views)}</span></div>
    </div>
    <div class="doc-actions">
      <button class="icon-btn ${saved ? 'on' : ''}" data-act="save" data-id="${d.id}" title="${saved ? 'Bỏ lưu' : 'Lưu tài liệu'}">${saved ? '🔖' : '📑'}</button>
      <button class="btn sm" data-act="preview" data-id="${d.id}">Xem trước</button>
    </div>
  </article>`;
}

function emptyState(msg, action = '') {
  return `<div class="empty"><div class="empty-ic">🔍</div><p>${msg}</p>${action}</div>`;
}

function ratingSummary(list, criteria) {
  const a = avg(list, (r) => r.rating);
  const dist = [5, 4, 3, 2, 1].map((n) => list.filter((r) => r.rating === n).length);
  const max = Math.max(1, ...dist);
  return `<div class="rating-summary card">
    <div class="rs-main">
      <div class="rs-score">${list.length ? a.toFixed(1) : '–'}</div>
      ${stars(a, 'lg')}
      <div class="muted">${list.length} đánh giá</div>
    </div>
    <div class="rs-dist">
      ${dist.map((c, i) => `<div class="dist-row"><span>${5 - i}★</span><div class="bar"><i style="width:${(c / max) * 100}%"></i></div><span class="muted">${c}</span></div>`).join('')}
    </div>
    <div class="rs-crit">
      ${criteria.map(([k, label, hint]) => {
        const v = avg(list, (r) => r.criteria[k] || 0);
        return `<div class="crit"><div class="crit-top"><span>${label}</span><b>${list.length ? v.toFixed(1) : '–'}/5</b></div><div class="bar alt"><i style="width:${(v / 5) * 100}%"></i></div><div class="hint">${hint}</div></div>`;
      }).join('')}
    </div>
  </div>`;
}

const TEACHER_CRIT = [['clarity', 'Truyền đạt', '5 = rất dễ hiểu'], ['enthusiasm', 'Nhiệt tình', '5 = rất nhiệt tình'], ['leniency', 'Chấm điểm', '1 = rất chặt · 5 = rất thoáng']];
const SUBJECT_CRIT = [['difficulty', 'Độ khó', '1 = dễ · 5 = rất khó'], ['workload', 'Khối lượng', '1 = nhẹ · 5 = rất nặng'], ['usefulness', 'Tính hữu ích', '5 = rất hữu ích']];

function topTags(list, n = 4) {
  const c = {};
  list.forEach((r) => r.tags.forEach((t) => (c[t] = (c[t] || 0) + 1)));
  return Object.entries(c).sort((a, b) => b[1] - a[1]).slice(0, n);
}

function reviewItem(r) {
  const s = r.subjectId ? subj(r.subjectId) : null;
  const h = state.helpful.has(r.id);
  return `<div class="review">
    <div class="review-head">
      <div class="avatar sm">${esc((r.author || 'A')[0].toUpperCase())}</div>
      <div><b>${esc(r.author)}</b><div class="muted small">${esc(r.semester || '')} · ${fmtDate(r.date)}${s ? ` · môn <a href="#/subject/${s.id}">${esc(s.name)}</a>` : ''}</div></div>
      <div class="review-rate">${stars(r.rating)}</div>
    </div>
    <p>${esc(r.text)}</p>
    <div class="chips">${r.tags.map((t) => `<span class="chip ghost">${esc(t)}</span>`).join('')}</div>
    <div class="review-foot"><button class="link-btn ${h ? 'on' : ''}" data-act="helpful" data-id="${r.id}">👍 Hữu ích (${r.helpful + (h ? 1 : 0)})</button></div>
  </div>`;
}

function reviewForm(type, id) {
  const tags = type === 'teacher' ? TEACHER_TAGS : SUBJECT_TAGS;
  const crit = type === 'teacher' ? TEACHER_CRIT : SUBJECT_CRIT;
  const subjOpts = type === 'teacher' ? teacher(id).subjects.map((s) => `<option value="${s}">${esc(subj(s).name)}</option>`).join('') : '';
  return `<form class="card review-form" data-review-form data-type="${type}" data-id="${id}">
    <h3>Viết đánh giá của bạn</h3>
    <div class="form-row">
      <label>Đánh giá chung</label>
      <div class="star-input" data-star-input>${[1, 2, 3, 4, 5].map((n) => `<button type="button" data-star="${n}">★</button>`).join('')}<input type="hidden" name="rating" value="0"><span class="muted small" data-star-label>Chọn số sao</span></div>
    </div>
    ${type === 'teacher' ? `<div class="form-row"><label>Môn bạn đã học với giảng viên</label><select name="subjectId">${subjOpts}</select></div>` : ''}
    <div class="crit-inputs">
      ${crit.map(([k, label, hint]) => `<div class="form-row"><label>${label} <b data-out="${k}">3</b>/5</label><input type="range" min="1" max="5" value="3" name="${k}" data-range="${k}"><div class="hint">${hint}</div></div>`).join('')}
    </div>
    <div class="form-row"><label>Thẻ mô tả (chọn nhiều)</label><div class="tag-picker">${tags.map((t) => `<label class="tag-opt"><input type="checkbox" name="tags" value="${esc(t)}"><span>${esc(t)}</span></label>`).join('')}</div></div>
    <div class="form-row"><label>Nhận xét</label><textarea name="text" rows="3" placeholder="Chia sẻ trải nghiệm thật, mang tính xây dựng…" required></textarea></div>
    <div class="form-grid">
      <div class="form-row"><label>Học kỳ</label><select name="semester"><option>HK1 2025–2026</option><option>HK2 2024–2025</option><option>HK1 2024–2025</option><option>HK2 2023–2024</option></select></div>
      <div class="form-row"><label>Tên hiển thị</label><input name="author" placeholder="Để trống = Ẩn danh"></div>
    </div>
    <p class="hint">Đánh giá được kiểm duyệt tự động; ngôn từ xúc phạm sẽ bị ẩn.</p>
    <button class="btn primary">Gửi đánh giá</button>
  </form>`;
}

/* ---------- Sinh nội dung trang tài liệu (giả lập) ---------- */
function buildPages(doc) {
  if (doc.text != null) {
    const chunks = [];
    for (let i = 0; i < doc.text.length || i === 0; i += 2200) chunks.push(doc.text.slice(i, i + 2200));
    return chunks.map((c) => `<pre class="pg-text">${esc(c)}</pre>`);
  }
  const s = subj(doc.subjectId), t = teacher(doc.teacherId);
  const tp = s.topics;
  const head = `<div class="pg-head"><span>${esc(s.code)} · ${esc(s.name)}</span><span>StudyShare</span></div>`;
  const box = (x) => `<pre class="pg-code">${esc(x)}</pre>`;

  if (doc.type === 'Slide bài giảng' || doc.format === 'pptx') {
    const slides = [`<div class="sl-title"><div class="sl-kicker">${esc(s.code)}</div><h1>${esc(s.name)}</h1><p>${esc(doc.title)}</p><p class="muted">${esc(t?.name || '')} · ${doc.year}</p></div>`];
    tp.forEach((x, i) => {
      slides.push(`<div class="sl"><div class="sl-num">Chương ${i + 1}</div><h2>${esc(x.t)}</h2><ul>${x.p.split('. ').filter(Boolean).map((b) => `<li>${esc(b.replace(/\.$/, ''))}</li>`).join('')}</ul></div>`);
      slides.push(`<div class="sl"><div class="sl-num">Chương ${i + 1} · Ví dụ</div><h2>${esc(x.t)}</h2>${box(x.x)}</div>`);
    });
    slides.push(`<div class="sl-title"><h1>Cảm ơn!</h1><p>Câu hỏi & thảo luận</p></div>`);
    return slides.map((h) => `<div class="slide-inner">${h}</div>`);
  }

  const cover = `<div class="pg-cover"><div class="pg-uni">TRƯỜNG ĐẠI HỌC DEMO<br><small>Khoa ${esc(s.faculty)}</small></div>
    <div class="pg-cover-mid"><div class="pg-kicker">${esc(doc.type.toUpperCase())}</div><h1>${esc(doc.title)}</h1><p>${esc(s.name)} (${esc(s.code)})</p></div>
    <div class="pg-cover-foot">${esc(t?.name || '')}<br>${doc.year}</div></div>`;

  if (doc.type === 'Đề thi') {
    const q = (i, x) => `<div class="pg-q"><b>Câu ${i + 1}</b> <i>(2,5 điểm)</i>. ${esc(x.q)}${i % 2 === 0 ? box(x.x) : ''}</div>`;
    const pages = [
      `<div class="pg-exam-head"><div><b>TRƯỜNG ĐẠI HỌC DEMO</b><br>Khoa ${esc(s.faculty)}</div><div class="right"><b>ĐỀ THI ${doc.term === 'GK' ? 'GIỮA KỲ' : 'CUỐI KỲ'}</b><br>Năm học ${doc.year - 1}–${doc.year}</div></div>
       <h2 class="center">Môn: ${esc(s.name)} (${esc(s.code)})</h2><p class="center muted">Thời gian làm bài: 90 phút · Không sử dụng tài liệu · Đề gồm ${tp.length} câu</p><hr>
       ${tp.slice(0, 2).map((x, i) => q(i, x)).join('')}`,
      `${head}${tp.slice(2).map((x, i) => q(i + 2, x)).join('')}<p class="center muted">— HẾT —</p><p class="muted small">Cán bộ coi thi không giải thích gì thêm.</p>`,
    ];
    if (doc.solution) pages.push(`${head}<h2>Đáp án gợi ý</h2>${tp.map((x, i) => `<div class="pg-q"><b>Câu ${i + 1}.</b> ${esc(x.p)}${box(x.x)}</div>`).join('')}`);
    return pages;
  }

  if (doc.type === 'Bài tập') {
    return [cover, ...tp.map((x, i) => `${head}<h2>Chương ${i + 1}. ${esc(x.t)}</h2>
      <div class="pg-q"><b>Bài ${i * 3 + 1}.</b> ${esc(x.q)}</div>
      <div class="pg-sol"><b>Gợi ý:</b> ${esc(x.p)}</div>${box(x.x)}
      <div class="pg-q"><b>Bài ${i * 3 + 2}.</b> Áp dụng kiến thức về “${esc(x.t.toLowerCase())}”, hãy giải bài toán tương tự với dữ liệu khác.</div>
      <div class="pg-q"><b>Bài ${i * 3 + 3}.</b> (Nâng cao) Chứng minh hoặc phân tích tính đúng đắn của phương pháp đã sử dụng.</div>`)];
  }

  const toc = `${head}<h2>Mục lục</h2><ol class="pg-toc">${tp.map((x, i) => `<li><span>${esc(x.t)}</span><i></i><span>${i + 3}</span></li>`).join('')}</ol>
    <div class="pg-note">💡 ${esc(doc.desc || '')}</div>`;
  const body = tp.map((x, i) => `${head}<h2>${i + 1}. ${esc(x.t)}</h2><p>${esc(x.p)}</p>${box(x.x)}
    <h3>${i + 1}.1. Ghi nhớ</h3><ul><li>Nắm vững định nghĩa và các tính chất cơ bản.</li><li>Luyện tập với ví dụ minh họa phía trên.</li><li>Liên hệ với các chương trước để hiểu bản chất.</li></ul>
    <div class="pg-note"><b>Câu hỏi ôn tập:</b> ${esc(x.q)}</div><div class="pg-foot">${i + 3}</div>`);
  return [cover, toc, ...body];
}

state.docs.forEach((d) => (d.pageCount = d.fileUrl || d.dataUrl || d.file ? (d.pageCount || 1) : buildPages(d).length));

/* ---------- Router ---------- */
const routes = [
  [/^\/?$/, renderHome, 'home'],
  [/^\/docs$/, renderDocs, 'docs'],
  [/^\/doc\/(.+)$/, renderDoc, 'docs'],
  [/^\/subjects$/, renderSubjects, 'subjects'],
  [/^\/subject\/(.+)$/, renderSubject, 'subjects'],
  [/^\/teachers$/, renderTeachers, 'teachers'],
  [/^\/teacher\/(.+)$/, renderTeacher, 'teachers'],
  [/^\/upload$/, renderUpload, ''],
  [/^\/saved$/, renderSaved, 'saved'],
  [/^\/leaderboard$/, renderLeaderboard, 'leaderboard'],
  [/^\/requests$/, renderRequests, 'requests'],
];

function parseHash() {
  const raw = location.hash.replace(/^#/, '').split('#')[0] || '/';
  const [path, qs] = raw.split('?');
  return { path, query: Object.fromEntries(new URLSearchParams(qs || '')) };
}

function router() {
  const { path, query } = parseHash();
  const app = $('#app');
  for (const [re, fn, nav] of routes) {
    const m = path.match(re);
    if (m) {
      $$('#mainnav a').forEach((a) => a.classList.toggle('active', a.dataset.nav === nav));
      app.innerHTML = fn(...m.slice(1).map(decodeURIComponent), query) || '';
      afterRender[fn.name]?.(...m.slice(1), query);
      window.scrollTo(0, 0);
      return;
    }
  }
  app.innerHTML = emptyState('Không tìm thấy trang.', '<a class="btn" href="#/">Về trang chủ</a>');
}
const afterRender = {};

/* ---------- Trang chủ ---------- */
function renderHome() {
  const trending = [...state.docs].sort((a, b) => b.downloads - a.downloads).slice(0, 4);
  const newest = [...state.docs].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 4);
  const topTeachers = TEACHERS.map((t) => ({ t, list: reviewsFor('teacher', t.id) }))
    .sort((a, b) => avg(b.list, (r) => r.rating) - avg(a.list, (r) => r.rating) || b.list.length - a.list.length).slice(0, 4);
  const latestReviews = [...state.reviews].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 3);
  const recent = state.recent.map(docById).filter(Boolean).slice(0, 4);

  return `
  <section class="hero">
    <div class="hero-text">
      <h1>Tài liệu học tập, <span class="grad">chia sẻ bởi sinh viên</span></h1>
      <p>Tìm giáo trình, đề thi, slide theo từng môn học. Xem review thật về giảng viên & môn học trước khi đăng ký.</p>
      <form class="hero-search" data-hero-search>
        <input name="q" placeholder="VD: đề thi giải tích, SQL, cây nhị phân…" autocomplete="off">
        <button class="btn primary">Tìm kiếm</button>
      </form>
      <div class="chips hero-chips">${SUBJECTS.slice(0, 6).map((s) => `<a class="chip" href="#/subject/${s.id}">${s.icon} ${esc(s.name)}</a>`).join('')}</div>
    </div>
    <div class="hero-stats">
      <div class="stat"><b>${state.docs.length}</b><span>Tài liệu</span></div>
      <div class="stat"><b>${SUBJECTS.length}</b><span>Môn học</span></div>
      <div class="stat"><b>${TEACHERS.length}</b><span>Giảng viên</span></div>
      <div class="stat"><b>${state.reviews.length}</b><span>Đánh giá</span></div>
    </div>
  </section>

  ${recent.length ? `<section class="section"><div class="section-head"><h2>🕘 Xem gần đây</h2><a href="#/saved">Xem tất cả →</a></div><div class="doc-grid">${recent.map(docCard).join('')}</div></section>` : ''}

  <section class="section"><div class="section-head"><h2>🔥 Tải nhiều nhất</h2><a href="#/docs?sort=downloads">Xem tất cả →</a></div><div class="doc-grid">${trending.map(docCard).join('')}</div></section>
  <section class="section"><div class="section-head"><h2>✨ Mới tải lên</h2><a href="#/docs?sort=new">Xem tất cả →</a></div><div class="doc-grid">${newest.map(docCard).join('')}</div></section>

  <div class="two-col">
    <section class="section"><div class="section-head"><h2>⭐ Giảng viên được đánh giá cao</h2><a href="#/teachers">Tất cả →</a></div>
      <div class="list-card card">${topTeachers.map(({ t, list }) => `
        <a class="row-link" href="#/teacher/${t.id}"><div class="avatar">${initials(t.name)}</div>
          <div class="grow"><b>${esc(t.name)}</b><div class="muted small">${esc(t.faculty)}</div></div>
          <div class="right">${stars(avg(list, (r) => r.rating))}<div class="muted small">${list.length} đánh giá</div></div></a>`).join('')}
      </div>
    </section>
    <section class="section"><div class="section-head"><h2>💬 Review mới nhất</h2></div>
      <div class="card">${latestReviews.map((r) => {
        const target = r.targetType === 'teacher' ? teacher(r.targetId) : subj(r.targetId);
        return `<div class="mini-review"><a href="#/${r.targetType}/${r.targetId}"><b>${esc(target.name)}</b></a> ${stars(r.rating)}<p>“${esc(r.text)}”</p></div>`;
      }).join('')}</div>
    </section>
  </div>`;
}
afterRender.renderHome = () => {
  $('[data-hero-search]').addEventListener('submit', (e) => {
    e.preventDefault();
    location.hash = '#/docs?q=' + encodeURIComponent(e.target.q.value.trim());
  });
};

function initials(name) {
  const parts = name.replace(/^(PGS\.TS\.|TS\.|ThS\.)\s*/, '').split(' ');
  return (parts[parts.length - 2]?.[0] || '') + parts[parts.length - 1][0];
}

/* ---------- Danh sách tài liệu + bộ lọc ---------- */
let docFilter = null;
function defaultFilter() { return { q: '', subject: '', faculty: '', teacher: '', types: [], formats: [], year: '', sort: 'relevance' }; }

function filterDocs(f) {
  const words = norm(f.q).split(/\s+/).filter(Boolean);
  let list = state.docs.filter((d) => {
    const s = subj(d.subjectId), t = teacher(d.teacherId);
    if (words.length) {
      const hay = norm([d.title, d.desc, (d.tags || []).join(' '), s.name, s.code, t?.name, d.uploader, d.type].join(' '));
      if (!words.every((w) => hay.includes(w))) return false;
    }
    if (f.subject && d.subjectId !== f.subject) return false;
    if (f.faculty && s.faculty !== f.faculty) return false;
    if (f.teacher && d.teacherId !== f.teacher) return false;
    if (f.types.length && !f.types.includes(d.type)) return false;
    if (f.formats.length && !f.formats.includes(d.format)) return false;
    if (f.year && String(d.year) !== f.year) return false;
    return true;
  });
  const score = (d) => {
    if (!words.length) return d.downloads;
    const title = norm(d.title);
    return words.reduce((a, w) => a + (title.includes(w) ? 10 : 1), 0) * 1000 + d.downloads;
  };
  const sorters = {
    relevance: (a, b) => score(b) - score(a),
    new: (a, b) => b.date.localeCompare(a.date),
    downloads: (a, b) => b.downloads - a.downloads,
    likes: (a, b) => b.likes - a.likes,
    views: (a, b) => b.views - a.views,
    az: (a, b) => a.title.localeCompare(b.title, 'vi'),
  };
  return list.sort(sorters[f.sort] || sorters.relevance);
}

function renderDocs(query) {
  docFilter = defaultFilter();
  ['q', 'subject', 'faculty', 'teacher', 'year', 'sort'].forEach((k) => query[k] && (docFilter[k] = query[k]));
  if (query.type) docFilter.types = query.type.split(',');
  if (query.format) docFilter.formats = query.format.split(',');
  const years = [...new Set(state.docs.map((d) => d.year))].sort((a, b) => b - a);

  return `<div class="page-head"><h1>Thư viện tài liệu</h1><p class="muted">Lọc theo môn học, giảng viên, loại tài liệu, năm học…</p></div>
  <div class="docs-layout">
    <aside class="filters card" id="filters">
      <div class="filter-group"><label>Từ khóa</label><input id="fq" type="search" placeholder="Tìm trong tiêu đề, mô tả, thẻ…" value="${esc(docFilter.q)}"></div>
      <div class="filter-group"><label>Khoa / Viện</label><select id="ffaculty"><option value="">Tất cả</option>${FACULTIES.map((f) => `<option ${f === docFilter.faculty ? 'selected' : ''}>${esc(f)}</option>`).join('')}</select></div>
      <div class="filter-group"><label>Môn học</label><select id="fsubject"></select></div>
      <div class="filter-group"><label>Giảng viên</label><select id="fteacher"></select></div>
      <div class="filter-group"><label>Loại tài liệu</label><div class="check-list">${DOC_TYPES.map((t) => `<label><input type="checkbox" name="ftype" value="${t}" ${docFilter.types.includes(t) ? 'checked' : ''}> ${TYPE_ICON[t]} ${t}</label>`).join('')}</div></div>
      <div class="filter-group"><label>Định dạng</label><div class="check-list row">${Object.entries(FORMATS).map(([k, f]) => `<label><input type="checkbox" name="fformat" value="${k}" ${docFilter.formats.includes(k) ? 'checked' : ''}> ${f.label}</label>`).join('')}</div></div>
      <div class="filter-group"><label>Năm học</label><select id="fyear"><option value="">Tất cả</option>${years.map((y) => `<option ${String(y) === docFilter.year ? 'selected' : ''}>${y}</option>`).join('')}</select></div>
      <button class="btn ghost full" id="fclear">Xóa bộ lọc</button>
    </aside>
    <section>
      <div class="results-bar">
        <div id="resultCount" class="muted"></div>
        <div class="sort"><label class="muted small">Sắp xếp</label>
          <select id="fsort">
            ${[['relevance', 'Liên quan nhất'], ['new', 'Mới nhất'], ['downloads', 'Tải nhiều nhất'], ['likes', 'Được thích nhất'], ['views', 'Xem nhiều nhất'], ['az', 'Tên A → Z']].map(([v, l]) => `<option value="${v}" ${v === docFilter.sort ? 'selected' : ''}>${l}</option>`).join('')}
          </select>
        </div>
      </div>
      <div id="activeFilters" class="chips"></div>
      <div id="docList" class="doc-list"></div>
    </section>
  </div>`;
}
afterRender.renderDocs = () => {
  const fillSubjects = () => {
    const opts = SUBJECTS.filter((s) => !docFilter.faculty || s.faculty === docFilter.faculty);
    if (docFilter.subject && !opts.some((s) => s.id === docFilter.subject)) docFilter.subject = '';
    $('#fsubject').innerHTML = `<option value="">Tất cả môn</option>` + opts.map((s) => `<option value="${s.id}" ${s.id === docFilter.subject ? 'selected' : ''}>${esc(s.code)} – ${esc(s.name)}</option>`).join('');
  };
  const fillTeachers = () => {
    const opts = TEACHERS.filter((t) => (!docFilter.subject || t.subjects.includes(docFilter.subject)) && (!docFilter.faculty || t.faculty === docFilter.faculty));
    if (docFilter.teacher && !opts.some((t) => t.id === docFilter.teacher)) docFilter.teacher = '';
    $('#fteacher').innerHTML = `<option value="">Tất cả giảng viên</option>` + opts.map((t) => `<option value="${t.id}" ${t.id === docFilter.teacher ? 'selected' : ''}>${esc(t.name)}</option>`).join('');
  };
  const update = () => {
    const list = filterDocs(docFilter);
    $('#resultCount').innerHTML = `Tìm thấy <b>${list.length}</b> tài liệu${docFilter.q ? ` cho “${esc(docFilter.q)}”` : ''}`;
    $('#docList').innerHTML = list.length ? list.map(docCard).join('') : emptyState('Không có tài liệu phù hợp. Thử bỏ bớt bộ lọc, hoặc gửi yêu cầu tài liệu cho cộng đồng.', '<a class="btn" href="#/requests">Gửi yêu cầu tài liệu</a>');
    const chips = [];
    if (docFilter.q) chips.push(['q', `“${docFilter.q}”`]);
    if (docFilter.faculty) chips.push(['faculty', docFilter.faculty]);
    if (docFilter.subject) chips.push(['subject', subj(docFilter.subject).name]);
    if (docFilter.teacher) chips.push(['teacher', teacher(docFilter.teacher).name]);
    docFilter.types.forEach((t) => chips.push(['types:' + t, t]));
    docFilter.formats.forEach((t) => chips.push(['formats:' + t, FORMATS[t].label]));
    if (docFilter.year) chips.push(['year', 'Năm ' + docFilter.year]);
    $('#activeFilters').innerHTML = chips.map(([k, l]) => `<button class="chip removable" data-rm="${esc(k)}">${esc(l)} ✕</button>`).join('');
    // đồng bộ URL (không kích hoạt router)
    const p = new URLSearchParams();
    ['q', 'subject', 'faculty', 'teacher', 'year'].forEach((k) => docFilter[k] && p.set(k, docFilter[k]));
    if (docFilter.sort !== 'relevance') p.set('sort', docFilter.sort);
    if (docFilter.types.length) p.set('type', docFilter.types.join(','));
    if (docFilter.formats.length) p.set('format', docFilter.formats.join(','));
    history.replaceState(null, '', '#/docs' + (p.toString() ? '?' + p : ''));
  };
  fillSubjects(); fillTeachers(); update();

  $('#fq').addEventListener('input', (e) => { docFilter.q = e.target.value; update(); });
  $('#ffaculty').addEventListener('change', (e) => { docFilter.faculty = e.target.value; fillSubjects(); fillTeachers(); update(); });
  $('#fsubject').addEventListener('change', (e) => { docFilter.subject = e.target.value; fillTeachers(); update(); });
  $('#fteacher').addEventListener('change', (e) => { docFilter.teacher = e.target.value; update(); });
  $('#fyear').addEventListener('change', (e) => { docFilter.year = e.target.value; update(); });
  $('#fsort').addEventListener('change', (e) => { docFilter.sort = e.target.value; update(); });
  $('#filters').addEventListener('change', (e) => {
    if (e.target.name === 'ftype') docFilter.types = $$('[name=ftype]:checked').map((i) => i.value);
    if (e.target.name === 'fformat') docFilter.formats = $$('[name=fformat]:checked').map((i) => i.value);
    if (e.target.name) update();
  });
  $('#fclear').addEventListener('click', () => { history.replaceState(null, '', '#/docs'); router(); });
  $('#activeFilters').addEventListener('click', (e) => {
    const k = e.target.closest('[data-rm]')?.dataset.rm;
    if (!k) return;
    if (k.includes(':')) {
      const [arr, v] = k.split(':');
      docFilter[arr] = docFilter[arr].filter((x) => x !== v);
      $$(`[name=f${arr.slice(0, -1)}][value="${v}"]`).forEach((i) => (i.checked = false));
    } else {
      docFilter[k] = '';
      const el = $('#f' + k);
      if (el) el.value = '';
      if (k === 'faculty') { fillSubjects(); fillTeachers(); }
      if (k === 'subject') fillTeachers();
    }
    update();
  });
};

/* ---------- Chi tiết tài liệu ---------- */
function renderDoc(id) {
  const d = docById(id);
  if (!d) return emptyState('Tài liệu không tồn tại hoặc đã bị xóa.', '<a class="btn" href="#/docs">Quay lại thư viện</a>');
  const s = subj(d.subjectId), t = teacher(d.teacherId);
  state.recent = [id, ...state.recent.filter((x) => x !== id)].slice(0, 12);
  store.set('recent', state.recent);

  const related = state.docs.filter((x) => x.id !== d.id)
    .map((x) => ({ x, score: (x.subjectId === d.subjectId ? 5 : 0) + (x.teacherId === d.teacherId ? 2 : 0) + (x.type === d.type ? 1 : 0) + (x.tags || []).filter((tg) => (d.tags || []).includes(tg)).length }))
    .filter((o) => o.score > 0).sort((a, b) => b.score - a.score || b.x.downloads - a.x.downloads).slice(0, 5).map((o) => o.x);
  const comments = state.comments[d.id] || [];
  const f = FORMATS[d.format] || FORMATS.pdf;
  const sReviews = reviewsFor('subject', s.id);
  const firstPage = d.text != null || !(d.fileUrl || d.dataUrl || d.file) ? buildPages(d)[0] : null;
  const isSlide = d.format === 'pptx' && d.text == null && !d.user;

  return `<nav class="crumbs"><a href="#/docs">Tài liệu</a> / <a href="#/subject/${s.id}">${esc(s.name)}</a> / <span>${esc(d.title)}</span></nav>
  <div class="detail-layout">
    <div>
      <div class="card doc-hero">
        <div class="thumb ${isSlide ? 'slide-thumb' : ''}" data-act="preview" data-id="${d.id}" title="Nhấn để xem trước">
          ${firstPage ? `<div class="page ${isSlide ? 'slide' : ''}">${firstPage}</div>` : `<div class="thumb-file" style="--c:${f.color}"><b>${f.label}</b><span>${esc(d.fileName || '')}</span></div>`}
          <div class="thumb-overlay">👁 Xem trước</div>
        </div>
        <div class="doc-info">
          <div class="chips"><span class="chip type">${TYPE_ICON[d.type]} ${esc(d.type)}</span><span class="chip" style="background:${f.color};color:#fff">${f.label}</span>${d.year ? `<span class="chip ghost">${d.year}</span>` : ''}</div>
          <h1>${esc(d.title)}</h1>
          <p class="muted">${esc(d.desc || 'Không có mô tả.')}</p>
          <dl class="kv">
            <dt>Môn học</dt><dd><a href="#/subject/${s.id}">${esc(s.code)} – ${esc(s.name)}</a></dd>
            <dt>Giảng viên</dt><dd>${t ? `<a href="#/teacher/${t.id}">${esc(t.name)}</a>` : '—'}</dd>
            <dt>Người đăng</dt><dd>${esc(d.uploader)} · ${fmtDate(d.date)}</dd>
            <dt>Số trang</dt><dd>${d.pageCount}${d.fileSize ? ' · ' + fmtSize(d.fileSize) : ''}</dd>
          </dl>
          <div class="stats big"><span>⬇ ${fmtNum(d.downloads)} lượt tải</span><span>♥ ${fmtNum(d.likes)} thích</span><span>👁 ${fmtNum(d.views)} lượt xem</span></div>
          <div class="chips">${(d.tags || []).map((tg) => `<a class="chip ghost" href="#/docs?q=${encodeURIComponent(tg)}">#${esc(tg)}</a>`).join('')}</div>
          <div class="action-row">
            <button class="btn primary" data-act="preview" data-id="${d.id}">👁 Xem trước</button>
            <button class="btn" data-act="download" data-id="${d.id}">⬇ Tải xuống</button>
            <button class="btn ${state.liked.has(d.id) ? 'on' : ''}" data-act="like" data-id="${d.id}">♥ ${state.liked.has(d.id) ? 'Đã thích' : 'Thích'}</button>
            <button class="btn ${state.saved.has(d.id) ? 'on' : ''}" data-act="save" data-id="${d.id}">🔖 ${state.saved.has(d.id) ? 'Đã lưu' : 'Lưu'}</button>
            <button class="btn ghost" data-act="share" data-id="${d.id}">🔗 Chia sẻ</button>
            <button class="btn ghost" data-act="report" data-id="${d.id}">⚑ Báo cáo</button>
          </div>
        </div>
      </div>

      <section class="section card">
        <h2>💬 Thảo luận (${comments.length})</h2>
        <div id="commentList">${comments.map(commentItem).join('') || '<p class="muted">Chưa có bình luận nào. Hãy là người đầu tiên!</p>'}</div>
        <form class="comment-form" data-comment-form data-id="${d.id}">
          <div class="avatar sm">B</div>
          <input name="text" placeholder="Đặt câu hỏi hoặc góp ý về tài liệu…" required>
          <button class="btn primary">Gửi</button>
        </form>
      </section>
    </div>

    <aside>
      <div class="card subject-mini">
        <div class="muted small">Môn học</div>
        <a href="#/subject/${s.id}" class="subject-mini-title"><span class="s-ic">${s.icon}</span><b>${esc(s.name)}</b></a>
        <div class="muted small">${esc(s.code)} · ${s.credits} tín chỉ · ${esc(s.faculty)}</div>
        <div class="mt">${stars(avg(sReviews, (r) => r.rating))} <span class="muted small">(${sReviews.length} đánh giá)</span></div>
        <a class="btn ghost full mt" href="#/subject/${s.id}">Xem review môn học →</a>
      </div>
      <div class="card">
        <h3>Tài liệu liên quan</h3>
        ${related.length ? related.map((x) => `<a class="related" href="#/doc/${x.id}"><span class="ri" style="--c:${(FORMATS[x.format] || FORMATS.pdf).color}">${TYPE_ICON[x.type]}</span><span><b>${esc(x.title)}</b><small class="muted">${esc(subj(x.subjectId).code)} · ⬇ ${fmtNum(x.downloads)}</small></span></a>`).join('') : '<p class="muted">Chưa có.</p>'}
      </div>
    </aside>
  </div>`;
}
function commentItem(c) {
  return `<div class="comment"><div class="avatar sm">${esc(c.author[0].toUpperCase())}</div><div><b>${esc(c.author)}</b> <span class="muted small">${fmtDate(c.date)}</span><p>${esc(c.text)}</p></div></div>`;
}
afterRender.renderDoc = (id) => {
  const form = $('[data-comment-form]');
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = form.text.value.trim();
    if (!text) return;
    const c = { author: ME, text, date: today() };
    (state.comments[id] ||= []).push(c);
    const mine = store.get('comments', {});
    (mine[id] ||= []).push(c);
    store.set('comments', mine);
    router();
    toast('Đã gửi bình luận');
  });
};

/* ---------- Môn học ---------- */
function subjectStats(s) {
  const list = reviewsFor('subject', s.id);
  return { list, rating: avg(list, (r) => r.rating), difficulty: avg(list, (r) => r.criteria.difficulty), docs: docsOf(s.id).length };
}

function renderSubjects(query) {
  return `<div class="page-head"><h1>Môn học</h1><p class="muted">Tra cứu review, độ khó và tài liệu của từng môn.</p></div>
  <div class="toolbar">
    <input id="sq" type="search" placeholder="Tìm theo tên hoặc mã môn…" value="${esc(query.q || '')}">
    <select id="sfac"><option value="">Tất cả khoa</option>${FACULTIES.map((f) => `<option>${esc(f)}</option>`).join('')}</select>
    <select id="ssort"><option value="rating">Đánh giá cao nhất</option><option value="docs">Nhiều tài liệu nhất</option><option value="easy">Dễ nhất</option><option value="hard">Khó nhất</option></select>
  </div>
  <div id="subjectGrid" class="card-grid"></div>`;
}
afterRender.renderSubjects = () => {
  const update = () => {
    const q = norm($('#sq').value), fac = $('#sfac').value, sort = $('#ssort').value;
    const list = SUBJECTS.map((s) => ({ s, ...subjectStats(s) }))
      .filter(({ s }) => (!q || norm(s.name + ' ' + s.code).includes(q)) && (!fac || s.faculty === fac))
      .sort((a, b) => ({ rating: b.rating - a.rating, docs: b.docs - a.docs, easy: a.difficulty - b.difficulty, hard: b.difficulty - a.difficulty }[sort]));
    $('#subjectGrid').innerHTML = list.map(({ s, list: rv, rating, difficulty, docs }) => `
      <a class="card subject-card" href="#/subject/${s.id}">
        <div class="s-top"><span class="s-ic">${s.icon}</span><span class="chip ghost">${esc(s.code)}</span></div>
        <h3>${esc(s.name)}</h3>
        <div class="muted small">${esc(s.faculty)} · ${s.credits} tín chỉ</div>
        <p class="clamp">${esc(s.desc)}</p>
        <div class="s-foot">
          <span>${stars(rating)} <small class="muted">${rv.length}</small></span>
          <span class="diff d${Math.round(difficulty)}">Độ khó ${rv.length ? difficulty.toFixed(1) : '–'}</span>
          <span class="muted small">📄 ${docs}</span>
        </div>
      </a>`).join('') || emptyState('Không tìm thấy môn học.');
  };
  ['sq', 'sfac', 'ssort'].forEach((id) => $('#' + id).addEventListener('input', update));
  update();
};

function renderSubject(id, query) {
  const s = subj(id);
  if (!s) return emptyState('Không tìm thấy môn học.');
  const list = reviewsFor('subject', id).sort((a, b) => b.date.localeCompare(a.date));
  const docs = docsOf(id).sort((a, b) => b.downloads - a.downloads);
  const teachers = TEACHERS.filter((t) => t.subjects.includes(id));
  const tab = query.tab || 'docs';
  const typeCounts = DOC_TYPES.map((t) => [t, docs.filter((d) => d.type === t).length]).filter(([, c]) => c);

  return `<nav class="crumbs"><a href="#/subjects">Môn học</a> / <span>${esc(s.name)}</span></nav>
  <div class="profile-head card">
    <div class="big-ic">${s.icon}</div>
    <div class="grow">
      <div class="chips"><span class="chip">${esc(s.code)}</span><span class="chip ghost">${s.credits} tín chỉ</span><span class="chip ghost">${esc(s.faculty)}</span></div>
      <h1>${esc(s.name)}</h1>
      <p class="muted">${esc(s.desc)}</p>
      <div class="chips">${topTags(list).map(([t, c]) => `<span class="chip tag">${esc(t)} · ${c}</span>`).join('')}</div>
    </div>
    <div class="profile-actions">
      <a class="btn primary" href="#/upload?subject=${s.id}">＋ Tải tài liệu môn này</a>
      <a class="btn" href="#/subject/${s.id}?tab=reviews#write">✍ Viết review</a>
    </div>
  </div>

  ${ratingSummary(list, SUBJECT_CRIT)}

  <div class="tabs">
    <a href="#/subject/${s.id}?tab=docs" class="${tab === 'docs' ? 'active' : ''}">📄 Tài liệu (${docs.length})</a>
    <a href="#/subject/${s.id}?tab=reviews" class="${tab === 'reviews' ? 'active' : ''}">💬 Review (${list.length})</a>
    <a href="#/subject/${s.id}?tab=teachers" class="${tab === 'teachers' ? 'active' : ''}">👩‍🏫 Giảng viên (${teachers.length})</a>
    <a href="#/subject/${s.id}?tab=syllabus" class="${tab === 'syllabus' ? 'active' : ''}">🧭 Nội dung môn</a>
  </div>

  ${tab === 'docs' ? `
    <div class="chips type-filter" id="typeFilter"><button class="chip active" data-type="">Tất cả</button>${typeCounts.map(([t, c]) => `<button class="chip" data-type="${t}">${TYPE_ICON[t]} ${t} (${c})</button>`).join('')}</div>
    <div class="doc-list" id="subjectDocs">${docs.map(docCard).join('') || emptyState('Chưa có tài liệu cho môn này.', `<a class="btn primary" href="#/upload?subject=${s.id}">Trở thành người đầu tiên chia sẻ</a>`)}</div>` : ''}

  ${tab === 'reviews' ? `<div class="reviews-layout"><div>${list.map(reviewItem).join('') || emptyState('Chưa có review.')}</div><div id="write">${reviewForm('subject', id)}</div></div>` : ''}

  ${tab === 'teachers' ? `<div class="card-grid">${teachers.map((t) => teacherCard(t, id)).join('')}</div>` : ''}

  ${tab === 'syllabus' ? `<div class="card syllabus">${s.topics.map((x, i) => `<div class="syl-item"><div class="syl-num">${i + 1}</div><div><h3>${esc(x.t)}</h3><p class="muted">${esc(x.p)}</p><a class="small" href="#/docs?subject=${s.id}&q=${encodeURIComponent(x.t.split(' ')[0])}">Tìm tài liệu chủ đề này →</a></div></div>`).join('')}</div>` : ''}`;
}
afterRender.renderSubject = (id) => {
  $('#typeFilter')?.addEventListener('click', (e) => {
    const b = e.target.closest('[data-type]');
    if (!b) return;
    $$('#typeFilter .chip').forEach((c) => c.classList.toggle('active', c === b));
    const docs = docsOf(id).filter((d) => !b.dataset.type || d.type === b.dataset.type).sort((a, b2) => b2.downloads - a.downloads);
    $('#subjectDocs').innerHTML = docs.map(docCard).join('');
  });
  if (location.hash.endsWith('#write')) setTimeout(() => $('#write')?.scrollIntoView({ behavior: 'smooth' }), 50);
};

/* ---------- Giảng viên ---------- */
function teacherCard(t, onlySubject) {
  let list = reviewsFor('teacher', t.id);
  if (onlySubject) list = list.filter((r) => r.subjectId === onlySubject);
  const a = avg(list, (r) => r.rating);
  const retake = list.length ? Math.round((list.filter((r) => r.rating >= 4).length / list.length) * 100) : null;
  return `<a class="card teacher-card" href="#/teacher/${t.id}">
    <div class="t-top"><div class="avatar lg">${initials(t.name)}</div><div><h3>${esc(t.name)}</h3><div class="muted small">${esc(t.faculty)}</div></div></div>
    <div class="t-rate"><b>${list.length ? a.toFixed(1) : '–'}</b>${stars(a)}<span class="muted small">${list.length} đánh giá</span></div>
    ${retake != null ? `<div class="small"><b>${retake}%</b> <span class="muted">sẽ học lại</span></div>` : ''}
    <div class="chips">${t.subjects.map((s) => `<span class="chip ghost">${esc(subj(s).code)}</span>`).join('')}</div>
    <div class="chips">${topTags(list, 3).map(([tg]) => `<span class="chip tag">${esc(tg)}</span>`).join('')}</div>
  </a>`;
}

function renderTeachers(query) {
  return `<div class="page-head"><h1>Giảng viên</h1><p class="muted">Review ẩn danh từ sinh viên đã học – giúp bạn chọn lớp phù hợp.</p></div>
  <div class="toolbar">
    <input id="tq" type="search" placeholder="Tìm tên giảng viên…" value="${esc(query.q || '')}">
    <select id="tfac"><option value="">Tất cả khoa</option>${FACULTIES.map((f) => `<option>${esc(f)}</option>`).join('')}</select>
    <select id="tsub"><option value="">Tất cả môn</option>${SUBJECTS.map((s) => `<option value="${s.id}">${esc(s.name)}</option>`).join('')}</select>
    <select id="tsort"><option value="rating">Đánh giá cao nhất</option><option value="count">Nhiều đánh giá nhất</option><option value="lenient">Chấm thoáng nhất</option><option value="clear">Dễ hiểu nhất</option></select>
  </div>
  <div id="teacherGrid" class="card-grid"></div>`;
}
afterRender.renderTeachers = () => {
  const update = () => {
    const q = norm($('#tq').value), fac = $('#tfac').value, sub = $('#tsub').value, sort = $('#tsort').value;
    const m = (t, f) => avg(reviewsFor('teacher', t.id), f);
    const list = TEACHERS.filter((t) => (!q || norm(t.name).includes(q)) && (!fac || t.faculty === fac) && (!sub || t.subjects.includes(sub)))
      .sort((a, b) => ({
        rating: m(b, (r) => r.rating) - m(a, (r) => r.rating),
        count: reviewsFor('teacher', b.id).length - reviewsFor('teacher', a.id).length,
        lenient: m(b, (r) => r.criteria.leniency) - m(a, (r) => r.criteria.leniency),
        clear: m(b, (r) => r.criteria.clarity) - m(a, (r) => r.criteria.clarity),
      }[sort]));
    $('#teacherGrid').innerHTML = list.map((t) => teacherCard(t)).join('') || emptyState('Không tìm thấy giảng viên.');
  };
  ['tq', 'tfac', 'tsub', 'tsort'].forEach((id) => $('#' + id).addEventListener('input', update));
  update();
};

function renderTeacher(id) {
  const t = teacher(id);
  if (!t) return emptyState('Không tìm thấy giảng viên.');
  const list = reviewsFor('teacher', id).sort((a, b) => b.helpful - a.helpful);
  const docs = state.docs.filter((d) => d.teacherId === id).sort((a, b) => b.downloads - a.downloads);
  const retake = list.length ? Math.round((list.filter((r) => r.rating >= 4).length / list.length) * 100) : 0;

  return `<nav class="crumbs"><a href="#/teachers">Giảng viên</a> / <span>${esc(t.name)}</span></nav>
  <div class="profile-head card">
    <div class="avatar xl">${initials(t.name)}</div>
    <div class="grow">
      <h1>${esc(t.name)}</h1>
      <div class="muted">${esc(t.faculty)}</div>
      <p>${esc(t.bio)}</p>
      <div class="chips">${t.subjects.map((s) => `<a class="chip" href="#/subject/${s}">${esc(subj(s).name)}</a>`).join('')}</div>
    </div>
    <div class="profile-kpis">
      <div><b>${retake}%</b><span>sẽ học lại</span></div>
      <div><b>${docs.length}</b><span>tài liệu</span></div>
    </div>
  </div>
  ${ratingSummary(list, TEACHER_CRIT)}
  <div class="chips">${topTags(list, 6).map(([tg, c]) => `<span class="chip tag">${esc(tg)} · ${c}</span>`).join('')}</div>

  <div class="reviews-layout">
    <div>
      <div class="section-head"><h2>Review (${list.length})</h2>
        <select id="rvSubject"><option value="">Mọi môn</option>${t.subjects.map((s) => `<option value="${s}">${esc(subj(s).name)}</option>`).join('')}</select>
      </div>
      <div id="reviewList">${list.map(reviewItem).join('') || emptyState('Chưa có review.')}</div>
      ${docs.length ? `<div class="section"><h2>Tài liệu từ lớp của ${esc(t.name)}</h2><div class="doc-list">${docs.map(docCard).join('')}</div></div>` : ''}
    </div>
    <div>${reviewForm('teacher', id)}</div>
  </div>`;
}
afterRender.renderTeacher = (id) => {
  $('#rvSubject')?.addEventListener('change', (e) => {
    const list = reviewsFor('teacher', id).filter((r) => !e.target.value || r.subjectId === e.target.value).sort((a, b) => b.helpful - a.helpful);
    $('#reviewList').innerHTML = list.map(reviewItem).join('') || emptyState('Chưa có review cho môn này.');
  });
};

/* ---------- Upload ---------- */
let pendingFile = null;
function renderUpload(query) {
  pendingFile = null;
  const pre = query.subject || '';
  return `<div class="page-head"><h1>Tải tài liệu lên</h1><p class="muted">Chia sẻ tài liệu để giúp các bạn khác – mỗi tài liệu được duyệt sẽ nhận +10 điểm đóng góp.</p></div>
  <form class="upload-layout" id="uploadForm">
    <div class="card">
      <label class="dropzone" id="dropzone">
        <input type="file" id="fileInput" hidden accept=".pdf,.doc,.docx,.ppt,.pptx,.png,.jpg,.jpeg,.webp,.txt,.md">
        <div class="dz-ic">⬆</div>
        <b>Kéo thả tệp vào đây hoặc nhấn để chọn</b>
        <span class="muted small">PDF, DOCX, PPTX, ảnh, TXT · tối đa 50 MB</span>
      </label>
      <div id="filePreview"></div>
    </div>
    <div class="card">
      <div class="form-row"><label>Tiêu đề *</label><input name="title" required placeholder="VD: Đề thi cuối kỳ Giải tích 1 năm 2025 có đáp án"></div>
      <div class="form-grid">
        <div class="form-row"><label>Môn học *</label><select name="subjectId" id="upSubject" required><option value="">— Chọn môn —</option>${SUBJECTS.map((s) => `<option value="${s.id}" ${s.id === pre ? 'selected' : ''}>${esc(s.code)} – ${esc(s.name)}</option>`).join('')}</select></div>
        <div class="form-row"><label>Giảng viên</label><select name="teacherId" id="upTeacher"><option value="">— Không rõ —</option></select></div>
        <div class="form-row"><label>Loại tài liệu *</label><select name="type" required>${DOC_TYPES.map((t) => `<option>${t}</option>`).join('')}</select></div>
        <div class="form-row"><label>Năm học</label><select name="year">${[2026, 2025, 2024, 2023, 2022].map((y) => `<option ${y === 2025 ? 'selected' : ''}>${y}</option>`).join('')}</select></div>
      </div>
      <div class="form-row"><label>Mô tả</label><textarea name="desc" rows="3" placeholder="Tài liệu gồm những gì, phù hợp cho ai…"></textarea></div>
      <div class="form-row"><label>Thẻ (phân cách bằng dấu phẩy)</label><input name="tags" placeholder="đề thi, đáp án, chương 3"></div>
      <label class="check"><input type="checkbox" required> Tôi xác nhận tài liệu không vi phạm bản quyền và quy định của trường.</label>
      <div id="dupWarn"></div>
      <button class="btn primary full">Đăng tài liệu</button>
    </div>
  </form>`;
}
afterRender.renderUpload = () => {
  const form = $('#uploadForm');
  const fillTeachers = () => {
    const sid = $('#upSubject').value;
    $('#upTeacher').innerHTML = '<option value="">— Không rõ —</option>' + TEACHERS.filter((t) => !sid || t.subjects.includes(sid)).map((t) => `<option value="${t.id}">${esc(t.name)}</option>`).join('');
  };
  // gợi ý trùng lặp: tài liệu có tiêu đề gần giống trong cùng môn
  const checkDup = () => {
    const title = norm(form.title.value), sid = form.subjectId.value;
    const words = title.split(/\s+/).filter((w) => w.length > 2);
    const dup = words.length < 2 ? [] : state.docs.filter((d) => (!sid || d.subjectId === sid) && words.filter((w) => norm(d.title).includes(w)).length >= Math.ceil(words.length * 0.6)).slice(0, 3);
    $('#dupWarn').innerHTML = dup.length ? `<div class="notice">⚠ Có thể đã có tài liệu tương tự: ${dup.map((d) => `<a href="#/doc/${d.id}" target="_blank">${esc(d.title)}</a>`).join(', ')}</div>` : '';
  };
  $('#upSubject').addEventListener('change', () => { fillTeachers(); checkDup(); });
  form.title.addEventListener('input', checkDup);
  fillTeachers();

  const dz = $('#dropzone'), input = $('#fileInput');
  const setFile = (file) => {
    if (!file) return;
    if (file.size > 50 * 1048576) return toast('Tệp vượt quá 50 MB');
    pendingFile = file;
    const ext = file.name.split('.').pop().toLowerCase();
    const url = URL.createObjectURL(file);
    let pv = '';
    if (ext === 'pdf') pv = `<iframe src="${url}" class="file-frame"></iframe>`;
    else if (file.type.startsWith('image/')) pv = `<img src="${url}" class="file-img" alt="">`;
    $('#filePreview').innerHTML = `<div class="file-chip"><span class="fl" style="--c:${FORMATS[extToFormat(ext)].color}">${FORMATS[extToFormat(ext)].label}</span><div class="grow"><b>${esc(file.name)}</b><div class="muted small">${fmtSize(file.size)}</div></div><button type="button" class="link-btn" id="rmFile">Xóa</button></div>${pv}`;
    $('#rmFile').onclick = () => { pendingFile = null; $('#filePreview').innerHTML = ''; input.value = ''; };
    if (!form.title.value) form.title.value = file.name.replace(/\.[^.]+$/, '').replace(/[_-]+/g, ' ');
    checkDup();
  };
  input.addEventListener('change', () => setFile(input.files[0]));
  ['dragenter', 'dragover'].forEach((ev) => dz.addEventListener(ev, (e) => { e.preventDefault(); dz.classList.add('over'); }));
  ['dragleave', 'drop'].forEach((ev) => dz.addEventListener(ev, (e) => { e.preventDefault(); dz.classList.remove('over'); }));
  dz.addEventListener('drop', (e) => setFile(e.dataTransfer.files[0]));

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!pendingFile) return toast('Vui lòng chọn tệp để tải lên');
    const fd = new FormData(form);
    const ext = pendingFile.name.split('.').pop().toLowerCase();
    const d = {
      id: 'u' + Date.now(), title: fd.get('title').trim(), subjectId: fd.get('subjectId'), teacherId: fd.get('teacherId') || null,
      type: fd.get('type'), format: extToFormat(ext), year: +fd.get('year'), uploader: ME, date: today(),
      downloads: 0, likes: 0, views: 0, desc: fd.get('desc').trim(),
      tags: fd.get('tags').split(',').map((x) => x.trim()).filter(Boolean),
      user: true, file: true, fileName: pendingFile.name, fileSize: pendingFile.size, mime: pendingFile.type, pageCount: 1,
    };
    if (d.format === 'txt') { d.text = (await pendingFile.text()).slice(0, 60000); delete d.file; }
    else if (pendingFile.size < 1.5 * 1048576 && (d.format === 'pdf' || d.format === 'img')) d.dataUrl = await readDataUrl(pendingFile);
    state.blobs[d.id] = URL.createObjectURL(pendingFile);
    if (d.text != null) d.pageCount = buildPages(d).length;
    state.docs.unshift(d);
    persistUserDocs();
    toast('🎉 Tải lên thành công! +10 điểm đóng góp');
    location.hash = '#/doc/' + d.id;
  });
};
function extToFormat(ext) {
  if (ext === 'pdf') return 'pdf';
  if (['doc', 'docx'].includes(ext)) return 'docx';
  if (['ppt', 'pptx'].includes(ext)) return 'pptx';
  if (['png', 'jpg', 'jpeg', 'gif', 'webp'].includes(ext)) return 'img';
  if (['txt', 'md'].includes(ext)) return 'txt';
  return 'pdf';
}
const readDataUrl = (f) => new Promise((res) => { const r = new FileReader(); r.onload = () => res(r.result); r.readAsDataURL(f); });
function persistUserDocs() {
  const mine = state.docs.filter((d) => d.user).map((d) => ({ ...d, views: d.views - (state.stats[d.id]?.v || 0), downloads: d.downloads - (state.stats[d.id]?.d || 0), likes: d.likes - (state.stats[d.id]?.l || 0) }));
  if (!store.set('userDocs', mine)) {
    // hết dung lượng localStorage -> bỏ nội dung tệp, chỉ giữ thông tin
    store.set('userDocs', mine.map(({ dataUrl, ...rest }) => rest));
    toast('Bộ nhớ trình duyệt đầy: tệp chỉ xem được trong phiên này');
  }
}

/* ---------- Đã lưu ---------- */
function renderSaved() {
  const saved = [...state.saved].map(docById).filter(Boolean);
  const recent = state.recent.map(docById).filter(Boolean);
  const mine = state.docs.filter((d) => d.user);
  return `<div class="page-head"><h1>Thư viện của bạn</h1></div>
  <section class="section"><div class="section-head"><h2>🔖 Đã lưu (${saved.length})</h2></div>
    <div class="doc-list">${saved.map(docCard).join('') || emptyState('Bạn chưa lưu tài liệu nào. Nhấn 📑 trên tài liệu để lưu lại.')}</div></section>
  <section class="section"><div class="section-head"><h2>⬆ Tài liệu bạn đã đăng (${mine.length})</h2><a href="#/upload">＋ Tải lên</a></div>
    <div class="doc-list">${mine.map(docCard).join('') || emptyState('Bạn chưa đăng tài liệu nào.')}</div></section>
  <section class="section"><div class="section-head"><h2>🕘 Xem gần đây</h2></div>
    <div class="doc-list">${recent.map(docCard).join('') || emptyState('Chưa có lịch sử xem.')}</div></section>`;
}

/* ---------- Bảng xếp hạng ---------- */
function renderLeaderboard() {
  const by = {};
  state.docs.forEach((d) => {
    const u = (by[d.uploader] ||= { name: d.uploader, docs: 0, downloads: 0, likes: 0, subjects: new Set() });
    u.docs++; u.downloads += d.downloads; u.likes += d.likes; u.subjects.add(d.subjectId);
  });
  const rows = Object.values(by).map((u) => ({ ...u, points: u.docs * 10 + u.likes * 2 + Math.round(u.downloads / 10) })).sort((a, b) => b.points - a.points);
  const badge = (u) => [u.docs >= 4 && '📚 Thủ thư', u.likes >= 500 && '❤ Được yêu thích', u.downloads >= 3000 && '🚀 Lan tỏa', u.subjects.size >= 3 && '🌈 Đa môn'].filter(Boolean);
  const medal = ['🥇', '🥈', '🥉'];
  return `<div class="page-head"><h1>Bảng xếp hạng đóng góp</h1><p class="muted">Điểm = 10 × tài liệu + 2 × lượt thích + lượt tải / 10</p></div>
  <div class="podium">${rows.slice(0, 3).map((u, i) => `<div class="card podium-item p${i + 1}"><div class="medal">${medal[i]}</div><div class="avatar lg">${esc(u.name[0].toUpperCase())}</div><b>${esc(u.name)}</b><div class="pts">${u.points} điểm</div></div>`).join('')}</div>
  <div class="card table-wrap"><table class="table">
    <thead><tr><th>#</th><th>Thành viên</th><th>Tài liệu</th><th>Lượt tải</th><th>Lượt thích</th><th>Huy hiệu</th><th>Điểm</th></tr></thead>
    <tbody>${rows.map((u, i) => `<tr class="${u.name === ME ? 'me' : ''}"><td>${medal[i] || i + 1}</td><td><b>${esc(u.name)}</b></td><td>${u.docs}</td><td>${fmtNum(u.downloads)}</td><td>${fmtNum(u.likes)}</td><td>${badge(u).map((b) => `<span class="chip tag">${b}</span>`).join(' ')}</td><td><b>${u.points}</b></td></tr>`).join('')}</tbody>
  </table></div>`;
}

/* ---------- Yêu cầu tài liệu ---------- */
function renderRequests() {
  const list = [...state.requests].sort((a, b) => a.done - b.done || b.votes - a.votes);
  return `<div class="page-head"><h1>Yêu cầu tài liệu</h1><p class="muted">Không tìm thấy tài liệu cần? Đăng yêu cầu – cộng đồng sẽ giúp bạn. Bình chọn để đẩy yêu cầu lên đầu.</p></div>
  <div class="reviews-layout">
    <div>${list.map((r) => {
      const s = subj(r.subjectId), v = state.voted.has(r.id);
      return `<div class="card request ${r.done ? 'done' : ''}">
        <button class="vote ${v ? 'on' : ''}" data-act="vote" data-id="${r.id}" ${r.done ? 'disabled' : ''}>▲<b>${r.votes + (v ? 1 : 0)}</b></button>
        <div class="grow"><b>${esc(r.text)}</b><div class="muted small"><a href="#/subject/${s.id}">${esc(s.name)}</a> · ${esc(r.author)} · ${fmtDate(r.date)}</div></div>
        ${r.done ? '<span class="chip ok">✓ Đã có</span>' : `<a class="btn sm" href="#/upload?subject=${s.id}">Đáp ứng</a>`}
      </div>`;
    }).join('')}</div>
    <form class="card" id="reqForm">
      <h3>Đăng yêu cầu mới</h3>
      <div class="form-row"><label>Môn học</label><select name="subjectId">${SUBJECTS.map((s) => `<option value="${s.id}">${esc(s.name)}</option>`).join('')}</select></div>
      <div class="form-row"><label>Bạn cần tài liệu gì?</label><textarea name="text" rows="3" required placeholder="VD: Đề thi cuối kỳ 2025 của thầy/cô…"></textarea></div>
      <button class="btn primary full">Đăng yêu cầu</button>
    </form>
  </div>`;
}
afterRender.renderRequests = () => {
  $('#reqForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const f = e.target;
    state.requests.unshift({ id: 'q' + Date.now(), subjectId: f.subjectId.value, text: f.text.value.trim(), author: ME, date: today(), votes: 0, done: false });
    store.set('requests', state.requests);
    toast('Đã đăng yêu cầu');
    router();
  });
};

/* ---------- Trình đọc xem trước ---------- */
const reader = { doc: null, zoom: 1, page: 0, total: 0, obs: null };

function openReader(doc) {
  bumpStat(doc, 'v');
  reader.doc = doc; reader.zoom = window.innerWidth < 700 ? 0.6 : 1; reader.page = 0;
  const el = $('#reader');
  const src = state.blobs[doc.id] || doc.dataUrl;
  let body, thumbs = '';
  const isSlide = doc.format === 'pptx' && !doc.file && doc.text == null;

  if (doc.file) {
    reader.total = 1;
    if (src && doc.format === 'pdf') body = `<iframe class="reader-frame" src="${src}"></iframe>`;
    else if (src && doc.format === 'img') body = `<div class="reader-pages"><img class="reader-img" src="${src}" alt=""></div>`;
    else body = `<div class="reader-pages"><div class="page"><div class="pg-cover"><div class="pg-cover-mid"><div class="pg-kicker">${(FORMATS[doc.format] || FORMATS.pdf).label}</div><h1>${esc(doc.title)}</h1>
      <p>${src ? 'Định dạng này cần được chuyển đổi sang PDF trên máy chủ để xem trước.' : 'Tệp gốc chỉ được giữ trong phiên tải lên (bản demo không có máy chủ lưu trữ).'}</p>
      <p class="muted">${esc(doc.fileName)} · ${fmtSize(doc.fileSize || 0)}</p></div></div></div></div>`;
  } else {
    const pages = buildPages(doc);
    reader.total = pages.length;
    const LIMIT = 6; // giới hạn xem trước: trang sau bị làm mờ
    body = `<div class="reader-pages" id="readerPages">${pages.map((p, i) => `<div class="page ${isSlide ? 'slide' : ''} ${i >= LIMIT ? 'locked' : ''}" data-page="${i}">${p}${i >= LIMIT ? `<div class="lock-mask"><b>Đã hết phần xem trước</b><button class="btn primary" data-act="download" data-id="${doc.id}">⬇ Tải xuống để đọc toàn bộ</button></div>` : ''}</div>`).join('')}</div>`;
    thumbs = `<div class="reader-thumbs" id="readerThumbs">${pages.map((p, i) => `<button class="rt" data-goto="${i}"><div class="rt-page ${isSlide ? 'slide' : ''}"><div class="page ${isSlide ? 'slide' : ''}">${p}</div></div><span>${i + 1}</span></button>`).join('')}</div>`;
  }

  el.innerHTML = `<div class="reader-bar">
      <button class="icon-btn" data-reader="close" title="Đóng (Esc)">✕</button>
      <div class="reader-title"><b>${esc(doc.title)}</b><span class="muted small">${esc(subj(doc.subjectId).name)}</span></div>
      <div class="reader-ctrl">
        ${doc.file ? '' : `<button class="icon-btn" data-reader="prev" title="Trang trước (←)">‹</button>
        <span id="readerPage">1 / ${reader.total}</span>
        <button class="icon-btn" data-reader="next" title="Trang sau (→)">›</button>
        <span class="sep"></span>
        <button class="icon-btn" data-reader="zoomout" title="Thu nhỏ">−</button>
        <span id="readerZoom">${Math.round(reader.zoom * 100)}%</span>
        <button class="icon-btn" data-reader="zoomin" title="Phóng to">＋</button>
        <input id="readerFind" type="search" placeholder="Tìm trong tài liệu…">`}
        <button class="btn sm primary" data-act="download" data-id="${doc.id}">⬇ Tải</button>
      </div>
    </div>
    <div class="reader-main">${thumbs}${body}</div>`;
  el.hidden = false;
  document.body.style.overflow = 'hidden';
  applyZoom();

  const pagesEl = $('#readerPages');
  if (pagesEl && !doc.file) {
    reader.obs?.disconnect();
    reader.obs = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) setReaderPage(+en.target.dataset.page, false); });
    }, { root: pagesEl, threshold: 0.55 });
    $$('.page', pagesEl).forEach((p) => reader.obs.observe(p));
    $('#readerFind').addEventListener('input', (e) => findInReader(e.target.value));
  }
}
function setReaderPage(i, scroll = true) {
  i = Math.max(0, Math.min(reader.total - 1, i));
  reader.page = i;
  const lbl = $('#readerPage');
  if (lbl) lbl.textContent = `${i + 1} / ${reader.total}`;
  $$('#readerThumbs .rt').forEach((b, k) => b.classList.toggle('active', k === i));
  $(`#readerThumbs .rt[data-goto="${i}"]`)?.scrollIntoView({ block: 'nearest' });
  if (scroll) $(`#readerPages .page[data-page="${i}"]`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
function applyZoom() {
  $('#readerPages')?.style.setProperty('--z', reader.zoom);
  const z = $('#readerZoom');
  if (z) z.textContent = Math.round(reader.zoom * 100) + '%';
}
function findInReader(q) {
  const root = $('#readerPages');
  $$('mark.hl', root).forEach((m) => m.replaceWith(m.textContent));
  root.normalize();
  if (q.trim().length < 2) return;
  const nq = norm(q);
  let first = null;
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);
  nodes.forEach((n) => {
    const idx = norm(n.textContent).indexOf(nq);
    if (idx < 0 || n.parentElement.closest('.lock-mask')) return;
    const r = document.createRange();
    r.setStart(n, idx); r.setEnd(n, Math.min(n.length, idx + nq.length));
    const mark = document.createElement('mark');
    mark.className = 'hl';
    r.surroundContents(mark);
    first ||= mark;
  });
  first?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  toast(first ? `Đã tìm thấy kết quả cho “${q}”` : 'Không tìm thấy');
}
function closeReader() {
  $('#reader').hidden = true;
  $('#reader').innerHTML = '';
  document.body.style.overflow = '';
  reader.obs?.disconnect();
  if (location.hash.startsWith('#/doc/')) refreshInPlace(); // cập nhật lượt xem
}

/* ---------- Tải xuống (giả lập) ---------- */
function downloadDoc(doc) {
  bumpStat(doc, 'd');
  const a = document.createElement('a');
  const src = state.blobs[doc.id] || doc.dataUrl;
  if (src) { a.href = src; a.download = doc.fileName || doc.title; }
  else if (doc.text != null) { a.href = URL.createObjectURL(new Blob([doc.text], { type: 'text/plain' })); a.download = doc.fileName || doc.title + '.txt'; }
  else {
    const html = `<!doctype html><meta charset="utf-8"><title>${esc(doc.title)}</title><style>body{font-family:serif;max-width:800px;margin:auto;padding:40px;line-height:1.6}pre{background:#f4f4f5;padding:12px;border-radius:6px}.page,.slide-inner{border-bottom:1px dashed #ccc;padding:30px 0}</style>
      <p><i>Bản tải xuống mô phỏng từ StudyShare (prototype).</i></p>${buildPages(doc).map((p) => `<div class="page">${p}</div>`).join('')}`;
    a.href = URL.createObjectURL(new Blob([html], { type: 'text/html' }));
    a.download = doc.title.replace(/[\\/:*?"<>|]/g, '') + '.html';
  }
  a.click();
  toast('Đang tải xuống…');
}

/* ---------- Toast & sự kiện toàn cục ---------- */
let toastTimer;
function toast(msg) {
  const t = $('#toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 2400);
}

document.addEventListener('click', (e) => {
  const act = e.target.closest('[data-act]');
  if (act) {
    e.preventDefault();
    const id = act.dataset.id;
    const d = docById(id);
    switch (act.dataset.act) {
      case 'preview': return openReader(d);
      case 'download': return downloadDoc(d);
      case 'save':
        state.saved.has(id) ? state.saved.delete(id) : state.saved.add(id);
        saveSet('saved');
        toast(state.saved.has(id) ? 'Đã lưu vào thư viện của bạn' : 'Đã bỏ lưu');
        return refreshInPlace();
      case 'like':
        if (state.liked.has(id)) { state.liked.delete(id); bumpStat(d, 'l', -1); } else { state.liked.add(id); bumpStat(d, 'l'); }
        saveSet('liked');
        return refreshInPlace();
      case 'helpful':
        state.helpful.has(id) ? state.helpful.delete(id) : state.helpful.add(id);
        saveSet('helpful');
        act.classList.toggle('on');
        act.textContent = `👍 Hữu ích (${state.reviews.find((r) => r.id === id).helpful + (state.helpful.has(id) ? 1 : 0)})`;
        return;
      case 'vote':
        state.voted.has(id) ? state.voted.delete(id) : state.voted.add(id);
        saveSet('voted');
        return router();
      case 'share':
        navigator.clipboard?.writeText(location.href).catch(() => {});
        return toast('Đã sao chép liên kết tài liệu');
      case 'report':
        return openModal(`<h3>Báo cáo tài liệu</h3><p class="muted">${esc(d.title)}</p>
          <div class="check-list">${['Vi phạm bản quyền', 'Nội dung sai / chất lượng kém', 'Trùng lặp', 'Spam / quảng cáo', 'Khác'].map((r, i) => `<label><input type="radio" name="reason" ${i ? '' : 'checked'}> ${r}</label>`).join('')}</div>
          <div class="modal-actions"><button class="btn ghost" data-modal-close>Hủy</button><button class="btn primary" data-modal-close data-toast="Cảm ơn! Báo cáo đã được gửi tới quản trị viên.">Gửi báo cáo</button></div>`);
    }
  }
  const go = e.target.closest('[data-goto]');
  if (go) return setReaderPage(+go.dataset.goto);
  const r = e.target.closest('[data-reader]');
  if (r) {
    const a = r.dataset.reader;
    if (a === 'close') closeReader();
    if (a === 'prev') setReaderPage(reader.page - 1);
    if (a === 'next') setReaderPage(reader.page + 1);
    if (a === 'zoomin') { reader.zoom = Math.min(2, +(reader.zoom + 0.1).toFixed(1)); applyZoom(); }
    if (a === 'zoomout') { reader.zoom = Math.max(0.4, +(reader.zoom - 0.1).toFixed(1)); applyZoom(); }
    return;
  }
  const mc = e.target.closest('[data-modal-close]');
  if (mc) { if (mc.dataset.toast) toast(mc.dataset.toast); return closeModal(); }
  if (e.target.id === 'modal') return closeModal();
  // click cả thẻ tài liệu
  const card = e.target.closest('.doc-card');
  if (card && !e.target.closest('a,button')) location.hash = card.dataset.href;
  // đánh giá sao
  const st = e.target.closest('[data-star]');
  if (st) {
    const wrap = st.closest('[data-star-input]'), n = +st.dataset.star;
    wrap.querySelector('input').value = n;
    $$('[data-star]', wrap).forEach((b) => b.classList.toggle('on', +b.dataset.star <= n));
    wrap.querySelector('[data-star-label]').textContent = ['', 'Rất tệ', 'Chưa tốt', 'Bình thường', 'Tốt', 'Tuyệt vời'][n];
  }
});

document.addEventListener('input', (e) => {
  const rg = e.target.closest('[data-range]');
  if (rg) rg.closest('form').querySelector(`[data-out="${rg.dataset.range}"]`).textContent = rg.value;
});

document.addEventListener('submit', (e) => {
  const f = e.target.closest('[data-review-form]');
  if (!f) return;
  e.preventDefault();
  const fd = new FormData(f);
  const rating = +fd.get('rating');
  if (!rating) return toast('Vui lòng chọn số sao');
  const type = f.dataset.type, id = f.dataset.id;
  const c = type === 'teacher' ? [fd.get('clarity'), fd.get('enthusiasm'), fd.get('leniency')] : [fd.get('difficulty'), fd.get('workload'), fd.get('usefulness')];
  const r = mkReview('ur' + Date.now(), type, id, type === 'teacher' ? fd.get('subjectId') : null, rating, c.map(Number), fd.getAll('tags'),
    fd.get('text').trim(), fd.get('author').trim() || 'Ẩn danh', fd.get('semester'), today(), 0);
  state.reviews.unshift(r);
  store.set('userReviews', state.reviews.filter((x) => x.id.startsWith('ur')));
  toast('Cảm ơn bạn đã đánh giá!');
  router();
});

function refreshInPlace() {
  const y = window.scrollY;
  if (location.hash.startsWith('#/docs')) { $('#fsort')?.dispatchEvent(new Event('change')); return; }
  router();
  window.scrollTo(0, y);
}

function openModal(html) { const m = $('#modal'); m.innerHTML = `<div class="modal-box">${html}</div>`; m.hidden = false; }
function closeModal() { $('#modal').hidden = true; }

document.addEventListener('keydown', (e) => {
  if (!$('#reader').hidden) {
    if (e.key === 'Escape') closeReader();
    if (document.activeElement?.id === 'readerFind') return;
    if (e.key === 'ArrowRight') setReaderPage(reader.page + 1);
    if (e.key === 'ArrowLeft') setReaderPage(reader.page - 1);
    return;
  }
  if (e.key === 'Escape') { closeModal(); hideDrop(); }
  if (e.key === '/' && !['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) { e.preventDefault(); $('#globalSearch').focus(); }
});

/* ---------- Tìm kiếm nhanh toàn cục ---------- */
const gs = $('#globalSearch'), drop = $('#searchDrop');
function hideDrop() { drop.hidden = true; }
gs.addEventListener('input', () => {
  const q = norm(gs.value.trim());
  if (!q) return hideDrop();
  const words = q.split(/\s+/);
  const match = (txt) => words.every((w) => norm(txt).includes(w));
  const docs = state.docs.filter((d) => match(d.title + ' ' + (d.tags || []).join(' ') + ' ' + subj(d.subjectId).name)).sort((a, b) => b.downloads - a.downloads).slice(0, 5);
  const subs = SUBJECTS.filter((s) => match(s.name + ' ' + s.code)).slice(0, 3);
  const ts = TEACHERS.filter((t) => match(t.name)).slice(0, 3);
  drop.innerHTML = (subs.length ? `<div class="sd-group">Môn học</div>${subs.map((s) => `<a href="#/subject/${s.id}">${s.icon} ${esc(s.name)} <small>${esc(s.code)}</small></a>`).join('')}` : '')
    + (ts.length ? `<div class="sd-group">Giảng viên</div>${ts.map((t) => `<a href="#/teacher/${t.id}">👩‍🏫 ${esc(t.name)} <small>${esc(t.faculty)}</small></a>`).join('')}` : '')
    + (docs.length ? `<div class="sd-group">Tài liệu</div>${docs.map((d) => `<a href="#/doc/${d.id}">${TYPE_ICON[d.type]} ${esc(d.title)} <small>${esc(subj(d.subjectId).code)}</small></a>`).join('')}` : '')
    + `<a class="sd-all" href="#/docs?q=${encodeURIComponent(gs.value.trim())}">Xem tất cả kết quả cho “${esc(gs.value.trim())}” →</a>`;
  drop.hidden = false;
});
gs.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') { location.hash = '#/docs?q=' + encodeURIComponent(gs.value.trim()); hideDrop(); gs.blur(); }
});
document.addEventListener('click', (e) => { if (!e.target.closest('.global-search')) hideDrop(); else if (e.target.closest('#searchDrop a')) { hideDrop(); gs.value = ''; } });

/* ---------- Theme & reset ---------- */
function setTheme(t) { document.documentElement.dataset.theme = t; $('#themeBtn').textContent = t === 'dark' ? '☀️' : '🌙'; store.set('theme', t); }
setTheme(store.get('theme', matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'));
$('#themeBtn').addEventListener('click', () => setTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'));
$('#resetBtn').addEventListener('click', () => {
  openModal(`<h3>Xóa dữ liệu demo?</h3><p class="muted">Tài liệu bạn đã tải lên, review, bình luận, mục đã lưu… sẽ bị xóa khỏi trình duyệt này.</p>
    <div class="modal-actions"><button class="btn ghost" data-modal-close>Hủy</button><button class="btn danger" id="confirmReset">Xóa</button></div>`);
  $('#confirmReset').onclick = () => {
    try { Object.keys(localStorage).filter((k) => k.startsWith('ss_')).forEach((k) => localStorage.removeItem(k)); } catch {}
    location.hash = '#/'; location.reload();
  };
});

window.addEventListener('hashchange', router);
router();
