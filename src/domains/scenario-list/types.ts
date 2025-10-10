export interface Baseline {
  baselineId: number;
  createdDate: string;
  tags: string[];
  title: string;
}

export interface BaselineListResponse {
  items: Baseline[];
  page: number;
  totalPages: number;
}
