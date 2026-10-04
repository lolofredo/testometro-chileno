export const SHARE_NICKNAME_MAX_LENGTH = 20;
// El ranking tiene más espacio: usa el mismo largo que permite el formulario.
export const RANKING_NICKNAME_MAX_LENGTH = 32;
export const ANONYMOUS_NICKNAME = "Anónimo";

// Raíces que se buscan dentro del nickname completo, sin espacios ni signos
// ("w e o n", "weooon" y "w3on" también calzan).
const blockedFragments = [
  "weon",
  "hueon",
  "huevon",
  "aweonao",
  "ahueonao",
  "conchetu",
  "conchesu",
  "conchatu",
  "conchadetu",
  "chuchetu",
  "hijodeput",
  "hijoeput",
  "culiao",
  "culiado",
  "qliao",
  "maricon",
  "maraco",
  "pichula",
  "chupala",
  "chupalo",
  "chupame",
  "sacowea",
  "pendejo",
  "mierda",
  "prostitut",
  "pedofil",
  "violador",
  "hitler",
  "nigger",
  "nigga",
  "faggot",
  "porno",
  "fuck",
  "bitch",
  "pussy",
  "asshole",
  "retrasad",
  "mongolic",
  "subnormal",
  "imbecil",
  "estupid",
  "pelotud",
  "boludo",
  "suicid"
];

// Palabras cortas que solo se bloquean como palabra completa, para no
// rechazar nicknames inocentes que las contienen ("Diputado", "Mariano").
const blockedWords = [
  "wn",
  "wea",
  "weas",
  "ql",
  "qlo",
  "ctm",
  "csm",
  "hdp",
  "ptm",
  "puta",
  "puto",
  "putas",
  "putos",
  "putita",
  "putito",
  "perra",
  "zorra",
  "raja",
  "pico",
  "tula",
  "poto",
  "culo",
  "cono",
  "pene",
  "pija",
  "sexo",
  "sex",
  "nazi",
  "fleto",
  "hueco",
  "idiota",
  "tarado",
  "chucha",
  "porn",
  "verga",
  "dick",
  "cock",
  "cunt",
  "shit",
  "sudaca"
];

const leetMap: Record<string, string> = {
  "0": "o",
  "1": "i",
  "3": "e",
  "4": "a",
  "5": "s",
  "7": "t",
  "8": "b",
  "@": "a",
  $: "s"
};

// Minúsculas, sin tildes, sin "leet" y sin letras repetidas seguidas.
function normalizeForMatch(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/[0-9@$]/g, (char) => leetMap[char] ?? char)
    .replace(/(.)\1+/g, "$1");
}

const normalizedFragments = blockedFragments.map(normalizeForMatch);
const normalizedWords = new Set(blockedWords.map(normalizeForMatch));

function isOffensive(nickname: string) {
  const normalized = normalizeForMatch(nickname);
  const compact = normalized.replace(/[^a-z]/g, "");
  if (normalizedFragments.some((fragment) => compact.includes(fragment))) {
    return true;
  }

  return normalized
    .split(/[^a-z]+/)
    .some((word) => word && normalizedWords.has(word));
}

function truncateAtWord(value: string, maxLength: number) {
  if (value.length <= maxLength) return value;
  const cut = value.slice(0, maxLength + 1);
  const lastSpace = cut.lastIndexOf(" ");
  return (lastSpace >= 8 ? cut.slice(0, lastSpace) : cut.slice(0, maxLength)).trim();
}

// Nickname apto para mostrarse en links e imágenes públicas: sin links,
// sin emojis ni caracteres raros, con largo máximo y sin insultos.
export function cleanShareNickname(raw: string, maxLength = SHARE_NICKNAME_MAX_LENGTH) {
  const withoutLinks = raw
    .normalize("NFKC")
    .split(/\s+/)
    .filter(
      (word) =>
        !/(https?:|www\.|@|\p{L}\.\p{L}{2,})/iu.test(word)
    )
    .join(" ");

  const cleaned = truncateAtWord(
    withoutLinks
      .replace(/[^\p{L}\p{M}\p{N} ._'-]/gu, "")
      .replace(/[._'-]{2,}/g, "")
      .replace(/\s+/g, " ")
      .trim(),
    maxLength
  );

  if (!/[\p{L}\p{N}]/u.test(cleaned) || isOffensive(cleaned)) {
    return ANONYMOUS_NICKNAME;
  }

  return cleaned;
}
