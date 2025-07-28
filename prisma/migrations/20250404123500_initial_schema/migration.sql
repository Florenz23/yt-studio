-- CreateEnum
CREATE TYPE "workflow_status" AS ENUM ('PENDING', 'STARTING', 'RUNNING', 'COMPLETED', 'FAILED');

-- CreateTable
CREATE TABLE "workflow_metrics" (
    "workflow_id" UUID NOT NULL,
    "start_time" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "end_time" TIMESTAMPTZ(6),
    "execution_time_seconds" DOUBLE PRECISION,
    "prompt_tokens" INTEGER NOT NULL DEFAULT 0,
    "completion_tokens" INTEGER NOT NULL DEFAULT 0,
    "total_tokens" INTEGER,

    CONSTRAINT "workflow_metrics_pkey" PRIMARY KEY ("workflow_id")
);

-- CreateTable
CREATE TABLE "workflow_status_updates" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "workflow_id" UUID NOT NULL,
    "status" "workflow_status" NOT NULL,
    "message" TEXT NOT NULL,
    "progress" INTEGER,
    "timestamp" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "workflow_status_updates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workflows" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "workflow_type" TEXT NOT NULL,
    "framework" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "status" "workflow_status" NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "input_data" JSONB NOT NULL,
    "result_data" JSONB,
    "execution_time_seconds" DOUBLE PRECISION,

    CONSTRAINT "workflows_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_status_updates_workflow_id" ON "workflow_status_updates"("workflow_id");

-- CreateIndex
CREATE INDEX "idx_workflows_framework" ON "workflows"("framework");

-- CreateIndex
CREATE INDEX "idx_workflows_model" ON "workflows"("model");

-- CreateIndex
CREATE INDEX "idx_workflows_status" ON "workflows"("status");

-- CreateIndex
CREATE INDEX "idx_workflows_type" ON "workflows"("workflow_type");

-- AddForeignKey
ALTER TABLE "workflow_metrics" ADD CONSTRAINT "workflow_metrics_workflow_id_fkey" FOREIGN KEY ("workflow_id") REFERENCES "workflows"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "workflow_status_updates" ADD CONSTRAINT "workflow_status_updates_workflow_id_fkey" FOREIGN KEY ("workflow_id") REFERENCES "workflows"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
