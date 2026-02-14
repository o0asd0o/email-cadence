-- CreateTable
CREATE TABLE "Cadence" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "steps" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Enrollment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "cadenceId" TEXT NOT NULL,
    "contactEmail" TEXT NOT NULL,
    "workflowId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Enrollment_cadenceId_fkey" FOREIGN KEY ("cadenceId") REFERENCES "Cadence" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
