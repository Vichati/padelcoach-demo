function getProviderConfig(provider) {
  switch (provider) {
    case "groq":
      return {
        label: "Groq",
        baseURL: "https://api.groq.com/openai/v1",
        model: "llama-3.3-70b-versatile",
      };
    case "xai":
      return {
        label: "xAI",
        baseURL: "https://api.x.ai/v1",
        model: "grok-4-0709",
      };
    case "aiapi":
      return {
        label: "AIAPI",
        baseURL: "https://aiapi.world/v1",
        model: "gpt-4.1-mini",
      };
    case "openai":
    default:
      return {
        label: "OpenAI",
        baseURL: "https://api.openai.com/v1",
        model: "gpt-4.1-mini",
      };
  }
}

function buildPrompt(profile, session) {
  return `
Tu es un coach expert de padel, orienté performance amateur/compétiteur.

Ta mission :
- analyser la séance
- produire des recommandations concrètes, courtes, actionnables
- éviter le blabla
- ne pas inventer de données absentes
- rester cohérent avec les métriques reçues

Retourne UNIQUEMENT un JSON valide avec exactement ces clés :
{
  "priorite": "Faible|Moyenne|Haute",
  "technique": "string",
  "tactique": "string",
  "physique": "string",
  "recuperation": "string",
  "pointFort": "string",
  "pointFaible": "string",
  "objectif": "string"
}

Profil joueur:
${JSON.stringify(profile, null, 2)}

Session:
${JSON.stringify(session, null, 2)}
`;
}

function safeJsonParse(text) {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

function normalizeCoaching(data) {
  return {
    priorite: ["Faible", "Moyenne", "Haute"].includes(data?.priorite)
      ? data.priorite
      : "Moyenne",
    technique: String(data?.technique || ""),
    tactique: String(data?.tactique || ""),
    physique: String(data?.physique || ""),
    recuperation: String(data?.recuperation || ""),
    pointFort: String(data?.pointFort || ""),
    pointFaible: String(data?.pointFaible || ""),
    objectif: String(data?.objectif || ""),
  };
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { provider = "openai", apiKey, profile, session } = body || {};

    if (!apiKey || !String(apiKey).trim()) {
      return Response.json(
        { success: false, error: "Clé API manquante." },
        { status: 400 }
      );
    }

    if (!profile || !session) {
      return Response.json(
        { success: false, error: "Profil ou session manquant." },
        { status: 400 }
      );
    }

    const config = getProviderConfig(provider);
    const prompt = buildPrompt(profile, session);

    const res = await fetch(`${config.baseURL}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: config.model,
        temperature: 0.7,
        messages: [
          {
            role: "system",
            content:
              "Tu es un coach expert de padel. Tu réponds toujours uniquement en JSON valide.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
      }),
      cache: "no-store",
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      return Response.json(
        {
          success: false,
          error:
            data?.error?.message ||
            data?.error ||
            `Erreur fournisseur IA (${config.label})`,
        },
        { status: 502 }
      );
    }

    const text = data?.choices?.[0]?.message?.content?.trim() || "";
    const parsed = safeJsonParse(text);

    if (!parsed) {
      return Response.json(
        {
          success: false,
          error: "Réponse IA invalide.",
          raw: text,
        },
        { status: 502 }
      );
    }

    return Response.json({
      success: true,
      provider_used: config.label,
      coaching: normalizeCoaching(parsed),
    });
  } catch (error) {
    return Response.json(
      {
        success: false,
        error: String(error?.message || error),
      },
      { status: 500 }
    );
  }
}