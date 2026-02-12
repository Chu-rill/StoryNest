import { IsString, MinLength, MaxLength, IsOptional, IsEnum, IsArray, ArrayMaxSize } from 'class-validator';

enum Category {
  Technology = 'Technology',
  Travel = 'Travel',
  Food = 'Food',
  Lifestyle = 'Lifestyle',
  Other = 'Other',
}

enum PostFormat {
  rich = 'rich',
  markdown = 'markdown',
}

export class CreatePostDto {
  @IsString()
  @MinLength(5, { message: 'Title must be at least 5 characters long' })
  @MaxLength(100, { message: 'Title must not exceed 100 characters' })
  title: string;

  @IsOptional()
  @IsString()
  @MinLength(10, { message: 'Summary must be at least 10 characters long' })
  @MaxLength(200, { message: 'Summary must not exceed 200 characters' })
  summary?: string;

  @IsString()
  @MinLength(50, { message: 'Content must be at least 50 characters long' })
  content: string;

  @IsOptional()
  @IsEnum(PostFormat)
  format?: PostFormat;

  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(5, { message: 'Maximum 5 tags allowed' })
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsEnum(Category)
  category?: Category;
}
