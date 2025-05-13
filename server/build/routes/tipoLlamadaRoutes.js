"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const tipoLlamadaController_1 = require("../controllers/tipoLlamadaController");
const router = (0, express_1.Router)();
router.get('/', tipoLlamadaController_1.getAllLlamadas);
router.get('/:nombre', tipoLlamadaController_1.getLlamadaByNombre);
router.put('/:nombre', tipoLlamadaController_1.updateLlamada);
exports.default = router;
