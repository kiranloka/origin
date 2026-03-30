import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { layoutWithLines, prepareWithSegments } from "@chenglou/pretext";
import mermaid from "mermaid";
import "./index.css";

type ManifestoBlock =
  | { kind: "hero"; eyebrow: string; title: string; dek: string }
  | { kind: "paragraph"; text: string; tone?: "default" | "impact" }
  | { kind: "section"; title: string }
  | { kind: "list"; items: string[] }
  | { kind: "diagram"; code: string; caption: string }
  | { kind: "cta"; title: string; text: string; action: string };

const MANIFESTO_BLOCKS: ManifestoBlock[] = [
  { kind: "hero", eyebrow: "Origin", title: "The Manifesto", dek: "Where intent becomes executable." },
  { kind: "paragraph", text: "Software is not written anymore." },
  { kind: "paragraph", text: "It is described." },
  { kind: "paragraph", text: 'But what we call "description" today is broken.' },
  {
    kind: "paragraph",
    text: "We sit in front of agents - Cursor, ChatGPT, Claude - and pretend this is intelligence.",
  },
  { kind: "paragraph", text: "It isn't. It's negotiation." },
  {
    kind: "paragraph",
    text: "You say something vague. The agent guesses. You correct it. It apologizes. You try again.",
  },
  {
    kind: "paragraph",
    text: "Three prompts later, five minutes later, thousands of tokens later - you finally get what you wanted.",
  },
  { kind: "paragraph", text: "This is not a model problem." },
  { kind: "paragraph", text: "This is an input problem." },
  { kind: "paragraph", text: "Agents don't fail because they're not smart." },
  { kind: "paragraph", text: "They fail because we give them incomplete intent." },
  {
    kind: "paragraph",
    text: "Natural language was never meant to be executable. It is ambiguous, lossy, and missing constraints.",
  },
  { kind: "paragraph", text: "So the model fills the gaps. And the gaps are where everything breaks." },
  { kind: "paragraph", tone: "impact", text: "60-70% of agent interaction is spent in clarification loops." },
  { kind: "paragraph", text: "Not because AI is weak." },
  { kind: "paragraph", text: "Because input is undefined." },
  { kind: "section", title: "The Lie" },
  { kind: "paragraph", text: 'We have been told: "Just prompt better."' },
  {
    kind: "paragraph",
    text: "So we iterate. We refine. We learn tricks. We become translators between thought and machine.",
  },
  { kind: "paragraph", text: "But this does not scale." },
  { kind: "paragraph", text: "Because thinking is not the bottleneck." },
  { kind: "paragraph", text: "Expression is." },
  { kind: "section", title: "The Shift" },
  { kind: "paragraph", text: "We do not need better prompts." },
  {
    kind: "paragraph",
    text: "We need a new layer where intent is complete, context is explicit, and constraints are defined before the agent ever runs.",
  },
  { kind: "section", title: "Origin" },
  { kind: "paragraph", text: "Origin is that layer." },
  {
    kind: "paragraph",
    text: "It takes what you mean - not just what you say - and turns it into something machines can execute.",
  },
  { kind: "paragraph", text: 'Before: "Add authentication."' },
  {
    kind: "list",
    items: [
      "Objective defined",
      "Requirements enumerated",
      "Constraints enforced",
      "Edge cases included",
      "Outputs specified",
    ],
  },
  { kind: "paragraph", text: "No guessing. No iteration. No back-and-forth." },
  { kind: "paragraph", text: "Just execution." },
  {
    kind: "diagram",
    code: `flowchart LR
  A[Human intent<br/>vague prompt] --> B[Agent guesses]
  B --> C[Correction loop]
  C --> D[Token burn + delay]
  E[Origin input layer] --> F[Executable intent spec]
  F --> G[Deterministic agent execution]
  D -.replaced by.-> G`,
    caption: "From prompt negotiation to intent execution.",
  },
  { kind: "section", title: "What Changes" },
  {
    kind: "paragraph",
    text: "With Origin, the agent stops behaving like a confused intern and starts behaving like a deterministic system.",
  },
  { kind: "list", items: ["First response lands", "Tokens drop by 60%+", "Time collapses from minutes to seconds"] },
  { kind: "paragraph", text: "This is not optimization." },
  { kind: "paragraph", text: "This is removing waste that should never exist." },
  { kind: "section", title: "The Deeper Truth" },
  { kind: "paragraph", text: "Every system in computing evolves toward structure." },
  {
    kind: "list",
    items: [
      "Assembly -> structured programming",
      "Scripts -> typed languages",
      "REST -> schemas",
      "Databases -> constraints",
    ],
  },
  { kind: "paragraph", text: "AI skipped that step." },
  { kind: "paragraph", text: 'We went straight to "just talk to it." That was always temporary.' },
  {
    kind: "diagram",
    code: `timeline
  title Computing converges to structure
  1940s : Assembly
  1970s : Structured Programming
  1990s : Typed + modular systems
  2000s : API schemas + contracts
  2020s : LLM prompting
  Next : Origin-style intent compilation`,
    caption: "The missing structural layer arrives now.",
  },
  { kind: "section", title: "What Comes Next" },
  { kind: "paragraph", text: "The future is not humans writing code." },
  { kind: "paragraph", text: "It is not even humans prompting AI." },
  { kind: "list", items: ["Humans defining intent", "Systems compiling intent", "Agents executing intent"] },
  { kind: "paragraph", text: "Origin sits in the middle." },
  { kind: "section", title: "Why Now" },
  { kind: "paragraph", text: "Agents are becoming the default interface." },
  {
    kind: "paragraph",
    text: "Developers are already feeling the friction. Iteration fatigue is real. Costs are invisible, but compounding.",
  },
  { kind: "paragraph", text: "And almost no one is fixing the root problem." },
  { kind: "section", title: "So We Are" },
  { kind: "list", items: ["Not a prompt tool", "Not an IDE plugin", "Not another layer of abstraction"] },
  { kind: "paragraph", text: "We are the input layer for the agentic era." },
  { kind: "section", title: "Closing" },
  { kind: "paragraph", text: "The biggest inefficiency in AI today is not computation." },
  { kind: "paragraph", text: "It is miscommunication." },
  { kind: "paragraph", text: "Fix the input, and everything downstream changes." },
  {
    kind: "cta",
    title: "Join Early",
    text: "Every agent stack will depend on this layer. Build with Origin first.",
    action: "Request Early Access",
  },
];

const TEXT_PRESETS = {
  heroEyebrow: { font: '600 13px "IBM Plex Sans"', lineHeight: 16 },
  heroTitle: { font: '700 56px "IBM Plex Sans"', lineHeight: 60 },
  heroDek: { font: '500 20px "IBM Plex Sans"', lineHeight: 26 },
  section: { font: '650 30px "IBM Plex Sans"', lineHeight: 34 },
  paragraph: { font: '500 20px "Newsreader"', lineHeight: 34 },
  impact: { font: '600 19px "IBM Plex Sans"', lineHeight: 28 },
  list: { font: '500 20px "Newsreader"', lineHeight: 34 },
  ctaTitle: { font: '650 30px "IBM Plex Sans"', lineHeight: 34 },
  ctaBody: { font: '500 20px "Newsreader"', lineHeight: 32 },
  figcaption: { font: '400 14px "IBM Plex Sans"', lineHeight: 20 },
} as const;

function PretextLines({
  text,
  className,
  font,
  lineHeight,
  style,
}: {
  text: string;
  className: string;
  font: string;
  lineHeight: number;
  style?: CSSProperties;
}) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const [width, setWidth] = useState(0);
  const [fontEpoch, setFontEpoch] = useState(0);

  useEffect(() => {
    const fonts = document.fonts;
    if (!fonts) return;
    let active = true;
    void fonts.ready.then(() => {
      if (active) setFontEpoch(value => value + 1);
    });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!hostRef.current) return;
    const target = hostRef.current;
    const observer = new ResizeObserver(entries => {
      const size = entries[0]?.contentRect.width ?? 0;
      setWidth(Math.max(0, Math.floor(size)));
    });
    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  const prepared = useMemo(() => prepareWithSegments(text, font), [text, font, fontEpoch]);

  const lines = useMemo(() => {
    if (width <= 0) return [text];
    return layoutWithLines(prepared, width, lineHeight).lines.map(line => line.text);
  }, [prepared, width, lineHeight, text]);

  return (
    <div className={className} ref={hostRef} style={style}>
      {lines.map((line, index) => (
        <span className="pretext-line" key={`${index}-${line.slice(0, 12)}`}>
          {line.length > 0 ? line : "\u00a0"}
        </span>
      ))}
    </div>
  );
}

function MermaidDiagram({ code, caption, style }: { code: string; caption: string; style?: CSSProperties }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function render() {
      try {
        const id = `mermaid-${Math.random().toString(36).slice(2)}`;
        const { svg } = await mermaid.render(id, code);
        if (!cancelled) {
          setSvg(svg);
          setError(null);
        }
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : String(e));
        }
      }
    }

    render();

    return () => {
      cancelled = true;
    };
  }, [code]);

  return (
    <figure className="diagram reveal" style={style}>
      <div ref={containerRef} dangerouslySetInnerHTML={{ __html: svg }} />
      {error && <div style={{ color: "red", fontSize: "12px" }}>Diagram error: {error}</div>}
      <PretextLines className="figcaption" text={caption} {...TEXT_PRESETS.figcaption} />
    </figure>
  );
}

export function App() {
  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: "base",
      securityLevel: "loose",
      themeVariables: {
        primaryColor: "#f4f5f6",
        primaryTextColor: "#111111",
        lineColor: "#202020",
        textColor: "#111111",
        fontFamily: "IBM Plex Sans, system-ui, sans-serif",
      },
    });
  }, []);

  return (
    <main className="page-shell">
      <article className="manifesto">
        {MANIFESTO_BLOCKS.map((block, blockIndex) => {
          const style = { "--stagger": String(blockIndex) } as CSSProperties;
          if (block.kind === "hero") {
            return (
              <header className="manifesto-hero reveal" style={style} key={`hero-${blockIndex}`}>
                <PretextLines className="hero-eyebrow" text={block.eyebrow} {...TEXT_PRESETS.heroEyebrow} />
                <PretextLines className="hero-title" text={block.title} {...TEXT_PRESETS.heroTitle} />
                <PretextLines className="hero-dek" text={block.dek} {...TEXT_PRESETS.heroDek} />
              </header>
            );
          }
          if (block.kind === "paragraph") {
            const preset = block.tone === "impact" ? TEXT_PRESETS.impact : TEXT_PRESETS.paragraph;
            const paragraphClass = block.tone === "impact" ? "impact reveal" : "manifesto-paragraph reveal";
            return (
              <PretextLines
                key={`paragraph-${blockIndex}`}
                className={paragraphClass}
                text={block.text}
                style={style}
                {...preset}
              />
            );
          }
          if (block.kind === "section") {
            return (
              <PretextLines
                key={`section-${blockIndex}`}
                className="manifesto-section reveal"
                style={style}
                text={block.title}
                {...TEXT_PRESETS.section}
              />
            );
          }
          if (block.kind === "list") {
            return (
              <ul className="manifesto-list reveal" style={style} key={`list-${blockIndex}`}>
                {block.items.map(item => (
                  <li key={item}>
                    <PretextLines className="manifesto-list-text" text={item} {...TEXT_PRESETS.list} />
                  </li>
                ))}
              </ul>
            );
          }
          if (block.kind === "diagram") {
            return (
              <MermaidDiagram
                key={`diagram-${blockIndex}`}
                code={block.code}
                caption={block.caption}
                style={style}
              />
            );
          }
          return (
            <section className="cta reveal" style={style} key={`cta-${blockIndex}`} id="join">
              <PretextLines className="cta-title" text={block.title} {...TEXT_PRESETS.ctaTitle} />
              <PretextLines className="cta-body" text={block.text} {...TEXT_PRESETS.ctaBody} />
              <a href="#join">{block.action}</a>
            </section>
          );
        })}
      </article>
    </main>
  );
}

export default App;
