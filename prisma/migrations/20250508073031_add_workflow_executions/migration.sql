-- CreateTable
CREATE TABLE "workflow_executions" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "workflow_id" UUID NOT NULL,
    "ip_address" TEXT,
    "user_agent" TEXT,
    "referer" TEXT,
    "execution_time" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "geo_country" TEXT,
    "geo_region" TEXT,
    "geo_city" TEXT,
    "successful" BOOLEAN NOT NULL DEFAULT true,
    "error_message" TEXT,

    CONSTRAINT "workflow_executions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_workflow_executions_workflow_id" ON "workflow_executions"("workflow_id");

-- CreateIndex
CREATE INDEX "idx_workflow_executions_time" ON "workflow_executions"("execution_time");

-- CreateIndex
CREATE INDEX "idx_workflow_executions_ip" ON "workflow_executions"("ip_address");

-- AddForeignKey
ALTER TABLE "workflow_executions" ADD CONSTRAINT "workflow_executions_workflow_id_fkey" FOREIGN KEY ("workflow_id") REFERENCES "workflows"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
