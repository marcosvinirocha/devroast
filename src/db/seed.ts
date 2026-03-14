import { faker } from "@faker-js/faker";
import { sql } from "drizzle-orm";
import { db } from "./index";
import { leaderboard, roasts, submissions } from "./schema";

const LANGUAGES = [
  "javascript",
  "typescript",
  "python",
  "rust",
  "go",
  "java",
  "c",
  "cpp",
  "ruby",
  "php",
] as const;

const ROAST_MODES = ["brutal", "balanced", "friendly"] as const;
const STATUSES = ["pending", "processing", "completed", "failed"] as const;

const CODE_TEMPLATES: Record<string, string[]> = {
  javascript: [
    `function sum(a, b) { return a + b; }`,
    `const users = data.map(u => u.name);`,
    `if (x === true) { doSomething(); }`,
    `for (let i = 0; i < 10; i++) { console.log(i); }`,
  ],
  python: [
    `def sum(a, b): return a + b`,
    `users = [u['name'] for u in data]`,
    `if x == True: do_something()`,
    `for i in range(10): print(i)`,
  ],
  rust: [
    `fn sum(a: i32, b: i32) -> i32 { a + b }`,
    `let users: Vec<String> = data.iter().map(|u| u.name).collect();`,
    `if x == true { do_something(); }`,
    `for i in 0..10 { println!("{}", i); }`,
  ],
  typescript: [
    `function sum(a: number, b: number): number { return a + b; }`,
    `const users = data.map((u: User) => u.name);`,
    `if (x === true) { doSomething(); }`,
    `for (let i = 0; i < 10; i++) { console.log(i); }`,
  ],
};

const ROAST_TEMPLATES = {
  brutal: [
    "Isso é um desastre. Nem tentando, cara.",
    "Meu avô programa melhor com um guardanapo.",
    "Isso nem deveria compilar. Seriously?",
    "Se isso fosse um país, seria um campo de refugiados.",
    "Você sabe que existe documentação, né?",
    "Isso merece um tapinha na mão.",
    "Meu Deus, isso é pior que o código do meu TCC.",
    "Isso não é código, é uma carta de suicídio.",
    "Eu chorei. De tanto rir.",
    "Se isso queima, imagine na produção.",
  ],
  balanced: [
    "Funciona, mas tem espaço para melhorar.",
    "Poderia ser pior, mas poderia ser melhor.",
    "Isso resolve o problema, só não resolve bem.",
    "Tem algumas ideias boas, mas precisa de refatoração.",
    "O código funciona, agora vamos falar de manutenção.",
    "Não está ruim, mas também não está bom.",
    "Isso serve para um MVP, nada mais.",
    "Precisa de testes urgently.",
    "Boa iniciativa, execuçãoprecisa de ajuda.",
    "Funciona, mas não me peça para dar manutenção.",
  ],
  friendly: [
    "Bons esforços! Continue praticando.",
    "Cada erro é um aprendizado. Você está no caminho certo!",
    "Ótimo começar! Com o tempo você pega o jeito.",
    "Está melhorando! Continue assim.",
    "Pequenas mudanças podem fazer uma grande diferença.",
    "Parabéns por tentar! A prática leva à perfeição.",
    "Você está no caminho certo. Continue!",
    "Boa base! Agora é só refinar.",
    "Ótimo começar! Continue evoluindo.",
    "Cada linha de código é um passo adiante.",
  ],
};

function getRandomElement<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateCode(language: string): string {
  const templates = CODE_TEMPLATES[language] || CODE_TEMPLATES.javascript;
  const code = faker.helpers.mustache(getRandomElement(templates), {
    name: faker.person.firstName(),
  });
  return code;
}

function generateRoastContent(roastMode: string): string {
  const templates = ROAST_TEMPLATES[roastMode as keyof typeof ROAST_TEMPLATES];
  return getRandomElement(templates);
}

async function seed() {
  console.log("🌱 Starting seed...");

  const submissionCount = 100;
  const submissionsData = [];

  console.log(`Creating ${submissionCount} submissions...`);
  for (let i = 0; i < submissionCount; i++) {
    const language = getRandomElement(LANGUAGES);
    const status = getRandomElement(STATUSES);
    const score =
      status === "completed" ? faker.number.int({ min: 0, max: 100 }) : null;

    submissionsData.push({
      code: generateCode(language),
      language,
      title: faker.lorem.sentence({ min: 3, max: 6 }),
      description: faker.lorem.paragraph(),
      status,
      score,
      createdAt: faker.date.past({ years: 1 }),
      updatedAt: faker.date.recent({ days: 30 }),
    });
  }

  const insertedSubmissions = await db
    .insert(submissions)
    .values(submissionsData)
    .returning({ id: submissions.id });

  console.log(`Created ${insertedSubmissions.length} submissions`);

  console.log("Creating roasts...");
  const roastsData = [];

  for (const submission of insertedSubmissions) {
    const roastMode = getRandomElement(ROAST_MODES);
    const content = generateRoastContent(roastMode);

    roastsData.push({
      submissionId: submission.id,
      content,
      roastMode,
      createdAt: faker.date.past({ years: 1 }),
    });
  }

  await db.insert(roasts).values(roastsData);
  console.log(`Created ${roastsData.length} roasts`);

  console.log("Creating leaderboard...");
  const leaderboardData = [
    {
      totalScore: 850,
      submissionsCount: 12,
      averageScore: "70.83",
      rank: 1,
      updatedAt: new Date(),
    },
    {
      totalScore: 720,
      submissionsCount: 10,
      averageScore: "72.00",
      rank: 2,
      updatedAt: new Date(),
    },
    {
      totalScore: 680,
      submissionsCount: 8,
      averageScore: "85.00",
      rank: 3,
      updatedAt: new Date(),
    },
    {
      totalScore: 590,
      submissionsCount: 9,
      averageScore: "65.56",
      rank: 4,
      updatedAt: new Date(),
    },
    {
      totalScore: 450,
      submissionsCount: 7,
      averageScore: "64.29",
      rank: 5,
      updatedAt: new Date(),
    },
  ];

  await db.insert(leaderboard).values(leaderboardData);
  console.log(`Created ${leaderboardData.length} leaderboard entries`);

  console.log("✅ Seed completed!");
}

seed()
  .catch((error) => {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  })
  .finally(() => {
    process.exit(0);
  });
