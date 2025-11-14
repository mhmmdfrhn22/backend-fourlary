-- CreateTable
CREATE TABLE `Role` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama_role` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Role_nama_role_key`(`nama_role`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `role_id` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `User_username_key`(`username`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Kategori` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `judul` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Post` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `judul` VARCHAR(191) NOT NULL,
    `kategori_id` INTEGER NOT NULL,
    `isi` VARCHAR(191) NOT NULL,
    `user_id` INTEGER NOT NULL,
    `foto` VARCHAR(191) NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'draft',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `KategoriFoto` (
    `id_kategori` INTEGER NOT NULL AUTO_INCREMENT,
    `nama_kategori` VARCHAR(191) NOT NULL,
    `tanggal_dibuat` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `dibuat_oleh` INTEGER NULL,

    PRIMARY KEY (`id_kategori`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `FotoGaleri` (
    `id_foto` INTEGER NOT NULL AUTO_INCREMENT,
    `id_kategori` INTEGER NOT NULL,
    `url_foto` VARCHAR(191) NOT NULL,
    `deskripsi` VARCHAR(191) NULL,
    `tanggal_upload` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `diupload_oleh` INTEGER NULL,

    PRIMARY KEY (`id_foto`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `KomentarFoto` (
    `id_komentar` INTEGER NOT NULL AUTO_INCREMENT,
    `id_foto` INTEGER NOT NULL,
    `id_user` INTEGER NOT NULL,
    `isi_komentar` VARCHAR(191) NOT NULL,
    `tanggal_komentar` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id_komentar`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LikeFoto` (
    `id_like` INTEGER NOT NULL AUTO_INCREMENT,
    `id_foto` INTEGER NOT NULL,
    `id_user` INTEGER NOT NULL,
    `tanggal_like` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `LikeFoto_id_foto_id_user_key`(`id_foto`, `id_user`),
    PRIMARY KEY (`id_like`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `GuruInfo` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama_guru` VARCHAR(191) NOT NULL,
    `foto_guru` VARCHAR(191) NULL,
    `mata_pelajaran` VARCHAR(191) NOT NULL,
    `deskripsi` VARCHAR(191) NULL,
    `link_sosial_media` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `JurusanSekolah` (
    `id_jurusan` INTEGER NOT NULL AUTO_INCREMENT,
    `nama_jurusan` VARCHAR(191) NOT NULL,
    `deskripsi` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id_jurusan`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PembimbingProfile` (
    `id_pembimbing` INTEGER NOT NULL AUTO_INCREMENT,
    `nama` VARCHAR(191) NOT NULL,
    `nomor_wa` VARCHAR(191) NULL,
    `link_wa` VARCHAR(191) NULL,
    `foto_pembimbing` VARCHAR(191) NULL,
    `jabatan` VARCHAR(191) NULL,
    `deskripsi` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id_pembimbing`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PembinatPekerjaan` (
    `id_pekerjaan` INTEGER NOT NULL AUTO_INCREMENT,
    `id_jurusan` INTEGER NULL,
    `id_pembimbing` INTEGER NULL,
    `nama_pekerjaan` VARCHAR(191) NOT NULL,
    `gambar_pekerjaan` VARCHAR(191) NULL,
    `deskripsi` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id_pekerjaan`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_role_id_fkey` FOREIGN KEY (`role_id`) REFERENCES `Role`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Post` ADD CONSTRAINT `Post_kategori_id_fkey` FOREIGN KEY (`kategori_id`) REFERENCES `Kategori`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Post` ADD CONSTRAINT `Post_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `KategoriFoto` ADD CONSTRAINT `KategoriFoto_dibuat_oleh_fkey` FOREIGN KEY (`dibuat_oleh`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FotoGaleri` ADD CONSTRAINT `FotoGaleri_id_kategori_fkey` FOREIGN KEY (`id_kategori`) REFERENCES `KategoriFoto`(`id_kategori`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FotoGaleri` ADD CONSTRAINT `FotoGaleri_diupload_oleh_fkey` FOREIGN KEY (`diupload_oleh`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `KomentarFoto` ADD CONSTRAINT `KomentarFoto_id_foto_fkey` FOREIGN KEY (`id_foto`) REFERENCES `FotoGaleri`(`id_foto`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `KomentarFoto` ADD CONSTRAINT `KomentarFoto_id_user_fkey` FOREIGN KEY (`id_user`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LikeFoto` ADD CONSTRAINT `LikeFoto_id_foto_fkey` FOREIGN KEY (`id_foto`) REFERENCES `FotoGaleri`(`id_foto`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LikeFoto` ADD CONSTRAINT `LikeFoto_id_user_fkey` FOREIGN KEY (`id_user`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PembinatPekerjaan` ADD CONSTRAINT `PembinatPekerjaan_id_jurusan_fkey` FOREIGN KEY (`id_jurusan`) REFERENCES `JurusanSekolah`(`id_jurusan`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PembinatPekerjaan` ADD CONSTRAINT `PembinatPekerjaan_id_pembimbing_fkey` FOREIGN KEY (`id_pembimbing`) REFERENCES `PembimbingProfile`(`id_pembimbing`) ON DELETE SET NULL ON UPDATE CASCADE;
