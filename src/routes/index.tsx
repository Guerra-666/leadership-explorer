import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import logo from "@/assets/cuh-logo.png";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Test de Liderazgo — CUH" },
      {
        name: "description",
        content:
          "Descubre tu estilo de liderazgo con el test oficial del Centro Universitario Hidalguense.",
      },
    ],
  }),
  component: LeadershipTest,
});

type LeaderType =
  | "Coercitivo"
  | "Visionario"
  | "Afiliativo"
  | "Democrático"
  | "Marcapasos"
  | "Coach";

const SCALE: { label: string; short: string; value: number }[] = [
  { label: "Nunca", short: "N", value: 1 },
  { label: "Rara vez", short: "RV", value: 2 },
  { label: "A veces", short: "AV", value: 3 },
  { label: "Frecuentemente", short: "F", value: 4 },
  { label: "Siempre", short: "S", value: 5 },
];

const QUESTIONS: { type: LeaderType; text: string }[] = [
  { type: "Coercitivo", text: "Me desespera perder tiempo escuchando demasiadas opiniones." },
  { type: "Visionario", text: "Me gusta inspirar a otros con metas claras." },
  { type: "Afiliativo", text: "Me preocupo por el bienestar emocional del equipo." },
  { type: "Democrático", text: "Me gusta escuchar ideas antes de tomar decisiones." },
  { type: "Marcapasos", text: "Tengo estándares muy altos para mí y para los demás." },
  { type: "Coach", text: "Me gusta ayudar a otros a desarrollar su potencial." },
  { type: "Coercitivo", text: "Prefiero tomar el control rápidamente cuando algo sale mal." },
  { type: "Visionario", text: "Intento que las personas entiendan el propósito de lo que hacen." },
  { type: "Afiliativo", text: "Intento evitar conflictos innecesarios entre personas." },
  { type: "Democrático", text: "Creo que todos deben participar en los acuerdos importantes." },
  { type: "Marcapasos", text: "Me cuesta trabajar con personas que avanzan lento." },
  { type: "Coach", text: "Disfruto enseñar y orientar a las personas." },
  { type: "Coercitivo", text: "Me enfoco mucho en obtener resultados inmediatos." },
  { type: "Visionario", text: "Disfruto motivar equipos hacia una visión futura." },
  { type: "Afiliativo", text: "Busco generar un ambiente positivo y de confianza." },
  { type: "Democrático", text: "Busco que las personas expresen su opinión libremente." },
  { type: "Marcapasos", text: "Me gusta que las cosas salgan bien desde el primer intento." },
  { type: "Coach", text: "Intento dar retroalimentación para ayudar a mejorar." },
  { type: "Coercitivo", text: "Cuando hay presión, suelo dar instrucciones directas y firmes." },
  { type: "Visionario", text: "Me gusta transmitir entusiasmo cuando trabajo con otros." },
  { type: "Afiliativo", text: "Prefiero cuidar las relaciones antes que imponer autoridad." },
  { type: "Democrático", text: "Prefiero construir soluciones en conjunto." },
  { type: "Marcapasos", text: "Normalmente exijo mucho compromiso y rapidez." },
  { type: "Coach", text: "Me interesa que las personas crezcan profesionalmente." },
];

const TYPES: LeaderType[] = [
  "Coercitivo",
  "Visionario",
  "Afiliativo",
  "Democrático",
  "Marcapasos",
  "Coach",
];

const DESCRIPTIONS: Record<
  LeaderType,
  { tagline: string; essence: string; traits: string[] }
> = {
  Coercitivo: {
    tagline: "Decisión, control y acción inmediata.",
    essence:
      "Lideras desde la firmeza. Cuando otros dudan, tú decides; cuando otros analizan, tú actúas.",
    traits: [
      "Toma decisiones rápidas bajo presión.",
      "Comunica instrucciones claras y firmes.",
      "Mantiene el control en situaciones de crisis.",
      "Prioriza resultados inmediatos sobre el consenso.",
    ],
  },
  Visionario: {
    tagline: "Inspiración, propósito y dirección clara.",
    essence:
      "Tu liderazgo se sostiene en el futuro. Conectas a las personas con un porqué más grande que la tarea.",
    traits: [
      "Transmite entusiasmo y sentido de propósito.",
      "Comunica una visión clara del futuro.",
      "Motiva al equipo hacia metas ambiciosas.",
      "Conecta el trabajo diario con un objetivo mayor.",
    ],
  },
  Afiliativo: {
    tagline: "Personas, vínculos y armonía.",
    essence:
      "Diriges cuidando a las personas. Construyes equipos donde se trabaja mejor porque se está mejor.",
    traits: [
      "Construye relaciones de confianza.",
      "Cuida el bienestar emocional del equipo.",
      "Evita conflictos innecesarios.",
      "Fomenta un ambiente positivo y armónico.",
    ],
  },
  Democrático: {
    tagline: "Participación, escucha y consenso.",
    essence:
      "Tu fuerza está en la conversación. Las decisiones cobran sentido cuando todos se sienten parte.",
    traits: [
      "Valora todas las opiniones antes de decidir.",
      "Construye acuerdos en conjunto.",
      "Promueve la libre expresión de ideas.",
      "Genera compromiso a través de la participación.",
    ],
  },
  Marcapasos: {
    tagline: "Excelencia, ritmo y altos estándares.",
    essence:
      "Lideras con el ejemplo. Pones el listón alto y esperas que el equipo se eleve para alcanzarlo.",
    traits: [
      "Pone el ejemplo con excelencia personal.",
      "Mantiene estándares muy altos de calidad.",
      "Exige compromiso y rapidez al equipo.",
      "Busca que todo salga bien desde el primer intento.",
    ],
  },
  Coach: {
    tagline: "Desarrollo, mentoría y crecimiento.",
    essence:
      "Lideras formando a otros. Tu mayor logro es ver crecer a las personas que acompañas.",
    traits: [
      "Acompaña el crecimiento profesional del equipo.",
      "Da retroalimentación constructiva y oportuna.",
      "Enseña, orienta y guía con paciencia.",
      "Invierte tiempo en el desarrollo a largo plazo.",
    ],
  },
};

type Step = "intro" | "page1" | "page2" | "result";

function LeadershipTest() {
  const [step, setStep] = useState<Step>("intro");
  const [name, setName] = useState("");
  const [answers, setAnswers] = useState<Record<number, number>>({});

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [step]);

  const setAnswer = (i: number, v: number) =>
    setAnswers((prev) => ({ ...prev, [i]: v }));

  const allAnsweredIn = (from: number, to: number) =>
    Array.from({ length: to - from }, (_, i) => i + from).every(
      (i) => answers[i] !== undefined,
    );

  const computeTotals = (): Record<LeaderType, number> => {
    const totals = {
      Coercitivo: 0,
      Visionario: 0,
      Afiliativo: 0,
      Democrático: 0,
      Marcapasos: 0,
      Coach: 0,
    } as Record<LeaderType, number>;
    QUESTIONS.forEach((q, i) => {
      totals[q.type] += answers[i] ?? 0;
    });
    return totals;
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans antialiased">
      <SiteHeader />

      <main className="mx-auto w-full max-w-3xl px-4 pb-16 pt-6 sm:px-6 sm:pt-10">
        {step === "intro" && (
          <Intro name={name} setName={setName} onStart={() => setStep("page1")} />
        )}

        {step === "page1" && (
          <QuestionPage
            sectionIndex={1}
            from={0}
            to={12}
            answers={answers}
            setAnswer={setAnswer}
            onBack={() => setStep("intro")}
            onNext={() => setStep("page2")}
            canContinue={allAnsweredIn(0, 12)}
            nextLabel="Continuar"
          />
        )}

        {step === "page2" && (
          <QuestionPage
            sectionIndex={2}
            from={12}
            to={24}
            answers={answers}
            setAnswer={setAnswer}
            onBack={() => setStep("page1")}
            onNext={() => setStep("result")}
            canContinue={allAnsweredIn(12, 24)}
            nextLabel="Ver resultado"
          />
        )}

        {step === "result" && (
          <Result
            name={name}
            totals={computeTotals()}
            onRestart={() => {
              setAnswers({});
              setName("");
              setStep("intro");
            }}
          />
        )}
      </main>

      <footer className="border-t border-border bg-card">
        <div className="mx-auto max-w-3xl px-4 py-6 text-center text-xs text-muted-foreground sm:px-6">
          © {new Date().getFullYear()} Centro Universitario Hidalguense · Test de Liderazgo
        </div>
      </footer>
    </div>
  );
}

function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-card/90 backdrop-blur">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3 sm:px-6 sm:py-4">
        <img
          src={logo}
          alt="Centro Universitario Hidalguense"
          className="h-9 w-auto sm:h-11"
        />
        <div className="text-right">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-primary sm:text-xs">
            Liderazgo
          </p>
          <p className="text-[10px] text-muted-foreground sm:text-xs">Evaluación CUH</p>
        </div>
      </div>
    </header>
  );
}

function Intro({
  name,
  setName,
  onStart,
}: {
  name: string;
  setName: (v: string) => void;
  onStart: () => void;
}) {
  const trimmed = name.trim();
  return (
    <section className="relative overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
      <div className="absolute inset-x-0 top-0 h-1.5 bg-primary" />
      <div className="px-6 py-10 sm:px-12 sm:py-14">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
          Test de Liderazgo
        </p>
        <h1 className="mt-3 font-display text-4xl font-semibold leading-[1.05] tracking-tight text-foreground sm:text-5xl md:text-6xl">
          Descubre el líder
          <br />
          <span className="italic text-primary">que ya eres.</span>
        </h1>
        <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          Una evaluación breve de <span className="font-medium text-foreground">24 afirmaciones</span>{" "}
          para identificar tu estilo predominante de liderazgo entre seis perfiles reconocidos.
          Honestidad por encima de respuestas ideales.
        </p>

        <div className="mt-8 grid grid-cols-3 gap-3 sm:gap-6">
          <Stat label="Preguntas" value="24" />
          <Stat label="Secciones" value="2" />
          <Stat label="Minutos" value="≈5" />
        </div>

        <div className="mt-10 space-y-3">
          <Label htmlFor="name" className="text-sm font-medium text-foreground">
            ¿Cuál es tu nombre?
          </Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Escribe tu nombre completo"
            className="h-14 rounded-xl border-border bg-background text-base"
            onKeyDown={(e) => {
              if (e.key === "Enter" && trimmed) onStart();
            }}
            autoFocus
          />
        </div>

        <Button
          size="lg"
          disabled={!trimmed}
          onClick={onStart}
          className="mt-6 h-14 w-full rounded-xl text-base font-semibold sm:w-auto sm:px-10"
        >
          Comenzar el test →
        </Button>
      </div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-secondary/60 px-3 py-4 text-center sm:px-4 sm:py-5">
      <p className="font-display text-2xl font-semibold text-primary sm:text-3xl">{value}</p>
      <p className="mt-1 text-[10px] font-medium uppercase tracking-widest text-muted-foreground sm:text-xs">
        {label}
      </p>
    </div>
  );
}

function QuestionPage({
  sectionIndex,
  from,
  to,
  answers,
  setAnswer,
  onBack,
  onNext,
  canContinue,
  nextLabel,
}: {
  sectionIndex: 1 | 2;
  from: number;
  to: number;
  answers: Record<number, number>;
  setAnswer: (i: number, v: number) => void;
  onBack: () => void;
  onNext: () => void;
  canContinue: boolean;
  nextLabel: string;
}) {
  const answeredInSection = Array.from({ length: to - from }, (_, i) => i + from).filter(
    (i) => answers[i] !== undefined,
  ).length;
  const totalInSection = to - from;

  return (
    <section className="space-y-6">
      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-primary sm:text-xs">
              Sección {sectionIndex} de 2
            </p>
            <h2 className="mt-1 font-display text-2xl font-semibold tracking-tight sm:text-3xl">
              {sectionIndex === 1
                ? "Comencemos por lo esencial"
                : "Última parte, casi listo"}
            </h2>
          </div>
          <div className="text-right">
            <p className="font-display text-2xl font-semibold text-primary sm:text-3xl">
              {answeredInSection}
              <span className="text-muted-foreground">/{totalInSection}</span>
            </p>
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground sm:text-xs">
              respondidas
            </p>
          </div>
        </div>
        <div className="mt-5 h-2 w-full overflow-hidden rounded-full bg-secondary">
          <div
            className="h-full rounded-full bg-primary transition-all duration-500"
            style={{ width: `${(answeredInSection / totalInSection) * 100}%` }}
          />
        </div>
      </div>

      <ol className="space-y-4">
        {QUESTIONS.slice(from, to).map((q, idx) => {
          const i = from + idx;
          return (
            <li
              key={i}
              className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex items-start gap-4 px-5 pt-5 sm:px-7 sm:pt-6">
                <span className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-primary font-display text-sm font-semibold text-primary-foreground">
                  {i + 1}
                </span>
                <p className="pt-1 text-[15px] font-medium leading-relaxed text-foreground sm:text-base">
                  {q.text}
                </p>
              </div>

              <div
                role="radiogroup"
                aria-label={`Pregunta ${i + 1}`}
                className="mt-5 flex flex-col gap-2 border-t border-border bg-secondary/40 p-3 sm:grid sm:grid-cols-5 sm:gap-2 sm:p-4"
              >
                {SCALE.map((s) => {
                  const selected = answers[i] === s.value;
                  return (
                    <button
                      key={s.value}
                      type="button"
                      role="radio"
                      aria-checked={selected}
                      onClick={() => setAnswer(i, s.value)}
                      className={[
                        "group flex w-full flex-row items-center gap-3 rounded-xl border-2 px-4 py-3 transition-all sm:flex-col sm:items-center sm:gap-2 sm:px-1 sm:py-3",
                        selected
                          ? "border-primary bg-primary text-primary-foreground shadow-sm"
                          : "border-transparent bg-card text-muted-foreground hover:border-primary/30 hover:bg-accent/40",
                      ].join(" ")}
                    >
                      <span
                        className={[
                          "flex h-5 w-5 flex-none items-center justify-center rounded-md border-2 transition-colors",
                          selected
                            ? "border-primary-foreground bg-primary-foreground text-primary"
                            : "border-muted-foreground/40 bg-background",
                        ].join(" ")}
                        aria-hidden
                      >
                        {selected && (
                          <svg
                            viewBox="0 0 20 20"
                            className="h-3.5 w-3.5"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                          >
                            <path
                              d="M4 10l4 4 8-8"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        )}
                      </span>
                      <span
                        className={[
                          "text-sm font-semibold leading-tight sm:text-center sm:text-[11px]",
                          selected ? "text-primary-foreground" : "",
                        ].join(" ")}
                      >
                        {s.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </li>
          );
        })}
      </ol>

      {/* Inline action row (desktop) */}
      <div className="hidden items-center justify-between gap-3 sm:flex">
        <Button variant="outline" size="lg" onClick={onBack} className="h-12 rounded-xl">
          ← Atrás
        </Button>
        <Button
          size="lg"
          onClick={onNext}
          disabled={!canContinue}
          className="h-12 rounded-xl px-8 font-semibold"
        >
          {nextLabel} →
        </Button>
      </div>

      {/* Sticky bottom bar (mobile) */}
      <div className="sticky bottom-0 -mx-4 border-t border-border bg-card/95 px-4 py-3 backdrop-blur sm:hidden">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={onBack}
            className="h-12 flex-1 rounded-xl text-sm"
          >
            Atrás
          </Button>
          <Button
            onClick={onNext}
            disabled={!canContinue}
            className="h-12 flex-[2] rounded-xl text-sm font-semibold"
          >
            {canContinue ? `${nextLabel} →` : `Responde ${totalInSection - answeredInSection} más`}
          </Button>
        </div>
      </div>
    </section>
  );
}

function Result({
  name,
  totals,
  onRestart,
}: {
  name: string;
  totals: Record<LeaderType, number>;
  onRestart: () => void;
}) {
  const ranked = (Object.entries(totals) as [LeaderType, number][]).sort(
    (a, b) => b[1] - a[1],
  );
  const max = ranked[0][1] || 1;
  const winners = ranked.filter(([_, score]) => score === max).map(([type]) => type);
  const isTie = winners.length > 1;
  const firstName = name.trim().split(/\s+/)[0];

  return (
    <section className="space-y-6">
      {/* Hero card */}
      <article className="relative overflow-hidden rounded-3xl border border-border bg-primary text-primary-foreground shadow-sm">
        <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-primary-foreground/5" />
        <div className="absolute -bottom-20 -left-10 h-56 w-56 rounded-full bg-primary-foreground/5" />

        <div className="relative px-6 py-10 sm:px-12 sm:py-14">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary-foreground/70">
            Resultado · {firstName}
          </p>
          <p className="mt-6 font-display text-base italic text-primary-foreground/80 sm:text-lg">
            {isTie ? "Tus tipos de liderazgo son" : "Tu tipo de liderazgo es"}
          </p>
          <div className="mt-3 space-y-2">
            {winners.map((w, i) => (
              <h1
                key={w}
                className="font-display text-4xl font-semibold leading-[1.1] tracking-tight sm:text-6xl"
              >
                {isTie && <span className="mr-2 text-primary-foreground/50">{i + 1}.</span>}
                {w}
              </h1>
            ))}
          </div>

          {isTie ? (
            <p className="mt-5 max-w-xl text-base leading-relaxed text-primary-foreground/90 sm:text-lg">
              Obtuviste la misma puntuación en {winners.length} perfiles. Esto significa que combinas
              fortalezas de distintos estilos y puedes adaptar tu liderazgo según el contexto.
            </p>
          ) : (
            <p className="mt-5 max-w-xl text-base leading-relaxed text-primary-foreground/90 sm:text-lg">
              {DESCRIPTIONS[winners[0]].essence}
            </p>
          )}

          <div className="mt-8 flex flex-wrap gap-2">
            {winners.map((w) => (
              <div
                key={w}
                className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/20 bg-primary-foreground/10 px-4 py-2 text-xs font-medium uppercase tracking-widest"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-primary-foreground" />
                {DESCRIPTIONS[w].tagline}
              </div>
            ))}
          </div>
        </div>
      </article>

      {/* Per-winner traits */}
      {winners.map((w) => (
        <article
          key={w}
          className="rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-10"
        >
          <h2 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
            {w}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {DESCRIPTIONS[w].tagline}
          </p>
          <p className="mt-3 max-w-xl text-base leading-relaxed text-muted-foreground">
            {DESCRIPTIONS[w].essence}
          </p>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {DESCRIPTIONS[w].traits.map((t, i) => (
              <li
                key={t}
                className="flex items-start gap-3 rounded-2xl border border-border bg-secondary/50 p-4"
              >
                <span className="flex h-7 w-7 flex-none items-center justify-center rounded-lg bg-primary font-display text-xs font-semibold text-primary-foreground">
                  {i + 1}
                </span>
                <span className="pt-1 text-sm leading-relaxed text-foreground sm:text-[15px]">
                  {t}
                </span>
              </li>
            ))}
          </ul>
        </article>
      ))}

      {/* Score breakdown */}
      <article className="rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-10">
        <h2 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
          Tu perfil completo
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Puntuación obtenida en cada uno de los seis estilos.
        </p>
        <ul className="mt-6 space-y-4">
          {TYPES.map((t) => {
            const score = totals[t];
            const pct = (score / max) * 100;
            const isWinner = winners.includes(t);
            return (
              <li key={t}>
                <div className="mb-1.5 flex items-baseline justify-between">
                  <span
                    className={[
                      "text-sm font-semibold sm:text-base",
                      isWinner ? "text-primary" : "text-foreground",
                    ].join(" ")}
                  >
                    {t}
                  </span>
                  <span className="font-display text-sm tabular-nums text-muted-foreground sm:text-base">
                    {score} <span className="text-xs">pts</span>
                  </span>
                </div>
                <div className="h-2.5 w-full overflow-hidden rounded-full bg-secondary">
                  <div
                    className={[
                      "h-full rounded-full transition-all duration-700",
                      isWinner ? "bg-primary" : "bg-muted-foreground/40",
                    ].join(" ")}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      </article>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Button
          variant="outline"
          size="lg"
          onClick={onRestart}
          className="h-12 rounded-xl"
        >
          Realizar otro test
        </Button>
      </div>
    </section>
  );
}
