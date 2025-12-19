import "../css/CommentTopSection.css";

const posts = [
  { id: 1, icon: "EU", title: "유럽 저가항공 꿀팁 공유", meta: "조회수 상승 중", hot: true },
  { id: 2, icon: "JP", title: "도쿄 3박 4일 루트 추천", meta: "여행 일정" },
  { id: 3, icon: "🌴", title: "발리 여행 경비 예상 정리", meta: "예산 가이드" },
  { id: 4, icon: "US", title: "미국 서부 로드트립 코스 정리", meta: "자유여행" },
  { id: 5, icon: "TH", title: "태국 방콕·치앙마이 일정 비교", meta: "동남아 여행" },
  { id: 6, icon: "IT", title: "이탈리아 7박 9일 핵심 루트", meta: "유럽 여행" },
  { id: 7, icon: "VN", title: "베트남 다낭 가성비 숙소 추천", meta: "숙소 정보" },
  { id: 8, icon: "GB", title: "런던 여행 시 교통패스 총정리", meta: "교통 가이드" },
  { id: 9, icon: "ES", title: "스페인 바르셀로나 미식 여행", meta: "맛집 추천" },
];

const CommentTopSection = () => {
  return (
    <section className="comment-section">
      <div className="comment-head">
        <h2>지금 인기 급상승 게시글</h2>
        <span className="comment-badge">HOT</span>
      </div>

      <ul className="comment-grid">
        {posts.map((post) => (
          <li
            key={post.id}
            className={`comment-card ${post.hot ? "is-hot" : ""}`}
          >
            <span className="comment-icon">{post.icon}</span>

            <div className="comment-text">
              <p className="comment-title">{post.title}</p>
              <span className="comment-meta">{post.meta}</span>
            </div>

            <span className="comment-arrow">→</span>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default CommentTopSection;
