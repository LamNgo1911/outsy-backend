-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "birthdate" TIMESTAMP(3) NOT NULL,
    "bio" TEXT,
    "profilePicture" TEXT,
    "location" TEXT NOT NULL,
    "interests" TEXT[],
    "status" TEXT NOT NULL DEFAULT 'active',
    "onlineStatus" BOOLEAN NOT NULL DEFAULT false,
    "preferences" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "igUrl" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
