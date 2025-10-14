// src/constants/errorMessages.ts

export const ERROR_MESSAGES = {
  // ===== Common Errors =====
  INVALID_INPUT_VALUE: "입력값이 올바르지 않습니다.",
  METHOD_NOT_ALLOWED: "요청한 메서드가 허용되지 않습니다.",
  HANDLE_ACCESS_DENIED: "접근 권한이 없습니다.",
  INTERNAL_SERVER_ERROR: "서버에 문제가 발생했습니다. 잠시 후 다시 시도해주세요.",
  INVALID_TYPE_VALUE: "데이터 형식이 올바르지 않습니다.",
  ENTITY_NOT_FOUND: "요청한 데이터를 찾을 수 없습니다.",

  // ===== User Errors =====
  USER_NOT_FOUND: "사용자를 찾을 수 없습니다.",
  EMAIL_DUPLICATION: "이미 사용 중인 이메일입니다.",
  LOGIN_ID_DUPLICATION: "이미 사용 중인 아이디입니다.",
  INVALID_PASSWORD: "비밀번호가 올바르지 않습니다.",
  UNAUTHORIZED_USER: "로그인 정보가 유효하지 않습니다. 다시 로그인해주세요.",
  NICKNAME_DUPLICATION: "이미 사용 중인 닉네임입니다.",

  // ===== Post Errors =====
  POST_NOT_FOUND: "게시글을 찾을 수 없습니다.",
  POST_ALREADY_LIKED: "이미 좋아요를 누르셨습니다.",

  // ===== Comment Errors =====
  COMMENT_NOT_FOUND: "댓글을 찾을 수 없습니다.",
  COMMENT_ALREADY_LIKED: "이미 좋아요를 누르셨습니다.",

  // ===== Session Errors =====
  SESSION_NOT_FOUND: "로그인 세션이 존재하지 않습니다.",
  SESSION_EXPIRED: "세션이 만료되었습니다. 다시 로그인해주세요.",
  SESSION_REVOKED: "세션이 취소되었습니다. 다시 로그인해주세요.",

  // ===== Node Errors =====
  NODE_NOT_FOUND: "노드를 찾을 수 없습니다.",
  BASE_LINE_NOT_FOUND: "기준선을 찾을 수 없습니다.",
  DECISION_LINE_NOT_FOUND: "결정선을 찾을 수 없습니다.",
  GUEST_BASELINE_LIMIT: "게스트는 생성 가능한 기준선 수를 초과했습니다.",

  // ===== Scenario Errors =====
  SCENARIO_NOT_FOUND: "시나리오를 찾을 수 없습니다.",
  SCENARIO_REQUEST_NOT_FOUND: "시나리오 요청 정보를 찾을 수 없습니다.",
  SCENE_COMPARE_NOT_FOUND: "비교할 장면을 찾을 수 없습니다.",
  SCENE_TYPE_NOT_FOUND: "장면 유형이 올바르지 않습니다.",
  SCENARIO_ALREADY_IN_PROGRESS: "이미 진행 중인 시나리오가 있습니다.",
  BASE_SCENARIO_NOT_FOUND: "기본 시나리오를 찾을 수 없습니다.",
  SCENARIO_TIMELINE_NOT_FOUND: "시나리오 타임라인을 찾을 수 없습니다.",
  SCENARIO_CREATION_FAILED: "시나리오 생성에 실패했습니다.",
  SCENARIO_NOT_COMPLETED: "시나리오가 아직 완료되지 않았습니다.",

  // ===== AI Errors =====
  AI_SERVICE_UNAVAILABLE: "AI 서비스에 연결할 수 없습니다.",
  AI_REQUEST_TIMEOUT: "AI 응답 시간이 초과되었습니다. 잠시 후 다시 시도해주세요.",
  AI_RESPONSE_PARSING_ERROR: "AI 응답 처리 중 오류가 발생했습니다.",
  AI_GENERATION_FAILED: "AI 생성 중 오류가 발생했습니다.",
  AI_INVALID_REQUEST: "올바르지 않은 AI 요청 형식입니다.",
  AI_QUOTA_EXCEEDED: "AI 사용 한도를 초과했습니다.",
  AI_MODEL_NOT_AVAILABLE: "요청하신 AI 모델을 사용할 수 없습니다.",

  // ===== Like Errors =====
  LIKE_NOT_FOUND: "좋아요 정보를 찾을 수 없습니다.",

  // ===== Poll Errors =====
  POLL_VOTE_NOT_FOUND: "투표 정보를 찾을 수 없습니다.",
  POLL_VOTE_INVALID_FORMAT: "투표 형식이 올바르지 않습니다.",
  POLL_VOTE_INVALID_OPTION: "유효하지 않은 투표 항목입니다.",

  // ===== Lock Errors =====
  LOCK_ACQUISITION_FAILED: "다른 요청이 처리 중입니다. 잠시 후 다시 시도해주세요.",

  // ===== Storage Errors =====
  STORAGE_UPLOAD_FAILED: "파일 업로드에 실패했습니다.",
  STORAGE_DELETE_FAILED: "파일 삭제에 실패했습니다.",
  STORAGE_INVALID_FILE: "유효하지 않은 파일 형식입니다.",
  STORAGE_FILE_NOT_FOUND: "파일을 찾을 수 없습니다.",
  S3_CONNECTION_FAILED: "스토리지 연결에 실패했습니다.",
  LOCAL_STORAGE_IO_ERROR: "로컬 저장소 접근 중 오류가 발생했습니다.",
} as const;

export type ErrorMessageKey = keyof typeof ERROR_MESSAGES;

