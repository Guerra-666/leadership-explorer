import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import logo from "@/assets/cuh-logo.png";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Test de Liderazgo — CUH" },
      { name: "description", content: "Descubre tu tipo de liderazgo con el Test del Centro Universitario Hidalguense." },
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

const SCALE: { label: string; value: number }[] = [
  { label: "Nunca", value: 1 },
  { label: "Rara vez", value: 2 },
  { label: "A veces", value: 3 },
  { label: "Frecuentemente", value: 4 },
  { label: "Siempre", value: 5 },
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

const DESCRIPTIONS: Record<LeaderType, { tagline: string; traits: string[] }> = {
  Coercitivo: {
    tagline: "Líder directo, decidido y orientado a la acción inmediata.",
    traits: [
      "Toma decisiones rápidas bajo presión.",
      "Comunica instrucciones claras y firmes.",
      "Mantiene el control en situaciones de crisis.",
      "Prioriza resultados inmediatos sobre el consenso.",
    ],
  },
  Visionario: {
    tagline: "Líder inspirador que guía con propósito y dirección clara.",
    traits: [
      "Transmite entusiasmo y sentido de propósito.",
      "Comunica una visión clara del futuro.",
      "Motiva al equipo hacia metas ambiciosas.",
      "Conecta el trabajo diario con un objetivo mayor.",
    ],
  },
  Afiliativo: {
    tagline: "Líder cercano que prioriza las personas y el ambiente del equipo.",
    traits: [
      "Construye relaciones de confianza.",
      "Cuida el bienestar emocional del equipo.",
      "Evita conflictos innecesarios.",
      "Fomenta un ambiente positivo y armónico.",
    ],
  },
  Democrático: {
    tagline: "Líder participativo que decide escuchando al equipo.",
    traits: [
      "Valora todas las opiniones antes de decidir.",
      "Construye acuerdos en conjunto.",
      "Promueve la libre expresión de ideas.",
      "Genera compromiso a través de la participación.",
    ],
  },
  Marcapasos: {
    tagline: "Líder exigente que marca el ritmo con altos estándares.",
    traits: [
      "Pone el ejemplo con excelencia personal.",
      "Mantiene estándares muy altos de calidad.",
      "Exige compromiso y rapidez al equipo.",
      "Busca que todo salga bien desde el primer intento.",
    ],
  },
  Coach: {
    tagline: "Líder formador que desarrolla el potencial de cada persona.",
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

  const setAnswer = (i: number, v: number) =>
    setAnswers((prev) => ({ ...prev, [i]: v }));

  const page1Range = [0, 12] as const;
  const page2Range = [12, 24] as const;

  const allAnsweredIn = (from: number, to: number) =>
    Array.from({ length: to - from }, (_, i) => i + from).every(
      (i) => answers[i] !== undefined,
    );

  const computeResult = (): LeaderType => {
    const totals: Record<LeaderType, number> = {
      Coercitivo: 0,
      Visionario: 0,
      Afiliativo: 0,
      Democrático: 0,
      Marcapasos: 0,
      Coach: 0,
    };
    QUESTIONS.forEach((q, i) => {
      totals[q.type] += answers[i] ?? 0;
    });
    return (Object.entries(totals) as [LeaderType, number][]).sort(
      (a, b) => b[1] - a[1],
    )[0][0];
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <img src={logo} alt="Centro Universitario Hidalguense" className="h-12 w-auto" />
          <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Test de Liderazgo
          </span>
        </div>
      </header>

      <section className="mx-auto max-w-3xl px-6 py-12 sm:py-16">
        {step === "intro" && (
          <Intro name={name} setName={setName} onStart={() => setStep("page1")} />
        )}

        {step === "page1" && (
          <QuestionPage
            title="Sección 1 de 2"
            subtitle="Responde con honestidad. No hay respuestas correctas."
            from={page1Range[0]}
            to={page1Range[1]}
            answers={answers}
            setAnswer={setAnswer}
            onBack={() => setStep("intro")}
            onNext={() => setStep("page2")}
            canContinue={allAnsweredIn(...page1Range)}
            progress={Object.keys(answers).length}
          />
        )}

        {step === "page2" && (
          <QuestionPage
            title="Sección 2 de 2"
            subtitle="Última parte. Estás por descubrir tu estilo."
            from={page2Range[0]}
            to={page2Range[1]}
            answers={answers}
            setAnswer={setAnswer}
            onBack={() => setStep("page1")}
            onNext={() => setStep("result")}
            canContinue={allAnsweredIn(...page2Range)}
            progress={Object.keys(answers).length}
            finishLabel="Ver resultado"
          />
        )}

        {step === "result" && (
          <Result
            name={name}
            type={computeResult()}
            onRestart={() => {
              setAnswers({});
              setName("");
              setStep("intro");
            }}
          />
        )}
      </section>

      <footer className="border-t border-border py-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Centro Universitario Hidalguense
      </footer>
    </main>
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
    <div className="rounded-xl border border-border bg-card p-8 sm:p-12 shadow-sm">
      <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-foreground">
        Descubre tu tipo de liderazgo
      </h1>
      <p className="mt-4 text-base text-muted-foreground leading-relaxed">
        Este test consta de <span className="font-medium text-foreground">24 afirmaciones</span> divididas
        en dos secciones. Selecciona la opción que mejor describa tu comportamiento habitual.
        Toma aproximadamente 5 minutos.
      </p>

      <div className="mt-8 space-y-2">
        <Label htmlFor="name" className="text-sm font-medium">
          Nombre completo
        </Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Escribe tu nombre"
          className="h-12 text-base"
          onKeyDown={(e) => {
            if (e.key === "Enter" && trimmed) onStart();
          }}
        />
      </div>

      <div className="mt-8 flex justify-end">
        <Button
          size="lg"
          disabled={!trimmed}
          onClick={onStart}
          className="h-12 px-8 text-base"
        >
          Comenzar test
        </Button>
      </div>
    </div>
  );
}

function QuestionPage({
  title,
  subtitle,
  from,
  to,
  answers,
  setAnswer,
  onBack,
  onNext,
  canContinue,
  progress,
  finishLabel = "Siguiente",
}: {
  title: string;
  subtitle: string;
  from: number;
  to: number;
  answers: Record<number, number>;
  setAnswer: (i: number, v: number) => void;
  onBack: () => void;
  onNext: () => void;
  canContinue: boolean;
  progress: number;
  finishLabel?: string;
}) {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">{title}</p>
        <h2 className="mt-2 text-2xl sm:text-3xl font-semibold tracking-tight">{subtitle}</h2>
        <div className="mt-4 h-1.5 w-full rounded-full bg-muted">
          <div
            className="h-1.5 rounded-full bg-primary transition-all"
            style={{ width: `${(progress / 24) * 100}%` }}
          />
        </div>
        <p className="mt-2 text-xs text-muted-foreground">{progress} / 24 respondidas</p>
      </div>

      <ol className="space-y-4">
        {QUESTIONS.slice(from, to).map((q, idx) => {
          const i = from + idx;
          return (
            <li
              key={i}
              className="rounded-xl border border-border bg-card p-5 sm:p-6 shadow-sm"
            >
              <div className="flex items-start gap-3">
                <span className="mt-0.5 flex h-7 w-7 flex-none items-center justify-center rounded-md bg-secondary text-sm font-semibold text-secondary-foreground">
                  {i + 1}
                </span>
                <p className="text-base leading-relaxed text-foreground">{q.text}</p>
              </div>

              <div
                role="radiogroup"
                aria-label={`Pregunta ${i + 1}`}
                className="mt-5 grid grid-cols-5 gap-2"
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
                        "group flex flex-col items-center gap-2 rounded-lg border p-2 sm:p-3 transition-colors",
                        selected
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-background hover:border-primary hover:bg-accent",
                      ].join(" ")}
                    >
                      <span
                        className={[
                          "flex h-5 w-5 items-center justify-center rounded border-2 transition-colors",
                          selected
                            ? "border-primary-foreground bg-primary-foreground"
                            : "border-muted-foreground/40 bg-background",
                        ].join(" ")}
                      >
                        {selected && (
                          <svg
                            viewBox="0 0 20 20"
                            className="h-3 w-3 text-primary"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                          >
                            <path d="M4 10l4 4 8-8" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </span>
                      <span
                        className={[
                          "text-[11px] sm:text-xs font-medium text-center leading-tight",
                          selected ? "text-primary-foreground" : "text-muted-foreground",
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

      <div className="flex items-center justify-between gap-4 pt-2">
        <Button variant="outline" size="lg" onClick={onBack} className="h-12">
          Atrás
        </Button>
        <Button
          size="lg"
          onClick={() => {
            onNext();
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          disabled={!canContinue}
          className="h-12 px-8"
        >
          {finishLabel}
        </Button>
      </div>
    </div>
  );
}

function Result({
  name,
  type,
  onRestart,
}: {
  name: string;
  type: LeaderType;
  onRestart: () => void;
}) {
  const info = DESCRIPTIONS[type];
  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-border bg-card p-8 sm:p-12 shadow-sm">
        <p className="text-sm text-muted-foreground">{name}</p>
        <p className="mt-6 text-sm font-medium uppercase tracking-widest text-primary">
          Tu tipo de liderazgo es
        </p>
        <h1 className="mt-2 text-4xl sm:text-5xl font-semibold tracking-tight text-primary">
          {type}
        </h1>
        <p className="mt-4 text-base text-muted-foreground leading-relaxed">{info.tagline}</p>
      </div>

      <div className="rounded-xl border border-border bg-card p-8 shadow-sm">
        <h2 className="text-lg font-semibold tracking-tight">Características</h2>
        <ul className="mt-4 space-y-3">
          {info.traits.map((t) => (
            <li key={t} className="flex items-start gap-3 text-sm sm:text-base text-foreground">
              <span className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-primary" />
              <span className="leading-relaxed">{t}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex justify-end">
        <Button variant="outline" size="lg" onClick={onRestart} className="h-12">
          Realizar otro test
        </Button>
      </div>
    </div>
  );
}
