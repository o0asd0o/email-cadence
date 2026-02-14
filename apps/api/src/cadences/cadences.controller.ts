import { Controller, Post, Get, Put, Param, Body } from "@nestjs/common";
import { CadencesService } from "./cadences.service";
import type { CreateCadenceDto, UpdateCadenceDto } from "@cadence/shared";

@Controller("cadences")
export class CadencesController {
  constructor(private readonly cadencesService: CadencesService) {}

  @Post()
  async create(@Body() body: CreateCadenceDto) {
    return this.cadencesService.create(body);
  }

  @Get()
  async findAll() {
    return this.cadencesService.findAll();
  }

  @Get(":id")
  async findOne(@Param("id") id: string) {
    return this.cadencesService.findById(id);
  }

  @Put(":id")
  async update(@Param("id") id: string, @Body() body: UpdateCadenceDto) {
    return this.cadencesService.update(id, body);
  }
}
