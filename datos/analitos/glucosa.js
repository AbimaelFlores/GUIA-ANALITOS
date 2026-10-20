// Analito. Imagen opcional: coloca img/analitos/glucosa.png o indica otra ruta en 'imagen'.
registrarAnalito({
  id: "glucosa",
  nombre: "Glucosa",
  abrev: "Glu",
  abrevUrg: "Glu",
  tubo: "rojo",
  personal: "venosa",
  tuboAlterno: "amarillo",
  area: "Química clínica",
  envio: false,
  categorias: ["ordinario", "urgencias"],
  sinonimos: ["azúcar", "glucemia"]
});
