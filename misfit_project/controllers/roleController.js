const RolePrivileges = require("../models/RolePrivilegesModel");
const Roles = require("../models/RolesModel");

// Get all roles
exports.getAllRoles = async (req, res) => {
    try {
        const roles = await Roles.find();
        res.status(200).json(roles);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a single role by ID
exports.getRoleById = async (req, res) => {
    try {
        const role = await Roles.findById(req.params.id).populate('RolePrivileges');
        if (!role) {
            return res.status(404).json({ message: 'Role not found' });
        }
        res.status(200).json(role);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create a new role
exports.createRole = async (req, res) => {

    try {
        let body = req.body;
        const incomingRole = req.body.role_name;

        const checkRole = await Roles.findOne({ role_name: incomingRole });
        if (checkRole) {
            return res.status(400).json({ message: 'Bu rol zaten var' });
        }

        if (!req.body.privileges || req.body.privileges.length === 0) {
            return res.status(400).json({ message: 'Privileges are required' });
        }


        const createdRole = await Roles.create({
            role_name: incomingRole,
            description: req.body.description,
            /* privileges: rolePrivs.map(privilege => privilege._id), */
            is_active: req.body.is_active,
            created_by: req.body.created_by
        });

        for (let i = 0; i < body.privileges.length; i++) {
            let priv = new RolePrivileges({
                role_id: createdRole._id,
                privilege: body.privileges[i],
                created_by: req.user?.id
            });
            await priv.save();
        }


        res.status(201).json({ message: createdRole });
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Update an existing role   
exports.updateRole = async (req, res) => {
    try {
        const role = await Roles.findById(req.params.id);
        if (!role) {
            return res.status(404).json({ message: 'Role not found' });
        }

        if (!(Array.isArray(req.body.privileges)) && !(req.body.privileges.length > 0)) {
            return res.status(404).json({ message: 'The role must have least one privilege' })
        }
        role.role_name = req.body.role_name;
        role.is_active = req.body.is_active;

        let existingPrivs = await RolePrivileges.find({ role_id: req.params.id }).select("privilege").exec();

        let newPrivs = req.body.privileges.filter(prvs => !existingPrivs.includes(prvs));

        let removingPrivs = existingPrivs.filter(prvs => !req.body.privileges.includes(prvs))

        if (newPrivs.length > 0) {
            await RolePrivileges.insertMany(newPrivs.map(privilege => ({
                role_id: req.params.id,
                privilege,
                created_by: req.user?.id
            })));
        }

        if (removingPrivs.length > 0) {
            await RolePrivileges.deleteMany({ role_id: req.params.id, privilege: { $in: removingPrivs.map(p => p.privilege) } })
        }

        const updatedRole = await role.save();

        res.status(200).json({ Updated: updatedRole, AddedPrivs: newPrivs, DeletedPrivs: removingPrivs });

    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete a role
exports.deleteRole = async (req, res) => {
    try {
        const role = await Roles.findById(req.params.id);
        if (!role) {
            return res.status(404).json({ message: 'Role not found' });
        }

        await Roles.findByIdAndDelete(req.params.id);
        await RolePrivileges.deleteMany({ role_id: req.params.id });
        res.status(200).json({ message: 'Role deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};