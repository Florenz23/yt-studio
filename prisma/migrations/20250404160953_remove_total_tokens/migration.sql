/*
  Warnings:

  - You are about to drop the column `total_tokens` on the `workflow_metrics` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "workflow_metrics" DROP COLUMN "total_tokens";
