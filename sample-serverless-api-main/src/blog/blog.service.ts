import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Blog } from './blog.entity';

@Injectable()
export class BlogService {
    constructor(
        @InjectRepository(Blog)
        private readonly blogRepository: Repository<Blog>,
    ) {}

    create(blog: Partial<Blog>): Promise<Blog> {
        const newBlog = this.blogRepository.create(blog);
        return this.blogRepository.save(newBlog);
    }

    findAll(): Promise<Blog[]> {
        return this.blogRepository.find();
    }

    findOne(id: number): Promise<Blog> {
        return this.blogRepository.findOne({ where: { id } });
    }

    async update(id: number, blog: Partial<Blog>): Promise<Blog> {
        await this.blogRepository.update(id, blog);
        return this.blogRepository.findOne({ where: { id } });
    }

    async delete(id: number): Promise<void> {
        await this.blogRepository.delete(id);
    }
}
