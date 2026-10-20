// Analito. Imagen opcional: coloca img/analitos/procalcitonina.png o indica otra ruta en 'imagen'.
registrarAnalito({
  id: "procalcitonina",
  nombre: "Procalcitonina",
  abrev: "PCT",
  abrevUrg: "POC",
  tubo: "rojo",
  personal: "venosa",
  tuboAlterno: "amarillo",
  area: "Química clínica",
  envio: false,
  categorias: ["ordinario", "urgencias"]
});
