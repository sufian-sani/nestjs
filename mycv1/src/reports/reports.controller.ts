import {Controller, Post, Body, UseGuards, Patch, Param} from '@nestjs/common';
import {ReportsService} from "./reports.service";
import {CreateUserDto} from "./dto/create-report.dto";
import {AuthGuard} from "../guards/auth.guard";
import {CurrentUser} from "../users/decorators/current-user.decorator";
import {User} from "../users/user.entity";
import {Serialize} from "../../interceptors/serialize.interceptor";
import {ReportDto} from "./dto/report.dto";
import {ApproveReportDto} from "./dto/approve-report.dto";
import {AdminGuard} from "../guards/admin.guard";

@Controller('reports')
export class ReportsController {
    constructor(private reportService: ReportsService) {}

    @Post()
    @UseGuards(AuthGuard)
    @Serialize(ReportDto)
    createReport(@Body() body: CreateUserDto, @CurrentUser() user: User){
        return this.reportService.create(body, user)
    }

    @Patch('/:id')
    // @UseGuards(AuthGuard)
    @UseGuards(AdminGuard)
    approveReport(@Param('id') id:string, @Body() body:ApproveReportDto){
        return this.reportService.changeApproval(id, body.approved)
    }
}
