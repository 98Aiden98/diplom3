import { Controller, Get, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';
import { ReportRangeDto } from './dto/report-range.dto';
import { ReportsService } from './reports.service';

@ApiTags('Reports')
@ApiBearerAuth()
@Roles(Role.ADMIN)
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('summary')
  @ApiOperation({ summary: 'Get summary report' })
  getSummary(@Query() range: ReportRangeDto) {
    return this.reportsService.getSummary(range);
  }

  @Get('revenue')
  @ApiOperation({ summary: 'Get revenue report' })
  getRevenue(@Query() range: ReportRangeDto) {
    return this.reportsService.getRevenue(range);
  }

  @Get('popular-services')
  @ApiOperation({ summary: 'Get popular services report' })
  getPopularServices(@Query() range: ReportRangeDto) {
    return this.reportsService.getPopularServices(range);
  }

  @Get('doctors-load')
  @ApiOperation({ summary: 'Get doctors load report' })
  getDoctorsLoad(@Query() range: ReportRangeDto) {
    return this.reportsService.getDoctorsLoad(range);
  }
}
