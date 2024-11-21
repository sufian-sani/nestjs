import {Injectable, NestMiddleware} from "@nestjs/common";
import {UsersService} from "../users.service";
import { Request, Response, NextFunction } from 'express';
import {User} from "../user.entity";

declare global {
    namespace Express {
        interface Request {
            currentUser?: User;
        }
    }
}

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
    constructor(private usersService: UsersService) {}
    async use(req: Request, res: Response, next: NextFunction) {
        // @ts-ignore
        const { userId } = req.session || {}
        if(userId){
            const user = await this.usersService.findOne(userId.id)
            req.currentUser = user;
        }
        next();
    }
}