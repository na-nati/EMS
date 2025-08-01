import { Router } from "express";
import {
  registeruser,
  loginuser,
  getAllUsers,
  updateProfilePicture,
  getProfile,
} from "../controllers/userController";
import { validateBody } from "../middleware/validateBody";
import { registerUserSchema, loginUserSchema } from "../validation/userValidation";
import { authMiddleware } from "../middleware/authMiddleware";
import { upload, handleMulterError } from "../middleware/uploadMiddleware";

const router = Router();

router.post("/register", validateBody(registerUserSchema), registeruser);

router.post("/login", validateBody(loginUserSchema), loginuser);

router.get("/", getAllUsers);

// Get user profile (requires authentication)
router.get("/profile", authMiddleware, getProfile);

// Update profile picture (requires authentication and file upload)
router.patch("/:userId/profile-picture",
  authMiddleware,
  upload.single('profilePicture'),
  handleMulterError,
  updateProfilePicture
);

export default router;
