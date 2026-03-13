import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CodeBlockServer } from "@/components/ui/code-block-server";
import { DiffLine } from "@/components/ui/diff-line";
import {
  Navbar,
  NavbarLink,
  NavbarLogo,
  NavbarSpacer,
} from "@/components/ui/navbar";
import { ScoreRing } from "@/components/ui/score-ring";
import {
  TableCodeCell,
  TableLangCell,
  TableRankCell,
  TableRow,
  TableScoreCell,
} from "@/components/ui/table-row";
import { Toggle } from "@/components/ui/toggle";

const sampleCode = `function calculateTotal(items) {
  var total = 0;
  for (var i = 0; i < items.length; i++) {
    total = total + items[i].price;
  }
  return total;
}`;

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-[14px] font-bold font-mono text-accent-green">
        {"//"}
      </span>
      <span className="text-[14px] font-bold font-mono text-text-primary">
        {children}
      </span>
    </div>
  );
}

export default function ComponentsPage() {
  return (
    <div className="min-h-screen bg-bg-page px-20 py-[60px]">
      <div className="flex items-center gap-2 mb-[60px]">
        <span className="text-[24px] font-bold font-mono text-accent-green">
          {"//"}
        </span>
        <span className="text-[24px] font-bold font-mono text-text-primary">
          component_library
        </span>
      </div>

      <div className="flex flex-col gap-6">
        <section>
          <SectionTitle>typography</SectionTitle>
          <div className="mt-5 flex flex-col gap-5">
            <span className="text-[36px] font-bold font-mono text-text-primary">
              {"paste your code. get roasted."}
            </span>
            <div className="flex items-center gap-2">
              <span className="text-[14px] font-bold font-mono text-accent-green">
                {"//"}
              </span>
              <span className="text-[14px] font-bold font-mono text-text-primary">
                detailed_analysis
              </span>
            </div>
            <span className="text-[14px] font-mono text-text-secondary">
              description text sample
            </span>
            <span className="text-[12px] font-mono text-text-tertiary">
              lang: javascript · 7 lines
            </span>
            <span className="text-[13px] font-mono text-[#FFC799]">
              function calculateTotal()
            </span>
          </div>
        </section>

        <section>
          <SectionTitle>buttons</SectionTitle>
          <div className="mt-6 flex items-center gap-4">
            <Button variant="default">$ roast_my_code</Button>
            <Button variant="secondary">$ share_roast</Button>
            <Button variant="link">$ view_all &gt;&gt;</Button>
          </div>
        </section>

        <section>
          <SectionTitle>toggle</SectionTitle>
          <div className="mt-6 flex items-center gap-8">
            <Toggle checked label="roast mode" />
            <Toggle label="roast mode" />
          </div>
        </section>

        <section>
          <SectionTitle>badge_status</SectionTitle>
          <div className="mt-6 flex items-center gap-6">
            <Badge variant="critical">critical</Badge>
            <Badge variant="warning">warning</Badge>
            <Badge variant="good">good</Badge>
            <Badge variant="verdict">needs_serious_help</Badge>
          </div>
        </section>

        <section>
          <SectionTitle>cards</SectionTitle>
          <div className="mt-6">
            <Card className="w-[480px] p-5">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Badge variant="critical" />
                  <span className="text-[12px] font-mono text-accent-red">
                    critical
                  </span>
                </div>
              </CardHeader>
              <CardTitle className="text-[13px]">
                using var instead of const/let
              </CardTitle>
              <CardDescription className="text-[12px] leading-[18px]">
                the var keyword is function-scoped rather than block-scoped,
                which can lead to unexpected behavior and bugs. modern
                javascript uses const for immutable bindings and let for mutable
                ones.
              </CardDescription>
            </Card>
          </div>
        </section>

        <section>
          <SectionTitle>code_block</SectionTitle>
          <div className="mt-6">
            <CodeBlockServer
              code={sampleCode}
              language="javascript"
              fileName="calculate.js"
            />
          </div>
        </section>

        <section>
          <SectionTitle>diff_line</SectionTitle>
          <div className="mt-6 flex flex-col">
            <DiffLine type="removed" prefix="-">
              var total = 0;
            </DiffLine>
            <DiffLine type="added" prefix="+">
              const total = 0;
            </DiffLine>
            <DiffLine type="context" prefix=" ">
              for (let i = 0; i &lt; items.length; i++) {"{"}
            </DiffLine>
          </div>
        </section>

        <section>
          <SectionTitle>table_row</SectionTitle>
          <div className="mt-6">
            <TableRow>
              <TableRankCell>#1</TableRankCell>
              <TableScoreCell variant="bad">2.1</TableScoreCell>
              <TableCodeCell>
                function calculateTotal(items) {"{"} var total = 0; ...
              </TableCodeCell>
              <TableLangCell>javascript</TableLangCell>
            </TableRow>
          </div>
        </section>

        <section>
          <SectionTitle>navbar</SectionTitle>
          <div className="mt-6">
            <Navbar>
              <NavbarLogo>
                <span className="text-[20px] font-bold text-accent-green">
                  &gt;
                </span>
                <span className="text-[18px] font-medium text-text-primary">
                  devroast
                </span>
              </NavbarLogo>
              <NavbarSpacer />
              <NavbarLink>leaderboard</NavbarLink>
            </Navbar>
          </div>
        </section>

        <section>
          <SectionTitle>score_ring</SectionTitle>
          <div className="mt-6">
            <ScoreRing score={3.5} />
          </div>
        </section>
      </div>
    </div>
  );
}
