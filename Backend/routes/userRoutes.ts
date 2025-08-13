import { Router } from "express";
import {
  registeruser,
  loginuser,
  getAllUsers,
  updateProfilePicture,
  getProfile,
  updateProfile,
  refreshToken,
  logout
} from "../controllers/userController";
import { validateBody } from "../middleware/validateBody";
import { registerUserSchema, loginUserSchema } from "../validation/userValidation";
import { authMiddleware, authorizeRoles } from "../middleware/authMiddleware";
import { upload, handleMulterError } from "../middleware/uploadMiddleware";

const router = Router();

// Public routes
router.post("/register", validateBody(registerUserSchema), registeruser);
router.post("/login", validateBody(loginUserSchema), loginuser);
router.post("/refresh-token", refreshToken);
router.post("/logout", logout);

// Protected routes - require authentication
router.use(authMiddleware);

// User profile management
router.get("/profile", getProfile);
router.put("/profile", updateProfile);

// Profile picture management
router.patch("/:userId/profile-picture",
  upload.single('profilePicture'),
  handleMulterError,
  updateProfilePicture
);

// Admin only routes
router.get("/", authorizeRoles('super_admin', 'hr'), getAllUsers);

export default router;
