
import { writeFile, mkdir } from "node:fs/promises";

import { github, githubGraphql } from "./api/github.js";
import { getRepositoryStats } from "./api/repositories.js";
import { getLanguageStats } from "./api/languages.js";

import { generateOverview } from "./generators/overview.js";
import { generateLanguages } from "./generators/languages.js";

async function main() {
  console.log("Fetching GitHub data...\n");

  // GitHub profile
  const { data: user } = await github.users.getAuthenticated();

  console.log("Username:", user.login);
  console.log("Public repositories:", user.public_repos);

  // Contributions
  const now = new Date();
  const from = new Date();
  from.setFullYear(now.getFullYear() - 1);

  const contributions = await githubGraphql<{
    viewer: {
      contributionsCollection: {
        contributionCalendar: {
          totalContributions: number;
        };
      };
    };
  }>(
    `
      query($from: DateTime!, $to: DateTime!) {
        viewer {
          contributionsCollection(from: $from, to: $to) {
            contributionCalendar {
              totalContributions
            }
          }
        }
      }
    `,
    {
      from: from.toISOString(),
      to: now.toISOString(),
    }
  );

  const totalContributions =
    contributions.viewer.contributionsCollection.contributionCalendar.totalContributions;

  // Repository statistics
  const repositoryStats = await getRepositoryStats();

  // Programming languages
  const languageStats = await getLanguageStats();

  console.log("\nGenerating SVG files...");

  // Generate SVG
  const overviewSvg = generateOverview({
    repositories: repositoryStats.totalRepositories,
    stars: repositoryStats.totalStars,
    forks: repositoryStats.totalForks,
    contributions: totalContributions,
  });

  const languagesSvg = generateLanguages(languageStats);

  // Save SVG files
  await mkdir("assets", { recursive: true });

  await writeFile("assets/stats-overview.svg", overviewSvg, "utf8");
  await writeFile("assets/top-languages.svg", languagesSvg, "utf8");

  console.log("\nSVG generation completed!");
  console.log("Generated: assets/stats-overview.svg");
  console.log("Generated: assets/top-languages.svg");
}

main().catch((error: unknown) => {
  console.error("\nFailed to generate GitHub stats:");

  if (error instanceof Error) {
    console.error(error.message);
  } else {
    console.error(error);
  }

  process.exitCode = 1;
});
