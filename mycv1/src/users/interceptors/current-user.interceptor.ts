import {
    NestInterceptor,
    Injectable,
    ExecutionContext,
    CallHandler
} from "@nestjs/common";
import {UsersService} from "../users.service";

@Injectable()
export class CurrentUserInterceptor implements NestInterceptor {
    constructor(private usersService: UsersService) {}

    async intercept(context: ExecutionContext, handler: CallHandler){
        const request = context.switchToHttp().getRequest();
        const { userId } = request.session || {};
        // console.log(userId)
        // if (typeof userId === 'object') {
        //     let userId = userId['id'];
        // }
        if(userId){
            if (typeof userId === 'object'){
                const user = await this.usersService.findOne(userId['id']);
                request.currentUser = user;
            }
            else{
                const user = await this.usersService.findOne(userId);
                request.currentUser = user;
            }
        }
        return handler.handle()
    }
}