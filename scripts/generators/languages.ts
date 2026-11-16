import { escapeXml, theme } from "./utils.js";

interface LanguageStat {
  language: string;
  bytes: number;
  percentage: number;
}

const languageColors = [
  "#7aa2f7",
  "#bb9af7",
  "#7dcfff",
  "#9ece6a",
  "#e0af68",
  "#f7768e",
  "#73daca",
  "#c0caf5",
  "#565f89",
];

export function generateLanguages(languages: LanguageStat[]): string {
  const sorted = [...languages].sort((a, b) => b.bytes - a.bytes);

  const topLanguages = sorted.slice(0, 8);
  const otherPercentage = sorted
    .slice(8)
    .reduce((total, item) => total + item.percentage, 0);

  const displayLanguages = [
    ...topLanguages,
    ...(otherPercentage > 0
      ? [{
          language: "Other",
          percentage: otherPercentage,
          bytes: 0,
        }]
      : []),
  ];

  const rows = displayLanguages.map((item, index) => {
    const y = 112 + index * 32;
    const color = languageColors[index % languageColors.length];
    const percentage = Math.min(100, Math.max(0, item.percentage));
    const barWidth = percentage * 5.2;

    return `
      <g>
        <text
          x="28" y="${y}"
          fill="${theme.text}"
          font-size="12"
          font-family="Arial, sans-serif"
        >${escapeXml(item.language)}</text>

        <rect
          x="180" y="${y - 10}"
          width="520" height="9"
          rx="4.5"
          fill="${theme.surface}"
        />

        <rect
          x="180" y="${y - 10}"
          width="${barWidth}" height="9"
          rx="4.5"
          fill="${color}"
        />

        <text
          x="770" y="${y}"
          text-anchor="end"
          fill="${theme.muted}"
          font-size="12"
          font-family="Arial, sans-serif"
        >${percentage.toFixed(2)}%</text>
      </g>
    `;
  }).join("");

  const height = Math.max(180, 142 + displayLanguages.length * 32);

  return `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="800"
      height="${height}"
      viewBox="0 0 800 ${height}"
      fill="none"
    >
      <rect
        width="800"
        height="${height}"
        rx="16"
        fill="${theme.background}"
      />

      <text
        x="28" y="43"
        fill="${theme.text}"
        font-size="21"
        font-weight="bold"
        font-family="Arial, sans-serif"
      >Top Programming Languages</text>

      <text
        x="28" y="68"
        fill="${theme.muted}"
        font-size="12"
        font-family="Arial, sans-serif"
      >Based on code size across public repositories</text>

      ${rows}

      <text
        x="772" y="${height - 16}"
        text-anchor="end"
        fill="${theme.muted}"
        font-size="10"
        font-family="Arial, sans-serif"
      >github.com/syahrul35</text>
    </svg>
  `;
}
