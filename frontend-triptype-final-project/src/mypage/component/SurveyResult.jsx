import MyPageSectionTitle from "../common/component/MyPageSectionTitle";
import "../css/SurveyResult.css";
import "../css/MyPageCommon.css";

function SurveyResult() {
  return (
    <div className="mypage-page">
      <MyPageSectionTitle title="설문 결과" />

      <div className="mypage-card">
        <h3 className="mypage-card-title">나의 여행 성향</h3>
        <p className="mypage-muted">
          조원이 설문 API 연결 방식 알려주면 여기서 그대로 붙이면 됩니다.
        </p>

        <div className="survey-placeholder">
          <div className="chip">#여행취향</div>
          <div className="chip">#추천여행지</div>
          <div className="chip">#항공권추천</div>
        </div>
      </div>
    </div>
  );
}

export default SurveyResult;