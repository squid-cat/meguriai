const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function cleanupSessions() {
  try {
    console.log('Starting session cleanup...');

    // 期限切れのセッションを削除（24時間以前）
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    
    const deletedSessions = await prisma.session.deleteMany({
      where: {
        expires: {
          lt: new Date()
        }
      }
    });

    console.log(`Deleted ${deletedSessions.count} expired sessions`);

    // 古いverification tokensも削除
    const deletedTokens = await prisma.verificationToken.deleteMany({
      where: {
        expires: {
          lt: new Date()
        }
      }
    });

    console.log(`Deleted ${deletedTokens.count} expired verification tokens`);

    console.log('Session cleanup completed successfully');
  } catch (error) {
    console.error('Error during session cleanup:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

cleanupSessions(); 