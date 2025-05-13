"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const registroLlamada_1 = require("../controllers/registroLlamada");
const router = (0, express_1.Router)();
router.post('/', registroLlamada_1.createLlamada);
router.get('/usuario/:claveUsuario', registroLlamada_1.getLlamadasByUsuario);
router.get('/', registroLlamada_1.getAllLlamadas);
exports.default = router;
