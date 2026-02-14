import { Controller, Get } from "@nestjs/common";

@Controller()
export class AppController {
  @Get()
  root() {
    return {
      name: "Email Cadence API",
      version: "1.0.0",
      endpoints: {
        cadences: "/cadences",
        enrollments: "/enrollments",
        health: "/health",
      },
    };
  }

  @Get("health")
  health() {
    return {
      status: "ok",
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    };
  }
}
