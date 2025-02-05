"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUser = exports.createUser = exports.getUserById = exports.getUsers = void 0;
const client_1 = require("@prisma/client");
const uuid_1 = require("uuid");
const prisma = new client_1.PrismaClient();
// Get all users
const getUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield prisma.user.findMany();
        res.json(users);
    }
    catch (error) {
        res.status(500).json({ message: "Error retrieving users" });
    }
});
exports.getUsers = getUsers;
// Get a user by ID
const getUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const user = yield prisma.user.findUnique({ where: { id } });
        if (user) {
            res.json(user);
        }
        else {
            res.status(404).json({ message: "User not found" });
        }
    }
    catch (error) {
        res.status(500).json({ message: "Error retrieving user" });
    }
});
exports.getUserById = getUserById;
// Create a new user
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, email, password, firstName, lastName, gender, birthdate, bio, profilePicture, location, interests, status, onlineStatus, preferences, igUrl, } = req.body;
        const newUser = yield prisma.user.create({
            data: {
                id: (0, uuid_1.v4)(),
                username,
                email,
                password,
                firstName,
                lastName,
                gender,
                birthdate,
                bio,
                profilePicture,
                location,
                interests,
                status,
                onlineStatus,
                preferences,
                igUrl,
            },
        });
        res.status(201).json(newUser);
    }
    catch (error) {
        res.status(500).json({ message: "Error creating user" });
    }
});
exports.createUser = createUser;
// Update a user by ID
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { username, email, password, firstName, lastName, gender, birthdate, bio, profilePicture, location, interests, status, onlineStatus, preferences, igUrl, } = req.body;
        const updatedUser = yield prisma.user.update({
            where: { id },
            data: {
                username,
                email,
                password,
                firstName,
                lastName,
                gender,
                birthdate,
                bio,
                profilePicture,
                location,
                interests,
                status,
                onlineStatus,
                preferences,
                igUrl,
            },
        });
        res.json(updatedUser);
    }
    catch (error) {
        res.status(500).json({ message: "Error updating user" });
    }
});
exports.updateUser = updateUser;
// Delete a user by ID
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        yield prisma.user.delete({ where: { id } });
        res.status(204).send();
    }
    catch (error) {
        res.status(500).json({ message: "Error deleting user" });
    }
});
exports.deleteUser = deleteUser;
