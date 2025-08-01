"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("../controllers/userController");
const validateBody_1 = require("../middleware/validateBody");
const userValidation_1 = require("../validation/userValidation");
const authMiddleware_1 = require("../middleware/authMiddleware");
const uploadMiddleware_1 = require("../middleware/uploadMiddleware");
const router = (0, express_1.Router)();
router.post("/register", (0, validateBody_1.validateBody)(userValidation_1.registerUserSchema), userController_1.registeruser);
router.post("/login", (0, validateBody_1.validateBody)(userValidation_1.loginUserSchema), userController_1.loginuser);
router.get("/", userController_1.getAllUsers);
// Get user profile (requires authentication)
router.get("/profile", authMiddleware_1.authMiddleware, userController_1.getProfile);
// Update profile picture (requires authentication and file upload)
router.patch("/:userId/profile-picture", authMiddleware_1.authMiddleware, uploadMiddleware_1.upload.single('profilePicture'), uploadMiddleware_1.handleMulterError, userController_1.updateProfilePicture);
exports.default = router;
