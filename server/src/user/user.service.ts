import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { ConflictError, NotFoundError, BadRequestError } from '../common/exceptions/http-exceptions';
import { UpdateUserDto } from '../auth/dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async findById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async create(username: string, password: string, email: string) {
    const existingUser = await this.findByEmail(email);
    if (existingUser) {
      throw new ConflictError('User with this email already exists');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    return this.prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        email,
      },
      select: {
        id: true,
        username: true,
        email: true,
        bio: true,
        profilePicture: true,
        profileBackground: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async validatePassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  async followUser(followerId: string, followingId: string) {
    if (followerId === followingId) {
      throw new BadRequestError('You cannot follow yourself');
    }

    const targetUser = await this.findById(followingId);
    if (!targetUser) {
      throw new NotFoundError('User to follow not found');
    }

    // Check if already following
    const existingFollow = await this.prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId,
          followingId,
        },
      },
    });

    if (existingFollow) {
      throw new ConflictError('Already following this user');
    }

    return this.prisma.follow.create({
      data: {
        followerId,
        followingId,
      },
    });
  }

  async unfollowUser(followerId: string, followingId: string) {
    if (followerId === followingId) {
      throw new BadRequestError('You cannot unfollow yourself');
    }

    const targetUser = await this.findById(followingId);
    if (!targetUser) {
      throw new NotFoundError('User to unfollow not found');
    }

    const existingFollow = await this.prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId,
          followingId,
        },
      },
    });

    if (!existingFollow) {
      throw new BadRequestError('You are not following this user');
    }

    return this.prisma.follow.delete({
      where: {
        followerId_followingId: {
          followerId,
          followingId,
        },
      },
    });
  }

  async getUserProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        email: true,
        bio: true,
        profilePicture: true,
        profileBackground: true,
        createdAt: true,
        updatedAt: true,
        posts: {
          select: {
            id: true,
            title: true,
            summary: true,
            image: true,
            createdAt: true,
            shareCount: true,
            likes: {
              select: { userId: true },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
        followers: {
          select: {
            follower: {
              select: {
                id: true,
                username: true,
                profilePicture: true,
              },
            },
          },
        },
        following: {
          select: {
            following: {
              select: {
                id: true,
                username: true,
                profilePicture: true,
              },
            },
          },
        },
        likes: {
          select: {
            post: {
              select: {
                id: true,
                title: true,
                summary: true,
                image: true,
                createdAt: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    return {
      ...user,
      followers: user.followers.map(f => f.follower),
      following: user.following.map(f => f.following),
      likedPosts: user.likes.map(l => l.post),
    };
  }

  async updateUserProfile(userId: string, updateData: UpdateUserDto) {
    if (Object.keys(updateData).length === 0) {
      throw new BadRequestError('No update data provided');
    }

    const data: any = { ...updateData };

    if (updateData.password) {
      const salt = await bcrypt.genSalt(10);
      data.password = await bcrypt.hash(updateData.password, salt);
    }

    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data,
      select: {
        id: true,
        username: true,
        email: true,
        bio: true,
        profilePicture: true,
        profileBackground: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return updatedUser;
  }

  async getAllUsers() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        bio: true,
        profilePicture: true,
        profileBackground: true,
        createdAt: true,
        followers: {
          select: {
            follower: {
              select: {
                id: true,
                username: true,
              },
            },
          },
        },
        following: {
          select: {
            following: {
              select: {
                id: true,
                username: true,
              },
            },
          },
        },
      },
    });
  }
}
