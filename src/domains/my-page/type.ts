export interface Comment {
  commentId: number;
  postId: number;
  postTitle: string;
  content: string;
  postCreatedAt: string;
  commentCreatedAt: string;
}

export interface CommentListResponse {
  items: Comment[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

export interface MyInfo {
  username: string;
  email: string;
  birthdayAt: string;
  gender: "M" | "F";
  beliefs: string;
  mbti: string;
  lifeSatis?: number | null;
  relationship?: number | null;
  workLifeBal?: number | null;
  riskAvoid?: number | null;
}

export interface Post {
  postId: number;
  title: string;
  createdAt: string;
  commentCount: number;
}

export interface PostListResponse {
  items: Post[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

export interface Scenario {
  scenarioId: number;
  job: string;
  typeScores: Record<string, number>;
  total: number;
  summary: string;
}

export interface ScenarioListResponse {
  items: Scenario[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

export interface RepresentativeProfile {
  nickname: string;
  representativeScenarioId: number | null;
  description: string;
  sceneTypePoints: Record<string, number>;
}

export interface UsageStats {
  scenarioCount: number;
  totalPoints: number;
  postCount: number;
  commentCount: number;
  mbti: string;
}
