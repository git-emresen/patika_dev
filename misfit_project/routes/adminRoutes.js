
const express = require('express')
const adminControllers = require('../controllers/adminControllers');
const auth=require("../lib/auth.js");
;
const router = express.Router();

router.use(auth.authMiddleware);   

router.route("/users").get(auth.checkRoles("admin_view"),adminControllers.getAllUsers);
router.route("/users/create").post(adminControllers.createUser);
router.route("/users/:id").get(adminControllers.getUser);
router.route("/users/:id").put(adminControllers.updateUser);
router.route("/users/:id").delete(adminControllers.deleteUser);

module.exports = router;