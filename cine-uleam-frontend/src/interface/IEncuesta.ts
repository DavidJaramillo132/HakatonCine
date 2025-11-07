export interface IEncuesta {
  id: string;
  pregunta: string;
  admin_id: string;
  fecha_creacion: string;
  fecha_cierre?: string;
}

export interface IVoto {
  id: string;
  encuesta_id: string;
  usuario_id: string;
  respuesta: boolean;
  fecha_voto: string;
}

export interface IEstadisticasEncuesta {
  encuesta: IEncuesta;
  total_respuestas: number;
  respuestas_si: number;
  respuestas_no: number;
  porcentaje_si: number;
  porcentaje_no: number;
}
