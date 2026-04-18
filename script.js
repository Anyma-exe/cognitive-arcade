// ============================================
// 🧠 COGNITIVE ARCADE — script.js
// ============================================

// --- NAVIGATION ENTRE LES ÉCRANS ---

const menuPrincipal = document.getElementById("menu-principal");
const jeuStroop     = document.getElementById("jeu-stroop");
const jeuNback      = document.getElementById("jeu-nback");
const jeuGonogo     = document.getElementById("jeu-gonogo");

function afficherEcran(ecran) {
  menuPrincipal.classList.add("cache");
  jeuStroop.classList.add("cache");
  jeuNback.classList.add("cache");
  jeuGonogo.classList.add("cache");
  ecran.classList.remove("cache");
}

document.getElementById("btn-stroop").addEventListener("click", () => afficherEcran(jeuStroop));
document.getElementById("btn-nback").addEventListener("click",  () => afficherEcran(jeuNback));
document.getElementById("btn-gonogo").addEventListener("click", () => afficherEcran(jeuGonogo));

document.getElementById("retour-stroop").addEventListener("click",            () => afficherEcran(menuPrincipal));
document.getElementById("retour-nback").addEventListener("click",             () => afficherEcran(menuPrincipal));
document.getElementById("retour-gonogo").addEventListener("click",            () => afficherEcran(menuPrincipal));
document.getElementById("retour-resultats-stroop").addEventListener("click",  () => afficherEcran(menuPrincipal));
document.getElementById("retour-resultats-nback").addEventListener("click",   () => afficherEcran(menuPrincipal));
document.getElementById("retour-resultats-gonogo").addEventListener("click",  () => afficherEcran(menuPrincipal));

// ============================================
// 🎨 STROOP TEST
// ============================================

const MOTS     = ["RED", "BLUE", "GREEN"];
const COULEURS = [
  { nom: "RED", code: "#e74c3c", touche: "r" },
  { nom: "BLUE",  code: "#3498db", touche: "b" },
  { nom: "GREEN",  code: "#2ecc71", touche: "g" }
];
const NOMBRE_ESSAIS_STROOP = 20;

let essaiStroop      = 0;
let scoreStroop      = 0;
let tempsDebutStroop = 0;
let totalTempsStroop = 0;
let motCourant       = "";
let couleurCourante  = null;
let enAttenteStroop  = false;
let resultatsStroop  = [];

const ecranAccueilStroop   = document.getElementById("ecran-accueil-stroop");
const ecranJeuStroop       = document.getElementById("ecran-jeu-stroop");
const ecranResultatsStroop = document.getElementById("ecran-resultats-stroop");
const motAffiche           = document.getElementById("mot-affiche");
const feedbackStroop       = document.getElementById("feedback-stroop");
const compteurStroop       = document.getElementById("compteur-stroop");

function auHasard(tableau) {
  return tableau[Math.floor(Math.random() * tableau.length)];
}

function nouvelEssaiStroop() {
  enAttenteStroop = true;
  motCourant      = auHasard(MOTS);
  couleurCourante = auHasard(COULEURS);

  motAffiche.textContent     = motCourant;
  motAffiche.style.color     = couleurCourante.code;
  compteurStroop.textContent = `Essai : ${essaiStroop + 1} / ${NOMBRE_ESSAIS_STROOP}`;
  feedbackStroop.textContent = "";
  tempsDebutStroop           = Date.now();
}

function traiterReponseStroop(toucheAppuyee) {
  if (!enAttenteStroop) return;
  enAttenteStroop = false;

  const tempsReaction = Date.now() - tempsDebutStroop;
  const bonneTouche   = couleurCourante.touche;
  const correct       = (toucheAppuyee === bonneTouche);
  const typeEssai     = (motCourant === couleurCourante.nom) ? "congruent" : "incongruent";

  if (correct) {
    scoreStroop++;
    totalTempsStroop += tempsReaction;
    feedbackStroop.textContent = "✅ Correct !";
    feedbackStroop.style.color = "#2ecc71";
  } else {
    feedbackStroop.textContent = "❌ Failed !";
    feedbackStroop.style.color = "#e74c3c";
  }

  resultatsStroop.push({
    essai: essaiStroop + 1,
    mot: motCourant,
    couleur: couleurCourante.nom,
    type: typeEssai,
    correct: correct,
    tempsReaction: tempsReaction
  });

  essaiStroop++;

  if (essaiStroop >= NOMBRE_ESSAIS_STROOP) {
    setTimeout(afficherResultatsStroop, 800);
  } else {
    setTimeout(nouvelEssaiStroop, 600);
  }
}

function afficherResultatsStroop() {
  ecranJeuStroop.classList.add("cache");
  ecranResultatsStroop.classList.remove("cache");

  const precision    = Math.round((scoreStroop / NOMBRE_ESSAIS_STROOP) * 100);
  const tempsMoyenMs = scoreStroop > 0 ? Math.round(totalTempsStroop / scoreStroop) : 0;

  let diagnostic  = "";
  let couleurDiag = "";

  if (tempsMoyenMs < 600) {
    diagnostic  = "🟢 Excellent! You're very resistant to interference.";
    couleurDiag = "#2ecc71";
  } else if (tempsMoyenMs < 900) {
    diagnostic  = "🟡 Attention is average. The Stroop effect is well managed.";
    couleurDiag = "#f39c12";
  } else {
    diagnostic  = "🔴 Marked Stroop effect. Your brain is strongly influenced by automatic reading—it’s normal!";
    couleurDiag = "#e74c3c";
  }

  document.getElementById("score-final-stroop").textContent = `🎯 Precision : ${precision}% (${scoreStroop}/${NOMBRE_ESSAIS_STROOP} corrects)`;
  document.getElementById("temps-moyen-stroop").textContent = `⏱️ Average reaction time : ${tempsMoyenMs} ms`;
  document.getElementById("diagnostic-stroop").textContent  = diagnostic;
  document.getElementById("diagnostic-stroop").style.color  = couleurDiag;
}

function demarrerStroop() {
  essaiStroop      = 0;
  scoreStroop      = 0;
  totalTempsStroop = 0;
  resultatsStroop  = [];

  ecranAccueilStroop.classList.add("cache");
  ecranResultatsStroop.classList.add("cache");
  ecranJeuStroop.classList.remove("cache");

  nouvelEssaiStroop();
}

document.getElementById("bouton-start-stroop").addEventListener("click", demarrerStroop);
document.getElementById("bouton-restart-stroop").addEventListener("click", demarrerStroop);

// ============================================
// 🔢 N-BACK
// ============================================

const LETTRES             = ["A", "B", "C", "D", "E", "F", "G", "H"];
const NOMBRE_ESSAIS_NBACK = 20;
const DUREE_LETTRE        = 1500;
const DUREE_PAUSE         = 800;
const DUREE_MASQUE        = 400;

let essaiNback       = 0;
let lettreActuelle   = "";
let lettrePrecedente = "";
let enAttenteNback   = false;
let aRepondu         = false;
let vraisPositifs    = 0;
let fauxPositifs     = 0;
let omissions        = 0;
let timerNback       = null;
let resultatsNback   = [];

const ecranAccueilNback   = document.getElementById("ecran-accueil-nback");
const ecranJeuNback       = document.getElementById("ecran-jeu-nback");
const ecranResultatsNback = document.getElementById("ecran-resultats-nback");
const lettrAffichee       = document.getElementById("lettre-affichee");
const feedbackNback       = document.getElementById("feedback-nback");
const compteurNback       = document.getElementById("compteur-nback");

function nouvelEssaiNback() {
  if (essaiNback >= NOMBRE_ESSAIS_NBACK) {
    afficherResultatsNback();
    return;
  }

  lettrePrecedente = lettreActuelle;

  const estCible = (essaiNback > 0) && (Math.random() < 0.3);
  if (estCible) {
    lettreActuelle = lettrePrecedente;
  } else {
    let nouvelleLetre;
    do {
      nouvelleLetre = auHasard(LETTRES);
    } while (nouvelleLetre === lettrePrecedente);
    lettreActuelle = nouvelleLetre;
  }

  // Flash si cible : on cache 400ms puis on réaffiche
  if (estCible && essaiNback > 0) {
    lettrAffichee.textContent = "";
    setTimeout(() => {
      afficherLettreNback(estCible);
    }, DUREE_MASQUE);
  } else {
    afficherLettreNback(estCible);
  }
}

function afficherLettreNback(estCible) {
  lettrAffichee.textContent = lettreActuelle;
  feedbackNback.textContent = "";
  aRepondu                  = false;
  enAttenteNback            = true;

  // Bordure lumineuse si cible
  if (estCible) {
    lettrAffichee.classList.add("bordure-cible");
    setTimeout(() => {
      lettrAffichee.classList.remove("bordure-cible");
    }, 400);
  }

  compteurNback.textContent = `Essai : ${essaiNback + 1} / ${NOMBRE_ESSAIS_NBACK}`;

  timerNback = setTimeout(() => {
    evaluerReponseNback(estCible);
  }, DUREE_LETTRE);
}

function evaluerReponseNback(estCible) {
  enAttenteNback        = false;
  lettrAffichee.textContent = "";

  if (estCible && !aRepondu) {
    omissions++;
    feedbackNback.textContent = "⚠️ Missed !";
    feedbackNback.style.color = "#f39c12";
  } else if (!estCible && aRepondu) {
    fauxPositifs++;
    feedbackNback.textContent = "❌ Error !";
    feedbackNback.style.color = "#e74c3c";
  } else if (estCible && aRepondu) {
    vraisPositifs++;
    feedbackNback.textContent = "✅ Correct !";
    feedbackNback.style.color = "#2ecc71";
  }

  resultatsNback.push({
    essai: essaiNback + 1,
    lettre: lettreActuelle,
    estCible: estCible,
    aRepondu: aRepondu
  });

  essaiNback++;
  timerNback = setTimeout(nouvelEssaiNback, DUREE_PAUSE);
}

function afficherResultatsNback() {
  ecranJeuNback.classList.add("cache");
  ecranResultatsNback.classList.remove("cache");

  const totalCibles = resultatsNback.filter(r => r.estCible).length;
  const precision   = totalCibles > 0
    ? Math.round((vraisPositifs / totalCibles) * 100)
    : 0;

  let diagnostic  = "";
  let couleurDiag = "";

  if (precision >= 80) {
    diagnostic  = "🟢 Excellent working memory ! You detect targets well.";
    couleurDiag = "#2ecc71";
  } else if (precision >= 50) {
    diagnostic  = "🟡 Working memory is average. Keep practicing !";
    couleurDiag = "#f39c12";
  } else {
    diagnostic  = "🔴 The N-Back task is difficult ! That's normal for a first attempt.";
    couleurDiag = "#e74c3c";
  }

  document.getElementById("score-final-nback").textContent = `🎯 Precision : ${precision}% (${vraisPositifs}/${totalCibles} targets detected)`;
  document.getElementById("details-nback").textContent     = `❌ False positives : ${fauxPositifs} | ⚠️ Omissions : ${omissions}`;
  document.getElementById("diagnostic-nback").textContent  = diagnostic;
  document.getElementById("diagnostic-nback").style.color  = couleurDiag;
}

function demarrerNback() {
  essaiNback       = 0;
  lettreActuelle   = "";
  lettrePrecedente = "";
  vraisPositifs    = 0;
  fauxPositifs     = 0;
  omissions        = 0;
  resultatsNback   = [];

  ecranAccueilNback.classList.add("cache");
  ecranResultatsNback.classList.add("cache");
  ecranJeuNback.classList.remove("cache");

  timerNback = setTimeout(nouvelEssaiNback, 1000);
}

document.getElementById("bouton-start-nback").addEventListener("click", demarrerNback);
document.getElementById("bouton-restart-nback").addEventListener("click", demarrerNback);

// ============================================
// 🛑 GO / NO-GO
// ============================================

const SYMBOLE_GO    = "⭐"; // Appuyer sur Espace
const SYMBOLE_NOGO  = "❌"; // Ne rien faire
const NOMBRE_ESSAIS_GONOGO = 30; // 30 essais : 70% Go, 30% No-Go
const DUREE_SYMBOLE = 1000; // Temps d'affichage du symbole
const DUREE_PAUSE_GONOGO = 800; // Pause entre les essais

let essaiGonogo      = 0;
let bonnesRepGonogo  = 0;  // Go bien appuyés
let fauxPosiGonogo   = 0;  // No-Go appuyés par erreur (impulsivité)
let omissionsGonogo  = 0;  // Go manqués (inattention)
let tempsRepGonogo   = []; // Temps de réaction sur les Go corrects
let enAttenteGonogo  = false;
let aReponduGonogo   = false;
let timerGonogo      = null;
let estGoActuel      = false;
let resultatsGonogo  = [];

const ecranAccueilGonogo   = document.getElementById("ecran-accueil-gonogo");
const ecranJeuGonogo       = document.getElementById("ecran-jeu-gonogo");
const ecranResultatsGonogo = document.getElementById("ecran-resultats-gonogo");
const symboleAffiche       = document.getElementById("symbole-affiche");
const feedbackGonogo       = document.getElementById("feedback-gonogo");
const compteurGonogo       = document.getElementById("compteur-gonogo");

function nouvelEssaiGonogo() {
  if (essaiGonogo >= NOMBRE_ESSAIS_GONOGO) {
    afficherResultatsGonogo();
    return;
  }

  // 70% de chance d'avoir un Go, 30% No-Go
  estGoActuel     = Math.random() < 0.7;
  aReponduGonogo  = false;
  enAttenteGonogo = true;

  // On affiche le symbole
  symboleAffiche.textContent  = estGoActuel ? SYMBOLE_GO : SYMBOLE_NOGO;
  feedbackGonogo.textContent  = "";
  compteurGonogo.textContent  = `Essai : ${essaiGonogo + 1} / ${NOMBRE_ESSAIS_GONOGO}`;

  // On note l'heure pour mesurer le temps de réaction
  tempsDebutGonogo = Date.now();

  // Après DUREE_SYMBOLE ms, on évalue
  timerGonogo = setTimeout(() => {
    evaluerReponseGonogo();
  }, DUREE_SYMBOLE);
}

// Variable pour le temps de début Go/No-Go
let tempsDebutGonogo = 0;

function evaluerReponseGonogo() {
  enAttenteGonogo        = false;
  symboleAffiche.textContent = ""; // On cache le symbole

  if (estGoActuel && aReponduGonogo) {
    // Go + appuyé = correct !
    bonnesRepGonogo++;
    const tr = Date.now() - tempsDebutGonogo;
    tempsRepGonogo.push(tr);
    feedbackGonogo.textContent = "✅ Correct !";
    feedbackGonogo.style.color = "#2ecc71";
  } else if (estGoActuel && !aReponduGonogo) {
    // Go + pas appuyé = omission
    omissionsGonogo++;
    feedbackGonogo.textContent = "⚠️ Missed !";
    feedbackGonogo.style.color = "#f39c12";
  } else if (!estGoActuel && aReponduGonogo) {
    // No-Go + appuyé = erreur d'impulsivité !
    fauxPosiGonogo++;
    feedbackGonogo.textContent = "🛑 Impulsive !";
    feedbackGonogo.style.color = "#e74c3c";
  } else {
    // No-Go + pas appuyé = bonne inhibition (on ne dit rien)
    feedbackGonogo.textContent = "👍 Good inhibition !";
    feedbackGonogo.style.color = "#3498db";
  }

  resultatsGonogo.push({
    essai: essaiGonogo + 1,
    type: estGoActuel ? "Go" : "No-Go",
    aRepondu: aReponduGonogo
  });

  essaiGonogo++;
  timerGonogo = setTimeout(nouvelEssaiGonogo, DUREE_PAUSE_GONOGO);
}

function afficherResultatsGonogo() {
  ecranJeuGonogo.classList.add("cache");
  ecranResultatsGonogo.classList.remove("cache");

  // Nombre total de Go dans la session
  const totalGo      = resultatsGonogo.filter(r => r.type === "Go").length;
  const totalNogo    = resultatsGonogo.filter(r => r.type === "No-Go").length;

  // Précision sur les Go
  const precisionGo  = totalGo > 0
    ? Math.round((bonnesRepGonogo / totalGo) * 100)
    : 0;

  // Temps de réaction moyen sur les Go corrects
  const tempsMoyenGo = tempsRepGonogo.length > 0
    ? Math.round(tempsRepGonogo.reduce((a, b) => a + b, 0) / tempsRepGonogo.length)
    : 0;

  // Taux d'erreurs d'impulsivité
  const tauxImpulsi  = totalNogo > 0
    ? Math.round((fauxPosiGonogo / totalNogo) * 100)
    : 0;

  let diagnostic  = "";
  let couleurDiag = "";

  if (tauxImpulsi <= 10 && precisionGo >= 80) {
    diagnostic  = "🟢 Excellent inhibition ! You control your impulses well.";
    couleurDiag = "#2ecc71";
  } else if (tauxImpulsi <= 25) {
    diagnostic  = "🟡 Correct inhibition. Some impulsive errors, but well controlled.";
    couleurDiag = "#f39c12";
  } else {
    diagnostic  = "🔴 Difficult inhibition. Many impulsive errors — that's what we're measuring !";
    couleurDiag = "#e74c3c";
  }

  document.getElementById("score-final-gonogo").textContent = `🎯 Go Precision : ${precisionGo}% | ⏱️ Average time : ${tempsMoyenGo} ms`;
  document.getElementById("details-gonogo").textContent     = `🛑 Impulses errors : ${fauxPosiGonogo}/${totalNogo} | ⚠️ Omissions : ${omissionsGonogo}/${totalGo}`;
  document.getElementById("diagnostic-gonogo").textContent  = diagnostic;
  document.getElementById("diagnostic-gonogo").style.color  = couleurDiag;
}

function demarrerGonogo() {
  essaiGonogo     = 0;
  bonnesRepGonogo = 0;
  fauxPosiGonogo  = 0;
  omissionsGonogo = 0;
  tempsRepGonogo  = [];
  resultatsGonogo = [];

  ecranAccueilGonogo.classList.add("cache");
  ecranResultatsGonogo.classList.add("cache");
  ecranJeuGonogo.classList.remove("cache");

  timerGonogo = setTimeout(nouvelEssaiGonogo, 1000);
}

document.getElementById("bouton-start-gonogo").addEventListener("click", demarrerGonogo);
document.getElementById("bouton-restart-gonogo").addEventListener("click", demarrerGonogo);

// ============================================
// ⌨️ GESTION DU CLAVIER (tous les jeux)
// ============================================

document.addEventListener("keydown", function(event) {
  const touche = event.key.toLowerCase();

  // Stroop : touches R, B, V
  if (touche === "r" || touche === "b" || touche === "v") {
    traiterReponseStroop(touche);
  }

  // N-Back : touche Espace
  if (event.code === "Space" && enAttenteNback && !aRepondu) {
    event.preventDefault();
    aRepondu = true;
    clearTimeout(timerNback);
    feedbackNback.textContent = "👆 Press !";
    feedbackNback.style.color = "#3498db";
    const estCible = (lettreActuelle === lettrePrecedente) && essaiNback > 0;
    evaluerReponseNback(estCible);
  }

  // Go/No-Go : touche Espace
  if (event.code === "Space" && enAttenteGonogo && !aReponduGonogo) {
    event.preventDefault();
    aReponduGonogo = true;
    clearTimeout(timerGonogo);

    // Si c'est un Go et qu'on appuie : on évalue immédiatement
    // Si c'est un No-Go et qu'on appuie : on évalue immédiatement aussi
    evaluerReponseGonogo();
  }
});