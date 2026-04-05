import ReactMarkdown from "react-markdown";

type Skill = { skill_content: string } | null;
type Participant = { brand_colors?: string | null } | null;

export function StepSkill({
  skill,
  participant,
}: {
  skill: Skill;
  participant: Participant;
}) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6" id="step-2">
      <h3 className="text-lg font-semibold text-zinc-200 flex items-center gap-2 mb-4">
        <span>✨</span> שלב 2: הסקיל שלך
      </h3>

      {skill ? (
        <div className="space-y-4">
          {participant?.brand_colors && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-zinc-400">צבעי מותג:</span>
              <div className="flex gap-1">
                {participant.brand_colors.split(",").map((color: string, i: number) => (
                  <div
                    key={i}
                    className="w-6 h-6 rounded-full border border-zinc-700"
                    style={{ backgroundColor: color.trim() }}
                  />
                ))}
              </div>
            </div>
          )}

          <div className="bg-zinc-800/50 rounded-lg p-4 prose prose-invert prose-sm max-w-none">
            <ReactMarkdown>{skill.skill_content}</ReactMarkdown>
          </div>
        </div>
      ) : (
        <div className="bg-zinc-800/50 rounded-lg p-8 text-center">
          <p className="text-zinc-400">
            הסקיל שלך ייווצר אוטומטית אחרי שתמלא את טופס הבריף העסקי
          </p>
          <p className="text-zinc-500 text-sm mt-2">
            <a href="/brief" className="text-blue-400 hover:underline">מלא את הטופס כאן</a>
          </p>
        </div>
      )}
    </div>
  );
}
