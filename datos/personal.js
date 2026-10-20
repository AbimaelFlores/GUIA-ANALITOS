/* Personal autorizado y capacitado para tomar la muestra de cada analito.
   Cada analito tiene el campo  personal: "<id de perfil>"  (ver datos/analitos/*.js).
   Los perfiles se definen aquí; para cambiar a quién se le asigna un perfil, edita ese campo en el analito.
   REFERENCIA: confirmar con la normativa interna vigente del HGR 36 y el manual de toma de muestras del laboratorio. */
window.PERSONAL = {
  perfiles: {
    venosa: {
      etiqueta: "Sangre venosa", nivel: "amplio",
      quien: ["Personal de laboratorio", "Enfermería", "Médico"],
      nota: "Venopunción por personal capacitado en la técnica (CLSI GP41)."
    },
    arterial: {
      etiqueta: "Sangre arterial", nivel: "limitado",
      quien: ["Médico", "Enfermería capacitada"],
      nota: "La punción arterial es un procedimiento invasivo: solo personal médico o de enfermería capacitado y autorizado."
    },
    gaso: {
      etiqueta: "Gasometría (arterial o venosa)", nivel: "limitado",
      quien: ["Médico", "Enfermería capacitada"],
      nota: "Venosa: también personal de laboratorio. Arterial: solo médico o enfermería capacitada."
    },
    hemocultivo: {
      etiqueta: "Hemocultivo periférico", nivel: "amplio",
      quien: ["Personal de laboratorio", "Enfermería", "Médico"],
      nota: "Solo personal capacitado en técnica aséptica (antisepsia de piel y del frasco), conforme a CLSI M47."
    },
    "hemocultivo-central": {
      etiqueta: "Hemocultivo de catéter central", nivel: "limitado",
      quien: ["Enfermería capacitada", "Médico"],
      nota: "Requiere manipular el acceso vascular: personal de enfermería o médico capacitado, con técnica aséptica."
    },
    "liquido-estéril": {
      etiqueta: "Líquido de cavidad estéril (LCR, pleural, ascitis, peritoneal, sinovial, pericárdico, biliar)", nivel: "medico",
      quien: ["Solo personal médico capacitado"],
      nota: "Procedimiento invasivo (punción lumbar, toracocentesis, paracentesis, artrocentesis, pericardiocentesis o drenaje). Enfermería y laboratorio solo asisten, rotulan y entregan la muestra."
    },
    dialisis: {
      etiqueta: "Líquido de diálisis peritoneal", nivel: "limitado",
      quien: ["Enfermería capacitada", "Médico"],
      nota: "Se toma del efluente del sistema de diálisis con técnica aséptica."
    },
    paciente: {
      etiqueta: "Autotoma con indicaciones", nivel: "paciente",
      quien: ["Paciente (con indicaciones del personal de salud)", "Enfermería o laboratorio si el paciente no puede"],
      nota: "Orina, heces, expectoración y semen: el personal entrega el recipiente, explica la técnica y verifica el rotulado. Si el paciente no puede, toma la muestra personal capacitado (orina por sonda: enfermería o médico)."
    },
    exudado: {
      etiqueta: "Exudado / frotis", nivel: "limitado",
      quien: ["Médico", "Enfermería capacitada", "Personal de laboratorio (bacteriología)"],
      nota: "Con técnica aséptica y, en exudado vaginal o uretral, en área con privacidad."
    },
    "toma-invasiva": {
      etiqueta: "Muestra de vía respiratoria baja / dispositivo", nivel: "limitado",
      quien: ["Médico", "Enfermería capacitada"],
      nota: "Aspirado bronquial, catéter o sitio de salida de catéter: solo personal médico o de enfermería capacitado."
    }
  },
  /* respaldo si un analito no trae el campo "personal": se deduce del tubo/recipiente */
  porTubo: {
    azul: "venosa", amarillo: "venosa", rojo: "venosa", morado: "venosa",
    "frasco-hemocultivo": "hemocultivo", "jeringa-heparina": "gaso",
    "frasco-esteril-especial": "liquido-estéril", "jeringa-esteril": "liquido-estéril",
    "bolsa-dialisis": "dialisis", "recipiente-esteril": "paciente", "frasco-esteril": "paciente",
    "medio-transporte": "exudado", cateter: "toma-invasiva"
  },
  aviso: "Referencia basada en la NOM-007-SSA3-2011 y en CLSI GP41, GP42 y M47. Confirma con la normativa interna vigente del hospital."
};
