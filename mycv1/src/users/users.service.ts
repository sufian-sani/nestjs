import {Injectable, NotFoundException} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
    constructor(@InjectRepository(User) private repo: Repository<User>) {}

    async create(email: string, password: string) {
        const user = this.repo.create({ email, password });
        return await this.repo.save(user);
    }
    find(email: string) {
        return this.repo.find({ where: { email: email } });
    }
    async findOne(id: number) {
        if(!id){
            throw new NotFoundException('Any User not found');
        }
        return this.repo.findOne({ where: { id } });
    }
    async update(id: number, attrs: Partial<User>){
        const user = await this.repo.findOne({ where: { id } });
        if (!user) {
            throw new Error('User does not exist');
        }
        Object.assign(user, attrs);
        return this.repo.save(user);
    }
    async remove(id: number){
        const user = await this.repo.findOne({ where: { id } });
        if (!user) {
            throw new Error('User does not exist');
        }
        await this.repo.remove(user);
    }
}
