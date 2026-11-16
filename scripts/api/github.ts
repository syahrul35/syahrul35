import "dotenv/config";

import { Octokit } from "@octokit/rest";
import { graphql } from "@octokit/graphql";

const token = process.env.GITHUB_TOKEN;

if (!token) {
  throw new Error("GITHUB_TOKEN is not defined in .env");
}

export const github = new Octokit({
  auth: token,
});

export const githubGraphql = graphql.defaults({
  headers: {
    authorization: `token ${token}`,
  },
});
