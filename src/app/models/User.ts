export interface User {
  name: string;
  firstLastName: string;
  secondLastName: string;
  rut: string;
  email: string;
  career: Career;
}

export interface Career {
  id: number;
  name: string;
}
