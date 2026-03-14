import { Badge } from "@/components/ui/badge";
import { CodeBlockServer } from "@/components/ui/code-block-server";

const LEADERBOARD_ENTRIES = [
  {
    rank: 1,
    author: "dev_noob_42",
    date: "2024-01-15",
    score: 2.1,
    language: "javascript",
    code: `function calculateSum(arr) {
  let sum = 0;
  for (let i = 0; i <= arr.length; i++) {
    sum += arr[i];
  }
  return sum;
}`,
  },
  {
    rank: 2,
    author: "spaghetti_coder",
    date: "2024-01-14",
    score: 3.4,
    language: "python",
    code: `def process_data(data):
    result = []
    for item in data:
        if item:
            result.append(item)
        else:
            continue
    return result`,
  },
  {
    rank: 3,
    author: "callback_hell",
    date: "2024-01-13",
    score: 3.8,
    language: "javascript",
    code: `fetch('/api/users')
  .then(res => res.json())
  .then(users => {
    users.forEach(user => {
      fetch('/api/posts/' + user.id)
        .then(postRes => postRes.json())
        .then(posts => {
          console.log(posts);
        });
    });
  });`,
  },
  {
    rank: 4,
    author: "global_var",
    date: "2024-01-12",
    score: 4.5,
    language: "javascript",
    code: `let result = [];

function addItem(item) {
  result.push(item);
}

function getItems() {
  return result;
}`,
  },
  {
    rank: 5,
    author: "magic_numbers",
    date: "2024-01-11",
    score: 5.2,
    language: "typescript",
    code: `function getDiscount(price: number): number {
  if (price > 100) {
    return 15;
  } else if (price > 50) {
    return 10;
  }
  return 5;
}`,
  },
];

export default function LeaderboardPage() {
  return (
    <div className="min-h-screen bg-bg-page">
      <div className="max-w-5xl mx-auto px-5 py-10">
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-[32px] font-bold text-accent-green">
              {">"}
            </span>
            <h1 className="text-[28px] font-bold text-text-primary font-mono">
              shame_leaderboard
            </h1>
          </div>
          <p className="text-[14px] text-text-secondary font-mono mb-4">
            {"// the most roasted code on the internet"}
          </p>
          <div className="flex items-center gap-2 text-[12px] text-text-tertiary font-mono">
            <span>2,847 submissions</span>
            <span>·</span>
            <span>avg score: 4.2/10</span>
          </div>
        </div>

        <div className="flex flex-col gap-5">
          {LEADERBOARD_ENTRIES.map((entry) => (
            <div
              key={entry.rank}
              className="border border-border-primary bg-bg-surface rounded-md overflow-hidden"
            >
              <div className="h-12 flex items-center justify-between px-5 border-b border-border-primary">
                <div className="flex items-center gap-4">
                  <span className="text-[14px] font-bold text-accent-red font-mono">
                    #{entry.rank}
                  </span>
                  <span className="text-[14px] text-text-primary font-mono">
                    {entry.author}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[12px] text-text-tertiary font-mono">
                    {entry.date}
                  </span>
                  <Badge variant="critical">{entry.score.toFixed(1)}/10</Badge>
                </div>
              </div>
              <CodeBlockServer code={entry.code} language={entry.language} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
