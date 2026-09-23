import { useState } from "react";
import exercises from "./exercises.json";

function App() {
  const [showHome, setShowHome] = useState(true);   
  const [showReviewMenu, setShowReviewMenu] = useState(false);
  const [showFoundations, setShowFoundations] = useState(false);

  // NEW: Foundations slide index
  const [foundationSlide, setFoundationSlide] = useState(0);

  const [index, setIndex] = useState(0);
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);

  // DFA trace system
  const [trace, setTrace] = useState<string[]>([]);
  const [showTrace, setShowTrace] = useState(false);

  // Progress counters
  const [correctCount, setCorrectCount] = useState(0);
  const [streak, setStreak] = useState(0);
  const [alreadyCorrect, setAlreadyCorrect] = useState(false);

  // Load sounds
  const correctSound = new Audio("/sounds/correct.mp3");
  const wrongSound = new Audio("/sounds/wrong.mp3");

  const exercise = exercises[index];

  // --------------------------
  // FOUNDATIONS MODULE SLIDES
  // --------------------------
  const foundationSlides = [
    {
      title: "Alphabet (Σ)",
      body: `
An **alphabet** Σ is a finite, non-empty set of symbols.

Examples:
• Σ = {0, 1}
• Σ = {a, b, c}

All strings and languages come from Σ.
`
    },
    {
      title: "Strings",
      body: `
A **string** is a finite sequence of symbols from Σ.

Examples over Σ = {0,1}:
• 0
• 01
• 1100

Order matters!
`
    },
    {
      title: "Empty String (ε)",
      body: `
The **empty string**, ε, contains NO symbols.

• |ε| = 0
• εx = xε = x

ε is ALWAYS in Σ*.
`
    },
    {
      title: "String Length |w|",
      body: `
The **length** of a string w is the number of symbols in it.

Examples:
• |ε| = 0
• |010| = 3
• |1111| = 4
`
    },
    {
      title: "Concatenation",
      body: `
Concatenation joins strings end-to-end.

Examples:
• "0" + "1" = "01"
• "01" + "1" = "011"
• ε + "100" = "100"
`
    },
    {
      title: "Kleene Star (Σ*)",
      body: `
Σ* is the set of ALL strings over Σ, including ε.

Example if Σ = {0,1}:
Σ* = {ε, 0, 1, 00, 01, 10, 11, ...}
`
    },
    {
      title: "Kleene Plus (Σ+)",
      body: `
Σ+ is like Σ* EXCEPT ε is NOT included.

So:
Σ* = Σ+ ∪ {ε}
`
    },
    {
      title: "What Is a Language?",
      body: `
A **language** is a set of strings over Σ.

Examples:
• L = strings ending in 0
• L = strings with exactly two 1s

L ⊆ Σ*
`
    },
    {
      title: "Formal DFA Definition",
      body: `
A DFA is a 5-tuple:

⟨Q, Σ, δ, q₀, F⟩

Where:
• Q = states
• Σ = alphabet
• δ = transition function
• q₀ = start state
• F = accepting states
`
    },
    {
      title: "Transition Function δ",
      body: `
δ(q, a) = next state when in state q reading symbol a.

Example:
δ(q0, 1) = q2
`
    },
    {
      title: "Accepting vs Rejecting",
      body: `
A DFA **accepts** w if the final state is in F.

Otherwise it **rejects** w.
`
    }
  ];

  // --------------------------
  // CHECK DFA
  // --------------------------
  function checkDFA() {
    const dfa = exercise.dfa;
    let state = dfa.start;

    for (const ch of input) {
      if (!dfa.alphabet.includes(ch)) {
        setResult("Invalid character: " + ch);
        return;
      }
      state = dfa.transitions[state][ch];
    }

    if (dfa.accept.includes(state)) {
      setResult("ACCEPTED ✔");

      if (!alreadyCorrect) {
        correctSound.play();
        setCorrectCount(correctCount + 1);
        setStreak(streak + 1);
        setAlreadyCorrect(true);
      }

    } else {
      wrongSound.play();
      setResult("REJECTED ✘");
      setStreak(0);
    }
  }

  // --------------------------
  // TRACE DFA
  // --------------------------
  function traceDFA() {
    const dfa = exercise.dfa;
    let state = dfa.start;
    const steps: string[] = [];

    steps.push(`Start at state: ${state}`);

    for (const ch of input) {
      if (!dfa.alphabet.includes(ch)) {
        steps.push(`Invalid character: ${ch}`);
        setTrace(steps);
        setShowTrace(true);
        return;
      }

      const next = dfa.transitions[state][ch];
      steps.push(`${state} --${ch}--> ${next}`);
      state = next;
    }

    if (dfa.accept.includes(state)) {
      steps.push(`Final state ${state} is ACCEPTING ✔`);
    } else {
      steps.push(`Final state ${state} is REJECTING ✘`);
    }

    setTrace(steps);
    setShowTrace(true);
  }

  // --------------------------
  // RESET
  // --------------------------
  function reset() {
    setInput("");
    setResult("");
    setShowHint(false);
    setShowAnswer(false);
    setShowTrace(false);
    setTrace([]);
    setAlreadyCorrect(false);
  }

  return (
    <div style={styles.outer}>

      {/* ---------------- HOME SCREEN ---------------- */}
      {showHome && !showReviewMenu && !showFoundations && (
        <div style={styles.homeContainer}>
          <h1 style={styles.homeTitle}>⚡ DFA LightningTutor</h1>

          <p style={styles.homeSubtitle}>
            Master DFAs with instant feedback, hints, traces, and gamified progress.
          </p>

          <button style={styles.startButton} onClick={() => setShowHome(false)}>
            Start Practicing
          </button>

          <button
            style={styles.reviewButton}
            onClick={() => {
              setShowHome(false);
              setShowReviewMenu(true);
            }}
          >
            📘 Review
          </button>

          <p style={styles.credit}>Created by <strong>Your Name</strong></p>
        </div>
      )}

      {/* ---------------- REVIEW MENU ---------------- */}
      {showReviewMenu && !showFoundations && (
        <div style={styles.reviewMenu}>
          <h1>📘 Review Center</h1>
          <p>Select a module:</p>

          <button style={styles.menuButton} onClick={() => setShowFoundations(true)}>
            Foundations Module
          </button>

          <button style={styles.menuButton}>Example DFAs</button>
          <button style={styles.menuButton}>Designing DFAs</button>
          <button style={styles.menuButton}>Language Operations</button>
          <button style={styles.menuButton}>NFA Basics</button>
          <button style={styles.menuButton}>Regex Basics</button>
          <button style={styles.menuButton}>Theory Practice</button>

          <button
            style={styles.menuButton}
            onClick={() => {
              setShowReviewMenu(false);
              setShowHome(true);
            }}
          >
            ← Back Home
          </button>
        </div>
      )}

      {/* ---------------- FOUNDATIONS MODULE ---------------- */}
      {showFoundations && (
        <div style={styles.reviewWrapper}>
          <h1>📘 Foundations Module</h1>

          <div style={styles.cardReview}>
            <h2 style={styles.cardTitle}>{foundationSlides[foundationSlide].title}</h2>
            <pre style={styles.cardText}>{foundationSlides[foundationSlide].body}</pre>
          </div>

          <div style={styles.slideNavRow}>
            {foundationSlide === 0 ? (
              <button
                style={styles.exitButton}
                onClick={() => {
                  setShowFoundations(false);
                  setFoundationSlide(0);
                }}
              >
                Exit Module
              </button>
            ) : (
              <button
                style={styles.navButton}
                onClick={() => setFoundationSlide(foundationSlide - 1)}
              >
                ← Previous
              </button>
            )}

            {foundationSlide === foundationSlides.length - 1 ? (
              <button
                style={styles.exitButton}
                onClick={() => {
                  setShowFoundations(false);
                  setFoundationSlide(0);
                }}
              >
                Exit Module →
              </button>
            ) : (
              <button
                style={styles.navButton}
                onClick={() => setFoundationSlide(foundationSlide + 1)}
              >
                Next →
              </button>
            )}
          </div>
        </div>
      )}

      {/* ---------------- PRACTICE SCREEN ---------------- */}
      {!showHome && !showReviewMenu && !showFoundations && (
        <>
          <h1 style={styles.title}>⚡ DFA LightningTutor</h1>

          <div style={styles.statsBox}>
            <p><strong>Correct:</strong> {correctCount}</p>
            <p><strong>Streak:</strong> {streak} 🔥</p>
          </div>

          <div style={styles.card}>
            <h2>Exercise #{index + 1}</h2>
            <p>{exercise.prompt}</p>

            <img src={exercise.image} alt="DFA Diagram" style={{ width: 300, marginTop: 20 }} />

            <input
              type="text"
              placeholder="Enter a string (e.g., 01011)"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              style={styles.input}
            />

            <div style={styles.buttonRow}>
              <button style={styles.hintButton} onClick={() => setShowHint(!showHint)}>Hint 💡</button>
              <button style={styles.checkButton} onClick={checkDFA}>Check</button>
              <button style={styles.clearButton} onClick={reset}>Clear</button>
              <button style={styles.answerButton} onClick={() => setShowAnswer(!showAnswer)}>Show Answer</button>
              <button style={styles.traceButton} onClick={traceDFA}>Trace DFA</button>
            </div>

            {result && <p style={styles.result}>{result}</p>}

            {showHint && (
              <div style={styles.infoBox}>
                <strong>Hint:</strong> {exercise.hint}
              </div>
            )}

            {showAnswer && (
              <div style={styles.infoBoxGreen}>
                <strong>Answer:</strong> {exercise.answer}
              </div>
            )}

            {showTrace && (
              <div style={styles.traceBox}>
                <h3>Trace</h3>
                {trace.map((line, i) => <p key={i}>{line}</p>)}
              </div>
            )}
          </div>

          <button
            style={styles.nextButton}
            onClick={() => {
              reset();
              setIndex((index + 1) % exercises.length);
            }}
          >
            Next Exercise 🎲
          </button>
        </>
      )}
    </div>
  );
}

/* ---------------- STYLES ---------------- */
const styles = {
  outer: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #e8dbff, #f4ecff)",
    padding: 40,
    textAlign: "center" as const,
  },

  homeContainer: {
    marginTop: 120,
    textAlign: "center" as const,
  },

  homeTitle: {
    fontSize: 48,
    color: "#4a148c",
    fontWeight: 800,
    marginBottom: 20,
  },

  homeSubtitle: {
    fontSize: 20,
    color: "#6a1b9a",
    marginBottom: 40,
    padding: "0 20px",
  },

  startButton: {
    background: "#6a1b9a",
    color: "white",
    padding: "14px 40px",
    border: "none",
    borderRadius: 12,
    fontSize: 22,
    cursor: "pointer",
    fontWeight: 600,
    boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
  },

  reviewButton: {
    background: "#03A9F4",
    color: "white",
    padding: "14px 40px",
    borderRadius: 12,
    fontSize: 22,
    cursor: "pointer",
    fontWeight: 600,
    boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
    marginTop: 20,
    border: "none",
  },

  credit: {
    marginTop: 60,
    color: "#444",
    fontSize: 16,
  },

  reviewMenu: {
    marginTop: 120,
    textAlign: "center",
    display: "block",
  },

  menuButton: {
    display: "block",
    width: "300px",
    margin: "12px auto",
    background: "#4CAF50",
    color: "white",
    padding: "12px 25px",
    borderRadius: 10,
    border: "none",
    fontSize: 20,
    cursor: "pointer",
    fontWeight: 600,
    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
  },

  reviewWrapper: {
    textAlign: "center",
    marginTop: 60,
    padding: "0 20px",
  },

  cardReview: {
    background: "white",
    maxWidth: 600,
    margin: "20px auto",
    padding: 25,
    borderRadius: 12,
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    textAlign: "left",
    whiteSpace: "pre-wrap",
  },

  cardTitle: {
    fontSize: 24,
    marginBottom: 15,
    color: "#333",
  },

  cardText: {
    fontSize: 18,
    whiteSpace: "pre-wrap",
    color: "#444",
    lineHeight: 1.6,
  },

  slideNavRow: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: 20,
    maxWidth: 600,
    marginLeft: "auto",
    marginRight: "auto",
  },

  navButton: {
    background: "#6a1b9a",
    color: "white",
    padding: "10px 25px",
    borderRadius: 8,
    border: "none",
    cursor: "pointer",
    fontSize: 18,
    fontWeight: 600,
    boxShadow: "0 3px 10px rgba(0,0,0,0.15)",
  },

  exitButton: {
    background: "#9575cd",
    color: "white",
    padding: "10px 25px",
    borderRadius: 8,
    border: "none",
    cursor: "pointer",
    fontSize: 18,
    fontWeight: 600,
    boxShadow: "0 3px 10px rgba(0,0,0,0.15)",
  },

  /* PRACTICE UI */
  title: {
    fontSize: 34,
    marginBottom: 20,
    color: "#4a148c",
    fontWeight: 700,
  },

  statsBox: {
    background: "#ffffffaa",
    padding: "10px 20px",
    borderRadius: 12,
    display: "inline-flex",
    gap: 20,
    marginBottom: 20,
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
    fontSize: 18,
    fontWeight: 600,
  },

  card: {
    width: "420px",
    margin: "0 auto",
    background: "#ffffff",
    padding: 25,
    borderRadius: 14,
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  },

  input: {
    padding: 12,
    width: "80%",
    fontSize: 16,
    marginTop: 20,
    borderRadius: 8,
    border: "1px solid #ccc",
  },

  buttonRow: {
    marginTop: 20,
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap" as const,
    gap: 10,
  },

  hintButton: {
    background: "#ffa726",
    color: "white",
    padding: "10px 18px",
    borderRadius: 8,
    border: "none",
    cursor: "pointer",
  },

  checkButton: {
    background: "#1e88e5",
    color: "white",
    padding: "10px 18px",
    borderRadius: 8,
    border: "none",
    cursor: "pointer",
  },

  clearButton: {
    background: "#757575",
    color: "white",
    padding: "10px 18px",
    borderRadius: 8,
    border: "none",
    cursor: "pointer",
  },

  answerButton: {
    background: "#43a047",
    color: "white",
    padding: "10px 18px",
    borderRadius: 8,
    border: "none",
    cursor: "pointer",
  },

  traceButton: {
    background: "#6a1b9a",
    color: "white",
    padding: "10px 18px",
    borderRadius: 8,
    border: "none",
    cursor: "pointer",
  },

  nextButton: {
    marginTop: 30,
    background: "#7e57c2",
    color: "white",
    padding: "12px 30px",
    borderRadius: 10,
    border: "none",
    cursor: "pointer",
    fontSize: 16,
  },

  result: {
    marginTop: 15,
    fontSize: 20,
    fontWeight: 600,
  },

  infoBox: {
    background: "#fff8e1",
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },

  infoBoxGreen: {
    background: "#e8f5e9",
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },

  traceBox: {
    background: "#f3e5f5",
    padding: 20,
    borderRadius: 10,
    marginTop: 20,
    textAlign: "left" as const,
    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
  },
};

export default App;
