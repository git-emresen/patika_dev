const express = require('express');
const roleController = require('../controllers/roleController');
const auth=require("../lib/auth");

const router = express.Router();

router.use(auth.authMiddleware);

// Get all roles
router.get('/', roleController.getAllRoles);

// Get a single role by ID
router.get('/:id', roleController.getRoleById);

// Create a new role
router.post('/create', roleController.createRole);

// Update a role by ID
router.post('/update/:id', roleController.updateRole);

// Delete a role by ID
router.post('/delete/:id', roleController.deleteRole);

module.exports = router;