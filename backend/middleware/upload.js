const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

const cloudinaryStorage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'nexus-gaming',
        allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
        transformation: [{ width: 1920, height: 1080, crop: 'limit' }],
    },
});

const uploadToCloudinary = multer({
    storage: cloudinaryStorage,
    limits: { fileSize: 10 * 1024 * 1024 },
});

const uploadToMemory = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 50 * 1024 * 1024 },
});

module.exports = { uploadToCloudinary, uploadToMemory };
