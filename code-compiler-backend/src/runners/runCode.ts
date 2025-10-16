import fs from "fs/promises";
import { randomUUID } from "crypto";
import { exec } from "child_process";
import util from "util";
import path from "path";
import os from "os";

const execAsync = util.promisify(exec);

const languageConfigs = {
  js: {
    extension: ".js",
    dockerImage: "node:18",
    command: (filename: string) => `node ${filename}`,
  },
  ts: {
    extension: ".ts",
    dockerImage: "node:18",
    command: (filename: string) =>
      `sh -c "npm install -g ts-node typescript && ts-node ${filename}"`,
  },
  py: {
    extension: ".py",
    dockerImage: "python:3.11",
    command: (filename: string) => `python ${filename}`,
  },
  java: {
    extension: ".java",
    dockerImage: "openjdk:21",
    command: (filename: string) =>
      `sh -c "javac ${filename} && java ${filename.replace(".java", "")}"`,
  },
  cpp: {
    extension: ".cpp",
    dockerImage: "gcc:13.2.0",
    command: (filename: string) =>
      `sh -c "g++ ${filename} -o app && ./app"`,
  },
};

interface RunOptions {
  language: keyof typeof languageConfigs;
  code: string;
}

export const runCodeInDocker = async ({
  language,
  code,
}: RunOptions): Promise<{ stdout: string; stderr: string }> => {
  const config = languageConfigs[language];
  if (!config) throw new Error("Unsupported language");

  const filename = `code-${randomUUID()}${config.extension}`;

  // Use home folder instead of /tmp for Snap Docker compatibility
  const baseTempDir = path.join(os.homedir(), "sandbox-runs");
  await fs.mkdir(baseTempDir, { recursive: true });
  await fs.chmod(baseTempDir, 0o777);

  const tempDir = path.join(baseTempDir, `run-${randomUUID()}`);
  await fs.mkdir(tempDir, { recursive: true });
  await fs.chmod(tempDir, 0o777);

  const filePath = path.join(tempDir, filename);
  await fs.writeFile(filePath, code, { mode: 0o644 });

  // Docker command
  const dockerCmd = `docker run --rm \
    --workdir /app \
    -m 256m \
    --network none \
    -v "${tempDir}:/app" \
    --cpus=".5" \
    --pids-limit=64 \
    ${config.dockerImage} \
    ${config.command(filename)}`;

  try {
    const { stdout, stderr } = await execAsync(dockerCmd, { timeout: 10000 });        
    return { stdout, stderr };
  } catch (err: any) {    
    return {
      stdout: err.stdout || "",
      stderr: err.stderr || err.message,
    };
  } finally {
    await fs.rm(tempDir, { recursive: true, force: true });
  }
};
