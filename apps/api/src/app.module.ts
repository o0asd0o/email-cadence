import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { DatabaseModule } from "./db/database.module";
import { CadencesModule } from "./cadences/cadences.module";
import { EnrollmentsModule } from "./enrollments/enrollments.module";
import { TemporalModule } from "./temporal/temporal.module";

@Module({
  imports: [DatabaseModule, TemporalModule, CadencesModule, EnrollmentsModule],
  controllers: [AppController],
})
export class AppModule {}
