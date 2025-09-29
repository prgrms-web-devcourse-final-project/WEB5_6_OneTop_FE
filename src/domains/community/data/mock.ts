import { postListResponse, Post } from '../types';

// Mock posts data
const mockPosts: Post[] = [
  {
    id: 1,
    title: "새로운 취업 준비 팁 공유",
    content: "안녕하세요! 최근에 취업에 성공한 경험을 바탕으로 몇 가지 팁을 공유하고 싶어요. 첫 번째로는 자기소개서 작성 시 구체적인 경험을 포함하는 것이 중요합니다...",
    author: "김취업",
    boardType: "CHAT",
    hide: false,
    likeCount: 15,
    createdDate: "2024-01-15T10:30:00Z"
  },
  {
    id: 2,
    title: "프로그래밍 스터디 모집합니다",
    content: "JavaScript와 React를 함께 공부할 스터디원을 모집합니다. 주 2회 온라인으로 진행하며, 프로젝트도 함께 만들어볼 예정입니다.",
    author: "개발자지망생",
    boardType: "NOTICE",
    hide: false,
    likeCount: 8,
    createdDate: "2024-01-14T14:20:00Z"
  },
  {
    id: 3,
    title: "면접 후기 - IT 대기업",
    content: "어제 대기업 면접을 보고 왔습니다. 기술 면접에서 나온 질문들과 느낀 점들을 공유해드릴게요. 준비하시는 분들께 도움이 되길 바랍니다.",
    author: "면접왕",
    boardType: "POLL",
    hide: false,
    likeCount: 23,
    createdDate: "2024-01-13T16:45:00Z"
  },
  {
    id: 4,
    title: "자격증 공부 방법 질문",
    content: "정보처리기사 자격증을 준비하고 있는데, 효율적인 공부 방법이 있을까요? 경험자분들의 조언 부탁드립니다.",
    author: "자격증준비생",
    boardType: "SCENARIO",
    hide: false,
    likeCount: 5,
    createdDate: "2024-01-12T09:15:00Z"
  },
  {
    id: 5,
    title: "포트폴리오 피드백 요청",
    content: "웹 개발자 포트폴리오를 만들었는데, 피드백을 받고 싶습니다. 부족한 부분이나 개선할 점이 있다면 알려주세요.",
    author: "신입개발자",
    boardType: "CHAT",
    hide: false,
    likeCount: 12,
    createdDate: "2024-01-11T13:30:00Z"
  },
  {
    id: 6,
    title: "네트워킹 이벤트 참가 후기",
    content: "지난 주말에 개발자 네트워킹 이벤트에 참가했습니다. 많은 분들과 좋은 대화를 나눌 수 있었고, 새로운 기회도 얻을 수 있었어요.",
    author: "네트워커",
    boardType: "NOTICE",
    hide: false,
    likeCount: 7,
    createdDate: "2024-01-10T11:00:00Z"
  },
  {
    id: 7,
    title: "이력서 작성 가이드",
    content: "HR 담당자 경험을 바탕으로 이력서 작성 시 주의사항과 팁을 정리해봤습니다. 특히 신입 개발자분들께 도움이 될 것 같아요.",
    author: "HR전문가",
    boardType: "POLL",
    hide: false,
    likeCount: 31,
    createdDate: "2024-01-09T15:20:00Z"
  },
  {
    id: 8,
    title: "코딩테스트 대비 문제집 추천",
    content: "코딩테스트를 준비하면서 도움이 된 문제집과 온라인 플랫폼을 추천해드립니다. 난이도별로 정리해봤어요.",
    author: "알고리즘마스터",
    boardType: "SCENARIO",
    hide: false,
    likeCount: 19,
    createdDate: "2024-01-08T12:10:00Z"
  },
  {
    id: 9,
    title: "스타트업 vs 대기업 고민",
    content: "신입 개발자로서 스타트업과 대기업 중 어디로 가야 할지 고민이 많습니다. 각각의 장단점에 대한 의견을 듣고 싶어요.",
    author: "고민많은신입",
    boardType: "CHAT",
    hide: false,
    likeCount: 14,
    createdDate: "2024-01-07T17:30:00Z"
  },
  {
    id: 10,
    title: "개발자 컨퍼런스 정보 공유",
    content: "다음 달에 열리는 개발자 컨퍼런스 정보를 공유합니다. 좋은 세션들이 많으니 관심 있으신 분들은 참고하세요.",
    author: "컨퍼런스러버",
    boardType: "NOTICE",
    hide: false,
    likeCount: 9,
    createdDate: "2024-01-06T10:45:00Z"
  }
];

// Mock response for post list
export const mockPostListResponse: postListResponse = {
  data: {
    items: mockPosts,
    page: 1,
    size: 10,
    totalElements: 25,
    totalPages: 3,
    last: false
  },
  message: "게시글 목록을 성공적으로 조회했습니다.",
  status: 200
};

// Mock response for first page
export const mockPostListResponsePage1: postListResponse = {
  data: {
    items: mockPosts.slice(0, 10),
    page: 1,
    size: 10,
    totalElements: 25,
    totalPages: 3,
    last: false
  },
  message: "게시글 목록을 성공적으로 조회했습니다.",
  status: 200
};

// Mock response for second page
export const mockPostListResponsePage2: postListResponse = {
  data: {
    items: mockPosts.slice(10, 20),
    page: 2,
    size: 10,
    totalElements: 25,
    totalPages: 3,
    last: false
  },
  message: "게시글 목록을 성공적으로 조회했습니다.",
  status: 200
};

// Mock response for last page
export const mockPostListResponsePage3: postListResponse = {
  data: {
    items: mockPosts.slice(20, 25),
    page: 3,
    size: 10,
    totalElements: 25,
    totalPages: 3,
    last: true
  },
  message: "게시글 목록을 성공적으로 조회했습니다.",
  status: 200
};

// Mock empty response
export const mockEmptyPostListResponse: postListResponse = {
  data: {
    items: [],
    page: 1,
    size: 10,
    totalElements: 0,
    totalPages: 0,
    last: true
  },
  message: "조회된 게시글이 없습니다.",
  status: 200
};
