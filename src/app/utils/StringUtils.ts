import { ApiMessages } from "./Constants";

export const subjectsCapitalize = (phrase: string) => {
  phrase = phrase
    .split(" ")
    .map((word) => {
      if (
        word === "i" ||
        word === "ii" ||
        word === "iii" ||
        word === "iv" ||
        word === "v" ||
        word === "vi" ||
        word === "vii" ||
        word === "viii" ||
        word === "ix" ||
        word === "x" ||
        word === "ti"
      )
        return word.toUpperCase();
      else if (
        word === "e" ||
        word === "a" ||
        word === "y" ||
        word === "de" ||
        word === "la" ||
        word === "al"
      )
        return word;

      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");

  return phrase;
};

export const emptyString = "";

export const translateApiMessages = (message: string) => {
  switch (message) {
    case ApiMessages.rutAlreadyExists:
      return "El RUT ya está en uso.";
    case ApiMessages.emailAlreadyExists:
      return "El correo ya está en uso.";
    case ApiMessages.invalidRut:
      return "El RUT es inválido.";
    case ApiMessages.defaultErrorMsg:
      return "Ha Ocurrido un problema, intente más tarde.";
    default:
      return "Ha Ocurrido un problema, intente más tarde.";
  }
};
