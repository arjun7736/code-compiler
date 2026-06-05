import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

const imageExists = async (image: string) => {
  try {
    await execAsync(`docker image inspect ${image}`);
    return true;
  } catch {
    return false;
  }
};

const prePullImages = async () => {
  const images = [
    "node:22-alpine",
    "python:3.11-alpine",
    "eclipse-temurin:21-alpine",
    "gcc:13.2.0",
  ];

  for (const image of images) {
    try {
      const exists = await imageExists(image);
      if (exists) {
        console.log(`Image already exists: ${image}. Skipping pull.`);
        continue;
      }
      console.log(`Pulling image: ${image}`);
      await execAsync(`docker pull ${image}`);
      console.log(`Successfully pulled image: ${image}`);
    } catch (error) {
      console.error(`Failed to pull image ${image}:`, error);
    }
  }
};

export default prePullImages;
