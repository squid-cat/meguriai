const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function resetAllSessions() {
  try {
    console.log('🚨 RESETTING ALL SESSIONS - This will log out all users!');
    
    // 3秒待機してキャンセルの機会を与える
    console.log('Starting in 3 seconds... Press Ctrl+C to cancel');
    await new Promise(resolve => setTimeout(resolve, 3000));

    console.log('Deleting all sessions...');
    
    // 全セッションを削除
    const deletedSessions = await prisma.session.deleteMany({});
    console.log(`✅ Deleted ${deletedSessions.count} sessions`);

    // 全verification tokensを削除
    const deletedTokens = await prisma.verificationToken.deleteMany({});
    console.log(`✅ Deleted ${deletedTokens.count} verification tokens`);

    // 全accountsも削除（再ログインが必要）
    const deletedAccounts = await prisma.account.deleteMany({});
    console.log(`✅ Deleted ${deletedAccounts.count} OAuth accounts`);

    console.log('🎉 All sessions have been reset. Users will need to log in again.');
  } catch (error) {
    console.error('❌ Error during session reset:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

resetAllSessions(); 