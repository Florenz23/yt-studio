-- CreateTable
CREATE TABLE "github_star_records" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "repo_owner" TEXT NOT NULL,
    "repo_name" TEXT NOT NULL,
    "stars_count" INTEGER NOT NULL,
    "record_date" DATE NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "github_star_records_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_github_stars_repo" ON "github_star_records"("repo_owner", "repo_name");

-- CreateIndex
CREATE INDEX "idx_github_stars_date" ON "github_star_records"("record_date");
