"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const ctrl = __importStar(require("../controllers/eventController.js"));
const router = (0, express_1.Router)();
router.post('/', [
    (0, express_validator_1.body)('title').isString().notEmpty(),
    (0, express_validator_1.body)('starts_at').isISO8601(),
    (0, express_validator_1.body)('location').isString().notEmpty(),
    (0, express_validator_1.body)('capacity').isInt({ min: 1, max: 1000 }),
], async (req, res, next) => {
    try {
        await ctrl.createEvent(req, res);
    }
    catch (err) {
        next(err);
    }
});
router.get('/:id', [(0, express_validator_1.param)('id').isUUID()], async (req, res, next) => {
    try {
        await ctrl.getEvent(req, res);
    }
    catch (err) {
        next(err);
    }
});
router.get('/', async (req, res, next) => {
    try {
        await ctrl.listUpcoming(req, res);
    }
    catch (err) {
        next(err);
    }
});
router.get('/:id/stats', [(0, express_validator_1.param)('id').isUUID()], async (req, res, next) => {
    try {
        await ctrl.getStats(req, res);
    }
    catch (err) {
        next(err);
    }
});
router.post('/:id/register', [(0, express_validator_1.param)('id').isUUID(), (0, express_validator_1.body)('name').isString(), (0, express_validator_1.body)('email').isEmail()], async (req, res, next) => {
    try {
        await ctrl.register(req, res);
    }
    catch (err) {
        next(err);
    }
});
router.post('/:id/cancel', [(0, express_validator_1.param)('id').isUUID(), (0, express_validator_1.body)('userId').isUUID()], async (req, res, next) => {
    try {
        await ctrl.cancel(req, res);
    }
    catch (err) {
        next(err);
    }
});
exports.default = router;
