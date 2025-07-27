/*
  Warnings:

  - You are about to drop the column `svg_data` on the `avatars` table. All the data in the column will be lost.
  - You are about to drop the column `active_users` on the `daily_stats` table. All the data in the column will be lost.
  - You are about to drop the column `total_points` on the `daily_stats` table. All the data in the column will be lost.
  - You are about to drop the column `work_points` on the `work_records` table. All the data in the column will be lost.
  - You are about to drop the column `work_session_id` on the `work_records` table. All the data in the column will be lost.
  - You are about to drop the column `break_duration` on the `work_sessions` table. All the data in the column will be lost.
  - You are about to drop the column `total_cycles` on the `work_sessions` table. All the data in the column will be lost.
  - You are about to drop the column `work_duration` on the `work_sessions` table. All the data in the column will be lost.
  - The `status` column on the `work_sessions` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[user_id,date]` on the table `daily_stats` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `svg_path` to the `avatars` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `avatars` table without a default value. This is not possible if the table is not empty.
  - Added the required column `total_work_minutes` to the `daily_stats` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `daily_stats` table without a default value. This is not possible if the table is not empty.
  - Added the required column `work_minutes` to the `work_records` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `record_type` on the `work_records` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `break_minutes` to the `work_sessions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cycles` to the `work_sessions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `work_minutes` to the `work_sessions` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `session_type` on the `work_sessions` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "session_type" AS ENUM ('WORK', 'SHORT_BREAK', 'LONG_BREAK');

-- CreateEnum
CREATE TYPE "session_status" AS ENUM ('ACTIVE', 'PAUSED', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "record_type" AS ENUM ('POMODORO', 'MANUAL');

-- DropForeignKey
ALTER TABLE "work_records" DROP CONSTRAINT "work_records_user_id_fkey";

-- DropForeignKey
ALTER TABLE "work_records" DROP CONSTRAINT "work_records_work_session_id_fkey";

-- DropForeignKey
ALTER TABLE "work_sessions" DROP CONSTRAINT "work_sessions_user_id_fkey";

-- DropIndex
DROP INDEX "daily_stats_date_key";

-- AlterTable
ALTER TABLE "avatars" DROP COLUMN "svg_data",
ADD COLUMN     "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "svg_path" TEXT NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMPTZ NOT NULL;

-- AlterTable
ALTER TABLE "daily_stats" DROP COLUMN "active_users",
DROP COLUMN "total_points",
ADD COLUMN     "manual_count" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "pomodoro_count" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "total_work_minutes" INTEGER NOT NULL,
ADD COLUMN     "user_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "email_verified" TIMESTAMP(3),
ADD COLUMN     "image" TEXT,
ALTER COLUMN "name" DROP NOT NULL,
ALTER COLUMN "avatar_id" SET DEFAULT 1;

-- AlterTable
ALTER TABLE "work_records" DROP COLUMN "work_points",
DROP COLUMN "work_session_id",
ADD COLUMN     "work_minutes" INTEGER NOT NULL,
DROP COLUMN "record_type",
ADD COLUMN     "record_type" "record_type" NOT NULL;

-- AlterTable
ALTER TABLE "work_sessions" DROP COLUMN "break_duration",
DROP COLUMN "total_cycles",
DROP COLUMN "work_duration",
ADD COLUMN     "break_minutes" INTEGER NOT NULL,
ADD COLUMN     "cycles" INTEGER NOT NULL,
ADD COLUMN     "work_minutes" INTEGER NOT NULL,
DROP COLUMN "session_type",
ADD COLUMN     "session_type" "session_type" NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" "session_status" NOT NULL DEFAULT 'ACTIVE';

-- DropEnum
DROP TYPE "RecordType";

-- DropEnum
DROP TYPE "SessionStatus";

-- DropEnum
DROP TYPE "SessionType";

-- CreateTable
CREATE TABLE "accounts" (
    "id" TEXT NOT NULL DEFAULT uuid_generate_v4(),
    "user_id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "provider_account_id" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" TEXT NOT NULL DEFAULT uuid_generate_v4(),
    "session_token" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verification_tokens" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "accounts_provider_provider_account_id_key" ON "accounts"("provider", "provider_account_id");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_session_token_key" ON "sessions"("session_token");

-- CreateIndex
CREATE UNIQUE INDEX "verification_tokens_token_key" ON "verification_tokens"("token");

-- CreateIndex
CREATE UNIQUE INDEX "verification_tokens_identifier_token_key" ON "verification_tokens"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "daily_stats_user_id_date_key" ON "daily_stats"("user_id", "date");

-- AddForeignKey
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_sessions" ADD CONSTRAINT "work_sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_records" ADD CONSTRAINT "work_records_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
