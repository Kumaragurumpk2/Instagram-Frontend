// ================================================================
// AUTH SERVICE TYPES — mapped from instaauth_db
// ================================================================

export interface IUser {
  id: number;
  full_name: string;
  username: string;
  email: string;
  password?: string;
  profile_pic?: string | null; // Base64 blob converted to string for FE
  created_at: string;
  updated_at: string;
}

export interface IPasswordResetToken {
  id: number;
  user_id: number;
  token: string;
  expires_at: string;
  used: boolean;
}

export interface ILoginAttempt {
  user_id: number;
  failed_count: number;
  last_attempt: string | null;
  blocked_until: string | null;
}

// ================================================================
// AUTH REQUEST / RESPONSE DTOS
// ================================================================

export interface IRegisterRequest {
  full_name: string;
  username: string;
  email: string;
  password: string;
  confirm_password: string;
  profile_pic?: File | null;
}

export interface ILoginRequest {
  username_or_email: string;
  password: string;
  remember_me?: boolean;
}

export interface IAuthResponse {
  access_token: string;
  refresh_token: string;
  user: IUser;
  expires_in: number;
}

export interface IForgotPasswordRequest {
  email: string;
}

export interface IResetPasswordRequest {
  token: string;
  new_password: string;
  confirm_password: string;
}

// ================================================================
// POST SERVICE TYPES — mapped from instapost_db
// ================================================================

export type PrivacyType = 'PUBLIC' | 'FRIENDS' | 'PRIVATE' | 'CUSTOM';

export interface IPost {
  id: number;
  user_id: number;
  caption: string | null;
  privacy: PrivacyType;
  like_count: number;
  comment_count: number;
  is_trending_candidate: boolean;
  created_at: string;
  updated_at: string;
  // Joined fields from other services (populated by frontend)
  user?: IUser;
  media?: IMedia[];
  hashtags?: IHashtag[];
  is_liked_by_me?: boolean;
}

export type MediaType = 'IMAGE' | 'VIDEO';

export interface IMedia {
  id: number;
  post_id: number;
  media_type: MediaType;
  media_blob?: string | null; // Base64 string
  display_order: number;
  preview_url?: string; // generated locally before upload
}

export interface IComment {
  id: number;
  user_id: number;
  post_id: number;
  content: string;
  created_at: string;
  user?: IUser;
}

export interface ILike {
  user_id: number;
  post_id: number;
  created_at: string;
  user?: IUser;
}

export interface IHashtag {
  id: number;
  tag: string;
  usage_count: number;
}

export interface IPostHashtag {
  post_id: number;
  hashtag_id: number;
}

export interface IPostAllowedUser {
  post_id: number;
  user_id: number;
}

// ================================================================
// POST REQUEST / RESPONSE DTOS
// ================================================================

export interface ICreatePostRequest {
  user_id: number;
  caption: string;
  privacy: PrivacyType;
  hashtags: string[];
  allowed_user_ids?: number[];
  media_files: File[];
}

export interface IUpdatePostRequest {
  caption?: string;
  privacy?: PrivacyType;
  hashtags?: string[];
  allowed_user_ids?: number[];
}

export interface ICreateCommentRequest {
  user_id: number;
  post_id: number;
  content: string;
}

export interface ILikeRequest {
  user_id: number;
  post_id: number;
}

// ================================================================
// FOLLOW SERVICE TYPES — mapped from instafollow_db
// ================================================================

export interface IFollower {
  user_id: number;
  following_id: number;
  created_at: string;
  user?: IUser;
  following_user?: IUser;
}

export interface IUserFollowStats {
  user_id: number;
  followers_count: number;
  following_count: number;
}

export interface IFollowRequest {
  user_id: number;
  following_id: number;
}

// ================================================================
// TRENDING SERVICE TYPES — mapped from instatrendingpost_db
// ================================================================

export interface ITrendingPost {
  post_id: number;
  score: number;
  updated_at: string;
  post?: IPost;
}

export interface ITrendingHashtag {
  hashtag_id: number;
  score: number;
  updated_at: string;
  hashtag?: IHashtag;
}

// ================================================================
// COMMON / SHARED TYPES
// ================================================================

export interface IApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
  status_code: number;
}

export interface IPagedResponse<T> {
  content: T[];
  total_elements: number;
  total_pages: number;
  current_page: number;
  page_size: number;
  is_last: boolean;
}

export interface INotification {
  id: number;
  type: 'LIKE' | 'COMMENT' | 'FOLLOW';
  message: string;
  from_user_id: number;
  post_id?: number;
  is_read: boolean;
  created_at: string;
  from_user?: IUser;
}

export interface ISearchResult {
  users: IUser[];
  hashtags: IHashtag[];
  posts: IPost[];
}

export type ThemeMode = 'light' | 'dark';

export interface IValidationError {
  field: string;
  message: string;
}

export interface IFormState<T> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
  isSubmitting: boolean;
  isValid: boolean;
}
