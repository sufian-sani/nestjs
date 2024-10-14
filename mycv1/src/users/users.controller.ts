import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Patch,
    Delete,
    Query,
    UseInterceptors,
    ClassSerializerInterceptor,
    Session, UseGuards,
} from '@nestjs/common';
import {CreateUserDto} from "./dto/create-user.dto";
import {UsersService} from "./users.service";
import {UpdateUserDto} from "./dto/update-user.dto";
import {Serialize, SerializeInterceptor} from "../../interceptors/serialize.interceptor";
import {UserDto} from "./dto/user.dto";
import {AuthService} from "./auth.service";
import {User} from "./user.entity";
import {CurrentUser} from "./decorators/current-user.decorator";
import {CurrentUserInterceptor} from "./interceptors/current-user.interceptor";
import {AuthGuard} from "../guards/auth.guard";

@Controller('auth')
@Serialize(UserDto)
// @UseInterceptors(CurrentUserInterceptor)
export class UsersController {
    constructor(
        private usersService: UsersService,
        private authService: AuthService,
    ) {}

    // @Serialize(UserDto)
    @Post('/signup')
    async createUser(@Body() body: CreateUserDto, @Session() session: any) {
        const userId = await this.authService.signup(body.email, body.password)
        session.userId = userId;
        return userId
        // return this.usersService.create(body.email, body.password)
    }

    // @Serialize(UserDto)
    @Post('/signin')
    async signin(@Body() body: CreateUserDto, @Session() session: any){
        const userId = await this.authService.signin(body.email, body.password)
        session.userId = userId;
        return userId
    }

    @Post('/signout')
    signOut(@Session() session: any) {
        session.userId = null;
    }

    // -----------------------
    // @Get('/whoami')
    // async whoAmI(@Session() session: any) {
    //     const currentUser = await this.usersService.findOne(session.userId);
    //     // console.log('currentUser', currentUser)
    //     return currentUser;
    // }
    // @Serialize(UserDto)
    @UseGuards(AuthGuard)
    @Get('/whoami')
    async whoAmI(@CurrentUser() user: User) {
        // const currentUser = await this.usersService.findOne(session.userId);
        // return currentUser;
        return user;
    }

    @Get('/color/:color')
    setColor(@Param('color') color: string, @Session() session: any) {
        session.color = color
        return session
    }
    @Get('/color')
    getColor(@Session() session: any){
        return session.color
    }
    // ----------------------------

    // @UseInterceptors(ClassSerializerInterceptor)
    // @Serialize(UserDto)
    @Get()
    getAllUsers(@Query('email') email: string){
        return this.usersService.find(email);
    }
    // @UseInterceptors(new SerializeInterceptor(UserDto))
    // @Serialize(UserDto)
    @Get('/:id')
    getById(@Param('id') id: number) {
        return this.usersService.findOne(id)
    }
    @Patch('/:id')
    async updateUser(@Param('id') id: string, @Body() body: UpdateUserDto){
        return this.usersService.update(parseInt(id), body)
    }
    @Delete(':id')
    async removeUser(@Param('id') id: string) {
        return this.usersService.remove(parseInt(id));
    }
}
