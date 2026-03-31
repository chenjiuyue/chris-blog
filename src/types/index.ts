export interface Post {
  _id: string;
  title: string;
  content: string;
  summary: string;
  coverImage: string;
  category: string;
  tags: string[];
  author: string;
  status: 'draft' | 'published';
  viewCount: number;
  likeCount: number;
  commentCount: number;
  seriesId?: string;
  seriesOrder?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description: string;
  postCount: number;
}

export interface Tag {
  _id: string;
  name: string;
  slug: string;
  postCount: number;
}

export interface Comment {
  _id: string;
  postId: string;
  nickname: string;
  content: string;
  parentId: string;
  createdAt: string;
}

export interface BlogStatistics {
  _id: string;
  totalPosts: number;
  totalViews: number;
  totalComments: number;
  totalLikes: number;
  updatedAt: string;
}

export interface Link {
  _id: string;
  name: string;
  url: string;
  avatar: string;
  description: string;
  status: 'active' | 'inactive';
  order: number;
}

// 文章系列
export interface PostSeries {
  _id: string;
  title: string;
  description: string;
  cover?: string;
  postIds: string[]; // 按顺序存储文章ID
  postCount: number;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

// 扩展 Post 类型，支持系列
export interface PostWithSeries extends Post {
  seriesId?: string;
  seriesOrder?: number; // 在系列中的顺序
}

// 站点统计相关
export interface VisitTrendItem {
  date: string;
  count: number;
}

export interface CategoryDistribution {
  name: string;
  count: number;
}

export interface TopPost {
  _id: string;
  title: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
}

export interface TagStat {
  name: string;
  count: number;
}

export interface SiteStatsDetail {
  totalPosts: number;
  totalViews: number;
  totalComments: number;
  totalLikes: number;
  totalTags: number;
  totalCategories: number;
  todayViews: number;
  totalUV: number;
  visitTrend: VisitTrendItem[];
  categoryDistribution: CategoryDistribution[];
  topPosts: TopPost[];
  tagStats: TagStat[];
}
