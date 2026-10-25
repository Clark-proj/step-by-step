// Coordinates are normalized PNG UV: x left→right; y top→bottom.
// Each configuration is tied to the PNG in assets/. Never swap without calibration.
const motion=(center,radius,amount,speed=.8,response=[0,-.007])=>({center,radius,amount,speed,response});
const eye=(x,y,rx=.028,ry=.018)=>({center:[x,y],radius:[rx,ry]});
function profile(name,quality,particle,colors,spec){return {name,quality,particle,colors,src:`./ess-${name.toLowerCase()}.png`,glow:[1,.7,.25],symbolRadius:[.05,.045],bodyRadius:[.2,.2],breath:1.25,anchorY:.86,head:{center:[.6,.3],pivot:[.57,.39],radius:[.20,.18],angle:.007},...spec};}
export const profiles={
  sage:profile('Sage','Mente e creatività','leaf',['#90caa0','#cfb75b','#fff4d0'],{
    symbol:[.607,.380],eyes:[eye(.580,.222,.039,.026),eye(.703,.247,.031,.023)],mouth:[.654,.27],body:[.57,.46],anchorY:.94,anchorRects:[[.01,.71,.40,.96],[.51,.61,.72,.67]],
    head:{center:[.61,.21],pivot:[.61,.31],radius:[.24,.19],angle:.006},
    motions:[motion([.25,.41],[.23,.23],[-.0027,-.0014],.65,[-.006,-.005]),motion([.63,.79],[.31,.16],[.003,.0012],.59,[.004,-.003]),motion([.46,.12],[.24,.11],[.0014,0],.72,[0,-.003])],
    glints:[[.21,.35],[.29,.38],[.32,.44],[.19,.47],[.28,.53],[.38,.57],[.51,.15],[.69,.16],[.51,.66],[.63,.71],[.72,.77],[.76,.81],[.61,.38]],
    gesture:'Piume e foglie si richiudono dalla radice; il capo cambia attenzione e il ciuffo risponde con un piccolo scatto.',success:'Un cenno del capo, foglie luminose e una breve risposta del simbolo.'
  }),
  brook:profile('Brook','Corpo e continuità','droplet',['#64cef5','#bcabed','#e8fcff'],{
    symbol:[.602,.415],glow:[.15,.7,1],eyes:[eye(.477,.175,.036,.022),eye(.605,.139,.021,.017)],mouth:[.609,.203],body:[.54,.49],anchorY:.92,
    head:{center:[.48,.21],pivot:[.5,.31],radius:[.25,.2],angle:.007},
    motions:[motion([.26,.31],[.20,.19],[-.0025,.0013],.68,[-.007,-.005]),motion([.64,.77],[.35,.17],[.0035,.0014],.65,[.004,-.006]),motion([.86,.37],[.12,.13],[.0012,-.0015],.8,[.002,-.004])],
    glints:[[.27,.24],[.24,.31],[.31,.36],[.23,.49],[.18,.58],[.24,.67],[.39,.74],[.56,.77],[.70,.74],[.83,.69],[.84,.78],[.69,.85],[.60,.42]],
    gesture:'La zampa già sollevata accenna un gesto; pinne e coda seguono con ritardo, mentre il capo si orienta.',success:'La luce azzurra attraversa solo il simbolo; gocce e riflessi si liberano dalla coda.'
  }),
  hearth:profile('Hearth','Legami e cura','petal',['#db9edc','#b8b3f9','#fff0fb'],{
    symbol:[.867,.515],glow:[.8,.35,.8],eyes:[eye(.747,.300,.026,.016)],mouth:[.685,.357],body:[.63,.55],anchorY:.74,
    head:{center:[.747,.315],pivot:[.78,.40],radius:[.18,.15],angle:.006},
    motions:[motion([.62,.26],[.12,.09],[-.0015,.001],.7,[-.003,-.003]),motion([.87,.26],[.12,.1],[.0013,.0008],.7,[.003,-.003]),motion([.16,.56],[.16,.13],[-.002,.001],.62,[-.004,-.002])],
    glints:[[.48,.10],[.52,.17],[.65,.22],[.77,.13],[.84,.18],[.75,.24],[.80,.43],[.87,.51],[.60,.52],[.36,.51],[.21,.54]],
    gesture:'Le orecchie scattano separatamente e si assestano; il capo si orienta, con i piedi fermi.',success:'Un piccolo cenno fiducioso, petali delicati e luce sul petto.'
  }),
  moss:profile('Moss','Stabilità e pazienza','leaf',['#95bc68','#dab85d','#fff0bf'],{
    symbol:[.515,.414],symbolRadius:[.072,.05],glow:[.7,.7,.15],eyes:[eye(.786,.435,.031,.02),eye(.934,.458,.018,.016)],mouth:[.86,.503],body:[.63,.55],breath:.75,anchorY:.82,
    head:{center:[.84,.47],pivot:[.77,.55],radius:[.20,.14],angle:.005},
    motions:[motion([.45,.16],[.29,.15],[.0018,.0005],.48,[.002,-.002]),motion([.26,.44],[.17,.20],[.001,.0005],.53,[0,-.002])],
    glints:[[.31,.16],[.44,.12],[.59,.18],[.67,.26],[.29,.31],[.39,.36],[.49,.41],[.32,.51],[.43,.57],[.60,.58],[.65,.45]],
    gesture:'Il capo osserva con calma; le fronde hanno inerzia e le foglie seguono il movimento senza trascinare il guscio.',success:'Una risposta calma: luce ambrata, foglie e un cenno appena percepibile.'
  }),
  nyx:profile('Nyx','Riposo e raccoglimento','snow',['#a2bbf8','#a9a4e6','#f3f5ff'],{
    symbol:[.87,.443],glow:[.3,.4,1],eyes:[eye(.804,.243,.025,.016),eye(.894,.253,.019,.014)],mouth:[.908,.293],body:[.73,.54],breath:.85,anchorY:.80,
    head:{center:[.83,.26],pivot:[.81,.35],radius:[.19,.16],angle:.005},
    motions:[motion([.31,.62],[.25,.18],[.002,.0008],.5,[-.003,-.003]),motion([.43,.46],[.17,.15],[-.0017,.0007],.63,[-.003,-.002])],
    glints:[[.70,.17],[.80,.20],[.88,.28],[.72,.42],[.59,.49],[.46,.55],[.27,.62],[.49,.64],[.87,.44],[.65,.62]],
    gesture:'Orecchie vigili, piccoli cambi di attenzione e un movimento lento della coda; zampe ferme sulla roccia.',success:'Breve bagliore lunare e pochi fiocchi luminosi, senza esplosioni frenetiche.'
  }),
  prism:profile('Prism','Chiarezza e attenzione','shard',['#a8c6ff','#c6a4f3','#f5f2ff'],{
    symbol:[.513,.412],glow:[.5,.5,1],eyes:[eye(.452,.270,.027,.019),eye(.565,.272,.027,.019)],mouth:[.51,.315],body:[.52,.47],anchorY:.97,
    head:{center:[.51,.28],pivot:[.51,.35],radius:[.15,.13],angle:.006},
    motions:[motion([.28,.41],[.24,.22],[-.0035,.001],.7,[-.009,-.006]),motion([.76,.41],[.24,.22],[.0035,.001],.7,[.009,-.006]),motion([.53,.74],[.25,.18],[.002,.001],.6,[0,-.003])],
    glints:[[.24,.27],[.29,.36],[.35,.47],[.23,.53],[.76,.27],[.72,.36],[.66,.47],[.79,.53],[.43,.66],[.59,.71],[.52,.44]],
    gesture:'Ali, antenne e zampe hanno gesti sfalsati, con ampiezza controllata per mantenere le forme.',success:'Un’apertura appena più ampia e una breve pioggia di minuscole schegge luminose.'
  }),
  wisp:profile('Wisp','Gioco e meraviglia','shard',['#c8b8ff','#a5c8fb','#fff0ff'],{
    symbol:[.74,.44],glow:[.65,.4,1],eyes:[eye(.735,.281,.027,.018),eye(.84,.27,.019,.015)],mouth:[.85,.322],body:[.63,.55],anchorY:.96,
    head:{center:[.78,.29],pivot:[.73,.38],radius:[.18,.16],angle:.009},
    motions:[motion([.34,.65],[.26,.2],[.003,.0015],.72,[-.005,-.005]),motion([.43,.19],[.15,.14],[-.002,.0008],.8,[-.004,-.003]),motion([.73,.18],[.14,.13],[.0015,.0007],.75,[.003,-.002])],
    glints:[[.37,.15],[.45,.23],[.70,.15],[.65,.24],[.60,.46],[.44,.55],[.31,.62],[.30,.70],[.47,.75],[.57,.68]],
    gesture:'Orecchie curiose, brevi scatti delle zampe sollevate e coda con un ritorno più lento.',success:'Luce iridescente e scintille giocose, senza cambiare l’aspetto adulto.'
  }),
  fathom:profile('Fathom','Visione e profondità','droplet',['#75d4ec','#c1adeb','#eaffff'],{
    symbol:[.696,.487],glow:[.15,.7,1],eyes:[eye(.60,.24,.022,.018)],mouth:[.63,.30],body:[.49,.49],anchorY:.98,
    head:{center:[.56,.26],pivot:[.48,.34],radius:[.18,.17],angle:.006},
    motions:[motion([.24,.25],[.18,.20],[-.0025,.0012],.63,[-.005,-.003]),motion([.73,.58],[.19,.22],[.003,.0013],.66,[.005,-.005]),motion([.50,.82],[.28,.16],[.0034,.0013],.53,[.004,-.004])],
    glints:[[.35,.17],[.25,.25],[.37,.32],[.58,.42],[.66,.53],[.70,.61],[.52,.66],[.40,.73],[.57,.82],[.43,.88]],
    gesture:'Cresta, pinne e coda seguono un movimento continuo e leggero, senza dividere la figura in pezzi.',success:'Il simbolo si intensifica e lascia emergere gocce e riflessi delle pinne.'
  }),
  aster:profile('Aster','Intuizione','shard',['#efb7df','#dec36b','#fff4d9'],{
    symbol:[.37,.67],glow:[1,.6,.3],eyes:[eye(.717,.406,.028,.019)],mouth:[.80,.45],body:[.56,.62],anchorY:.83,
    head:{center:[.72,.42],pivot:[.68,.49],radius:[.16,.16],angle:.007},
    motions:[motion([.30,.18],[.17,.16],[-.002,.001],.65,[-.004,-.003]),motion([.62,.16],[.14,.15],[.0017,.001],.61,[.003,-.003]),motion([.28,.64],[.18,.16],[.0017,.0008],.7,[-.003,-.002])],
    glints:[[.28,.16],[.36,.24],[.57,.13],[.63,.22],[.50,.45],[.39,.62],[.36,.69],[.53,.67]],
    gesture:'Le grandi orecchie si orientano con piccoli scatti e un ritorno morbido; capo e coda hanno tempi diversi.',success:'Un cenno di attenzione e luce stellare concentrata sul corpo.'
  }),
  bloom:profile('Bloom','Gioia e creatività','petal',['#eeb2c7','#a3d59a','#fff1cc'],{
    symbol:[.67,.39],glow:[1,.5,.25],eyes:[eye(.717,.246,.024,.017)],mouth:[.83,.24],body:[.59,.43],anchorY:.98,
    head:{center:[.64,.26],pivot:[.56,.34],radius:[.17,.15],angle:.008},
    motions:[motion([.29,.32],[.22,.21],[-.003,.0013],.95,[-.006,-.004]),motion([.71,.48],[.17,.2],[.002,.0013],.85,[.004,-.004]),motion([.49,.76],[.24,.21],[.0026,.0013],.68,[.003,-.005])],
    glints:[[.26,.22],[.34,.29],[.29,.40],[.45,.46],[.60,.42],[.67,.51],[.43,.59],[.51,.72],[.45,.82]],
    gesture:'Le ali-petalo cambiano apertura, con brevi fremiti e assestamenti; la coda segue più lentamente.',success:'Petali e luce calda accompagnano una distensione delle ali.'
  }),
  brume:profile('Brume','Calma','petal',['#bfb7f2','#e8bbcf','#fff0d9'],{
    symbol:[.683,.499],glow:[.75,.45,1],eyes:[eye(.83,.322,.03,.018)],mouth:[.94,.34],body:[.59,.47],breath:.8,anchorY:.98,
    head:{center:[.83,.34],pivot:[.74,.42],radius:[.21,.17],angle:.004},
    motions:[motion([.35,.25],[.28,.16],[.002,.0014],.48,[-.003,-.003]),motion([.41,.68],[.27,.23],[.0028,.0015],.5,[-.004,-.003]),motion([.74,.57],[.15,.17],[.002,.001],.55,[.003,-.003])],
    glints:[[.28,.20],[.42,.25],[.49,.37],[.65,.47],[.43,.57],[.31,.67],[.48,.74],[.68,.59]],
    gesture:'Pinne e coda seguono un flusso continuo; il capo cambia leggermente attenzione.',success:'Un bagliore morbido e particelle leggere, senza interrompere la calma.'
  }),
  echo:profile('Echo','Ascolto e voce interiore','shard',['#b99bea','#e5b0dc','#f5e8ff'],{
    symbol:[.687,.417],glow:[.75,.3,1],eyes:[eye(.739,.296,.023,.018),eye(.813,.31,.017,.014)],mouth:[.796,.339],body:[.64,.46],anchorY:.98,
    head:{center:[.78,.30],pivot:[.73,.37],radius:[.17,.17],angle:.007},
    motions:[motion([.30,.28],[.24,.23],[-.0028,.001],.65,[-.007,-.004]),motion([.78,.48],[.18,.22],[.0023,.001],.65,[.006,-.004]),motion([.55,.76],[.23,.18],[.002,.0009],.6,[.003,-.003])],
    glints:[[.28,.19],[.36,.31],[.28,.43],[.51,.30],[.76,.46],[.80,.57],[.60,.60],[.55,.72],[.65,.48]],
    gesture:'Ali dalla radice, piccoli scatti dell’orecchio e un breve fremito; la coda si assesta dopo il corpo.',success:'Un cenno del capo e luce viola che si libera in particelle, senza onde circolari.'
  }),
  lumen:profile('Lumen','Fiducia e determinazione','petal',['#f0bd6b','#e8a17e','#fff1c6'],{
    symbol:[.809,.484],glow:[1,.6,.1],eyes:[eye(.752,.226,.03,.018),eye(.90,.235,.02,.016)],mouth:[.852,.284],body:[.70,.55],anchorY:.80,
    head:{center:[.82,.25],pivot:[.79,.34],radius:[.19,.18],angle:.006},
    motions:[motion([.42,.36],[.21,.23],[-.002,.001],.65,[-.005,-.003]),motion([.78,.39],[.17,.22],[.002,.001],.68,[.004,-.003]),motion([.22,.63],[.18,.20],[.002,.001],.6,[-.003,-.003])],
    glints:[[.46,.19],[.64,.19],[.42,.33],[.77,.33],[.46,.47],[.69,.48],[.34,.56],[.25,.64],[.56,.62]],
    gesture:'Orecchie indipendenti, capo fiero che cambia attenzione e coda che si assesta; le zampe rimangono ferme.',success:'Una luce solare concentrata sul petto e petali dorati, senza sole orbitante.'
  }),
  quartz:profile('Quartz','Resilienza','shard',['#dfa4d4','#a8d2ec','#fff0fd'],{
    symbol:[.696,.49],symbolRadius:[.06,.06],glow:[1,.4,.7],eyes:[eye(.678,.125,.027,.018)],mouth:[.757,.171],body:[.60,.54],breath:.9,anchorY:.84,
    head:{center:[.70,.16],pivot:[.67,.25],radius:[.20,.16],angle:.005},
    motions:[motion([.30,.42],[.19,.24],[-.0014,.0006],.6,[-.003,-.002]),motion([.74,.45],[.16,.23],[.0014,.0006],.63,[.003,-.002])],
    glints:[[.33,.28],[.27,.39],[.38,.45],[.63,.47],[.71,.38],[.76,.56],[.47,.61],[.33,.68],[.63,.71]],
    gesture:'Un respiro stabile, piccoli scatti dell’orecchio e movimenti del capo; le zampe rimangono piantate.',success:'Il cristallo del petto si accende e libera minuscole schegge luminose.'
  }),
  rill:profile('Rill','Equilibrio','petal',['#8ed9d6','#f2b8a1','#efffff'],{
    symbol:[.704,.348],glow:[.1,.8,.8],eyes:[eye(.687,.168,.025,.017),eye(.765,.171,.016,.014)],mouth:[.761,.20],body:[.62,.41],anchorY:.98,
    head:{center:[.73,.18],pivot:[.67,.28],radius:[.17,.15],angle:.006},
    motions:[motion([.32,.37],[.23,.24],[-.0025,.0013],.64,[-.005,-.003]),motion([.73,.46],[.18,.21],[.0025,.0013],.64,[.005,-.003]),motion([.49,.78],[.27,.20],[.003,.0013],.55,[.003,-.005])],
    glints:[[.43,.20],[.36,.33],[.29,.44],[.64,.40],[.69,.49],[.54,.60],[.40,.70],[.55,.79],[.57,.86]],
    gesture:'Cresta, pinne e coda si muovono insieme con un flusso lieve e continuo.',success:'Una risposta fluida del corpo, luce acquamarina e petali di loto.'
  }),
  veil:profile('Veil','Trasformazione','petal',['#adcfc0','#cbbbe8','#fff3e7'],{
    symbol:[.65,.395],glow:[.45,.8,.65],eyes:[eye(.5575,.215,.026,.019),eye(.645,.238,.017,.014)],mouth:[.62,.273],body:[.56,.45],breath:1.05,anchorY:.98,
    head:{center:[.60,.23],pivot:[.59,.31],radius:[.19,.17],angle:.006},
    motions:[motion([.35,.32],[.25,.19],[-.0025,.0014],.57,[-.004,-.003]),motion([.69,.56],[.23,.20],[.0027,.0013],.59,[.004,-.004]),motion([.45,.82],[.27,.15],[.0028,.0012],.5,[.003,-.004])],
    glints:[[.44,.16],[.37,.28],[.34,.39],[.57,.46],[.70,.53],[.62,.62],[.43,.72],[.51,.83],[.36,.81]],
    gesture:'Veli e coda seguono la stessa curva continua; il capo cambia attenzione con un piccolo gesto.',success:'La luce sul corpo si intensifica e libera frammenti madreperla, senza trasformazioni fisiche.'
  }),
  volt:profile('Volt','Concentrazione','electric',['#8bc9f7','#e6c370','#f4fbff'],{
    symbol:[.675,.482],glow:[.15,.6,1],eyes:[eye(.725,.373,.023,.016)],mouth:[.7625,.407],body:[.61,.50],anchorY:.98,
    head:{center:[.73,.38],pivot:[.68,.45],radius:[.16,.14],angle:.006},
    motions:[motion([.28,.26],[.24,.24],[-.0028,.001],.76,[-.007,-.005]),motion([.80,.45],[.17,.20],[.0025,.001],.8,[.005,-.004]),motion([.45,.76],[.29,.19],[.0028,.0012],.62,[.003,-.004])],
    glints:[[.22,.17],[.32,.25],[.40,.34],[.31,.42],[.65,.44],[.77,.45],[.70,.55],[.43,.65],[.52,.78]],
    gesture:'Ali vigili con apertura dalla radice, piccoli scatti degli artigli liberi e movimenti del capo.',success:'Piume luminose e piccoli frammenti elettrici isolati, senza fulmini sullo schermo.'
  }),
  ember:profile('Ember','Lavoro ed energia','feather',['#ffbd69','#ef8e43','#fff2cd'],{
    src:'./ess-ember.png',symbol:[.752,.391],eyes:[eye(.699,.194,.033,.021)],mouth:[.785,.237],body:[.62,.45],anchorY:.98,anchorRects:[[.43,.62,.99,.97]],
    head:{center:[.67,.21],pivot:[.64,.29],radius:[.20,.18],angle:.008},
    motions:[motion([.28,.40],[.25,.24],[-.004,.0018],1.15,[-.013,-.012]),motion([.91,.44],[.16,.22],[.003,.0015],1.3,[.011,-.01]),motion([.42,.83],[.38,.14],[.0032,.0014],.92,[.002,-.003])],
    glints:[[.18,.30],[.25,.34],[.32,.37],[.24,.43],[.38,.44],[.42,.51],[.88,.42],[.92,.49],[.87,.56],[.93,.60],[.16,.71],[.20,.79],[.32,.84],[.45,.89],[.62,.90],[.55,.85]],
    gesture:'Piccoli movimenti delle ali dalla radice, gesti della cresta e coda con inerzia; la roccia resta ferma.',success:'Breve celebrazione in piume e scintille dopo un’attività salvata.'
  })
};
export const essenceOrder=['sage','brook','hearth','moss','nyx','prism','wisp','fathom','aster','bloom','brume','echo','lumen','quartz','rill','veil','volt','ember'];
