// Analito. Imagen opcional: coloca img/analitos/tiempo-de-protrombina.png o indica otra ruta en 'imagen'.
registrarAnalito({
  id: "tiempo-de-protrombina",
  nombre: "Tiempo de protrombina",
  abrev: "TP",
  abrevUrg: "TP",
  tubo: "azul",
  personal: "venosa",
  area: "Coagulación",
  envio: false,
  categorias: ["ordinario", "urgencias"],
  sinonimos: ["INR", "protrombina"],
  nota: "En solicitudes de urgencias el TP ya incluye INR."
});
