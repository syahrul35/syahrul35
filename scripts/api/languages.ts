import { github } from "./github.js";
import { getRepositories } from "./repositories.js";

export async function getLanguageStats() {
  const repositories = await getRepositories();

  const languageTotals: Record<string, number> = {};

  for (const repo of repositories) {
    const { data: languages } = await github.repos.listLanguages({
      owner: repo.owner.login,
      repo: repo.name,
    });

    for (const [language, bytes] of Object.entries(languages)) {
      languageTotals[language] =
        (languageTotals[language] ?? 0) + bytes;
    }
  }

  const totalBytes = Object.values(languageTotals).reduce(
    (total, bytes) => total + bytes,
    0
  );

  return Object.entries(languageTotals)
    .map(([language, bytes]) => ({
      language,
      bytes,
      percentage: Number(((bytes / totalBytes) * 100).toFixed(2)),
    }))
    .sort((a, b) => b.bytes - a.bytes);
}
