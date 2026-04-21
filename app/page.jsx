"use client";

import React, { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import {
  User,
  Activity,
  History,
  Trophy,
  HeartPulse,
  Upload,
  Send,
  Settings,
  CheckCircle2,
  AlertCircle,
  Dumbbell,
  Target,
  Sparkles,
  Brain,
  Zap,
  TrendingUp,
  Shield,
  Lock,
  Link2,
  Eye,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";

const APP_NAME = "Padelscan Pro";
const APP_VERSION = "V3 private demo";
const DEMO_ACCESS_TOKEN = "padelscan-pro-private-2026";
const ACCESS_STORAGE_KEY = "padelscan_pro_demo_access";

const WEBHOOK_URL_DEFAULT =
  "https://script.google.com/macros/s/AKfycbyIpYLnkm4Z5HqLEcaCwpit0HdDo7FKsOO6Hf8f2zNmUt_HuTtTCr8nrjtUzqgrF4_o/exec";
const WEBHOOK_SECRET_DEFAULT = "padelcoach_2026_x9KpA71mZqL_secure";

const initialProfile = {
  idJoueur: "J_001",
  pseudo: "CoachPadel",
  prenom: "Alex",
  nom: "Martin",
  email: "alex@example.com",
  dateNaissance: "1992-03-12",
  taille: "178",
  poids: "72",
  bras: "73",
  niveau: "4",
  main: "Droitier",
  positionTerrain: "Côté Droit",
  montreModele: "Apple Watch Ultra",
  dateInscription: "2026-04-19",
};

const mockImports = [
  {
    source: "Apple Health / Watch",
    date: "2026-04-19",
    heureDebut: "18:00",
    heureFin: "19:15",
    duree: 75,
    calories: 612,
    fcMoy: 138,
    fcMax: 171,
    distance: 4.1,
  },
  {
    source: "Health Connect / Wear OS",
    date: "2026-04-16",
    heureDebut: "20:05",
    heureFin: "21:00",
    duree: 55,
    calories: 455,
    fcMoy: 131,
    fcMax: 164,
    distance: 3.4,
  },
  {
    source: "Apple Health / Watch",
    date: "2026-04-12",
    heureDebut: "10:15",
    heureFin: "11:35",
    duree: 80,
    calories: 648,
    fcMoy: 142,
    fcMax: 176,
    distance: 4.5,
  },
];

const initialSessions = [
  {
    id: "S_20260419_001",
    joueurId: "J_001",
    date: "2026-04-19",
    heureDebut: "18:00",
    heureFin: "19:15",
    duree: 75,
    club: "Padel Center Paris",
    typeTerrain: "Indoor",
    typeSession: "Match",
    partenaire: "Lucas",
    adv1: "Sam",
    adv2: "Nico",
    score: "6/4 3/6 10/7",
    resultat: "Victoire",
    fatigueAvant: 3,
    fatigueApres: 7,
    notes:
      "Bonne intensité, service solide, gestion mentale correcte dans le super tie-break.",
    forme: {
      id: "F_20260419_001",
      fcRepos: 58,
      fcMax: 171,
      fcMoy: 138,
      calories: 612,
      stress: 4,
      douleurs: "Non",
      zoneDouleur: "",
    },
    resume: {
      scoreFinal: "6/4 3/6 10/7",
      resultatMatch: "Victoire",
      volumeCoups: 182,
      typeDominant: "Volée de coup droit",
      vitesseMoyRaquette: "78 km/h",
      fautesDirectes: 11,
      fcMoyenne: 138,
      niveauFatigue: 7,
      pointsOrGagnes: 2,
    },
    conseils: {
      priorite: "Moyenne",
      technique:
        "Travaille la première volée après service pour sécuriser la montée.",
      tactique: "Monte plus tôt au filet sur balle courte pour imposer le rythme.",
      physique: "Conserve l’intensité cardio au début du second set.",
      recuperation:
        "Hydratation, retour au calme 10 min et mobilité épaules/ischios.",
      pointFort: "Bon service dans les points importants.",
      pointFaible: "Transitions fond-filet encore hésitantes.",
      objectif: "Mieux convertir les balles d’attaque.",
    },
  },
  {
    id: "S_20260416_002",
    joueurId: "J_001",
    date: "2026-04-16",
    heureDebut: "20:05",
    heureFin: "21:00",
    duree: 55,
    club: "Urban Padel",
    typeTerrain: "Indoor",
    typeSession: "Entraînement",
    partenaire: "Thomas",
    adv1: "",
    adv2: "",
    score: "",
    resultat: "Victoire",
    fatigueAvant: 2,
    fatigueApres: 5,
    notes: "Séance de rythme et volées. Bonne qualité technique globale.",
    forme: {
      id: "F_20260416_002",
      fcRepos: 56,
      fcMax: 164,
      fcMoy: 131,
      calories: 455,
      stress: 3,
      douleurs: "Non",
      zoneDouleur: "",
    },
    resume: {
      scoreFinal: "",
      resultatMatch: "Victoire",
      volumeCoups: 145,
      typeDominant: "Bandeja",
      vitesseMoyRaquette: "74 km/h",
      fautesDirectes: 7,
      fcMoyenne: 131,
      niveauFatigue: 5,
      pointsOrGagnes: 0,
    },
    conseils: {
      priorite: "Faible",
      technique: "Bonne stabilité sur bandeja, garde le même relâchement sur vibora.",
      tactique: "Travaille la variation de profondeur après la vitre.",
      physique: "RAS, charge bien tolérée.",
      recuperation: "Routine légère, sommeil normal.",
      pointFort: "Qualité de balle au filet.",
      pointFaible: "Lobs défensifs parfois trop courts.",
      objectif: "Allonger les trajectoires défensives.",
    },
  },
  {
    id: "S_20260412_003",
    joueurId: "J_001",
    date: "2026-04-12",
    heureDebut: "10:15",
    heureFin: "11:35",
    duree: 80,
    club: "Casa Padel",
    typeTerrain: "Outdoor",
    typeSession: "Match",
    partenaire: "Lucas",
    adv1: "Yann",
    adv2: "Mehdi",
    score: "4/6 6/3 10/8",
    resultat: "Victoire",
    fatigueAvant: 4,
    fatigueApres: 8,
    notes: "Match engagé, très bonne réaction après un premier set subi.",
    forme: {
      id: "F_20260412_003",
      fcRepos: 59,
      fcMax: 176,
      fcMoy: 142,
      calories: 648,
      stress: 5,
      douleurs: "Oui",
      zoneDouleur: "Épaule droite légère",
    },
    resume: {
      scoreFinal: "4/6 6/3 10/8",
      resultatMatch: "Victoire",
      volumeCoups: 214,
      typeDominant: "Retour croisé",
      vitesseMoyRaquette: "81 km/h",
      fautesDirectes: 15,
      fcMoyenne: 142,
      niveauFatigue: 8,
      pointsOrGagnes: 4,
    },
    conseils: {
      priorite: "Haute",
      technique: "Travaille le relâchement sur les frappes hautes en fin de match.",
      tactique:
        "Très bonne lecture croisée, continue à fixer puis accélérer long de ligne.",
      physique: "Surveille la fatigue de l’épaule quand la charge dépasse 75 min.",
      recuperation: "Glace locale, mobilité douce et nuit de récupération complète.",
      pointFort: "Réaction mentale après la perte du premier set.",
      pointFaible: "Fautes directes sous fatigue.",
      objectif: "Mieux tenir la qualité technique au-delà de 70 min.",
    },
  },
];

function formatDateDisplay(value) {
  if (!value) return "-";
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return value;
  const [, y, m, d] = match;
  return `${d}/${m}/${y}`;
}

function buildIds(date) {
  const clean = (date || new Date().toISOString().slice(0, 10)).replace(/-/g, "");
  const rand = Math.floor(Math.random() * 900 + 100);
  return {
    sessionId: `S_${clean}_${rand}`,
    formeId: `F_${clean}_${rand}`,
    scoreId: `SC_${clean}_${rand}`,
    conseilId: `CONS_${clean}_${rand}`,
  };
}

function computeStats(sessions) {
  const total = sessions.length;
  const victoires = sessions.filter((s) => s.resultat === "Victoire").length;
  const dureeMoy = total
    ? Math.round(sessions.reduce((a, s) => a + Number(s.duree || 0), 0) / total)
    : 0;
  const fcMoy = total
    ? Math.round(
        sessions.reduce((a, s) => a + Number(s.forme?.fcMoy || 0), 0) / total
      )
    : 0;
  const fatigueMoy = total
    ? Math.round(
        sessions.reduce((a, s) => a + Number(s.fatigueApres || 0), 0) / total
      )
    : 0;

  return {
    total,
    victoires,
    tauxVictoire: total ? Math.round((victoires / total) * 100) : 0,
    dureeMoy,
    fcMoy,
    fatigueMoy,
  };
}

function buildPayload(profile, session, webhookSecret) {
  const ids = buildIds(session.date);

  return {
    secret: webhookSecret,
    JOUEURS: [
      {
        ID_Joueur: profile.idJoueur,
        Pseudo: profile.pseudo,
        Prénom: profile.prenom,
        Nom: profile.nom,
        Email: profile.email,
        DATE_Naissance: profile.dateNaissance,
        Taille_cm: profile.taille,
        Poids_kg: profile.poids,
        Longueur_Bras_cm: profile.bras,
        Niveau: profile.niveau,
        Main: profile.main,
        Position_Terrain: profile.positionTerrain,
        Montre_Modele: profile.montreModele,
        Date_Inscription: profile.dateInscription,
      },
    ],
    SESSIONS: [
      {
        ID_Session: session.id || ids.sessionId,
        ID_Joueur: profile.idJoueur,
        Date_Session: formatDateDisplay(session.date),
        Heure_Debut: session.heureDebut,
        Heure_Fin: session.heureFin,
        Duree_Minutes: Number(session.duree || 0),
        Nom_Club: session.club,
        Type_Terrain: session.typeTerrain,
        Type_Session: session.typeSession,
        Partenaire_Pseudo: session.partenaire,
        Adversaire1_Pseudo: session.adv1,
        Adversaire2_Pseudo: session.adv2,
        Score: session.score,
        Resultat: session.resultat,
        Fatigue_Avant: Number(session.fatigueAvant || 0),
        Fatigue_Apres: Number(session.fatigueApres || 0),
        Notes: session.notes,
      },
    ],
    FORME: [
      {
        ID_Forme: session.forme?.id || ids.formeId,
        ID_Session: session.id || ids.sessionId,
        ID_Joueur: profile.idJoueur,
        Date: formatDateDisplay(session.date),
        Heure_Mesure: session.heureFin,
        FC_Repos: Number(session.forme?.fcRepos || 0),
        FC_Max_Session: Number(session.forme?.fcMax || 0),
        FC_Moyenne_Session: Number(session.forme?.fcMoy || 0),
        HRV: "",
        Calories_Depensees: Number(session.forme?.calories || 0),
        Hydratation_ml: "",
        Qualite_Sommeil_0_100: "",
        Heures_Sommeil: "",
        Douleurs: session.forme?.douleurs || "Non",
        Zone_Douleur: session.forme?.zoneDouleur || "",
        Niveau_Stress: Number(session.forme?.stress || 0),
      },
    ],
    SCORES: [
      {
        ID_Score: ids.scoreId,
        ID_Session: session.id || ids.sessionId,
        ID_Joueur: profile.idJoueur,
        Date_Match: formatDateDisplay(session.date),
        Type_Match: session.typeSession || "Match",
        Format_Score: "Libre",
        Golden_Point_Actif: "Oui",
        Set1_A: "",
        Set1_B: "",
        Set2_A: "",
        Set2_B: "",
        "Tie Break Final": "",
        Equipe_Gagnante: session.resultat === "Victoire" ? "Equipe A" : "Equipe B",
        Duree_Match: Number(session.duree || 0),
        Joueur_A: profile.pseudo,
        Joueur_B: session.partenaire || "",
        Joueur_C: session.adv1 || "",
        Joueur_D: session.adv2 || "",
      },
    ],
    CONSEILS: [
      {
        ID_Conseil: ids.conseilId,
        ID_Session: session.id || ids.sessionId,
        ID_Joueur: profile.idJoueur,
        Date_Conseil: formatDateDisplay(session.date),
        Type_Conseil: "Mixte",
        Priorite: session.conseils?.priorite || "Moyenne",
        Conseil_Technique: session.conseils?.technique || "",
        Conseil_Physique: session.conseils?.physique || "",
        Conseil_Tactique: session.conseils?.tactique || "",
        Conseil_Recuperation: session.conseils?.recuperation || "",
        Point_Fort_Session: session.conseils?.pointFort || "",
        Point_Faible_Session: session.conseils?.pointFaible || "",
        Objectif_Prochaine_Session: session.conseils?.objectif || "",
        Score_Performance: Math.max(1, 100 - Number(session.fatigueApres || 0) * 5),
        Lu_Par_Joueur: "Non",
        Applique_Par_Joueur: "Pas encore testé",
      },
    ],
    RESUME_STATS: [
      {
        ID_Session: session.id || ids.sessionId,
        ID_Joueur: profile.idJoueur,
        Score_Final: session.score || "",
        Resultat_Match: session.resultat || "",
        Volume_Coups: Number(session.resume?.volumeCoups || 0),
        Type_Coup_Dominant: session.resume?.typeDominant || "",
        Top1_Coup_Type: session.resume?.typeDominant || "",
        "Top1_Qualite_%": "",
        Top2_Coup_Type: "",
        "Top2_Qualite_%": "",
        Top3_Coup_Type: "",
        "Top3_Qualite_%": "",
        Vitesse_Moy_Raquette: session.resume?.vitesseMoyRaquette || "",
        Zone_Occupation_Fav: profile.positionTerrain,
        Efficacite_Service: session.resultat === "Victoire" ? "Bonne" : "Moyenne",
        Fautes_Directes: Number(session.resume?.fautesDirectes || 0),
        FC_Moyenne: Number(session.forme?.fcMoy || 0),
        Niveau_Fatigue: Number(session.fatigueApres || 0),
        Points_Or_Gagnes: Number(session.resume?.pointsOrGagnes || 0),
        PROMPT_POUR_GEMINI: `Analyse ma session de padel. Score : ${
          session.score || "non renseigné"
        }. FC moyenne : ${session.forme?.fcMoy || "n/a"}.`,
      },
    ],
  };
}

function validateDraft(draft) {
  if (!draft.date) return "La date est requise.";
  if (!draft.heureDebut || !draft.heureFin) return "Les heures sont requises.";
  if (!draft.duree || Number(draft.duree) <= 0) {
    return "La durée doit être supérieure à 0.";
  }
  if (!draft.club) return "Le club est requis.";
  return null;
}

function draftToSession(draft, profile) {
  const ids = buildIds(draft.date);

  return {
    id: draft.id || ids.sessionId,
    joueurId: profile.idJoueur,
    date: draft.date,
    heureDebut: draft.heureDebut,
    heureFin: draft.heureFin,
    duree: Number(draft.duree || 0),
    club: draft.club,
    typeTerrain: draft.typeTerrain,
    typeSession: draft.typeSession,
    partenaire: draft.partenaire,
    adv1: draft.adv1,
    adv2: draft.adv2,
    score: draft.score,
    resultat: draft.resultat,
    fatigueAvant: Number(draft.fatigueAvant || 0),
    fatigueApres: Number(draft.fatigueApres || 0),
    notes: draft.notes,
    forme: {
      id: draft.forme.id || ids.formeId,
      fcRepos: Number(draft.forme.fcRepos || 0),
      fcMax: Number(draft.forme.fcMax || 0),
      fcMoy: Number(draft.forme.fcMoy || 0),
      calories: Number(draft.forme.calories || 0),
      stress: Number(draft.forme.stress || 0),
      douleurs: draft.forme.douleurs,
      zoneDouleur: draft.forme.zoneDouleur,
    },
    resume: {
      scoreFinal: draft.score,
      resultatMatch: draft.resultat,
      volumeCoups: Number(draft.resume.volumeCoups || 0),
      typeDominant: draft.resume.typeDominant,
      vitesseMoyRaquette: draft.resume.vitesseMoyRaquette,
      fautesDirectes: Number(draft.resume.fautesDirectes || 0),
      fcMoyenne: Number(draft.forme.fcMoy || 0),
      niveauFatigue: Number(draft.fatigueApres || 0),
      pointsOrGagnes: Number(draft.resume.pointsOrGagnes || 0),
    },
    conseils: { ...draft.conseils },
  };
}

function computeAiSummary(session) {
  if (!session) {
    return {
      performance: 0,
      style: "-",
      fatigueRisk: "-",
      priority: "-",
      insight: "-",
    };
  }

  const performanceBase =
    72 +
    (session.resultat === "Victoire" ? 10 : 0) +
    Math.max(0, 8 - Number(session.resume?.fautesDirectes || 0));

  const performance = Math.min(96, Math.max(58, performanceBase));

  let fatigueRisk = "Faible";
  if (Number(session.fatigueApres || 0) >= 8) fatigueRisk = "Élevé";
  else if (Number(session.fatigueApres || 0) >= 6) fatigueRisk = "Modéré";

  const style = session.resume?.typeDominant
    ? `Dominante ${session.resume.typeDominant.toLowerCase()}`
    : "Offensif côté droit";

  const priority =
    session.conseils?.objectif || "Stabiliser la transition défense → attaque";

  const insight =
    session.resultat === "Victoire"
      ? "Bonne gestion des points importants et capacité à accélérer au bon moment."
      : "Base solide, mais efficacité insuffisante dans les points clés.";

  return {
    performance,
    style,
    fatigueRisk,
    priority,
    insight,
  };
}

const fakeAiSuggestions = [
  {
    technique:
      "Travaille la première volée après service avec une cible croisée pour sécuriser la montée.",
    tactique:
      "Dès que la balle adverse flotte, prends le filet plus tôt pour verrouiller l’échange.",
    physique:
      "Surveille la baisse d’intensité à partir de 45 minutes et garde un premier appui plus explosif.",
    recuperation:
      "Hydratation + 10 min de retour au calme + mobilité épaule/hanche en post-séance.",
    pointFort: "Bonne qualité de balle dans les phases offensives.",
    pointFaible: "Transitions défensives encore trop passives.",
    objectif: "Gagner le filet un coup plus tôt sur les échanges neutres.",
    priorite: "Haute",
  },
  {
    technique:
      "Rends ta bandeja plus profonde pour empêcher la relance agressive au centre.",
    tactique:
      "Fixe davantage en diagonale avant d’ouvrir long de ligne sur balle courte.",
    physique:
      "Améliore le replacement après smash pour conserver la pression sur le point suivant.",
    recuperation:
      "Routine de récupération courte : respiration, marche active, hydratation, étirements doux.",
    pointFort: "Lecture du jeu et choix de zone pertinents.",
    pointFaible: "Qualité technique qui baisse sous fatigue.",
    objectif: "Réduire les fautes directes en fin de set.",
    priorite: "Moyenne",
  },
  {
    technique:
      "Stabilise ton contact de balle sur les volées de transition pour sécuriser la prise du filet.",
    tactique:
      "Cherche plus souvent la zone revers adverse avant d’accélérer long de ligne.",
    physique:
      "Maintiens une intensité stable sur les changements d’appui du second set.",
    recuperation:
      "Hydratation, respiration basse et mobilité hanche/épaule pendant 8 minutes.",
    pointFort: "Capacité à reprendre l’initiative dans les points serrés.",
    pointFaible: "Qualité de replacement après frappe haute.",
    objectif: "Améliorer la transition attaque → couverture du lob.",
    priorite: "Haute",
  },
];

function getShareLink() {
  if (typeof window === "undefined") return "";
  const url = new URL(window.location.href);
  url.searchParams.set("k", DEMO_ACCESS_TOKEN);
  return url.toString();
}

function hasAccessFromStorage() {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(ACCESS_STORAGE_KEY) === DEMO_ACCESS_TOKEN;
}

function readTokenFromUrl() {
  if (typeof window === "undefined") return "";
  const url = new URL(window.location.href);
  return url.searchParams.get("k") || "";
}

function grantAccess() {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(ACCESS_STORAGE_KEY, DEMO_ACCESS_TOKEN);
}

export default function PadelscanProV3App() {
  const [profile, setProfile] = useState(initialProfile);
  const [sessions, setSessions] = useState(initialSessions);
  const [selectedImport, setSelectedImport] = useState(mockImports[0]);
  const [draft, setDraft] = useState({
    id: "",
    date: selectedImport.date,
    heureDebut: selectedImport.heureDebut,
    heureFin: selectedImport.heureFin,
    duree: String(selectedImport.duree),
    club: "Padel Center Paris",
    typeTerrain: "Indoor",
    typeSession: "Match",
    partenaire: "Lucas",
    adv1: "Sam",
    adv2: "Nico",
    score: "4/6 6/3 10/8",
    resultat: "Victoire",
    fatigueAvant: "3",
    fatigueApres: "7",
    notes: "Match intense avec bonne remontée mentale.",
    forme: {
      id: "",
      fcRepos: "58",
      fcMax: String(selectedImport.fcMax),
      fcMoy: String(selectedImport.fcMoy),
      calories: String(selectedImport.calories),
      stress: "4",
      douleurs: "Non",
      zoneDouleur: "",
    },
    resume: {
      volumeCoups: "176",
      typeDominant: "Volée de coup droit",
      vitesseMoyRaquette: "79 km/h",
      fautesDirectes: "10",
      pointsOrGagnes: "3",
    },
    conseils: {
      priorite: "Moyenne",
      technique: "",
      tactique: "",
      physique: "",
      recuperation: "",
      pointFort: "",
      pointFaible: "",
      objectif: "",
    },
  });

  const [activeId, setActiveId] = useState(initialSessions[0]?.id || "");
  const [webhookUrl, setWebhookUrl] = useState(WEBHOOK_URL_DEFAULT);
  const [webhookSecret, setWebhookSecret] = useState(WEBHOOK_SECRET_DEFAULT);
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState({ type: "idle", message: "Prêt" });
  const [generatingAi, setGeneratingAi] = useState(false);
  const [shareLink, setShareLink] = useState("");
  const [copied, setCopied] = useState(false);
  const [hasAccess, setHasAccess] = useState(false);
  const [accessInput, setAccessInput] = useState("");
  const [accessReady, setAccessReady] = useState(false);

  const stats = useMemo(() => computeStats(sessions), [sessions]);
  const activeSession = sessions.find((s) => s.id === activeId) || sessions[0];
  const aiSummary = useMemo(() => computeAiSummary(activeSession), [activeSession]);

  useEffect(() => {
    const urlToken = readTokenFromUrl();
    const stored = hasAccessFromStorage();

    if (urlToken === DEMO_ACCESS_TOKEN) {
      grantAccess();
      setHasAccess(true);
    } else if (stored) {
      setHasAccess(true);
    }

    setShareLink(getShareLink());
    setAccessReady(true);
  }, []);

  const onProfileChange = (key, value) => setProfile((p) => ({ ...p, [key]: value }));

  const useImport = (item) => {
    setSelectedImport(item);
    setDraft((d) => ({
      ...d,
      date: item.date,
      heureDebut: item.heureDebut,
      heureFin: item.heureFin,
      duree: String(item.duree),
      forme: {
        ...d.forme,
        fcMax: String(item.fcMax),
        fcMoy: String(item.fcMoy),
        calories: String(item.calories),
      },
    }));
    setStatus({ type: "success", message: `Session importée depuis ${item.source}` });
  };

  const unlockWithCode = () => {
    if (accessInput.trim() === DEMO_ACCESS_TOKEN) {
      grantAccess();
      setHasAccess(true);
      setStatus({ type: "success", message: "Accès privé autorisé." });
      return;
    }
    setStatus({ type: "error", message: "Lien ou code d’accès invalide." });
  };

  const copyShareLink = async () => {
    try {
      await navigator.clipboard.writeText(shareLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setStatus({ type: "error", message: "Impossible de copier le lien." });
    }
  };

  const generateAiAdvice = async () => {
    setGeneratingAi(true);
    setStatus({ type: "idle", message: "Analyse IA en cours..." });

    await new Promise((resolve) => setTimeout(resolve, 1600));

    const suggestion =
      fakeAiSuggestions[Math.floor(Math.random() * fakeAiSuggestions.length)];

    setDraft((prev) => ({
      ...prev,
      conseils: {
        ...prev.conseils,
        ...suggestion,
      },
    }));

    setGeneratingAi(false);
    setStatus({
      type: "success",
      message:
        "Analyse IA terminée : axes de progression et recommandations générés.",
    });
  };

  const saveDraftAsSession = () => {
    const error = validateDraft(draft);
    if (error) {
      setStatus({ type: "error", message: error });
      return;
    }

    const session = draftToSession(draft, profile);

    setSessions((prev) => {
      const existing = prev.findIndex((s) => s.id === session.id);
      if (existing >= 0) {
        const next = [...prev];
        next[existing] = session;
        return next;
      }
      return [session, ...prev];
    });

    setActiveId(session.id);
    setStatus({ type: "success", message: "Session enregistrée localement." });
  };

  const sendSessionToWebhook = async () => {
    const error = validateDraft(draft);
    if (error) {
      setStatus({ type: "error", message: error });
      return;
    }

    setSending(true);
    setStatus({ type: "idle", message: "Envoi en cours..." });

    try {
      const sessionToSend = draftToSession(draft, profile);
      const payload = buildPayload(profile, sessionToSend, webhookSecret);

      const res = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const text = await res.text();
      let parsed;

      try {
        parsed = JSON.parse(text);
      } catch {
        parsed = { success: res.ok, raw: text };
      }

      if (!res.ok || parsed?.success === false) {
        throw new Error(parsed?.error || parsed?.message || `HTTP ${res.status}`);
      }

      setStatus({
        type: "success",
        message: parsed?.message || "Données envoyées avec succès.",
      });
    } catch (error) {
      setStatus({ type: "error", message: String(error?.message || error) });
    } finally {
      setSending(false);
    }
  };

  const statCards = [
    { title: "Sessions", value: stats.total, icon: History },
    { title: "Taux de victoire", value: `${stats.tauxVictoire}%`, icon: Trophy },
    { title: "FC moyenne", value: stats.fcMoy || "-", icon: HeartPulse },
    { title: "Fatigue moyenne", value: `${stats.fatigueMoy}/10`, icon: Activity },
  ];

  if (!accessReady) {
    return <div className="min-h-screen bg-background" />;
  }

  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-background p-4 md:p-8">
        <div className="mx-auto max-w-3xl space-y-6">
          <Card className="rounded-3xl shadow-sm">
            <CardContent className="p-8 md:p-10">
              <div className="flex items-start gap-4">
                <div className="rounded-2xl border p-3">
                  <Lock className="h-6 w-6" />
                </div>
                <div className="space-y-3">
                  <Badge variant="secondary">Accès privé</Badge>
                  <h1 className="text-3xl font-semibold tracking-tight">{APP_NAME}</h1>
                  <p className="text-sm text-muted-foreground">
                    Démo privée à accès limité. Ouvre l’application avec le lien privé complet
                    ou saisis le code d’accès ci-dessous.
                  </p>
                </div>
              </div>

              <div className="mt-8 grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border p-4">
                  <p className="text-sm font-medium">Version</p>
                  <p className="mt-2 text-sm text-muted-foreground">{APP_VERSION}</p>
                </div>
                <div className="rounded-2xl border p-4">
                  <p className="text-sm font-medium">Accès</p>
                  <p className="mt-2 text-sm text-muted-foreground">Lien privé ou code temporaire</p>
                </div>
              </div>

              <div className="mt-8 space-y-3">
                <Label>Code d’accès</Label>
                <Input
                  value={accessInput}
                  onChange={(e) => setAccessInput(e.target.value)}
                  placeholder="Colle ici le code ou le token privé"
                />
                <Button className="rounded-2xl" onClick={unlockWithCode}>
                  Déverrouiller la démo
                </Button>
              </div>

              <div className="mt-8 rounded-2xl border p-4">
                <div className="flex items-center gap-2">
                  {status.type === "error" ? (
                    <AlertCircle className="h-5 w-5" />
                  ) : (
                    <Shield className="h-5 w-5" />
                  )}
                  <p className="font-medium">Accès restreint</p>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  Pour partager la démo, utilise uniquement le lien privé contenant le paramètre <code>k</code>.
                </p>
                {status.message !== "Prêt" && (
                  <p className="mt-3 text-sm text-muted-foreground">{status.message}</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-4 rounded-3xl border bg-card p-6 shadow-sm md:flex-row md:items-center md:justify-between"
        >
          <div>
            <div className="flex items-center gap-3">
              <div className="rounded-2xl border p-3">
                <Dumbbell className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-3xl font-semibold tracking-tight">{APP_NAME}</h1>
                <p className="text-sm text-muted-foreground">
                  Plateforme premium de suivi padel avec import montre, analyse IA et synchronisation Google Sheets.
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary">{APP_VERSION}</Badge>
            <Badge variant="secondary">Accès limité</Badge>
            <Badge variant="secondary">Analyse IA</Badge>
            <Badge variant="secondary">Google Sheets sync</Badge>
          </div>
        </motion.div>

        <Card className="rounded-3xl shadow-sm">
          <CardContent className="flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-medium">Lien privé de démonstration</p>
              <p className="mt-1 break-all text-sm text-muted-foreground">{shareLink}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button className="rounded-2xl" variant="secondary" onClick={copyShareLink}>
                <Link2 className="mr-2 h-4 w-4" />
                {copied ? "Lien copié" : "Copier le lien privé"}
              </Button>
              <Badge variant="secondary" className="px-3 py-1">
                <Eye className="mr-2 h-3.5 w-3.5" />
                Partage restreint
              </Badge>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {statCards.map((card) => {
            const Icon = card.icon;
            return (
              <Card key={card.title} className="rounded-3xl shadow-sm">
                <CardContent className="flex items-center justify-between p-6">
                  <div>
                    <p className="text-sm text-muted-foreground">{card.title}</p>
                    <p className="mt-2 text-3xl font-semibold">{card.value}</p>
                  </div>
                  <div className="rounded-2xl border p-3">
                    <Icon className="h-5 w-5" />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Tabs defaultValue="dashboard" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3 rounded-2xl md:grid-cols-6">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="profil">Profil</TabsTrigger>
            <TabsTrigger value="import">Importer</TabsTrigger>
            <TabsTrigger value="session">Compléter</TabsTrigger>
            <TabsTrigger value="historique">Historique</TabsTrigger>
            <TabsTrigger value="admin">Admin</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-4">
            <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
              <Card className="rounded-3xl shadow-sm">
                <CardHeader>
                  <CardTitle>Dernière session</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {activeSession ? (
                    <>
                      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                        <Metric label="Date" value={formatDateDisplay(activeSession.date)} />
                        <Metric label="Durée" value={`${activeSession.duree} min`} />
                        <Metric label="Score" value={activeSession.score || "Non saisi"} />
                        <Metric label="Résultat" value={activeSession.resultat || "-"} />
                      </div>
                      <Separator />
                      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                        <Metric label="FC moyenne" value={activeSession.forme?.fcMoy || "-"} />
                        <Metric label="FC max" value={activeSession.forme?.fcMax || "-"} />
                        <Metric label="Calories" value={activeSession.forme?.calories || "-"} />
                        <Metric
                          label="Fatigue après"
                          value={`${activeSession.fatigueApres}/10`}
                        />
                      </div>
                      <div className="rounded-2xl border p-4">
                        <p className="text-sm font-medium">Conseil principal</p>
                        <p className="mt-2 text-sm text-muted-foreground">
                          {activeSession.conseils?.tactique ||
                            activeSession.conseils?.technique ||
                            "Aucun conseil généré."}
                        </p>
                      </div>
                    </>
                  ) : (
                    <p className="text-sm text-muted-foreground">Aucune session disponible.</p>
                  )}
                </CardContent>
              </Card>

              <Card className="rounded-3xl border shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5" />
                    Analyse IA
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <MetricCard title="Indice performance" value={`${aiSummary.performance}/100`} />
                    <MetricCard title="Risque fatigue" value={aiSummary.fatigueRisk} />
                    <MetricCard title="Style dominant" value={aiSummary.style} />
                    <MetricCard title="Priorité" value={activeSession?.conseils?.priorite || "-"} />
                  </div>
                  <div className="rounded-2xl border p-4">
                    <p className="text-sm font-medium">Synthèse intelligente</p>
                    <p className="mt-2 text-sm text-muted-foreground">{aiSummary.insight}</p>
                  </div>
                  <div className="rounded-2xl border p-4">
                    <p className="text-sm font-medium">Recommandation prioritaire</p>
                    <p className="mt-2 text-sm text-muted-foreground">{aiSummary.priority}</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="rounded-3xl shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Tendance des 3 dernières sessions
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-3">
                {sessions.slice(0, 3).map((session) => (
                  <div key={session.id} className="rounded-2xl border p-4">
                    <p className="text-sm text-muted-foreground">
                      {formatDateDisplay(session.date)}
                    </p>
                    <p className="mt-2 text-lg font-semibold">{session.typeSession}</p>
                    <div className="mt-3 space-y-2 text-sm text-muted-foreground">
                      <p>FC moyenne : {session.forme?.fcMoy}</p>
                      <p>Fatigue : {session.fatigueApres}/10</p>
                      <p>Volume : {session.resume?.volumeCoups || 0} coups</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profil" className="space-y-4">
            <Card className="rounded-3xl shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" /> Profil joueur
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <Field label="ID Joueur">
                  <Input
                    value={profile.idJoueur}
                    onChange={(e) => onProfileChange("idJoueur", e.target.value)}
                  />
                </Field>
                <Field label="Pseudo">
                  <Input
                    value={profile.pseudo}
                    onChange={(e) => onProfileChange("pseudo", e.target.value)}
                  />
                </Field>
                <Field label="Prénom">
                  <Input
                    value={profile.prenom}
                    onChange={(e) => onProfileChange("prenom", e.target.value)}
                  />
                </Field>
                <Field label="Nom">
                  <Input
                    value={profile.nom}
                    onChange={(e) => onProfileChange("nom", e.target.value)}
                  />
                </Field>
                <Field label="Email">
                  <Input
                    value={profile.email}
                    onChange={(e) => onProfileChange("email", e.target.value)}
                  />
                </Field>
                <Field label="Date de naissance">
                  <Input
                    type="date"
                    value={profile.dateNaissance}
                    onChange={(e) => onProfileChange("dateNaissance", e.target.value)}
                  />
                </Field>
                <Field label="Taille (cm)">
                  <Input
                    type="number"
                    value={profile.taille}
                    onChange={(e) => onProfileChange("taille", e.target.value)}
                  />
                </Field>
                <Field label="Poids (kg)">
                  <Input
                    type="number"
                    value={profile.poids}
                    onChange={(e) => onProfileChange("poids", e.target.value)}
                  />
                </Field>
                <Field label="Longueur bras (cm)">
                  <Input
                    type="number"
                    value={profile.bras}
                    onChange={(e) => onProfileChange("bras", e.target.value)}
                  />
                </Field>
                <Field label="Niveau">
                  <Input
                    value={profile.niveau}
                    onChange={(e) => onProfileChange("niveau", e.target.value)}
                  />
                </Field>
                <Field label="Main">
                  <Input
                    value={profile.main}
                    onChange={(e) => onProfileChange("main", e.target.value)}
                  />
                </Field>
                <Field label="Position terrain">
                  <Input
                    value={profile.positionTerrain}
                    onChange={(e) => onProfileChange("positionTerrain", e.target.value)}
                  />
                </Field>
                <Field label="Montre">
                  <Input
                    value={profile.montreModele}
                    onChange={(e) => onProfileChange("montreModele", e.target.value)}
                  />
                </Field>
                <Field label="Inscription">
                  <Input
                    type="date"
                    value={profile.dateInscription}
                    onChange={(e) => onProfileChange("dateInscription", e.target.value)}
                  />
                </Field>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="import" className="space-y-4">
            <div className="grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
              <Card className="rounded-3xl shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Upload className="h-5 w-5" /> Sessions détectées
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {mockImports.map((item, idx) => (
                    <button
                      key={`${item.date}-${idx}`}
                      onClick={() => useImport(item)}
                      className={`w-full rounded-2xl border p-4 text-left transition ${
                        selectedImport === item ? "border-foreground" : "hover:bg-muted/50"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="font-medium">{item.source}</p>
                          <p className="text-sm text-muted-foreground">
                            {formatDateDisplay(item.date)} · {item.heureDebut}–{item.heureFin}
                          </p>
                        </div>
                        <Badge variant="secondary">{item.duree} min</Badge>
                      </div>
                      <div className="mt-3 grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                        <span>FC moy: {item.fcMoy}</span>
                        <span>FC max: {item.fcMax}</span>
                        <span>Calories: {item.calories}</span>
                        <span>Distance: {item.distance} km</span>
                      </div>
                    </button>
                  ))}
                </CardContent>
              </Card>

              <Card className="rounded-3xl shadow-sm">
                <CardHeader>
                  <CardTitle>Pré-remplissage de session</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-2">
                  <MetricCard title="Date" value={formatDateDisplay(selectedImport.date)} />
                  <MetricCard title="Durée" value={`${selectedImport.duree} min`} />
                  <MetricCard title="FC moyenne" value={selectedImport.fcMoy} />
                  <MetricCard title="FC max" value={selectedImport.fcMax} />
                  <MetricCard title="Calories" value={selectedImport.calories} />
                  <MetricCard title="Source" value={selectedImport.source} />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="session" className="space-y-4">
            <Card className="rounded-3xl shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" /> Compléter la session
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-wrap gap-3">
                  <Button
                    className="rounded-2xl"
                    variant="secondary"
                    onClick={generateAiAdvice}
                    disabled={generatingAi}
                  >
                    <Sparkles className="mr-2 h-4 w-4" />
                    {generatingAi ? "Analyse en cours..." : "Générer recommandations IA"}
                  </Button>
                  <Badge variant="secondary" className="px-3 py-1">
                    Demo mode privé
                  </Badge>
                </div>

                <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                  <Field label="Date">
                    <Input
                      type="date"
                      value={draft.date}
                      onChange={(e) => setDraft({ ...draft, date: e.target.value })}
                    />
                  </Field>
                  <Field label="Heure début">
                    <Input
                      value={draft.heureDebut}
                      onChange={(e) => setDraft({ ...draft, heureDebut: e.target.value })}
                    />
                  </Field>
                  <Field label="Heure fin">
                    <Input
                      value={draft.heureFin}
                      onChange={(e) => setDraft({ ...draft, heureFin: e.target.value })}
                    />
                  </Field>
                  <Field label="Durée (min)">
                    <Input
                      type="number"
                      value={draft.duree}
                      onChange={(e) => setDraft({ ...draft, duree: e.target.value })}
                    />
                  </Field>
                  <Field label="Club">
                    <Input
                      value={draft.club}
                      onChange={(e) => setDraft({ ...draft, club: e.target.value })}
                    />
                  </Field>
                  <Field label="Type terrain">
                    <Select
                      value={draft.typeTerrain}
                      onValueChange={(value) => setDraft({ ...draft, typeTerrain: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Indoor">Indoor</SelectItem>
                        <SelectItem value="Outdoor">Outdoor</SelectItem>
                        <SelectItem value="Mixte">Mixte</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field label="Type session">
                    <Select
                      value={draft.typeSession}
                      onValueChange={(value) => setDraft({ ...draft, typeSession: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Match">Match</SelectItem>
                        <SelectItem value="Entraînement">Entraînement</SelectItem>
                        <SelectItem value="Coaching">Coaching</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field label="Score">
                    <Input
                      value={draft.score}
                      onChange={(e) => setDraft({ ...draft, score: e.target.value })}
                    />
                  </Field>
                  <Field label="Partenaire">
                    <Input
                      value={draft.partenaire}
                      onChange={(e) => setDraft({ ...draft, partenaire: e.target.value })}
                    />
                  </Field>
                  <Field label="Adversaire 1">
                    <Input
                      value={draft.adv1}
                      onChange={(e) => setDraft({ ...draft, adv1: e.target.value })}
                    />
                  </Field>
                  <Field label="Adversaire 2">
                    <Input
                      value={draft.adv2}
                      onChange={(e) => setDraft({ ...draft, adv2: e.target.value })}
                    />
                  </Field>
                  <Field label="Résultat">
                    <Select
                      value={draft.resultat}
                      onValueChange={(value) => setDraft({ ...draft, resultat: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Victoire">Victoire</SelectItem>
                        <SelectItem value="Défaite">Défaite</SelectItem>
                        <SelectItem value="Nul">Nul</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                </section>

                <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                  <Field label="Fatigue avant">
                    <Input
                      type="number"
                      value={draft.fatigueAvant}
                      onChange={(e) => setDraft({ ...draft, fatigueAvant: e.target.value })}
                    />
                  </Field>
                  <Field label="Fatigue après">
                    <Input
                      type="number"
                      value={draft.fatigueApres}
                      onChange={(e) => setDraft({ ...draft, fatigueApres: e.target.value })}
                    />
                  </Field>
                  <Field label="FC repos">
                    <Input
                      type="number"
                      value={draft.forme.fcRepos}
                      onChange={(e) =>
                        setDraft({
                          ...draft,
                          forme: { ...draft.forme, fcRepos: e.target.value },
                        })
                      }
                    />
                  </Field>
                  <Field label="FC max">
                    <Input
                      type="number"
                      value={draft.forme.fcMax}
                      onChange={(e) =>
                        setDraft({
                          ...draft,
                          forme: { ...draft.forme, fcMax: e.target.value },
                        })
                      }
                    />
                  </Field>
                  <Field label="FC moyenne">
                    <Input
                      type="number"
                      value={draft.forme.fcMoy}
                      onChange={(e) =>
                        setDraft({
                          ...draft,
                          forme: { ...draft.forme, fcMoy: e.target.value },
                        })
                      }
                    />
                  </Field>
                  <Field label="Calories">
                    <Input
                      type="number"
                      value={draft.forme.calories}
                      onChange={(e) =>
                        setDraft({
                          ...draft,
                          forme: { ...draft.forme, calories: e.target.value },
                        })
                      }
                    />
                  </Field>
                  <Field label="Stress">
                    <Input
                      type="number"
                      value={draft.forme.stress}
                      onChange={(e) =>
                        setDraft({
                          ...draft,
                          forme: { ...draft.forme, stress: e.target.value },
                        })
                      }
                    />
                  </Field>
                  <Field label="Douleurs">
                    <Input
                      value={draft.forme.douleurs}
                      onChange={(e) =>
                        setDraft({
                          ...draft,
                          forme: { ...draft.forme, douleurs: e.target.value },
                        })
                      }
                    />
                  </Field>
                </section>

                <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  <Field label="Conseil technique">
                    <Textarea
                      value={draft.conseils.technique}
                      onChange={(e) =>
                        setDraft({
                          ...draft,
                          conseils: { ...draft.conseils, technique: e.target.value },
                        })
                      }
                    />
                  </Field>
                  <Field label="Conseil tactique">
                    <Textarea
                      value={draft.conseils.tactique}
                      onChange={(e) =>
                        setDraft({
                          ...draft,
                          conseils: { ...draft.conseils, tactique: e.target.value },
                        })
                      }
                    />
                  </Field>
                  <Field label="Conseil physique">
                    <Textarea
                      value={draft.conseils.physique}
                      onChange={(e) =>
                        setDraft({
                          ...draft,
                          conseils: { ...draft.conseils, physique: e.target.value },
                        })
                      }
                    />
                  </Field>
                  <Field label="Récupération">
                    <Textarea
                      value={draft.conseils.recuperation}
                      onChange={(e) =>
                        setDraft({
                          ...draft,
                          conseils: { ...draft.conseils, recuperation: e.target.value },
                        })
                      }
                    />
                  </Field>
                  <Field label="Point fort">
                    <Textarea
                      value={draft.conseils.pointFort}
                      onChange={(e) =>
                        setDraft({
                          ...draft,
                          conseils: { ...draft.conseils, pointFort: e.target.value },
                        })
                      }
                    />
                  </Field>
                  <Field label="Point faible">
                    <Textarea
                      value={draft.conseils.pointFaible}
                      onChange={(e) =>
                        setDraft({
                          ...draft,
                          conseils: { ...draft.conseils, pointFaible: e.target.value },
                        })
                      }
                    />
                  </Field>
                </section>

                <Field label="Objectif prochaine session">
                  <Textarea
                    value={draft.conseils.objectif}
                    onChange={(e) =>
                      setDraft({
                        ...draft,
                        conseils: { ...draft.conseils, objectif: e.target.value },
                      })
                    }
                  />
                </Field>

                <Field label="Notes session">
                  <Textarea
                    value={draft.notes}
                    onChange={(e) => setDraft({ ...draft, notes: e.target.value })}
                  />
                </Field>

                <div className="flex flex-wrap gap-3">
                  <Button className="rounded-2xl" onClick={saveDraftAsSession}>
                    Enregistrer la session
                  </Button>
                  <Button
                    className="rounded-2xl"
                    variant="secondary"
                    onClick={sendSessionToWebhook}
                    disabled={sending}
                  >
                    <Send className="mr-2 h-4 w-4" />
                    Envoyer au webhook
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="historique" className="space-y-4">
            <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
              <Card className="rounded-3xl shadow-sm">
                <CardHeader>
                  <CardTitle>Historique</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {sessions.map((session) => (
                    <button
                      key={session.id}
                      onClick={() => setActiveId(session.id)}
                      className={`w-full rounded-2xl border p-4 text-left transition ${
                        activeId === session.id ? "border-foreground" : "hover:bg-muted/50"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="font-medium">
                            {formatDateDisplay(session.date)} · {session.typeSession}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {session.club || "Club non saisi"}
                          </p>
                        </div>
                        <Badge
                          variant={session.resultat === "Victoire" ? "default" : "secondary"}
                        >
                          {session.resultat}
                        </Badge>
                      </div>
                      <div className="mt-3 grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                        <span>{session.duree} min</span>
                        <span>{session.score || "Score non saisi"}</span>
                      </div>
                    </button>
                  ))}
                </CardContent>
              </Card>

              <Card className="rounded-3xl shadow-sm">
                <CardHeader>
                  <CardTitle>Détail session</CardTitle>
                </CardHeader>
                <CardContent className="space-y-5">
                  {activeSession ? (
                    <>
                      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                        <Metric label="Date" value={formatDateDisplay(activeSession.date)} />
                        <Metric label="Durée" value={`${activeSession.duree} min`} />
                        <Metric label="Terrain" value={activeSession.typeTerrain || "-"} />
                        <Metric label="Club" value={activeSession.club || "-"} />
                      </div>
                      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                        <Metric label="FC moyenne" value={activeSession.forme?.fcMoy || "-"} />
                        <Metric label="FC max" value={activeSession.forme?.fcMax || "-"} />
                        <Metric label="Calories" value={activeSession.forme?.calories || "-"} />
                        <Metric label="Fatigue" value={`${activeSession.fatigueApres}/10`} />
                      </div>
                      <div className="rounded-2xl border p-4">
                        <p className="text-sm font-medium">Participants</p>
                        <p className="mt-2 text-sm text-muted-foreground">
                          Partenaire: {activeSession.partenaire || "-"} · Adversaires:{" "}
                          {activeSession.adv1 || "-"}, {activeSession.adv2 || "-"}
                        </p>
                      </div>
                      <div className="grid gap-4 md:grid-cols-2">
                        <Insight title="Point fort" value={activeSession.conseils?.pointFort} />
                        <Insight
                          title="Point faible"
                          value={activeSession.conseils?.pointFaible}
                        />
                        <Insight
                          title="Conseil technique"
                          value={activeSession.conseils?.technique}
                        />
                        <Insight
                          title="Conseil tactique"
                          value={activeSession.conseils?.tactique}
                        />
                        <Insight
                          title="Conseil physique"
                          value={activeSession.conseils?.physique}
                        />
                        <Insight
                          title="Récupération"
                          value={activeSession.conseils?.recuperation}
                        />
                      </div>
                    </>
                  ) : (
                    <p className="text-sm text-muted-foreground">Sélectionne une session.</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="admin" className="space-y-4">
            <div className="grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
              <Card className="rounded-3xl shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" /> Configuration webhook
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Field label="Webhook URL">
                    <Input
                      value={webhookUrl}
                      onChange={(e) => setWebhookUrl(e.target.value)}
                    />
                  </Field>
                  <Field label="Webhook secret">
                    <Input
                      value={webhookSecret}
                      onChange={(e) => setWebhookSecret(e.target.value)}
                    />
                  </Field>
                  <div className="flex flex-wrap gap-3">
                    <Button
                      className="rounded-2xl"
                      onClick={sendSessionToWebhook}
                      disabled={sending}
                    >
                      <Send className="mr-2 h-4 w-4" />
                      Tester l'envoi
                    </Button>
                    <Button
                      className="rounded-2xl"
                      variant="secondary"
                      onClick={() =>
                        setStatus({
                          type: "idle",
                          message: JSON.stringify(
                            buildPayload(profile, draftToSession(draft, profile), webhookSecret),
                            null,
                            2
                          ),
                        })
                      }
                    >
                      Voir payload JSON
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-3xl shadow-sm">
                <CardHeader>
                  <CardTitle>État de l'application</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded-2xl border p-4">
                    <div className="flex items-center gap-2">
                      {status.type === "success" ? (
                        <CheckCircle2 className="h-5 w-5" />
                      ) : status.type === "error" ? (
                        <AlertCircle className="h-5 w-5" />
                      ) : generatingAi ? (
                        <Zap className="h-5 w-5" />
                      ) : (
                        <Activity className="h-5 w-5" />
                      )}
                      <p className="font-medium">
                        {status.type === "success"
                          ? "Succès"
                          : status.type === "error"
                          ? "Erreur"
                          : generatingAi
                          ? "IA active"
                          : "Statut"}
                      </p>
                    </div>
                    <pre className="mt-3 overflow-auto whitespace-pre-wrap text-xs text-muted-foreground">
                      {status.message}
                    </pre>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <MetricCard title="Joueur actif" value={profile.pseudo} />
                    <MetricCard title="Session active" value={activeSession?.id || "-"} />
                    <MetricCard title="Montre" value={profile.montreModele} />
                    <MetricCard title="Total sessions" value={sessions.length} />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {children}
    </div>
  );
}

function Metric({ label, value }) {
  return (
    <div className="rounded-2xl border p-4">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-2 text-xl font-semibold">{value}</p>
    </div>
  );
}

function MetricCard({ title, value }) {
  return (
    <div className="rounded-2xl border p-4">
      <p className="text-sm text-muted-foreground">{title}</p>
      <p className="mt-2 text-lg font-semibold">{value}</p>
    </div>
  );
}

function Insight({ title, value }) {
  return (
    <div className="rounded-2xl border p-4">
      <p className="text-sm font-medium">{title}</p>
      <p className="mt-2 text-sm text-muted-foreground">{value || "Non renseigné"}</p>
    </div>
  );
}

function ProgressRow({ label, value, suffix }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span>{label}</span>
        <span className="text-muted-foreground">
          {value}
          {suffix}
        </span>
      </div>
      <Progress value={value} className="h-2" />
    </div>
  );
}
