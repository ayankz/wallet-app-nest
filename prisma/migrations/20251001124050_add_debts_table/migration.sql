-- CreateEnum
CREATE TYPE "DebtStatus" AS ENUM ('PENDING', 'PAID', 'OVERDUE');

-- CreateEnum
CREATE TYPE "DebtDirection" AS ENUM ('LENT', 'BORROWED');

-- CreateTable
CREATE TABLE "debts" (
    "id" SERIAL NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "description" TEXT,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "status" "DebtStatus" NOT NULL DEFAULT 'PENDING',
    "proofFileUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER NOT NULL,
    "counterparty" TEXT NOT NULL,
    "direction" "DebtDirection" NOT NULL,

    CONSTRAINT "debts_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "debts" ADD CONSTRAINT "debts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
