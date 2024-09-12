import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsOptional,
  MinLength,
  IsDateString,
} from "class-validator";

class InterestDto {
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @IsString()
  @IsNotEmpty()
  tag: string;
}

class PictureDto {
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @IsString()
  @IsNotEmpty()
  url: string;

  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @IsNotEmpty()
  isProfile: boolean;
}

class VisitDto {
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @IsDateString()
  @IsNotEmpty()
  visitedAt: string;

  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @IsNumber()
  @IsNotEmpty()
  visitedBy: number;
}

class LikeDto {
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @IsDateString()
  @IsNotEmpty()
  likedAt: string;

  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @IsNumber()
  @IsNotEmpty()
  likedUserId: number;
}

class BlockDto {
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @IsDateString()
  @IsNotEmpty()
  blockedAt: string;

  @IsNumber()
  @IsNotEmpty()
  blockerId: number;

  @IsNumber()
  @IsNotEmpty()
  blockedId: number;
}

class ConnectionDto {
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @IsDateString()
  @IsNotEmpty()
  connectedAt: string;

  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @IsNumber()
  @IsNotEmpty()
  connectionId: number;
}

class MessageDto {
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsDateString()
  @IsNotEmpty()
  sentAt: string;

  @IsNumber()
  @IsNotEmpty()
  senderId: number;

  @IsNumber()
  @IsNotEmpty()
  receiverId: number;
}

class NotificationDto {
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @IsString()
  @IsNotEmpty()
  type: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsDateString()
  @IsNotEmpty()
  createdAt: string;

  @IsNumber()
  @IsNotEmpty()
  userId: number;
}

export default {
  InterestDto,
  PictureDto,
  VisitDto,
  LikeDto,
  BlockDto,
  ConnectionDto,
  MessageDto,
  NotificationDto,
};
