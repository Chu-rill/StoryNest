import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Public } from '../auth/decorators/public.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('content')
@UseGuards(JwtAuthGuard)
export class PostController {
  constructor(private postService: PostService) {}

  @Public()
  @Get('getPost')
  async getAllPosts(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('category') category?: string,
    @Query('author') author?: string,
  ) {
    const pageNum = page ? parseInt(page, 10) : 1;
    const limitNum = limit ? parseInt(limit, 10) : 10;
    const result = await this.postService.getAllPosts(pageNum, limitNum, category, author);

    return {
      status: 'success',
      statusCode: 200,
      message: 'Posts retrieved successfully',
      posts: result.posts,
      pagination: {
        total: result.total,
        totalPages: result.totalPages,
        currentPage: result.currentPage,
        limit: result.limit,
      },
    };
  }

  @Public()
  @Get('post/:id')
  async getPostById(@Param('id') id: string) {
    const post = await this.postService.getPostById(id);
    return {
      status: 'success',
      statusCode: 200,
      message: 'Post retrieved successfully',
      post,
    };
  }

  @Public()
  @Get('search')
  async searchPosts(@Query('query') query: string) {
    const posts = await this.postService.searchPosts(query);
    return {
      status: 'success',
      statusCode: 200,
      message: 'Posts retrieved successfully',
      posts,
      totalPosts: posts.length,
    };
  }

  @Post('post')
  async createPost(@Body() createPostDto: CreatePostDto, @CurrentUser() user: any) {
    const post = await this.postService.createPost(createPostDto, user.id);
    return {
      status: 'success',
      statusCode: 201,
      message: 'Post created successfully',
      post,
    };
  }

  @Put('edit/:id')
  async updatePost(
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
    @CurrentUser() user: any,
  ) {
    const post = await this.postService.updatePost(id, updatePostDto, user.id);
    return {
      status: 'success',
      statusCode: 200,
      message: 'Post updated successfully',
      post,
    };
  }

  @Delete('post/:id')
  async deletePost(@Param('id') id: string, @CurrentUser() user: any) {
    await this.postService.deletePost(id, user.id);
    return {
      status: 'success',
      statusCode: 200,
      message: 'Post deleted successfully',
    };
  }

  @Post('like/:id')
  async likePost(@Param('id') postId: string, @CurrentUser() user: any) {
    const post = await this.postService.likePost(postId, user.id);
    return {
      status: 'success',
      statusCode: 200,
      message: 'Post liked successfully',
      post,
    };
  }

  @Post('unlike/:id')
  async unlikePost(@Param('id') postId: string, @CurrentUser() user: any) {
    const post = await this.postService.unlikePost(postId, user.id);
    return {
      status: 'success',
      statusCode: 200,
      message: 'Post unliked successfully',
      post,
    };
  }

  @Get('comments/:id')
  async getComments(@Param('id') postId: string) {
    const comments = await this.postService.getAllComments(postId);
    return {
      status: 'success',
      statusCode: 200,
      message: 'Comments retrieved successfully',
      comments,
    };
  }

  @Post('comment/:id')
  async addComment(
    @Param('id') postId: string,
    @Body() createCommentDto: CreateCommentDto,
    @CurrentUser() user: any,
  ) {
    const comment = await this.postService.addComment(postId, createCommentDto, user.id);
    return {
      status: 'success',
      statusCode: 200,
      message: 'Comment added successfully',
      comment,
    };
  }

  @Delete('comment/:id/:commentId')
  async deleteComment(
    @Param('id') postId: string,
    @Param('commentId') commentId: string,
    @CurrentUser() user: any,
  ) {
    await this.postService.deleteComment(postId, commentId, user.id);
    return {
      status: 'success',
      statusCode: 200,
      message: 'Comment deleted successfully',
    };
  }

  @Get('user/posts/:userId')
  async getUserPosts(@Param('userId') userId: string, @Query('limit') limit?: string) {
    const limitNum = limit ? parseInt(limit, 10) : 20;
    const posts = await this.postService.getUserPosts(userId, limitNum);
    return {
      status: 'success',
      statusCode: 200,
      message: 'Posts retrieved successfully',
      posts,
      totalPosts: posts.length,
    };
  }

  @Post('posts/:postId/share')
  async sharePost(@Param('postId') postId: string, @CurrentUser() user: any) {
    const result = await this.postService.sharePost(postId, user.id);
    return {
      status: 'success',
      statusCode: 200,
      message: result.isNewShare ? 'Post shared successfully' : 'Post already shared',
      post: result.post,
      isNewShare: result.isNewShare,
    };
  }
}
