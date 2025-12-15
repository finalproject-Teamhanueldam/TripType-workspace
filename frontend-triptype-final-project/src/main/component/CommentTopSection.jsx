import "../style/CommentTopSection.css";

const CommentTopSection = () => {
  return (
    <section className="comment-section">
      <h2>지금 인기 급상승 게시글</h2>

      <ul className="comment-list">
        <li>✈️ 유럽 저가항공 꿀팁 공유 (조회수 ↑)</li>
        <li>🇯🇵 도쿄 3박 4일 루트 추천</li>
        <li>🌴 발리 여행 경비 예상 정리</li>
      </ul>
    </section>
  );
};

export default CommentTopSection;
