import { formatNumber, theme } from "./utils.js";

interface OverviewStats {
  repositories: number;
  stars: number;
  forks: number;
  contributions: number;
}

export function generateOverview(stats: OverviewStats): string {
  const cards = [
    { label: "Repositories", value: stats.repositories, color: theme.blue },
    { label: "Contributions", value: stats.contributions, color: theme.purple },
    { label: "Total Stars", value: stats.stars, color: theme.cyan },
    { label: "Total Forks", value: stats.forks, color: theme.green },
  ];

  const cardWidth = 174;
  const gap = 16;
  const startX = 24;

  const cardElements = cards.map((card, index) => {
    const x = startX + index * (cardWidth + gap);

    return `
      <g>
        <rect
          x="${x}" y="100"
          width="${cardWidth}" height="112"
          rx="12"
          fill="${theme.surface}"
          stroke="${theme.border}"
        />

        <rect
          x="${x}" y="100"
          width="4" height="112"
          rx="2"
          fill="${card.color}"
        />

        <text
          x="${x + 20}" y="138"
          fill="${theme.muted}"
          font-size="13"
          font-family="Arial, sans-serif"
        >${card.label}</text>

        <text
          x="${x + 20}" y="181"
          fill="${theme.text}"
          font-size="30"
          font-weight="bold"
          font-family="Arial, sans-serif"
        >${formatNumber(card.value)}</text>
      </g>
    `;
  }).join("");

  return `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="800"
      height="250"
      viewBox="0 0 800 250"
      fill="none"
    >
      <rect width="800" height="250" rx="16" fill="${theme.background}"/>

      <text
        x="24" y="48"
        fill="${theme.text}"
        font-size="21"
        font-weight="bold"
        font-family="Arial, sans-serif"
      >GitHub Overview</text>

      <text
        x="24" y="72"
        fill="${theme.muted}"
        font-size="12"
        font-family="Arial, sans-serif"
      >A snapshot of my GitHub activity</text>

      ${cardElements}

      <text
        x="776" y="236"
        text-anchor="end"
        fill="${theme.muted}"
        font-size="10"
        font-family="Arial, sans-serif"
      >github.com/syahrul35</text>
    </svg>
  `;
}
