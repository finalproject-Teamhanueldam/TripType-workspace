import "../css/UserNoticeDetail.css";
import NoticeComment from "./NoticeComment";
import { useNavigate, useParams } from "react-router-dom";
import { FaAngleLeft, FaEye, FaDownload } from "react-icons/fa";
import { useEffect, useState } from "react";
import axios from "axios";

function UserNoticeDetail() {
  const navigate = useNavigate();
  const { noticeId } = useParams();

  const [notice, setNotice] = useState(null);

  /* =========================
     첨부파일 관련 상태
  ========================= */
  const [previewFile, setPreviewFile] = useState(null);
  const [textPreview, setTextPreview] = useState("");

  /* =========================
     파일 타입 판별
  ========================= */
  const getFileType = (url) => {
    if (!url) return "etc";

    const ext = url.split(".").pop().toLowerCase();

    if (["jpg", "jpeg", "png", "webp"].includes(ext)) return "image";
    if (ext === "pdf") return "pdf";
    if (ext === "txt") return "text";
    if (["doc", "docx", "xls", "xlsx", "ppt", "pptx", "hwp"].includes(ext))
      return "office";

    return "etc";
  };


  /* =========================
     미리보기 열기
  ========================= */
  const openPreview = async (file) => {
    setPreviewFile(file);

    if (getFileType(file.noticeAttachmentUrl) === "text") {
      const storedFileName = encodeURIComponent(
        file.noticeAttachmentUrl.split("/").pop()
      );

      try {
        const res = await fetch(
          `http://localhost:8001/triptype/upload/notice/${storedFileName}`
        );
        const text = await res.text();
        setTextPreview(text);
      } catch {
        setTextPreview("텍스트 파일을 불러올 수 없습니다.");
      }
    }
  };

  /* =========================
     미리보기 닫기
  ========================= */
  const closePreview = () => {
    setPreviewFile(null);
    setTextPreview("");
  };

  /* =========================
     공지 상세 조회
  ========================= */
  useEffect(() => {
    axios
      .get(`http://localhost:8001/triptype/notice/${noticeId}`)
      .then((res) => setNotice(res.data))
      .catch((err) => console.error(err));
  }, [noticeId]);

  if (!notice) return <div>로딩중...</div>;

  /* =========================
     첨부파일 리스트 렌더링
  ========================= */
  const renderAttachments = () => {
    if (!Array.isArray(notice.attachmentList)) return null;

    return (
      <ul className="notice-attachments">
        {notice.attachmentList
          .filter(file => file?.noticeAttachmentUrl) // ✅ 핵심
          .map(file => {
            const storedFileName = encodeURIComponent(
              file.noticeAttachmentUrl.split("/").pop()
            );

            return (
              <li
                key={file.noticeAttachmentId}
                className="notice-attachment-item"
              >
                <span className="file-name">
                  {file.noticeAttachmentName}
                </span>

                <button
                  className="preview-btn"
                  onClick={() => openPreview(file)}
                >
                  <FaEye />
                </button>

                <a
                  className="download-btn"
                  href={`http://localhost:8001/triptype/notice/download/${storedFileName}`}
                >
                  <FaDownload />
                </a>
              </li>
            );
          })}
      </ul>
    );
  };


  /* =========================
     미리보기 내용 렌더링
  ========================= */
  const renderPreviewContent = () => {
    if (!previewFile?.noticeAttachmentUrl) return null;

    const storedFileName = encodeURIComponent(
      previewFile.noticeAttachmentUrl.split("/").pop()
    );

    const fileUrl = `http://localhost:8001/triptype/upload/notice/${storedFileName}`;
    const type = getFileType(previewFile.noticeAttachmentUrl);

    if (type === "image") {
      return <img src={fileUrl} alt="미리보기" />;
    }

    if (type === "pdf") {
      return <iframe src={fileUrl} width="100%" height="600" />;
    }

    if (type === "text") {
      return <pre className="text-preview">{textPreview}</pre>;
    }

    if (type === "office") {
      if (fileUrl.includes("localhost")) {
        return (
          <div className="preview-fallback">
            <p>이 파일은 미리보기를 지원하지 않습니다.</p>
            <a href={fileUrl} download>다운로드</a>
          </div>
        );
      }

      const viewerUrl = `https://docs.google.com/gview?url=${encodeURIComponent(
        fileUrl
      )}&embedded=true`;

      return (
        <iframe
          src={viewerUrl}
          width="100%"
          height="600"
          title="문서 미리보기"
        />
      );
    }
};


  return (
    <div className="notice-detail-page">
      {/* 제목 영역 */}
      <div className="notice-title-row">
        <h2 className="notice-detail-title">
          {notice.noticeTitle}
        </h2>

        <button
          className="notice-back-btn icon"
          onClick={() => navigate(-1)}
        >
          <FaAngleLeft /> 목록으로
        </button>
      </div>

      {/* 메타 */}
      <div className="notice-meta">
        <span>{notice.noticeCreatedAt}</span>
        <span> · 조회수 {notice.noticeViews}</span>
      </div>

      

      {/* 미리보기 모달 */}
      {previewFile && (
        <div className="preview-modal">
          <div className="preview-content">
            <button
              className="modal-close"
              onClick={closePreview}
            >
              ✕
            </button>
            {renderPreviewContent()}
          </div>
        </div>
      )}

      {/* 내용 */}
      <div className="notice-content-box">
        {notice.noticeContent}
      </div>

      {/* 첨부파일 */}
      <div className="notice-meta">
        {renderAttachments()}
      </div>

      {/* 댓글 */}
      <NoticeComment noticeId={noticeId} />
    </div>
  );
}

export default UserNoticeDetail;
