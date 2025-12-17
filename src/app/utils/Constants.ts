const nameErrorMsg =
  "Debe contener entre 3 y 50 caracteres, únicamente letras.";

const lastNameErrorMsg =
  "Debe contener entre 3 y 30 caracteres, únicamente letras.";
const rutErrorMsg = "RUT con puntos y guión (Ej: 12.345.678-9)";
const emailErrorMsg = "El correo debe ser dominio ucn.";
const pwdErrorMsg =
  "Debe contener al menos 10 caracteres, una mayúscula y un número.";
const matchPwdErrorMsg = "Las contraseñas no coinciden.";

export const Messages = {
  nameErrorMsg,
  lastNameErrorMsg,
  rutErrorMsg,
  emailErrorMsg,
  pwdErrorMsg,
  matchPwdErrorMsg,
};

const rutAlreadyExists = "RUT already in use";
const emailAlreadyExists = "Email already in use";
const invalidRut = "The field RUT is invalid.";
const defaultErrorMsg = "An error has occurred, try again later.";
const invalidPwd = "Contraseña inválida";
const invalidNames =
  "Debe contener mínimo 3 letras, sin caracteres especiales o números";
const requisitesPwd =
  "Contraseña debe contener entre 10 a 16 caracteres, una mayúscula, una minúscula y un número";
const invalidMatchPwd = "Contraseñas no coinciden";

export const ApiMessages = {
  rutAlreadyExists,
  emailAlreadyExists,
  invalidRut,
  defaultErrorMsg,
  invalidPwd,
  invalidNames,
  requisitesPwd,
  invalidMatchPwd,
};
