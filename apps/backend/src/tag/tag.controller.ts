import { Controller, Get, Post, Body } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiTags,
} from '@nestjs/swagger';
import { ITagsRO } from './tag.interface';
import { TagService } from './tag.service';
import { Tag } from './tag.entity';

@ApiBearerAuth()
@ApiTags('tags')
@Controller('tags')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Get()
  async findAll(): Promise<ITagsRO> {
    return this.tagService.findAll();
  }

  @Post()
  async create(@Body() createTagDto: { tag: string }): Promise<Tag> {
    return this.tagService.create(createTagDto.tag);
  }
}
