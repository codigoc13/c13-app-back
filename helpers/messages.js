const message = {
  idIsNotValid: `El id enviado no es válido de Mongo`,
  requireMale: (fieldName) => `El '${fieldName}' es requerido`,
  requireFemale: (fieldName) => `La '${fieldName}' es requerida`,
  stringMale: (fieldName) =>
    `El '${fieldName}' debe ser una cadena de caracteres`,
  stringFemale: (fieldName) =>
    `La '${fieldName}' debe ser una cadena de caracteres`,
  lengthMale: (fieldName, min) =>
    `El '${fieldName}' debe contener mínimo ${min} caracteres`,
  lengthFemale: (fieldName, min) =>
    `La '${fieldName}' debe contener mínimo ${min} caracteress`,
}

module.exports = {
  message,
}
