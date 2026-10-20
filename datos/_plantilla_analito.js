// PLANTILLA DE ANALITO (copia este archivo, renómbralo y añádelo en datos/indice.js)
registrarAnalito({
  id: "creatina-cinasa",
  nombre: "Creatina cinasa (CK)",
  abrev: "CK",                    // opcional: abreviatura de la lista de estudios ordinarios
  abrevUrg: "CK",                 // opcional: abreviatura aceptada en solicitudes de urgencias
  tubo: "rojo",                   // id del tubo o recipiente principal
  tuboAlterno: "amarillo",        // opcional: segundo tubo en el que también puede entregarse
  area: "Química clínica",        // si en una solicitud hay áreas distintas, el simulador agrega un tubo extra por área
  envio: false,                   // true = estudio de envío: SIEMPRE va en un tubo aparte
  categorias: ["ordinario", "urgencias"],   // "ordinario" = ESTUDIOS ORDINARIOS, "urgencias" = ESTUDIOS DE URGENCIAS (una o ambas)
  sinonimos: ["CPK"],             // palabras extra para el buscador
  muestraGrupo: "",               // opcional (solo recipientes): estudios con el mismo valor comparten UN recipiente (ej. "orina-24h"); sin valor, cada estudio usa su propio recipiente
  nota: "",                       // opcional
  imagen: "img/analitos/ck.png"   // opcional; si se omite se busca img/analitos/<id>.png
});
