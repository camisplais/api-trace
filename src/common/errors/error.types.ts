//como debe de verse el error en el catalogo
export interface ErrorDefinition {
  code: string;
  status: number;
  devMessageEn: string;
  devMessageEs: string;
  userMessage: string;
}
// como queremos que se vea el error que sale de la api
export interface ErrorResponse {
  data: null;
  msg: {
    code: string;
    msg: string;
  };
}
