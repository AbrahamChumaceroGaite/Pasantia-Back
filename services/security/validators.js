const { validationResult } = require('express-validator');

function validateNombre(value) {
  return /^[a-zA-ZáéíóúñÁÉÍÓÚ0-9\s]*$/.test(value);
}

function validateEmail(value) {
  return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value);
}

function validateAlphanumeric(value) {
  return /^[0-9a-zA-Z\-]+$/.test(value);
}

// Validar Formulario de Empresas
function validateEnterprise(body) {
  const errors = validationResult(body);

  if (!validateNombre(body.nombre)) {
    errors.push({ msg: 'Error en el campo nombre' });
  }

  if (!validateAlphanumeric(body.nit)) {
    errors.push({ msg: 'Error en el campo nit' });
  }

  if (!validateEmail(body.correo)) {
    errors.push({ msg: 'Error en el campo correo' });
  }

  if (!validateNombre(body.legal)) {
    errors.push({ msg: 'Error en el campo nombre del representante legal' });
  }


  return errors;
}

module.exports = {
  validateEnterprise,
};
