import { Injectable } from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import { Repository } from 'typeorm';
import {Report} from "./report.entity";
import {CreateReportDtoDto} from "./dto/create-report.dto";
import {User} from "../users/user.entity";
import {request} from "express";


@Injectable()
export class ReportsService {
    constructor(@InjectRepository(Report) private repo: Repository<Report>) {}
    create(reportDto: CreateReportDtoDto, user: User) {
        const report = this.repo.create(reportDto);
        report.user = user;
        // console.log(user)
        return this.repo.save(report);
    }
    async changeApproval(id: string, approved: boolean) {
        const report = await this.repo.findOne({ where: { id: parseInt(id) } });
        report.approved = approved;
        return this.repo.save(report);
    }
}
