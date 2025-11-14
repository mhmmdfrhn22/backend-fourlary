const prisma = require('../config/db'); // pastikan ini import PrismaClient instance

// 🔹 GET semua role
exports.getAllRoles = async () => {
  const roles = await prisma.role.findMany({
    orderBy: { id: 'desc' },
  });
  return roles;
};

// 🔹 GET role by ID
exports.getRoleById = async (id) => {
  const role = await prisma.role.findUnique({
    where: { id: Number(id) },
  });
  return role;
};

// 🔹 CREATE role baru
exports.createRole = async (nama_role) => {
  const role = await prisma.role.create({
    data: { nama_role },
  });
  return role;
};

// 🔹 UPDATE role
exports.updateRole = async (id, nama_role) => {
  const role = await prisma.role.update({
    where: { id: Number(id) },
    data: { nama_role },
  });
  return role;
};

// 🔹 DELETE role
exports.deleteRole = async (id) => {
  const role = await prisma.role.delete({
    where: { id: Number(id) },
  });
  return role;
};
