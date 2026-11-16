
import { github } from "./github.js";

export async function getRepositories() {
  const username = process.env.GITHUB_USERNAME;

  if (!username) {
    throw new Error("GITHUB_USERNAME is not defined in .env");
  }

  const { data } = await github.repos.listForUser({
    username,
    type: "owner",
    per_page: 100,
    sort: "updated",
  });

  return data.filter((repo) => !repo.fork);
}

export async function getRepositoryStats() {
  const repositories = await getRepositories();

  const totalStars = repositories.reduce(
    (total, repo) => total + (repo.stargazers_count ?? 0),
    0
  );

  const totalForks = repositories.reduce(
    (total, repo) => total + (repo.forks_count ?? 0),
    0
  );

  return {
    totalRepositories: repositories.length,
    totalStars,
    totalForks,
    repositories,
  };
}
