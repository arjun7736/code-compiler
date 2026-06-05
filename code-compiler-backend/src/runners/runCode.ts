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
    dockerImage: "node:22-alpine",
    command: (filename: string) => `node ${filename}`,
  },
  python: {
    extension: ".py",
    dockerImage: "python:3.11-alpine",
    command: (filename: string) => `python ${filename}`,
  },
 java: {
  extension: ".java",
  dockerImage: "eclipse-temurin:21-alpine",
  command: (filename: string) => {
    const className = filename.replace(".java", "");
    return `sh -c "javac ${filename} && java ${className}"`;
  },
},
  "c++": {
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

  let filename = language === "java"? "Main.java": `code-${randomUUID()}${config.extension}`;
  
  if (language === "java") {
  const match = code.match(/public\s+class\s+(\w+)/);

  if (match) {
    filename = `${match[1]}.java`;
  }
}

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
