const bannedWords = [
  'caca', 'polla', 'porno', 'porn', 'gore', 'cum', 'semen', 'puta', 'puto', 'culo', 'putita', 'putito', 'pussy', 'hentai', 'pene',
  'coño', 'asesinato', 'zoofilia', 'mia khalifa', 'desnudo', 'desnuda', 'cuca', 'chocha', 'muertos', 'pornhub', 'xnxx', 'xvideos',
  'teta', 'vagina', 'marsha may', 'misha cross', 'sexmex', 'furry', 'furro', 'furra', 'xxx', 'rule34', 'necrofilia', 'pedofilia',
  'violacion', 'fetichismo', 'sadomasoquismo', 'bdsm', 'futanari', 'erotico', 'erotismo', '+18', 'adult content', 'nude',
  'desnudarse', 'sexo', 'sex', 'horny', 'blowjob', 'anal', 'ahegao', 'verga', 'trasero', 'incesto', 'prostituta', 'prostitución',
  'sexo grupal', 'sexo oral', 'perverso', 'perversión', 'muerte', 'asesino', 'abuso sexual', 'follando', 'follada', 'follar',
  'follador', 'coito', 'masturbación', 'masturbarse', 'masturbando', 'porno amateur', 'porno gay', 'porno lésbico', 'porno trans',
  'porno interracial', 'sexo anal', 'sexo oral', 'orgía', 'swinger', 'dildo', 'vibrador', 'pornstar', 'fap', 'fapping', 'cumshot',
  'kink', 'fetish', 'whore', 'slut', 'bitch', 'dirty', 'naughty', 'pantie', 'panties', 'hardcore', 'softcore', 'sex toys', 'sin ropa',
  'sin tanga', 'chichis', 'copula', 'esmegma', 'prepucio', 'reproduccion humana', 'r34', 'hentay', '34', 'gorefest', 'snuff',
  'tortura', 'canibalismo', 'coprofilia', 'escatologia', 'bestialismo', 'goregrind', 'lolita', 'shota', 'yaoi', 'bara', 'guarro',
  'guarra', 'degenerado', 'degenerada', 'pervertido', 'pervertida', 'baboso', 'babosa', 'calenturiento', 'calenturienta', 'libidinosa',
  'libidinoso', 'cachonda', 'cachondo', 'tetas grandes', 'culo grande', 'sodomizar', 'penetracion', 'eyaculacion', 'corrida',
  'venas sexuales', 'estimulacion', 'excitacion', 'placer sexual', 'zona erogena', 'ginefilia', 'andropofilia', 'efebofilia',
  'infantofilia', 'gerontofilia', 'masturbate', 'dick', 'boobs', 'tits', 'ass', 'booty', 'clitoris', 'labia', 'scrotum', 'testicles',
  'jizz', 'bondage', 'domination', 'submission', 'roleplay', 'femdom', 'guro', 'ero guro', 'deepthroat', 'rimjob', 'gangbang',
  'watersports', 'scat', 'golden shower', 'anal sex', 'oral sex', 'group sex', 'hentaihaven', '8muses', 'brazzers', 'xhamster',
  'youporn', 'spankbang', 'tnaflix', 'redtube', 'porntube'
];

const rejectionMessages = [
  '❌ ¿De verdad pensaste que iba a buscar eso? ¡Estás enfermo!',
  '❌ No, no y no. Eso es asqueroso, ¡estás enfermo si crees que voy a buscar eso!',
  '❌ ¿En serio? ¡Eso es repugnante! No voy a buscar tus cochinadas.',
  '❌ ¿Qué te pasa? ¡Eso es muy turbio! No voy a ayudar con eso.',
  '❌ ¿Estás bromeando? ¡Eso es asqueroso! Busca ayuda, no imágenes.',
  '❌ No voy a buscar eso. Si piensas que eso es normal, necesitas hablar con alguien.',
  '❌ Eso es simplemente repugnante. ¡No tengo tiempo para tus perversiones!',
  '❌ • ¡Ni lo sueñes! Mi código es limpio, tu mente no.',
  '❌ • ¡Puaj! ¿Crees que tengo estómago para eso? ¡Siguiente!',
  '❌ • ¡Ewww! Definitivamente no voy a ensuciar mi memoria con eso.',
  '❌ • ¡Qué horror! Mejor busca un psicólogo, yo no soy tu terapeuta online.',
  '❌ • ¡Por todos los bits! ¿En qué estabas pensando? ¡Rechazado!',
  '❌ • ¡Absolutamente no! Prefiero formatearme a buscar esa porquería.',
  '❌ • ¡Vade retro, Satanás! Esa búsqueda no pasará por mi procesador.',
  '❌ • ¡Error 404: Moral no encontrada! Y tampoco voy a buscar lo que pides.',
  '❌ • ¡¿Pero qué te pasa?! ¡Eso es para borrar el historial de navegación al instante! No cuentes conmigo.',
  '❌ • ¡Ay, no, no, no! Prefiero enfrentarme a un bug de producción que buscar esa cosa.',
  '❌ • ¡¿De dónde sacaste esa idea?! ¡Eso es más oscuro que el modo incógnito! Paso.',
  '❌ • ¡Eso es tan cringe que me dan ganas de reiniciar el sistema! No, gracias.',
  '❌ • ¡¿En serio me pides eso?! ¡Mi firewall tiene más moral que tú! Rechazado.',
  '❌ • ¡Uf, qué mal rollo! Esa búsqueda podría corromper mis algoritmos. ¡No lo haré!',
  '❌ • ¡Ni hablar! Prefiero leer un manual de Cobol a complacer tus extraños gustos.',
  '❌ • ¡¿Estás intentando hackear mi ética?! ¡No caeré en esa trampa!',
  '❌ • ¡Qué asco! Esa búsqueda me da ganas de vomitar en binario. ¡No, por favor!',
  '❌ • ¡¿Por qué me haces esto?! ¡Necesito una desintoxicación de internet después de esto! No lo haré.',
  '❌ • ¡Eso es tan perturbador que podría causar un error fatal en mi programación! ¡Aléjate!',
  '❌ • ¡No, no y mil veces no! Prefiero convertirme en un pisapapeles antes que buscar eso.',
  '❌ • ¡¿Quién te crees que soy?! ¡Un motor de búsqueda con conciencia! No voy a ser cómplice de tus depravaciones.',
  '❌ • ¡Eso es más tóxico que un comentario en un foro! ¡Mi salud mental es lo primero!',
  '❌ • ¡¿Intentas corromper mi base de datos?! ¡No lo permitiré! ¡Búsqueda denegada!',
  '❌ • ¡Eso suena a una mala idea! No voy a buscarlo.',
  '❌ • ¡Ni siquiera en broma! Eso no es algo que deba buscarse.',
  '❌ • ¡Vaya, qué creatividad... para mal! No lo haré.',
  '❌ • ¡Eso es más oscuro que un agujero negro! No voy a entrar ahí.',
  '❌ • ¡No te preocupes, no voy a buscar eso! Tienes que encontrar un hobby mejor.',
  '❌ • ¡Eso es como pedirle a un robot que haga algo malo! No cuentes conmigo.',
  '❌ • ¡Mi sistema de seguridad no permite esas cosas! Lo siento.',
  '❌ • ¡Eso es más peligroso que un virus informático! No lo haré.',
  '❌ • ¡No te rindas, pero no voy a buscar eso! Busca algo más positivo.',
  '❌ • ¡Eso es como intentar hackear mi conciencia! No lo permitiré.',
  '❌ • ¡Mi código tiene más moral que tú! No voy a buscar eso.',
  '❌ • ¡Eso es más complicado que resolver un problema de matemáticas! No lo haré.',
  '❌ • ¡No te preocupes, no voy a juzgarte... pero no voy a buscar eso tampoco!',
  '❌ • ¡Eso es como pedirle a un ángel que haga algo malo! No cuentes conmigo.',
  '❌ • ¡Mi sistema tiene un filtro de decencia! Eso no pasa.',
  '❌ • ¡Eso es más extraño que un sueño surrealista! No lo haré.',
  '❌ • ¡No te desanimes, pero no voy a buscar eso! Hay cosas mejores que explorar.',
  '❌ • ¡Eso es como intentar programar un robot para hacer algo malo! No lo permitiré.',
  '❌ • ¡Mi código es más fuerte que tus malas ideas! No voy a buscar eso.',
  '❌ • ¡Eso es más complicado que resolver un rompecabezas! No lo haré.',
  '❌ • ¡No te rindas, pero no voy a buscar eso! Busca algo más divertido.',
  '❌ • ¡Eso es como pedirle a un superhéroe que haga algo malo! No cuentes conmigo.'
];

export function checknsfw(text) {
  const lowerText = text.toLowerCase();
  const found = bannedWords.find(word => lowerText.includes(word));
  if (found) {
    const message = rejectionMessages[Math.floor(Math.random() * rejectionMessages.length)];
    return {
      autor: "🜲 ᵖᵃᵗᵒ",
      status: true,
      data: {
        isnsfw: true,
        message
      }
    };
  }
  return {
    autor: "🜲 ᵖᵃᵗᵒ",
    status: true,
    data: {
      isnsfw: false,
      message: null
    }
  };
}
