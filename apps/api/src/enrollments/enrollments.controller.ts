import { Controller, Post, Get, Param, Body } from "@nestjs/common";
import { EnrollmentsService } from "./enrollments.service";
import type {
  CreateEnrollmentDto,
  UpdateCadenceSignalDto,
} from "@cadence/shared";

@Controller("enrollments")
export class EnrollmentsController {
  constructor(private readonly enrollmentsService: EnrollmentsService) {}

  @Post()
  async create(@Body() body: CreateEnrollmentDto) {
    return this.enrollmentsService.create(body.cadenceId, body.contactEmail);
  }

  @Get()
  async findAll() {
    return this.enrollmentsService.findAll();
  }

  @Get(":id")
  async findOne(@Param("id") id: string) {
    return this.enrollmentsService.findById(id);
  }

  @Post(":id/update-cadence")
  async updateCadence(
    @Param("id") id: string,
    @Body() body: UpdateCadenceSignalDto,
  ) {
    return this.enrollmentsService.updateCadence(id, body.steps);
  }
}
