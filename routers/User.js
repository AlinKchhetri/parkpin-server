import express from "express";
import { register, verify, login, logout, addTask, removeTask, completeTask, getMyProfile, updateProfile, updatePassword, forgotPassword, resetPassword, getUserDetails, registerToken, googleAuthRegister, resendOTP, verifyPassword, changeRole, getAllUser, deleteUser } from "../controllers/User.js";
import { isAuthenticated } from "../middleware/auth.js";

const router = express.Router();

router.route("/register").post(register);
router.route("/verify").post(verify);

router.route("/login").post(login);
router.route("/verifypassword").post(verifyPassword);
router.route("/googleauth").post(googleAuthRegister);
router.route("/me").get(isAuthenticated, getMyProfile);
router.route("/alluser").get(getAllUser);
router.route("/deleteuser/:id").delete(deleteUser);
router.route("/updateprofile").put(isAuthenticated, updateProfile);
router.route("/changerole").put(isAuthenticated, changeRole);
router.route("/updatepassword").put(isAuthenticated, updatePassword);
router.route("/forgotpassword").post(forgotPassword);
router.route("/resendotp").get(isAuthenticated, resendOTP);
router.route("/resetpassword").post(resetPassword);
router.route("/logout").get(logout);

router.route("/newtask").post(isAuthenticated, addTask);
router.route("/task/:taskId").get(isAuthenticated, completeTask).delete(isAuthenticated, removeTask);


router.route("/getuser/:id").get(getUserDetails);
router.route("/token").put(isAuthenticated, registerToken);

export default router;