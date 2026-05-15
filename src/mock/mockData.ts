import type {
  IUser,
  IPost,
  IMedia,
  IComment,
  ILike,
  IHashtag,
  ITrendingPost,
  ITrendingHashtag,
  IFollower,
  IUserFollowStats,
  INotification,
} from '../types';

// ================================================================
// MOCK USERS — matches instaauth_db.users schema
// ================================================================
export const MOCK_USERS: IUser[] = [
  {
    id: 1,
    full_name: 'Justin Guru',
    username: 'justin_guru_46',
    email: 'justin@example.com',
    profile_pic: 'https://api.dicebear.com/7.x/avataaars/svg?seed=justin_guru_46',
    created_at: '2024-01-10T10:00:00Z',
    updated_at: '2024-01-10T10:00:00Z',
  },
  {
    id: 2,
    full_name: 'Sidharth',
    username: 'sidharth',
    email: 'sidharth@example.com',
    profile_pic: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sidharth',
    created_at: '2024-01-11T10:00:00Z',
    updated_at: '2024-01-11T10:00:00Z',
  },
  {
    id: 3,
    full_name: 'Suraj',
    username: 'suraj',
    email: 'suraj@example.com',
    profile_pic: 'https://api.dicebear.com/7.x/avataaars/svg?seed=suraj',
    created_at: '2024-01-12T10:00:00Z',
    updated_at: '2024-01-12T10:00:00Z',
  },
  {
    id: 4,
    full_name: 'Raghu',
    username: 'raghu',
    email: 'raghu@example.com',
    profile_pic: 'https://api.dicebear.com/7.x/avataaars/svg?seed=raghu',
    created_at: '2024-01-13T10:00:00Z',
    updated_at: '2024-01-13T10:00:00Z',
  },
  {
    id: 5,
    full_name: 'Kumara Guru',
    username: 'kumara_guru',
    email: 'kumara@example.com',
    profile_pic: 'https://api.dicebear.com/7.x/avataaars/svg?seed=kumara_guru',
    created_at: '2024-01-14T10:00:00Z',
    updated_at: '2024-01-14T10:00:00Z',
  },
];

// ================================================================
// MOCK HASHTAGS — matches instapost_db.hashtags schema
// ================================================================
export const MOCK_HASHTAGS: IHashtag[] = [
  { id: 1, tag: 'travel', usage_count: 50 },
  { id: 2, tag: 'photography', usage_count: 120 },
  { id: 3, tag: 'nature', usage_count: 85 },
  { id: 4, tag: 'food', usage_count: 200 },
  { id: 5, tag: 'technology', usage_count: 60 },
  { id: 6, tag: 'fashion', usage_count: 95 },
  { id: 7, tag: 'fitness', usage_count: 75 },
  { id: 8, tag: 'art', usage_count: 45 },
];

// ================================================================
// MOCK MEDIA — matches instapost_db.media schema
// ================================================================
export const MOCK_MEDIA: IMedia[] = [
  {
    id: 1,
    post_id: 1,
    media_type: 'IMAGE',
    media_blob: null,
    display_order: 1,
    preview_url: 'https://picsum.photos/seed/post1/800/600',
  },
  {
    id: 2,
    post_id: 2,
    media_type: 'IMAGE',
    media_blob: null,
    display_order: 1,
    preview_url: 'https://picsum.photos/seed/post2/800/600',
  },
  {
    id: 3,
    post_id: 3,
    media_type: 'IMAGE',
    media_blob: null,
    display_order: 1,
    preview_url: 'https://picsum.photos/seed/post3/800/600',
  },
  {
    id: 4,
    post_id: 3,
    media_type: 'IMAGE',
    media_blob: null,
    display_order: 2,
    preview_url: 'https://picsum.photos/seed/post3b/800/600',
  },
  {
    id: 5,
    post_id: 4,
    media_type: 'IMAGE',
    media_blob: null,
    display_order: 1,
    preview_url: 'https://picsum.photos/seed/post4/800/600',
  },
  {
    id: 6,
    post_id: 5,
    media_type: 'IMAGE',
    media_blob: null,
    display_order: 1,
    preview_url: 'https://picsum.photos/seed/post5/800/600',
  },
  {
    id: 7,
    post_id: 6,
    media_type: 'IMAGE',
    media_blob: null,
    display_order: 1,
    preview_url: 'https://picsum.photos/seed/post6/800/600',
  },
  {
    id: 8,
    post_id: 7,
    media_type: 'IMAGE',
    media_blob: null,
    display_order: 1,
    preview_url: 'https://picsum.photos/seed/post7/800/600',
  },
  {
    id: 9,
    post_id: 8,
    media_type: 'IMAGE',
    media_blob: null,
    display_order: 1,
    preview_url: 'https://picsum.photos/seed/post8/800/600',
  },
];

// ================================================================
// MOCK POSTS — matches instapost_db.posts schema
// ================================================================
export const MOCK_POSTS: IPost[] = [
  {
    id: 1,
    user_id: 1,
    caption: 'My first Instagram style post! 🌟 #travel #photography',
    privacy: 'PUBLIC',
    like_count: 142,
    comment_count: 18,
    is_trending_candidate: true,
    created_at: '2024-05-01T08:00:00Z',
    updated_at: '2024-05-01T08:00:00Z',
    user: MOCK_USERS[0],
    media: [MOCK_MEDIA[0]],
    hashtags: [MOCK_HASHTAGS[0], MOCK_HASHTAGS[1]],
    is_liked_by_me: false,
  },
  {
    id: 2,
    user_id: 2,
    caption: 'Beautiful sunset at the beach 🌅 #nature #photography',
    privacy: 'PUBLIC',
    like_count: 287,
    comment_count: 34,
    is_trending_candidate: true,
    created_at: '2024-05-02T18:30:00Z',
    updated_at: '2024-05-02T18:30:00Z',
    user: MOCK_USERS[1],
    media: [MOCK_MEDIA[1]],
    hashtags: [MOCK_HASHTAGS[2], MOCK_HASHTAGS[1]],
    is_liked_by_me: true,
  },
  {
    id: 3,
    user_id: 3,
    caption: 'Weekend road trip vibes 🚗✨ #travel',
    privacy: 'PUBLIC',
    like_count: 95,
    comment_count: 12,
    is_trending_candidate: false,
    created_at: '2024-05-03T12:00:00Z',
    updated_at: '2024-05-03T12:00:00Z',
    user: MOCK_USERS[2],
    media: [MOCK_MEDIA[2], MOCK_MEDIA[3]],
    hashtags: [MOCK_HASHTAGS[0]],
    is_liked_by_me: false,
  },
  {
    id: 4,
    user_id: 4,
    caption: 'Delicious brunch today 😋 #food',
    privacy: 'FRIENDS',
    like_count: 61,
    comment_count: 7,
    is_trending_candidate: false,
    created_at: '2024-05-04T10:00:00Z',
    updated_at: '2024-05-04T10:00:00Z',
    user: MOCK_USERS[3],
    media: [MOCK_MEDIA[4]],
    hashtags: [MOCK_HASHTAGS[3]],
    is_liked_by_me: true,
  },
  {
    id: 5,
    user_id: 5,
    caption: 'New tech setup is 🔥 #technology',
    privacy: 'PUBLIC',
    like_count: 199,
    comment_count: 25,
    is_trending_candidate: true,
    created_at: '2024-05-05T14:00:00Z',
    updated_at: '2024-05-05T14:00:00Z',
    user: MOCK_USERS[4],
    media: [MOCK_MEDIA[5]],
    hashtags: [MOCK_HASHTAGS[4]],
    is_liked_by_me: false,
  },
  {
    id: 6,
    user_id: 1,
    caption: 'Spring fashion 2024 🌸 #fashion',
    privacy: 'PUBLIC',
    like_count: 312,
    comment_count: 41,
    is_trending_candidate: true,
    created_at: '2024-05-06T11:00:00Z',
    updated_at: '2024-05-06T11:00:00Z',
    user: MOCK_USERS[0],
    media: [MOCK_MEDIA[6]],
    hashtags: [MOCK_HASHTAGS[5]],
    is_liked_by_me: false,
  },
  {
    id: 7,
    user_id: 2,
    caption: 'Morning workout done! 💪 #fitness',
    privacy: 'PUBLIC',
    like_count: 178,
    comment_count: 22,
    is_trending_candidate: false,
    created_at: '2024-05-07T07:00:00Z',
    updated_at: '2024-05-07T07:00:00Z',
    user: MOCK_USERS[1],
    media: [MOCK_MEDIA[7]],
    hashtags: [MOCK_HASHTAGS[6]],
    is_liked_by_me: true,
  },
  {
    id: 8,
    user_id: 3,
    caption: 'Digital art piece I made today 🎨 #art',
    privacy: 'PUBLIC',
    like_count: 421,
    comment_count: 56,
    is_trending_candidate: true,
    created_at: '2024-05-08T16:00:00Z',
    updated_at: '2024-05-08T16:00:00Z',
    user: MOCK_USERS[2],
    media: [MOCK_MEDIA[8]],
    hashtags: [MOCK_HASHTAGS[7]],
    is_liked_by_me: false,
  },
];

// ================================================================
// MOCK COMMENTS — matches instapost_db.comments schema
// ================================================================
export const MOCK_COMMENTS: IComment[] = [
  {
    id: 1,
    user_id: 2,
    post_id: 1,
    content: 'Awesome post! 🔥',
    created_at: '2024-05-01T09:00:00Z',
    user: MOCK_USERS[1],
  },
  {
    id: 2,
    user_id: 3,
    post_id: 1,
    content: 'Love this! 😍',
    created_at: '2024-05-01T10:00:00Z',
    user: MOCK_USERS[2],
  },
  {
    id: 3,
    user_id: 1,
    post_id: 2,
    content: 'Stunning view! 🌅',
    created_at: '2024-05-02T19:00:00Z',
    user: MOCK_USERS[0],
  },
  {
    id: 4,
    user_id: 4,
    post_id: 2,
    content: 'Where is this? 😮',
    created_at: '2024-05-02T20:00:00Z',
    user: MOCK_USERS[3],
  },
];

// ================================================================
// MOCK FOLLOWERS — matches instafollow_db.followers schema
// ================================================================
export const MOCK_FOLLOWERS: IFollower[] = [
  {
    user_id: 1,
    following_id: 2,
    created_at: '2024-01-15T10:00:00Z',
    user: MOCK_USERS[0],
    following_user: MOCK_USERS[1],
  },
  {
    user_id: 1,
    following_id: 3,
    created_at: '2024-01-16T10:00:00Z',
    user: MOCK_USERS[0],
    following_user: MOCK_USERS[2],
  },
  {
    user_id: 2,
    following_id: 1,
    created_at: '2024-01-17T10:00:00Z',
    user: MOCK_USERS[1],
    following_user: MOCK_USERS[0],
  },
];

// ================================================================
// MOCK USER FOLLOW STATS — matches instafollow_db.user_follow_stats schema
// ================================================================
export const MOCK_FOLLOW_STATS: IUserFollowStats[] = [
  { user_id: 1, followers_count: 1200, following_count: 340 },
  { user_id: 2, followers_count: 890, following_count: 210 },
  { user_id: 3, followers_count: 456, following_count: 120 },
  { user_id: 4, followers_count: 234, following_count: 98 },
  { user_id: 5, followers_count: 678, following_count: 155 },
];

// ================================================================
// MOCK TRENDING — matches instatrendingpost_db schema
// ================================================================
export const MOCK_TRENDING_POSTS: ITrendingPost[] = [
  {
    post_id: 8,
    score: 98.5,
    updated_at: '2024-05-08T20:00:00Z',
    post: MOCK_POSTS[7],
  },
  {
    post_id: 6,
    score: 95.2,
    updated_at: '2024-05-06T20:00:00Z',
    post: MOCK_POSTS[5],
  },
  {
    post_id: 2,
    score: 91.8,
    updated_at: '2024-05-02T22:00:00Z',
    post: MOCK_POSTS[1],
  },
  {
    post_id: 5,
    score: 88.4,
    updated_at: '2024-05-05T18:00:00Z',
    post: MOCK_POSTS[4],
  },
  {
    post_id: 1,
    score: 83.1,
    updated_at: '2024-05-01T14:00:00Z',
    post: MOCK_POSTS[0],
  },
];

export const MOCK_TRENDING_HASHTAGS: ITrendingHashtag[] = [
  { hashtag_id: 4, score: 92.0, updated_at: '2024-05-08T20:00:00Z', hashtag: MOCK_HASHTAGS[3] },
  { hashtag_id: 2, score: 88.5, updated_at: '2024-05-08T18:00:00Z', hashtag: MOCK_HASHTAGS[1] },
  { hashtag_id: 6, score: 85.2, updated_at: '2024-05-08T16:00:00Z', hashtag: MOCK_HASHTAGS[5] },
  { hashtag_id: 3, score: 82.7, updated_at: '2024-05-08T14:00:00Z', hashtag: MOCK_HASHTAGS[2] },
  { hashtag_id: 1, score: 79.3, updated_at: '2024-05-08T12:00:00Z', hashtag: MOCK_HASHTAGS[0] },
  { hashtag_id: 7, score: 76.1, updated_at: '2024-05-08T10:00:00Z', hashtag: MOCK_HASHTAGS[6] },
];

// ================================================================
// MOCK NOTIFICATIONS
// ================================================================
export const MOCK_NOTIFICATIONS: INotification[] = [
  {
    id: 1,
    type: 'LIKE',
    message: 'Sidharth liked your post',
    from_user_id: 2,
    post_id: 1,
    is_read: false,
    created_at: '2024-05-08T18:00:00Z',
    from_user: MOCK_USERS[1],
  },
  {
    id: 2,
    type: 'COMMENT',
    message: 'Suraj commented on your post',
    from_user_id: 3,
    post_id: 1,
    is_read: false,
    created_at: '2024-05-08T17:00:00Z',
    from_user: MOCK_USERS[2],
  },
  {
    id: 3,
    type: 'FOLLOW',
    message: 'Raghu started following you',
    from_user_id: 4,
    is_read: true,
    created_at: '2024-05-07T12:00:00Z',
    from_user: MOCK_USERS[3],
  },
  {
    id: 4,
    type: 'LIKE',
    message: 'Kumara Guru liked your post',
    from_user_id: 5,
    post_id: 6,
    is_read: true,
    created_at: '2024-05-07T10:00:00Z',
    from_user: MOCK_USERS[4],
  },
];
