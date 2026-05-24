import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { CycleService } from './cycle.service';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AnyAdminJwtGuard } from 'src/auth/guard';
import { CycleCreateDto } from './dto';

@ApiBearerAuth('access_token')
@UseGuards(AnyAdminJwtGuard)
@Controller('cycle')
export class CycleController {
    constructor(private cycleService: CycleService) {}
    
    @ApiOperation({ summary: 'Create Cycle' })
    @ApiBody({ type: CycleCreateDto})
    @Post()
    postCycle(@Body() body: CycleCreateDto) {
        return this.cycleService.createCycle(body);
    }

    @ApiOperation({ summary: 'Get All Cycles' })
    @Get()
    getCycles() {
        return this.cycleService.getAllCycles();
    }

}
