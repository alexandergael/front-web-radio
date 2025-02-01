-- CreateTable
CREATE TABLE `Playlist` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `color` VARCHAR(191) NOT NULL,
    `pochetteUrl` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Song` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `artist` VARCHAR(191) NOT NULL,
    `songUrl` VARCHAR(191) NOT NULL,
    `duration` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Tag` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PlaylistSong` (
    `playlistId` INTEGER NOT NULL,
    `songId` INTEGER NOT NULL,

    PRIMARY KEY (`playlistId`, `songId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_SongToTags` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_SongToTags_AB_unique`(`A`, `B`),
    INDEX `_SongToTags_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `PlaylistSong` ADD CONSTRAINT `PlaylistSong_playlistId_fkey` FOREIGN KEY (`playlistId`) REFERENCES `Playlist`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PlaylistSong` ADD CONSTRAINT `PlaylistSong_songId_fkey` FOREIGN KEY (`songId`) REFERENCES `Song`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_SongToTags` ADD CONSTRAINT `_SongToTags_A_fkey` FOREIGN KEY (`A`) REFERENCES `Song`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_SongToTags` ADD CONSTRAINT `_SongToTags_B_fkey` FOREIGN KEY (`B`) REFERENCES `Tag`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
