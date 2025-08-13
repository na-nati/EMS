"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("../controllers/userController");
const validateBody_1 = require("../middleware/validateBody");
const userValidation_1 = require("../validation/userValidation");
const authMiddleware_1 = require("../middleware/authMiddleware");
const uploadMiddleware_1 = require("../middleware/uploadMiddleware");
const router = (0, express_1.Router)();
// Public routes
router.post("/register", (0, validateBody_1.validateBody)(userValidation_1.registerUserSchema), userController_1.registeruser);
router.post("/login", (0, validateBody_1.validateBody)(userValidation_1.loginUserSchema), userController_1.loginuser);
router.post("/refresh-token", userController_1.refreshToken);
router.post("/logout", userController_1.logout);
// Protected routes - require authentication
router.use(authMiddleware_1.authMiddleware);
// User profile management
router.get("/profile", userController_1.getProfile);
router.put("/profile", userController_1.updateProfile);
// Profile picture management
router.patch("/:userId/profile-picture", uploadMiddleware_1.upload.single('profilePicture'), uploadMiddleware_1.handleMulterError, userController_1.updateProfilePicture);
// Admin only routes
router.get("/", (0, authMiddleware_1.authorizeRoles)('super_admin', 'hr'), userController_1.getAllUsers);
exports.default = router;
//# sourceMappingURL=userRoutes.js.map