const chambas = {
  invierno: [
    '⛷️ • Enseñas a turistas a esquiar en una estación de lujo, obtienes:|min:8000|max:18000',
    '☕ • Preparas chocolate caliente en un café acogedor durante la nevada, obtienes:|min:6000|max:12000',
    '🎄 • Decoras árboles de Navidad en un centro comercial, obtienes:|min:7000|max:15000',
    '🧤 • Tejes bufandas personalizadas para una familia, obtienes:|min:6500|max:14000',
    '🧊 • Tallando esculturas de hielo en un festival invernal, obtienes:|min:9000|max:20000',
    '🦌 • Alimentas y cuidas renos en una reserva natural, obtienes:|min:8500|max:19000',
    '🏂 • Guiando clases de snowboard en la montaña, obtienes:|min:9000|max:20000',
    '🎬 • Apoyas en sets de películas navideñas, por tu trabajo obtienes:|min:7000|max:15000'
  ],
  verano: [
    '🏖️ • Vigilas bañistas como salvavidas en la playa, obtienes:|min:9000|max:22000',
    '🍧 • Vendes nieves artesanales en el malecón, obtienes:|min:7000|max:16000',
    '🌴 • Organizas fiestas temáticas en hoteles de la Riviera, obtienes:|min:10000|max:24000',
    '🚤 • Guías tours en lancha por manglares y lagunas, obtienes:|min:8000|max:20000',
    '🎸 • Animando noches bohemias en bares al aire libre, obtienes:|min:6500|max:14000',
    '🥥 • Recolectas cocos para bebidas tropicales, obtienes:|min:7500|max:17000',
    '🏄 • Enseñas surf a principiantes en la playa, obtienes:|min:9000|max:20000',
    '🎡 • Operas juegos mecánicos en la feria de verano, obtienes:|min:7000|max:15000'
  ],
  primavera: [
    '🌸 • Armas arreglos florales para bodas al aire libre, obtienes:|min:8500|max:21000',
    '🐝 • Manejas colmenas en una granja ecológica, obtienes:|min:7000|max:16000',
    '🚴 • Guias paseos ciclistas por campos en flor, obtienes:|min:6000|max:13000',
    '🎨 • Pintas murales en festivales de arte urbano, obtienes:|min:9000|max:22000',
    '🍓 • Cosechas fresas en una huerta orgánica, obtienes:|min:7500|max:18000',
    '🦋 • Llevas recorridos para ver mariposas en reservas, obtienes:|min:7000|max:15000',
    '🌱 • Plantas y cuidas plántulas en un vivero, obtienes:|min:6500|max:14000'
  ],
  otoño: [
    '🍂 • Limpias caminos barriendo hojas en parques históricos, obtienes:|min:6000|max:12000',
    '🎃 • Diseñas calabazas para concursos de Halloween, obtienes:|min:8000|max:18000',
    '🌰 • Recolectas nueces silvestres en el bosque, obtienes:|min:6500|max:15000',
    '🦉 • Llevas recorridos nocturnos en bosques misteriosos, obtienes:|min:9000|max:21000',
    '🍁 • Organizas ferias gastronómicas de temporada, obtienes:|min:10000|max:25000',
    '📚 • Narras cuentos en bibliotecas durante tardes lluviosas, obtienes:|min:7000|max:14000',
    '🧙 • Preparas escenarios para festivales de magia y misterio, obtienes:|min:8000|max:17000'
  ],
  eventos: [
    '🎆 • Supervisas el show de fuegos artificiales en Año Nuevo, obtienes:|min:15000|max:25000',
    '🎭 • Animando el carnaval de máscaras en desfiles, obtienes:|min:12000|max:22000',
    '🎤 • Presentas en el festival musical local, obtienes:|min:10000|max:20000',
    '🎉 • Organizas fiestas patrias en la plaza principal, obtienes:|min:9000|max:19000',
    '👻 • Actúas en la casa del terror de Halloween, obtienes:|min:8000|max:18000',
    '💘 • Entregas cartas de amor en San Valentín, obtienes:|min:7000|max:16000',
    '🎬 • Coordinas cortometrajes para el festival de cine local, obtienes:|min:12000|max:22000',
    '🎪 • Ayudas en el montaje de un circo itinerante, obtienes:|min:9000|max:18000'
  ]
};


// Utilidad para elegir aleatorio
function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Devuelve la temporada según la fecha
function getTemporada(fecha = new Date()) {
  const mes = fecha.getMonth() + 1;
  if ([12, 1, 2].includes(mes)) return 'invierno';
  if ([3, 4, 5].includes(mes)) return 'primavera';
  if ([6, 7, 8].includes(mes)) return 'verano';
  if ([9, 10, 11].includes(mes)) return 'otoño';
  return 'verano'; // fallback
}

/**
 * chamba(tema)
 * @param {string} tema - 'invierno', 'verano', 'primavera', 'otoño', 'eventos'
 * @returns {object} { autor, status, data: { work, min_pay, max_pay } }
 */
function chamba(tema) {
  let lista = chambas[tema];
  if (!lista || lista.length === 0) return { autor: '🜲 ᵖᵃᵗᵒ', status: false, data: null };
  let raw = pickRandom(lista);
  let [work, min, max] = raw.split('|').map(s => s.trim());
  return {
    autor: '🜲 ᵖᵃᵗᵒ',
    status: true,
    data: {
      work,
      min_pay: parseInt(min.replace('min:', '')),
      max_pay: parseInt(max.replace('max:', ''))
    }
  };
}

export { chamba, getTemporada };