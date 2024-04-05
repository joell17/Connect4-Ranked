const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function addNewFieldToDocuments() {
    const updateResult = await prisma.user_data.updateMany({
        data: {
            rank: 'Iron', // Set a default value for the new field
        },
    });

    console.log(`${updateResult.count} documents updated.`);
}

addNewFieldToDocuments()
    .catch((e) => {
        throw e;
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
