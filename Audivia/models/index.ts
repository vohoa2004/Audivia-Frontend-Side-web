export interface Tour {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  avgRating: number;
  ratingCount: number;
  duration: number;
  price: number;
  location: string;
  checkpoints: Checkpoint[];
  typeId: string;
  useCustomMap: boolean;
  startLatitude: number | null;
  startLongitude: number | null;
  customMapImages: CustomMapImage[];
}

export interface Checkpoint {
  id: string;
  tourId: string;
  title: string;
  description: string;
  latitude: number;
  longitude: number;
  order: number;
  imageUrl: string;
}

export interface TourType {
  id: string;
  name: string;
}

export interface SaveTour {
  id: string;
  userId: string;
  tourId: string;
  savedAt: string;
  plannedTime: string | null;
  tour: Tour;
  timeAgo: string;
}

export interface User {
  id: string;
  userName: string;
  fullName: string;
  email: string;
  avatarUrl: string;
  phone: string;
  balanceWallet: number;
  bio: string;
  coverPhoto: string;
  followers: string;
  following: string;
  friends: string;
  audioCharacterId: string;
  audioCharacterName: string;
  travelDistance: string;
  birthDay?: string;
  gender?: boolean;
  job?: string;
  country?: string;
}

export interface Post {
  id: string;
  content: string;
  location: string;
  images: string[];
  time: string;
  likes: number;
  comments: number;
  user: {
    id: string;
    userName: string;
    avatarUrl?: string;
  };
}

export interface Comment {
  id: string;
  content: string;
  postId: string;
  userName: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface Reaction {
  id: string;
  type: string;
  postId: string;
  createdBy: string;
  createdAt: string;
}

export interface ChatRoom {
  id: string;
  name: string;
  createdBy: string;
  isActive: boolean;
  type: string;
  members: ChatRoomMember
}

export interface Message {
  id: string;
  content: string;
  senderId: string;
  type: string;
  status: string;
  chatRoomId: string;
  sender?: User;
  createdAt: Date;
}

export interface ChatRoomMember {
  id: string;
  chatRoomId: string;
  userId: string;
  nickname: string;
  isHost: boolean;
  user: User
}

export interface TransactionHistory {
  id: string;
  userId: string;
  tourId: string;
  amount: number;
  description: string;
  type: string;
  status: string;
  createdAt: Date;
}

export interface Review {
  id: string
  title: string
  content: string
  rating: number
  createdAt: string
  tourId: string
  createdBy: string
  userName: string
  avatarUrl: string
}

export interface TourProgress {
  id: string;
  tourId: string;
  userId: string;
  startedAt: string;
  finishedAt?: string;
  isCompleted: boolean;
  currentCheckpointId: string;
  score: number;
  groupMode: boolean;
  groupId?: number;
  checkpointProgress: CheckpointProgress[];
}

export interface CheckpointProgress {
  id: string;
  userTourProgressId: string;
  tourCheckpointId: string;
  checkpointAudioId: string;
  progressSeconds: number;
  isCompleted: boolean;
  lastListenedTime: string;
}

export interface CustomMapImage {
  imageUrl: string;
  order: number;
}