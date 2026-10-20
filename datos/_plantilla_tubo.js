// PLANTILLA DE TUBO O RECIPIENTE (copia este archivo, renómbralo y añádelo en datos/indice.js)
registrarTubo({
  id: "verde",                    // sin espacios ni acentos; también nombre de la imagen
  nombre: "Verde",                // en recipientes escribe el nombre completo, ej. "Frasco estéril"
  tipo: "tubo",                   // "tubo" (sangre) o "recipiente" (frasco, jeringa, medio de transporte...)
  color: "#22c55e",               // color hexadecimal
  aditivo: "Heparina de litio",   // opcional (solo tubos)
  muestra: "Plasma",
  unidad: "plasma",               // opcional: suero, plasma, sangre total
  aforo: "",                      // opcional: si se escribe un texto, TODOS los analitos del tubo muestran ese texto como volumen mínimo (así funciona el tubo azul)
  nota: "",                       // opcional
  imagen: "img/tubos/verde.png"   // opcional; si se omite se busca img/tubos/<id>.png
});
