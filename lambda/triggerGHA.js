/* global fetch */
import {
  SecretsManagerClient,
  GetSecretValueCommand,
} from "@aws-sdk/client-secrets-manager";

export const handler = async () => {
  const secretsManager = new SecretsManagerClient({ region: "us-west-1" });
  const command = new GetSecretValueCommand({
    SecretId: process.env.GITHUB_TOKEN,
  });

  let data;
  try {
    console.log("Fetching GitHub token from Secrets Manager");
    data = await secretsManager.send(command);
    console.log("GitHub token fetched successfully");
  } catch (error) {
    console.error(`Failed to fetch GitHub token: ${error}`);
  }

  const { GITHUB_TOKEN } = JSON.parse(data.SecretString);
  const url = `https://api.github.com/repos/gramstudio/LIRR-ontime/actions/workflows/main.yml/dispatches`;
  const options = {
    method: "POST",
    headers: {
      Accept: "application/vnd.github.v3+json",
      Authorization: `token ${GITHUB_TOKEN}`,
    },
    body: JSON.stringify({
      ref: "main",
    }),
  };

  try {
    console.log("Attempting dispatch with fetch");
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    console.log("Workflow dispatched successfully!");
  } catch (error) {
    console.error(`Failed to dispatch workflow: ${error}`);
  }
};
