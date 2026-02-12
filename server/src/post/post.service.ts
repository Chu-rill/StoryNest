import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { NotFoundError, ForbiddenError, BadRequestError, ConflictError } from '../common/exceptions/http-exceptions';

@Injectable()
export class PostService {
  constructor(private prisma: PrismaService) {}

  async createPost(createPostDto: CreatePostDto, authorId: string) {
    return this.prisma.post.create({
      data: {
        ...createPostDto,
        authorId,
      },
      select: {
        id: true,
        title: true,
        summary: true,
        content: true,
        format: true,
        image: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async getPostById(id: string) {
    const post = await this.prisma.post.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            profilePicture: true,
            bio: true,
          },
        },
        likes: {
          select: {
            userId: true,
            user: {
              select: {
                id: true,
                username: true,
              },
            },
          },
        },
        comments: {
          include: {
            author: {
              select: {
                id: true,
                username: true,
                profilePicture: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    if (!post) {
      throw new NotFoundError('Post not found');
    }

    return post;
  }

  async getAllPosts(page: number = 1, limit: number = 10, category?: string, author?: string) {
    if (page < 1) {
      throw new BadRequestError('Page number must be greater than 0');
    }

    const skip = (page - 1) * limit;
    const where: any = {};

    if (category) {
      where.category = category;
    }

    if (author) {
      where.authorId = author;
    }

    const [posts, total] = await Promise.all([
      this.prisma.post.findMany({
        where,
        skip,
        take: limit,
        include: {
          author: {
            select: {
              id: true,
              username: true,
              profilePicture: true,
              bio: true,
            },
          },
          likes: {
            select: { userId: true },
          },
          comments: {
            select: { id: true },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.post.count({ where }),
    ]);

    return {
      posts: posts.map(post => ({
        ...post,
        likes: post.likes.length,
        commentsCount: post.comments.length,
      })),
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      limit,
    };
  }

  async getUserPosts(userId: string, limit: number = 20) {
    const posts = await this.prisma.post.findMany({
      where: { authorId: userId },
      take: limit,
      include: {
        likes: {
          select: { userId: true },
        },
        comments: {
          select: { id: true },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (!posts || posts.length === 0) {
      throw new NotFoundError('No posts found for this user');
    }

    return posts.map(post => ({
      id: post.id,
      title: post.title,
      summary: post.summary,
      content: post.content,
      image: post.image,
      likes: post.likes.length,
      commentsCount: post.comments.length,
    }));
  }

  async updatePost(id: string, updatePostDto: UpdatePostDto, userId: string) {
    const post = await this.prisma.post.findUnique({
      where: { id },
    });

    if (!post) {
      throw new NotFoundError('Post not found');
    }

    if (post.authorId !== userId) {
      throw new ForbiddenError('Unauthorized to update this post');
    }

    return this.prisma.post.update({
      where: { id },
      data: updatePostDto,
      select: {
        id: true,
        title: true,
        summary: true,
        content: true,
        image: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async deletePost(id: string, userId: string) {
    const post = await this.prisma.post.findUnique({
      where: { id },
    });

    if (!post) {
      throw new NotFoundError('Post not found');
    }

    if (post.authorId !== userId) {
      throw new ForbiddenError('Unauthorized to delete this post');
    }

    await this.prisma.post.delete({
      where: { id },
    });
  }

  async likePost(postId: string, userId: string) {
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      throw new NotFoundError('Post not found');
    }

    const existingLike = await this.prisma.like.findUnique({
      where: {
        postId_userId: {
          postId,
          userId,
        },
      },
    });

    if (existingLike) {
      throw new ConflictError('Post already liked');
    }

    await this.prisma.like.create({
      data: {
        postId,
        userId,
      },
    });

    return this.getPostById(postId);
  }

  async unlikePost(postId: string, userId: string) {
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      throw new NotFoundError('Post not found');
    }

    const existingLike = await this.prisma.like.findUnique({
      where: {
        postId_userId: {
          postId,
          userId,
        },
      },
    });

    if (!existingLike) {
      throw new BadRequestError('Post not liked yet');
    }

    await this.prisma.like.delete({
      where: {
        postId_userId: {
          postId,
          userId,
        },
      },
    });

    return this.getPostById(postId);
  }

  async addComment(postId: string, createCommentDto: CreateCommentDto, userId: string) {
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      throw new NotFoundError('Post not found');
    }

    return this.prisma.comment.create({
      data: {
        text: createCommentDto.text,
        postId,
        authorId: userId,
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });
  }

  async getAllComments(postId: string) {
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      throw new NotFoundError('Post not found');
    }

    return this.prisma.comment.findMany({
      where: { postId },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            profilePicture: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async deleteComment(postId: string, commentId: string, userId: string) {
    const comment = await this.prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!comment) {
      throw new NotFoundError('Comment not found');
    }

    if (comment.postId !== postId) {
      throw new BadRequestError('Comment does not belong to this post');
    }

    if (comment.authorId !== userId) {
      throw new ForbiddenError('Unauthorized to delete this comment');
    }

    await this.prisma.comment.delete({
      where: { id: commentId },
    });
  }

  async searchPosts(query: string) {
    const posts = await this.prisma.post.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { content: { contains: query, mode: 'insensitive' } },
          { tags: { has: query } },
        ],
      },
      select: {
        id: true,
        title: true,
        summary: true,
        content: true,
        image: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return posts;
  }

  async sharePost(postId: string, userId: string) {
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      throw new NotFoundError('Post not found');
    }

    const existingShare = await this.prisma.share.findUnique({
      where: {
        postId_userId: {
          postId,
          userId,
        },
      },
    });

    let isNewShare = false;
    if (!existingShare) {
      await this.prisma.share.create({
        data: {
          postId,
          userId,
        },
      });

      await this.prisma.post.update({
        where: { id: postId },
        data: {
          shareCount: { increment: 1 },
        },
      });

      isNewShare = true;
    }

    const updatedPost = await this.getPostById(postId);

    return {
      post: updatedPost,
      isNewShare,
    };
  }
}
