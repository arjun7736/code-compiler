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
    dockerImage: "node:18-alpine",
    command: (filename: string) => `node /app/${filename}`,
  },
  ts: {
    extension: ".ts",
    dockerImage: "node:18-alpine",
    command: (filename: string) =>
      `sh -c "cd /app && tsc ${filename} && node ${filename.replace(".ts", ".js")}"`,
  },
  py: {
    extension: ".py",
    dockerImage: "python:3.11-alpine",
    command: (filename: string) => `python /app/${filename}`,
  },
  java: {
    extension: ".java",
    dockerImage: "openjdk:21-alpine",
    command: (filename: string) =>
      `sh -c "javac /app/${filename} && java -cp /app ${filename.replace(".java", "")}"`,
  },
  cpp: {
    extension: ".cpp",
    dockerImage: "gcc:13.2.0",
    command: (filename: string) =>
      `sh -c "g++ /app/${filename} -o /app/app && /app/app"`,
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

  const baseTempDir = path.join(os.tmpdir(), "sandbox-runs");
  await fs.mkdir(baseTempDir, { recursive: true });

  const tempDir = path.join(baseTempDir, `run-${randomUUID()}`);
  await fs.mkdir(tempDir, { recursive: true });

  const hostFilePath = path.join(tempDir, filename);
  await fs.writeFile(hostFilePath, code);

  const dockerCmd = `docker run --rm -m 128m --network none -v ${tempDir}:/app --cpus=".5" --pids-limit=64 --name run-${randomUUID()} ${config.dockerImage} sh -c '${config.command(
    filename
  )}'`;

  try {
    const { stdout, stderr } = await execAsync(dockerCmd, { timeout: 4000 });
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
