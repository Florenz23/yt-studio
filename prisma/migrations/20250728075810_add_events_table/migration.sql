-- CreateTable
CREATE TABLE "events" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID,
    "session_id" TEXT,
    "event_type" TEXT NOT NULL,
    "event_category" TEXT,
    "event_action" TEXT,
    "event_label" TEXT,
    "event_value" DOUBLE PRECISION,
    "timestamp" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "events_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_events_user_id" ON "events"("user_id");

-- CreateIndex
CREATE INDEX "idx_events_session_id" ON "events"("session_id");

-- CreateIndex
CREATE INDEX "idx_events_type" ON "events"("event_type");

-- CreateIndex
CREATE INDEX "idx_events_category" ON "events"("event_category");

-- CreateIndex
CREATE INDEX "idx_events_timestamp" ON "events"("timestamp");
