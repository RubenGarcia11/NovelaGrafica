/**
 * Story Engine - Motor de Historia Interactiva
 * =============================================
 * Define la narrativa ramificada con múltiples finales
 * VERSIÓN EXPANDIDA con nuevos capítulos y final secreto
 */

// Estructura de la historia
const STORY = {
    // ============================================
    // PRÓLOGO: LA LEYENDA
    // ============================================
    prologo: {
        chapter: 'Prólogo',
        title: 'La Leyenda de los Vega',
        layout: 'layout-2-1',
        panels: [
            {
                image: 'prologo_periodico',
                narration: 'Hace 50 años, la familia Vega desapareció sin dejar rastro...',
                type: 'wide'
            },
            {
                image: 'prologo_familia',
                speech: {
                    text: '"Los Vega eran la familia más poderosa de la ciudad."',
                    position: 'top-center',
                    type: 'thought'
                },
                sfx: { text: 'MURMULLOS...', type: 'whisper', position: 'bottom-center' }
            },
            {
                image: 'prologo_misterio',
                narration: 'Nadie sabe qué pasó aquella noche de tormenta...',
                sfx: { text: '⚡', type: 'whoosh', position: 'top-right' }
            }
        ],
        choices: [
            {
                text: 'Continuar leyendo el archivo',
                next: 'inicio',
                consequence: 'investigador'
            }
        ]
    },

    // ============================================
    // CAPÍTULO 1: EL COMIENZO
    // ============================================
    inicio: {
        chapter: 'Capítulo 1',
        title: 'La Carta Misteriosa',
        layout: 'layout-1-2',
        panels: [
            {
                image: 'intro_mansion',
                narration: 'Era una noche tormentosa cuando llegó la carta...',
                type: 'wide',
                sfx: { text: '¡BOOM!', type: 'boom', position: 'top-right' }
            },
            {
                image: 'intro_detective',
                speech: {
                    text: '"¿Quién me escribe desde la Mansión Vega?"',
                    position: 'top-left',
                    type: 'speech'
                }
            },
            {
                image: 'intro_carta',
                narration: 'La carta prometía revelar un secreto que cambiaría todo...',
                speech: {
                    text: '"Ven solo. La verdad te espera. No confíes en nadie."',
                    position: 'bottom-right',
                    type: 'thought'
                }
            }
        ],
        choices: [
            {
                text: 'Ir solo a investigar la mansión',
                next: 'solo_entrada',
                consequence: 'valiente'
            },
            {
                text: 'Llamar a tu compañera Ana para ir juntos',
                next: 'equipo_entrada',
                consequence: 'prudente'
            },
            {
                text: 'Investigar primero quién envió la carta',
                next: 'investigar_remitente',
                consequence: 'meticuloso'
            }
        ]
    },

    // ============================================
    // NUEVA RAMA: INVESTIGACIÓN PREVIA
    // ============================================
    investigar_remitente: {
        chapter: 'Capítulo 1.5',
        title: 'Siguiendo las Pistas',
        layout: 'layout-3',
        rewards: ['mapa'], // Recompensa: Mapa Secreto
        panels: [
            {
                image: 'investigar_archivo',
                narration: 'El archivo municipal guarda secretos de décadas...',
                speech: {
                    text: '"El sello... es del notario de los Vega. Lleva cerrado décadas."',
                    position: 'bottom-left',
                    type: 'speech'
                }
            },
            {
                image: 'investigar_notario',
                narration: 'El viejo notario murió hace años, pero su hija sigue viva.',
                speech: {
                    text: '"Mi padre nunca habló de los Vega. Tenía miedo."',
                    position: 'top-right',
                    type: 'speech'
                }
            },
            {
                image: 'investigar_mapa',
                narration: 'Un mapa antiguo revela pasajes secretos en la mansión.',
                sfx: { text: '¡EUREKA!', type: 'bang', position: 'center' }
            }
        ],
        choices: [
            {
                text: 'Usar el mapa e ir solo con ventaja',
                next: 'solo_ventaja',
                consequence: 'astuto'
            },
            {
                text: 'Compartir la información con Ana',
                next: 'equipo_preparado',
                consequence: 'colaborador'
            }
        ]
    },

    solo_ventaja: {
        chapter: 'Capítulo 2',
        title: 'El Conocimiento es Poder',
        layout: 'layout-2-1',
        rewards: ['llave'], // Recompensa: Llave Maestra (al usar el mapa)
        panels: [
            {
                image: 'solo_entrada_mapa',
                narration: 'Conoces cada rincón gracias al mapa antiguo.',
                sfx: { text: 'CLIC', type: 'whoosh', position: 'top-left' }
            },
            {
                image: 'solo_pasaje',
                speech: {
                    text: '"El pasaje secreto debería estar... ¡aquí!"',
                    position: 'bottom-center',
                    type: 'speech'
                }
            },
            {
                image: 'solo_tunel',
                narration: 'Un túnel olvidado por el tiempo se abre ante ti.',
                type: 'wide'
            }
        ],
        choices: [
            {
                text: 'Explorar el túnel hacia el sótano',
                next: 'solo_sotano',
                consequence: 'aventurero'
            },
            {
                text: 'Subir al ático por el pasaje oculto',
                next: 'solo_arriba',
                consequence: 'cauteloso'
            }
        ]
    },

    // ============================================
    // RAMA: INVESTIGACIÓN EN SOLITARIO
    // ============================================
    solo_entrada: {
        chapter: 'Capítulo 2',
        title: 'Entrada en Solitario',
        layout: 'layout-2-1',
        panels: [
            {
                image: 'solo_puerta',
                narration: 'La puerta de la mansión cruje al abrirse...',
                sfx: { text: 'CREEEAK', type: 'whoosh', position: 'top-right' }
            },
            {
                image: 'solo_hall',
                speech: {
                    text: '"La oscuridad parece tener ojos... vigilan cada uno de mis pasos."',
                    position: 'bottom-left',
                    type: 'thought'
                }
            },
            {
                image: 'solo_escalera',
                narration: 'El vestíbulo revela dos caminos: las escaleras hacia arriba y un pasillo oscuro que lleva al sótano.',
                type: 'wide'
            }
        ],
        choices: [
            {
                text: 'Subir las escaleras hacia los dormitorios',
                next: 'solo_arriba',
                consequence: 'curioso'
            },
            {
                text: 'Explorar el pasillo oscuro',
                next: 'solo_pasillo',
                consequence: 'temerario'
            },
            {
                text: 'Bajar al sótano',
                next: 'solo_sotano',
                consequence: 'intrépido'
            }
        ]
    },

    // NUEVO: Sótano secreto
    solo_sotano: {
        chapter: 'Capítulo 2.5',
        title: 'El Sótano de los Secretos',
        layout: 'layout-1-2',
        rewards: ['antidoto'], // Recompensa: Antídoto Experimental
        panels: [
            {
                image: 'solo_sotano',
                narration: 'El sótano está lleno de cajas polvorientas y telarañas.',
                type: 'wide',
                sfx: { text: 'DRIP... DRIP...', type: 'whoosh', position: 'bottom-right' }
            },
            {
                image: 'solo_laboratorio',
                speech: {
                    text: '"¿Un laboratorio? ¿Qué hacían los Vega aquí abajo?"',
                    position: 'top-left',
                    type: 'thought'
                },
                narration: 'Equipos científicos oxidados y frascos con líquidos extraños.'
            },
            {
                image: 'solo_formula',
                narration: 'Una fórmula química en la pared... esto cambia todo.',
                speech: {
                    text: '"¡Dios mío! No era un mito... realmente estaban experimentando."',
                    position: 'bottom-center',
                    type: 'speech'
                }
            }
        ],
        choices: [
            {
                text: 'Fotografiar todo y escapar',
                next: 'final_verdad',
                consequence: 'prudente'
            },
            {
                text: 'Buscar más evidencia en el laboratorio',
                next: 'solo_trampa_sotano',
                consequence: 'ambicioso'
            },
            {
                text: 'Subir a confrontar al dueño',
                next: 'final_heroe',
                consequence: 'valiente'
            }
        ]
    },

    solo_trampa_sotano: {
        chapter: 'Capítulo 3',
        title: 'La Trampa Mortal',
        layout: 'layout-2',
        panels: [
            {
                image: 'solo_trampa_gas',
                sfx: { text: '¡HISSSSS!', type: 'boom', position: 'center' },
                narration: 'Un gas venenoso empieza a llenar la habitación...'
            },
            {
                image: 'solo_escapar',
                speech: {
                    text: '"¡No! ¡Tengo que encontrar la salida!"',
                    position: 'bottom-left',
                    type: 'speech'
                },
                narration: 'Solo tienes segundos para actuar.'
            }
        ],
        choices: [
            {
                text: 'Romper la ventana y saltar',
                next: 'final_verdad',
                consequence: 'superviviente'
            },
            {
                text: 'Buscar el antídoto en los frascos',
                next: 'final_secreto',
                consequence: 'genio'
            }
        ]
    },

    solo_arriba: {
        chapter: 'Capítulo 3',
        title: 'Secretos en el Ático',
        layout: 'layout-3',
        rewards: ['diario'], // Recompensa: Diario del Abuelo
        panels: [
            {
                image: 'solo_dormitorio',
                narration: 'Las habitaciones guardan décadas de polvo y secretos olvidados.'
            },
            {
                image: 'solo_diario',
                speech: {
                    text: '"Un diario... ¡Esto lo explica todo! Los Vega no desaparecieron... huyeron."',
                    position: 'top-center',
                    type: 'speech'
                }
            },
            {
                image: 'solo_sombra',
                sfx: { text: '¡CRACK!', type: 'bang', position: 'center' },
                narration: 'Pero alguien más sabe que estás aquí...',
                speech: {
                    text: '"No deberías haber venido..."',
                    position: 'bottom-right',
                    type: 'thought'
                }
            }
        ],
        choices: [
            {
                text: 'Confrontar a la sombra misteriosa',
                next: 'final_heroe',
                consequence: 'confrontar'
            },
            {
                text: 'Escapar con el diario como evidencia',
                next: 'final_verdad',
                consequence: 'prudente'
            },
            {
                text: 'Esconderte y espiar a la sombra',
                next: 'solo_espiar',
                consequence: 'astuto'
            }
        ]
    },

    // NUEVO: Espiar a la sombra
    solo_espiar: {
        chapter: 'Capítulo 3.5',
        title: 'El Arte del Sigilo',
        layout: 'layout-2',
        panels: [
            {
                image: 'solo_escondido',
                narration: 'Conteniendo la respiración, observas desde las sombras...',
                speech: {
                    text: '"Ese hombre... lo conozco. Es el alcalde."',
                    position: 'bottom-left',
                    type: 'thought'
                }
            },
            {
                image: 'solo_revelacion',
                narration: 'El alcalde habla por teléfono revelando toda la conspiración.',
                speech: {
                    text: '"Sí, los Vega sabían demasiado. Tuve que silenciarlos."',
                    position: 'top-right',
                    type: 'speech'
                },
                sfx: { text: '📱', type: 'whoosh', position: 'top-left' }
            }
        ],
        choices: [
            {
                text: 'Grabar la confesión con tu móvil',
                next: 'final_secreto',
                consequence: 'brillante'
            },
            {
                text: 'Huir ahora que sabes la verdad',
                next: 'final_verdad',
                consequence: 'superviviente'
            }
        ]
    },

    solo_pasillo: {
        chapter: 'Capítulo 3',
        title: 'El Pasillo de los Espejos',
        layout: 'layout-2',
        panels: [
            {
                image: 'solo_espejos',
                narration: 'Los espejos reflejan más de lo que deberían...',
                speech: {
                    text: '"¿Eso... soy yo? Mi reflejo no se mueve conmigo."',
                    position: 'bottom-left',
                    type: 'thought'
                }
            },
            {
                image: 'solo_trampa',
                sfx: { text: '¡CLANK!', type: 'boom', position: 'center' },
                narration: '¡Una trampa! El suelo cede bajo tus pies.'
            }
        ],
        choices: [
            {
                text: 'Intentar agarrarte al borde',
                next: 'solo_arriba',
                consequence: 'reflexivo'
            },
            {
                text: 'Dejarte caer hacia lo desconocido',
                next: 'solo_sotano',
                consequence: 'temerario'
            }
        ]
    },

    // ============================================
    // RAMA: INVESTIGACIÓN EN EQUIPO
    // ============================================
    equipo_entrada: {
        chapter: 'Capítulo 2',
        title: 'Fuerza en la Unión',
        layout: 'layout-2-1',
        rewards: ['llave'], // Recompensa: Llave Maestra
        panels: [
            {
                image: 'equipo_reunion',
                speech: {
                    text: '"Sabía que llamarías. Este caso huele a problemas desde aquí."',
                    position: 'top-right',
                    type: 'speech'
                }
            },
            {
                image: 'equipo_plan',
                narration: 'Juntos elaboran un plan meticuloso antes de entrar.',
                speech: {
                    text: '"He traído linternas, cuerdas y mi grabadora."',
                    position: 'bottom-left',
                    type: 'speech'
                }
            },
            {
                image: 'equipo_entrada',
                speech: {
                    text: '"¿Tú por la izquierda, yo por la derecha? Nos encontramos arriba."',
                    position: 'bottom-center',
                    type: 'speech'
                },
                type: 'wide'
            }
        ],
        choices: [
            {
                text: 'Seguir el plan y separarse',
                next: 'equipo_separados',
                consequence: 'confianza'
            },
            {
                text: 'Mantenerse juntos por seguridad',
                next: 'equipo_juntos',
                consequence: 'prudente'
            },
            {
                text: 'Explorar primero la biblioteca',
                next: 'equipo_biblioteca',
                consequence: 'investigador'
            }
        ]
    },

    // NUEVO: Ruta investigación previa en equipo
    equipo_preparado: {
        chapter: 'Capítulo 2',
        title: 'Preparados para Todo',
        layout: 'layout-3',
        panels: [
            {
                image: 'equipo_preparacion',
                narration: 'Compartes el mapa y la información con Ana.',
                speech: {
                    text: '"¡Increíble! Con esto podemos evitar las trampas."',
                    position: 'top-left',
                    type: 'speech'
                }
            },
            {
                image: 'equipo_estrategia',
                speech: {
                    text: '"El laboratorio secreto está bajo la biblioteca."',
                    position: 'bottom-center',
                    type: 'speech'
                },
                narration: 'Ana estudia el mapa con asombro.'
            },
            {
                image: 'equipo_entrada_noche',
                narration: 'Entran por el pasaje secreto del jardín a medianoche.',
                type: 'wide',
                sfx: { text: '🌙', type: 'whoosh', position: 'top-right' }
            }
        ],
        choices: [
            {
                text: 'Ir directamente al laboratorio',
                next: 'equipo_laboratorio',
                consequence: 'decidido'
            },
            {
                text: 'Buscar primero más evidencia',
                next: 'equipo_biblioteca',
                consequence: 'meticuloso'
            }
        ]
    },

    // NUEVO: Biblioteca oculta
    equipo_biblioteca: {
        chapter: 'Capítulo 2.5',
        title: 'La Biblioteca Prohibida',
        layout: 'layout-1-2',
        rewards: ['diario'], // Recompensa: Diario encontrado en biblioteca
        panels: [
            {
                image: 'equipo_biblioteca',
                narration: 'La biblioteca de los Vega contiene libros prohibidos de todo el mundo.',
                type: 'wide'
            },
            {
                image: 'equipo_libro',
                speech: {
                    text: '"Mira esto... un diario de contabilidad. ¡Pagos a políticos!"',
                    position: 'top-left',
                    type: 'speech'
                }
            },
            {
                image: 'equipo_pasadizo',
                narration: 'Ana encuentra un mecanismo oculto tras los libros.',
                sfx: { text: '¡CLICK!', type: 'bang', position: 'center' }
            }
        ],
        choices: [
            {
                text: 'Entrar en el pasadizo secreto',
                next: 'equipo_laboratorio',
                consequence: 'valiente'
            },
            {
                text: 'Quedarse a estudiar los documentos',
                next: 'equipo_juntos',
                consequence: 'prudente'
            }
        ]
    },

    // NUEVO: Laboratorio en equipo
    equipo_laboratorio: {
        chapter: 'Capítulo 3',
        title: 'El Laboratorio Secreto',
        layout: 'layout-2-1',
        rewards: ['antidoto'], // Recompensa: Antídoto encontrado
        panels: [
            {
                image: 'equipo_laboratorio',
                narration: 'El laboratorio secreto revela la verdad sobre los Vega.',
                sfx: { text: 'GLUB... GLUB...', type: 'bubble', position: 'top-center' },
                speech: {
                    text: '"No lo puedo creer... estaban creando una cura para todo."',
                    position: 'bottom-left',
                    type: 'speech'
                }
            },
            {
                image: 'equipo_formula_completa',
                speech: {
                    text: '"Y alguien poderoso no quería que el mundo lo supiera."',
                    position: 'top-right',
                    type: 'speech'
                }
            },
            {
                image: 'equipo_villano_aparece',
                sfx: { text: '¡BANG!', type: 'boom', position: 'center' },
                narration: 'La puerta se abre de golpe...',
                type: 'wide'
            }
        ],
        choices: [
            {
                text: 'Enfrentar al villano juntos',
                next: 'final_colectiva',
                consequence: 'valiente'
            },
            {
                text: 'Ana distrae mientras grabas evidencia',
                next: 'final_secreto',
                consequence: 'estratega'
            }
        ]
    },

    equipo_separados: {
        chapter: 'Capítulo 3',
        title: 'Caminos Divididos',
        layout: 'layout-2',
        panels: [
            {
                image: 'equipo_grito',
                sfx: { text: '¡AAAAH!', type: 'bang', position: 'top-center' },
                narration: 'Un grito atraviesa la oscuridad... ¡Es Ana!'
            },
            {
                image: 'equipo_correr',
                speech: {
                    text: '"¡ANA! ¡Aguanta, voy hacia ti!"',
                    position: 'bottom-left',
                    type: 'speech'
                },
                narration: 'Tu corazón late con fuerza mientras corres.',
                sfx: { text: 'PUMP-PUMP', type: 'pulse', position: 'center' }
            }
        ],
        choices: [
            {
                text: 'Correr hacia donde vino el grito',
                next: 'final_colectiva',
                consequence: 'leal'
            },
            {
                text: 'Buscar primero algo con qué defenderse',
                next: 'equipo_juntos',
                consequence: 'estratega'
            }
        ]
    },

    equipo_juntos: {
        chapter: 'Capítulo 3',
        title: 'Unidos Prevalecemos',
        layout: 'layout-1-2',
        panels: [
            {
                image: 'equipo_descubrimiento',
                narration: 'Juntos descubren la sala secreta de la mansión, donde todo empezó.',
                type: 'wide'
            },
            {
                image: 'equipo_evidencia',
                speech: {
                    text: '"¡Mira esto! Contratos, fotos, grabaciones... Es la prueba que necesitábamos."',
                    position: 'top-left',
                    type: 'speech'
                }
            },
            {
                image: 'equipo_villano',
                speech: {
                    text: '"Vaya, vaya... No esperaba visitas a estas horas."',
                    position: 'top-right',
                    type: 'speech'
                },
                narration: 'El verdadero dueño de la mansión aparece entre las sombras. Su rostro te resulta familiar...'
            }
        ],
        choices: [
            {
                text: 'Enfrentar al villano juntos',
                next: 'final_colectiva',
                consequence: 'unidad'
            },
            {
                text: 'Ana distrae mientras tú escapas con la evidencia',
                next: 'final_verdad',
                consequence: 'calculador'
            },
            {
                text: 'Negociar con el villano',
                next: 'negociacion',
                consequence: 'diplomatico'
            }
        ]
    },

    // NUEVO: Negociación con el villano
    negociacion: {
        chapter: 'Capítulo 4',
        title: 'El Arte del Engaño',
        layout: 'layout-2',
        panels: [
            {
                image: 'negociacion',
                speech: {
                    text: '"¿Qué quieres a cambio de tu silencio?"',
                    position: 'top-right',
                    type: 'speech'
                },
                narration: 'El villano parece dispuesto a negociar...'
            },
            {
                image: 'negociacion_trampa',
                speech: {
                    text: '"Mientras él habla, Ana está transmitiendo todo en vivo..."',
                    position: 'bottom-left',
                    type: 'thought'
                },
                sfx: { text: '📡 LIVE', type: 'whoosh', position: 'top-left' }
            }
        ],
        choices: [
            {
                text: 'Revelar que todo fue grabado',
                next: 'final_secreto',
                consequence: 'genio'
            },
            {
                text: 'Seguir el juego para ganar tiempo',
                next: 'final_colectiva',
                consequence: 'astuto'
            }
        ]
    },

    // ============================================
    // FINALES
    // ============================================
    final_heroe: {
        chapter: 'Final',
        title: '🏆 El Héroe Solitario',
        layout: 'layout-1',
        isEnding: true,
        endingId: 'heroe',
        panels: [
            {
                image: 'final_heroe',
                narration: 'Enfrentaste el peligro solo y saliste victorioso. El villano yace derrotado a tus pies.',
                speech: {
                    text: '"Se acabó. La mansión Vega ya no guarda más secretos."',
                    position: 'bottom-center',
                    type: 'speech'
                },
                type: 'ending'
            }
        ],
        description: 'Tu valentía te llevó a resolver el misterio por tu cuenta. Confrontaste al alcalde corrupto en una pelea épica y lograste reducirlo hasta que llegó la policía. El caso Vega se reabrió y se hizo justicia después de 50 años. Eres un héroe, y esta vez todo el mundo lo sabe.',
        stats: {
            titulo: 'El Lobo Solitario',
            moral: 'A veces la valentía individual marca la diferencia.',
            logros: ['Valiente', 'Confrontación Directa', 'Justicia Personal']
        }
    },

    final_verdad: {
        chapter: 'Final',
        title: '📜 La Verdad Oculta',
        layout: 'layout-1',
        isEnding: true,
        endingId: 'verdad',
        panels: [
            {
                image: 'final_verdad',
                narration: 'El diario y las pruebas revelaron una conspiración de décadas que implicaba a los más poderosos de la ciudad.',
                speech: {
                    text: '"El mundo debe saber lo que pasó aquí. Los Vega merecen justicia."',
                    position: 'bottom-center',
                    type: 'speech'
                },
                type: 'ending'
            }
        ],
        description: 'Escapaste con la evidencia necesaria para exponer la verdad. Tu investigación se publicó en todos los periódicos, destapando un escándalo que sacudió a toda la ciudad. Tres políticos fueron arrestados, y los herederos de los Vega recibieron una disculpa oficial del gobierno. Te ofrecieron un premio Pulitzer.',
        stats: {
            titulo: 'El Periodista',
            moral: 'La verdad es el arma más poderosa.',
            logros: ['Investigador', 'Prudente', 'Premio Pulitzer']
        }
    },

    final_colectiva: {
        chapter: 'Final',
        title: '🤝 Victoria Colectiva',
        layout: 'layout-1',
        isEnding: true,
        endingId: 'colectiva',
        panels: [
            {
                image: 'final_equipo',
                narration: 'Juntos lograron lo que habría sido imposible solo. La amistad y la confianza mutua fueron las verdaderas armas.',
                speech: {
                    text: '"No lo habría logrado sin ti, Ana. Somos un gran equipo."',
                    position: 'bottom-center',
                    type: 'speech'
                },
                type: 'ending'
            }
        ],
        description: 'El trabajo en equipo fue la clave. Ana y tú resolvieron el misterio juntos, capturando al villano en el acto. Su amistad se fortaleció y decidieron formar una agencia de detectives. La mansión Vega ahora es un museo dedicado a la verdad y la justicia, y ustedes son los curadores honorarios.',
        stats: {
            titulo: 'El Compañero Leal',
            moral: 'Juntos somos más fuertes.',
            logros: ['Trabajo en Equipo', 'Amistad', 'Nueva Agencia']
        }
    },

    // NUEVO: Cuarto final secreto
    final_secreto: {
        chapter: 'Final Secreto',
        title: '🌟 El Legado de los Vega',
        layout: 'layout-1',
        isEnding: true,
        endingId: 'secreto',
        panels: [
            {
                image: 'final_secreto',
                narration: 'Descubriste el mayor secreto de todos: la fórmula de los Vega era real, y ahora está en tus manos.',
                speech: {
                    text: '"Con este conocimiento... puedo cambiar el mundo."',
                    position: 'bottom-center',
                    type: 'speech'
                },
                type: 'ending'
            }
        ],
        description: '¡FINAL SECRETO DESBLOQUEADO! No solo resolviste el misterio, sino que descubriste que la fórmula de los Vega era una cura revolucionaria. Grabaste la confesión del alcalde corrupto y la transmitiste en vivo. Con la fórmula segura y los criminales expuestos, fundaste una fundación en nombre de los Vega que cambió la medicina para siempre. Eres una leyenda.',
        stats: {
            titulo: 'El Heredero de los Vega',
            moral: 'Los secretos más peligrosos a veces contienen las mayores bendiciones.',
            logros: ['Genio', 'Fundador de Legado', 'Cambió la Historia']
        }
    }
};

// Metadatos de la historia
const STORY_META = {
    title: 'El Misterio de la Mansión Vega',
    author: 'Novela Interactiva',
    totalEndings: 4,
    startNode: 'prologo',
    endings: {
        heroe: { name: 'El Héroe Solitario', icon: '🏆', color: '#fbbf24', difficulty: 'Normal' },
        verdad: { name: 'La Verdad Oculta', icon: '📜', color: '#6366f1', difficulty: 'Normal' },
        colectiva: { name: 'Victoria Colectiva', icon: '🤝', color: '#22c55e', difficulty: 'Normal' },
        secreto: { name: 'El Legado de los Vega', icon: '🌟', color: '#ec4899', difficulty: 'Secreto' }
    },
    chapters: {
        prologo: 'Prólogo',
        capitulo1: 'Capítulo 1: La Carta Misteriosa',
        capitulo2: 'Capítulo 2: La Investigación',
        capitulo3: 'Capítulo 3: Secretos Revelados',
        final: 'El Desenlace'
    }
};

// Imágenes placeholder (se reemplazarán con imágenes generadas)
const IMAGE_PLACEHOLDERS = {
    // Prólogo
    prologo_periodico: 'assets/images/prologo_periodico.png',
    prologo_familia: 'assets/images/prologo_familia.png',
    prologo_misterio: 'assets/images/prologo_misterio.png',
    // Intro
    intro_mansion: 'assets/images/intro_mansion.png',
    intro_detective: 'assets/images/intro_detective.png',
    intro_carta: 'assets/images/intro_carta.png',
    // Solo
    solo_puerta: 'assets/images/solo_puerta.png',
    solo_hall: 'assets/images/solo_hall.png',
    solo_escalera: 'assets/images/solo_escalera.png',
    solo_dormitorio: 'assets/images/solo_dormitorio.png',
    solo_diario: 'assets/images/solo_diario.png',
    solo_sombra: 'assets/images/solo_sombra.png',
    solo_espejos: 'assets/images/solo_espejos.png',
    solo_trampa: 'assets/images/solo_trampa.png',
    solo_sotano: 'assets/images/solo_sotano.png',
    solo_laboratorio: 'assets/images/solo_laboratorio.png',
    solo_formula: 'assets/images/solo_formula.png',
    // Equipo
    equipo_reunion: 'assets/images/equipo_reunion.png',
    equipo_plan: 'assets/images/equipo_plan.png',
    equipo_entrada: 'assets/images/equipo_entrada.png',
    equipo_grito: 'assets/images/equipo_grito.png',
    equipo_correr: 'assets/images/equipo_correr.png',
    equipo_descubrimiento: 'assets/images/equipo_descubrimiento.png',
    equipo_evidencia: 'assets/images/equipo_evidencia.png',
    equipo_villano: 'assets/images/equipo_villano.png',
    equipo_biblioteca: 'assets/images/equipo_biblioteca.png',
    equipo_laboratorio: 'assets/images/equipo_laboratorio.png',
    // Finales
    final_heroe: 'assets/images/final_heroe.png',
    final_verdad: 'assets/images/final_verdad.png',
    final_equipo: 'assets/images/final_equipo.png',
    final_secreto: 'assets/images/final_secreto.png'
};

// Exportar
window.STORY = STORY;
window.STORY_META = STORY_META;
window.IMAGE_PLACEHOLDERS = IMAGE_PLACEHOLDERS;

