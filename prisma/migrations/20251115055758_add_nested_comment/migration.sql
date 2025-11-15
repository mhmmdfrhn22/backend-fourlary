-- AlterTable
ALTER TABLE `KomentarFoto` ADD COLUMN `parent_id` INTEGER NULL;

-- CreateIndex
CREATE INDEX `KomentarFoto_parent_id_idx` ON `KomentarFoto`(`parent_id`);

-- AddForeignKey
ALTER TABLE `KomentarFoto` ADD CONSTRAINT `KomentarFoto_parent_id_fkey` FOREIGN KEY (`parent_id`) REFERENCES `KomentarFoto`(`id_komentar`) ON DELETE SET NULL ON UPDATE CASCADE;

-- RenameIndex
ALTER TABLE `KomentarFoto` RENAME INDEX `KomentarFoto_id_foto_fkey` TO `KomentarFoto_id_foto_idx`;

-- RenameIndex
ALTER TABLE `KomentarFoto` RENAME INDEX `KomentarFoto_id_user_fkey` TO `KomentarFoto_id_user_idx`;
