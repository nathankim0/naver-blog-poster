#!/usr/bin/env node

import { execSync, spawn } from "node:child_process";
import { createInterface } from "node:readline";
import { existsSync, writeFileSync, readFileSync } from "node:fs";
import { randomBytes } from "node:crypto";
import { resolve, basename } from "node:path";

const NAVER_DEV_CENTER_URL = "https://developers.naver.com/apps/#/register";
const REPO_URL = "https://github.com/nathankim0/naver-blog-poster.git";
const GREEN = "\x1b[32m";
const CYAN = "\x1b[36m";
const YELLOW = "\x1b[33m";
const DIM = "\x1b[2m";
const BOLD = "\x1b[1m";
const RESET = "\x1b[0m";

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
});

function ask(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => resolve(answer.trim()));
  });
}

function log(msg) {
  console.log(msg);
}

function step(num, msg) {
  log(`\n${GREEN}[${num}]${RESET} ${BOLD}${msg}${RESET}`);
}

function openBrowser(url) {
  const platform = process.platform;
  try {
    if (platform === "darwin") {
      execSync(`open "${url}"`);
    } else if (platform === "win32") {
      execSync(`start "" "${url}"`);
    } else {
      execSync(`xdg-open "${url}"`);
    }
  } catch {
    log(`${YELLOW}브라우저를 열 수 없습니다. 직접 접속해주세요:${RESET}`);
    log(`  ${url}`);
  }
}

async function main() {
  log("");
  log(`${BOLD}${GREEN}  Naver Blog Poster${RESET} — 마크다운으로 네이버 블로그 발행`);
  log(`${DIM}  ─────────────────────────────────────────────${RESET}`);

  // 현재 디렉토리가 이미 프로젝트인지 확인
  const isInsideProject =
    existsSync("package.json") &&
    (() => {
      try {
        const pkg = JSON.parse(readFileSync("package.json", "utf-8"));
        return pkg.name === "naver-blog-poster";
      } catch {
        return false;
      }
    })();

  let projectDir = process.cwd();

  if (!isInsideProject) {
    step(0, "프로젝트 다운로드");
    const dirName = "naver-blog-poster";

    if (existsSync(dirName)) {
      log(`  ${DIM}${dirName}/ 폴더가 이미 존재합니다. 해당 폴더를 사용합니다.${RESET}`);
    } else {
      log(`  ${DIM}GitHub에서 클론 중...${RESET}`);
      try {
        execSync(`git clone --depth 1 ${REPO_URL} ${dirName}`, {
          stdio: "pipe",
        });
      } catch {
        log(`${YELLOW}git clone 실패. 수동으로 클론해주세요:${RESET}`);
        log(`  git clone ${REPO_URL}`);
        rl.close();
        process.exit(1);
      }
    }

    projectDir = resolve(process.cwd(), dirName);
    process.chdir(projectDir);
    log(`  ${GREEN}✓${RESET} ${DIM}${projectDir}${RESET}`);
  }

  // .env.local 존재 여부 확인
  const envPath = resolve(projectDir, ".env.local");
  const hasEnv = existsSync(envPath);

  if (hasEnv) {
    const overwrite = await ask(
      `\n  ${YELLOW}.env.local이 이미 존재합니다. 덮어쓸까요?${RESET} (y/N) `
    );
    if (overwrite.toLowerCase() !== "y") {
      log(`  ${DIM}기존 설정을 유지합니다.${RESET}`);
      await installAndRun(projectDir);
      rl.close();
      return;
    }
  }

  // 네이버 개발자 센터 안내
  step(1, "네이버 개발자 센터에서 앱 등록");
  log("");
  log(`  ${CYAN}지금 브라우저에서 네이버 개발자 센터가 열립니다.${RESET}`);
  log(`  아래 설정으로 앱을 등록해주세요:`);
  log("");
  log(`  ${BOLD}사용 API:${RESET}        네이버 아이디로 로그인 + 블로그`);
  log(`  ${BOLD}서비스 URL:${RESET}      http://localhost:3000`);
  log(`  ${BOLD}Callback URL:${RESET}    http://localhost:3000/api/auth/callback/naver`);
  log("");

  await ask(`  ${DIM}Enter를 눌러 브라우저를 여세요...${RESET}`);
  openBrowser(NAVER_DEV_CENTER_URL);

  // API 키 입력
  step(2, "API 키 입력");
  log(`  ${DIM}앱 등록 후 발급받은 키를 입력하세요${RESET}`);
  log("");

  const clientId = await ask(`  ${BOLD}Client ID:${RESET}     `);
  if (!clientId) {
    log(`  ${YELLOW}Client ID가 비어있습니다. 다시 실행해주세요.${RESET}`);
    rl.close();
    process.exit(1);
  }

  const clientSecret = await ask(`  ${BOLD}Client Secret:${RESET} `);
  if (!clientSecret) {
    log(`  ${YELLOW}Client Secret이 비어있습니다. 다시 실행해주세요.${RESET}`);
    rl.close();
    process.exit(1);
  }

  // .env.local 생성
  step(3, "환경 설정 파일 생성");
  const nextAuthSecret = randomBytes(32).toString("base64");

  const envContent = [
    `NAVER_CLIENT_ID=${clientId}`,
    `NAVER_CLIENT_SECRET=${clientSecret}`,
    `NEXTAUTH_SECRET=${nextAuthSecret}`,
    `NEXTAUTH_URL=http://localhost:3000`,
    "",
  ].join("\n");

  writeFileSync(envPath, envContent);
  log(`  ${GREEN}✓${RESET} .env.local 생성 완료`);

  // 설치 및 실행
  await installAndRun(projectDir);
  rl.close();
}

async function installAndRun(projectDir) {
  step(4, "패키지 설치");
  log(`  ${DIM}npm install 실행 중...${RESET}`);

  try {
    execSync("npm install", { cwd: projectDir, stdio: "pipe" });
    log(`  ${GREEN}✓${RESET} 설치 완료`);
  } catch {
    log(`  ${YELLOW}npm install 실패. 수동으로 실행해주세요.${RESET}`);
    return;
  }

  step(5, "서버 시작");
  log("");
  log(`  ${GREEN}${BOLD}http://localhost:3000${RESET} 에서 네이버 로그인 후 사용하세요!`);
  log(`  ${DIM}Ctrl+C로 종료${RESET}`);
  log("");

  const child = spawn("npm", ["run", "dev"], {
    cwd: projectDir,
    stdio: "inherit",
    shell: true,
  });

  child.on("error", () => {
    log(`  ${YELLOW}서버 시작 실패. npm run dev를 직접 실행해주세요.${RESET}`);
  });
}

main().catch((err) => {
  console.error(err);
  rl.close();
  process.exit(1);
});
