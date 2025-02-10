
const express = require('express');
const router = express.Router();

const adminControllers = require('../controllers/adminControllers');


router.route("/users").get(adminControllers.getAllUsers);
router.route("/users/create").post(adminControllers.createUser);
router.route("/users/:id").get(adminControllers.getUser);
router.route("/users/:id").put(adminControllers.updateUser);
router.route("/users/:id").delete(adminControllers.deleteUser);

module.exports = router;