const { PrismaClient } = require("@prisma/client")

const db = new PrismaClient()

db.$connect().catch((err) => { console.log(err); })

module.exports = db
