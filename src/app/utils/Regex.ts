const emailRegex =
  /^[a-zA-Z]+(?:\.[a-zA-Z]+)?\d*?@(?:([a-zA-Z]+\.)+)?ucn\.cl$/i;

const pwdRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{10,16}$/;
const rutRegex = /^(\d{1,3}(\.\d{3})*-\d|(\d{1,3}(\.\d{3})*-[Kk]))$/;
const nameRegex = /^[a-zA-ZñáéíóúüÜÁÉÍÓÚÑ\s]{3,50}$/;
const lastNameRegex = /^[a-zA-ZñáéíóúüÜÁÉÍÓÚÑ\s]{3,30}$/;
  
const Regex = {
  emailRegex,
  pwdRegex,
  rutRegex,
  nameRegex,
  lastNameRegex,
};

export default Regex;
