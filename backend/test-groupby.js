const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        await prisma.orderItem.groupBy({
            by: ['menuItemId'],
            where: { order: { branchId: 'test' } },
            _sum: { quantity: true },
        });
        console.log("SUCCESS");
    } catch(e) {
        console.error("FAIL", e.message);
    }
    await prisma.$disconnect();
}

main();
