import { useState, useRef } from "react";
import "./App.css";

const SYMPTOMS_DB = [
  // Mood
  "Persistent sadness", "Loss of interest", "Hopelessness", "Worthlessness",
  "Excessive guilt", "Mood swings", "Irritability", "Euphoria / Elevated mood",
  "Emotional numbness", "Crying spells", "Low self-esteem",
  // Anxiety
  "Excessive worry", "Panic attacks", "Racing heart", "Shortness of breath",
  "Sweating / Trembling", "Fear of losing control", "Avoidance behavior",
  "Social withdrawal", "Fear of specific objects", "Restlessness",
  // Cognitive
  "Difficulty concentrating", "Memory problems", "Confusion / Disorientation",
  "Forgetfulness", "Slow thinking", "Poor decision-making",
  // Psychotic
  "Hallucinations", "Delusions", "Paranoia", "Disorganized speech",
  "Disorganized behavior", "Flat affect",
  // Sleep
  "Insomnia", "Hypersomnia", "Nightmares", "Sleepwalking",
  "Difficulty staying asleep", "Unrefreshing sleep", "Excessive daytime sleepiness",
  // Behavioral
  "Impulsivity", "Aggression", "Risk-taking behavior", "Self-harm urges",
  "Compulsive behaviors", "Repetitive rituals", "Hoarding",
  // Physical
  "Fatigue", "Appetite changes", "Weight changes", "Unexplained physical pain",
  "Loss of libido", "Headaches", "Gastrointestinal issues",
  // Trauma / Dissociation
  "Flashbacks", "Emotional detachment", "Hypervigilance", "Startle response",
  "Dissociation / Depersonalization", "Avoidance of trauma reminders",
  // Developmental
  "Difficulty with social cues", "Restricted interests", "Repetitive movements",
  "Attention difficulties", "Hyperactivity", "Impulsive speech",
  // Eating
  "Distorted body image", "Fear of gaining weight", "Binge eating",
  "Purging behaviors", "Restrictive eating", "Food preoccupation",
  // Substance / Impulse
  "Substance cravings", "Loss of control over use", "Gambling urges",
  "Compulsive spending", "Anger outbursts",
];

const CONDITIONS_MAP = [
  {
    id: "mdd",
    name: "Major Depressive Disorder",
    category: "Mood Disorder",
    symptoms: ["Persistent sadness", "Loss of interest", "Hopelessness", "Worthlessness",
      "Fatigue", "Sleep disturbances", "Appetite changes", "Difficulty concentrating",
      "Crying spells", "Emotional numbness", "Low self-esteem", "Weight changes",
      "Insomnia", "Hypersomnia"],
    description: "A pervasive mood disorder characterized by persistent low mood, loss of pleasure, and a range of emotional and physical symptoms lasting at least two weeks.",
    selfCare: [
      "Maintain a consistent daily routine including wake time",
      "Engage in at least 20–30 minutes of gentle exercise daily",
      "Limit alcohol and avoid recreational substances",
      "Practice mindfulness or guided meditation",
      "Reach out to trusted friends or support groups",
      "Keep a mood journal to track patterns",
    ],
    doctor: "Psychiatrist",
    doctorNote: "A psychiatrist can evaluate for antidepressant therapy combined with psychotherapy (e.g., CBT).",
    urgency: "medium",
  },
  {
    id: "bipolar",
    name: "Bipolar Disorder",
    category: "Mood Disorder",
    symptoms: ["Mood swings", "Euphoria / Elevated mood", "Irritability", "Impulsivity",
      "Risk-taking behavior", "Persistent sadness", "Hopelessness", "Insomnia",
      "Hypersomnia", "Racing heart", "Loss of interest"],
    description: "A mood disorder with alternating episodes of mania/hypomania and depression. Episodes can vary in frequency, duration, and intensity.",
    selfCare: [
      "Strictly maintain a regular sleep schedule",
      "Use a mood tracking app to identify episode triggers",
      "Avoid caffeine, alcohol, and stimulants",
      "Build a crisis plan with a trusted person",
      "Stick to medication schedules (if prescribed)",
      "Reduce high-stress commitments during vulnerable phases",
    ],
    doctor: "Psychiatrist",
    doctorNote: "Mood stabilizers and/or atypical antipsychotics are often first-line. A psychiatrist is essential.",
    urgency: "high",
  },
  {
    id: "gad",
    name: "Generalized Anxiety Disorder",
    category: "Anxiety Disorder",
    symptoms: ["Excessive worry", "Restlessness", "Fatigue", "Difficulty concentrating",
      "Irritability", "Muscle tension", "Insomnia", "Difficulty staying asleep",
      "Headaches", "Gastrointestinal issues"],
    description: "Chronic, excessive worry about multiple life domains (work, health, family) that is difficult to control and causes significant distress or impairment.",
    selfCare: [
      "Practice diaphragmatic breathing (4-7-8 technique)",
      "Schedule a dedicated 'worry time' to contain anxious thoughts",
      "Reduce caffeine intake significantly",
      "Exercise regularly — aerobics reduce cortisol effectively",
      "Try progressive muscle relaxation before bed",
      "Limit news and social media consumption",
    ],
    doctor: "Psychologist / Psychiatrist",
    doctorNote: "CBT is highly effective. SSRIs or buspirone may be considered. A psychologist for therapy, psychiatrist if medication is warranted.",
    urgency: "medium",
  },
  {
    id: "panic",
    name: "Panic Disorder",
    category: "Anxiety Disorder",
    symptoms: ["Panic attacks", "Racing heart", "Shortness of breath", "Sweating / Trembling",
      "Fear of losing control", "Avoidance behavior", "Restlessness", "Excessive worry"],
    description: "Recurrent, unexpected panic attacks accompanied by persistent concern about future attacks and behavioral changes to avoid them.",
    selfCare: [
      "Learn slow, controlled breathing to abort panic attacks",
      "Practice interoceptive exposure to reduce fear of sensations",
      "Avoid caffeine, alcohol, and sleep deprivation",
      "Keep a panic diary to identify triggers",
      "Use grounding techniques (5-4-3-2-1 method) during episodes",
    ],
    doctor: "Psychologist / Psychiatrist",
    doctorNote: "Panic-focused CBT is highly effective. SSRIs/SNRIs are first-line pharmacological options.",
    urgency: "medium",
  },
  {
    id: "social_anxiety",
    name: "Social Anxiety Disorder",
    category: "Anxiety Disorder",
    symptoms: ["Social withdrawal", "Avoidance behavior", "Fear of losing control",
      "Restlessness", "Sweating / Trembling", "Excessive worry", "Low self-esteem"],
    description: "Intense fear of social situations due to fear of scrutiny, embarrassment, or humiliation, leading to significant avoidance.",
    selfCare: [
      "Gradually expose yourself to feared social situations",
      "Practice assertiveness and social skills in safe environments",
      "Challenge cognitive distortions about others' perceptions",
      "Join support groups for social anxiety",
      "Reduce avoidance behaviors progressively",
    ],
    doctor: "Psychologist",
    doctorNote: "CBT with exposure-based therapy is the gold standard. An evaluation for SSRIs may be helpful.",
    urgency: "low",
  },
  {
    id: "ocd",
    name: "Obsessive-Compulsive Disorder",
    category: "Anxiety-Related Disorder",
    symptoms: ["Compulsive behaviors", "Repetitive rituals", "Excessive worry",
      "Hoarding", "Restlessness", "Avoidance behavior", "Difficulty concentrating"],
    description: "Characterized by intrusive, unwanted obsessions and repetitive compulsive behaviors performed to reduce distress, often consuming significant time.",
    selfCare: [
      "Practice ERP (Exposure and Response Prevention) with professional guidance",
      "Resist performing compulsions, even when distressing",
      "Mindfulness to observe obsessive thoughts without reacting",
      "Reduce reassurance-seeking behaviors",
      "Maintain structure and routine to reduce uncertainty",
    ],
    doctor: "Psychologist / Psychiatrist",
    doctorNote: "ERP (a form of CBT) is the most effective treatment. SSRIs at higher doses are often used adjunctively.",
    urgency: "medium",
  },
  {
    id: "ptsd",
    name: "Post-Traumatic Stress Disorder (PTSD)",
    category: "Trauma-Related Disorder",
    symptoms: ["Flashbacks", "Hypervigilance", "Nightmares", "Emotional detachment",
      "Avoidance of trauma reminders", "Startle response", "Irritability",
      "Insomnia", "Difficulty concentrating", "Social withdrawal"],
    description: "Develops after exposure to traumatic events. Characterized by re-experiencing, avoidance, negative cognitions, and hyperarousal symptoms.",
    selfCare: [
      "Ground yourself using the 5-4-3-2-1 sensory technique",
      "Establish safety routines and predictable environments",
      "Avoid substances that worsen hyperarousal",
      "Connect with trauma survivors' support communities",
      "Engage in gentle, body-based practices (yoga, tai chi)",
      "Limit trauma-related media exposure",
    ],
    doctor: "Psychiatrist / Trauma-specialized Psychologist",
    doctorNote: "Trauma-focused CBT, EMDR, and prolonged exposure therapy are gold standards. Psychiatric evaluation for medication support.",
    urgency: "high",
  },
  {
    id: "schizophrenia",
    name: "Schizophrenia Spectrum Disorder",
    category: "Psychotic Disorder",
    symptoms: ["Hallucinations", "Delusions", "Paranoia", "Disorganized speech",
      "Disorganized behavior", "Flat affect", "Social withdrawal",
      "Difficulty concentrating", "Emotional numbness"],
    description: "A serious mental disorder characterized by distortions in thinking, perception, emotion, and behavior. Positive and negative symptoms present across episodes.",
    selfCare: [
      "Never discontinue medication without psychiatric guidance",
      "Maintain a stable sleep and daily routine",
      "Involve family or caregivers for support monitoring",
      "Reduce stress through structured activities",
      "Attend day programs or community mental health services",
      "Identify early warning signs with your care team",
    ],
    doctor: "Psychiatrist",
    doctorNote: "Antipsychotic medication is essential. Coordinated specialty care involving a psychiatrist, case manager, and therapist is recommended.",
    urgency: "critical",
  },
  {
    id: "adhd",
    name: "ADHD (Attention-Deficit/Hyperactivity Disorder)",
    category: "Neurodevelopmental Disorder",
    symptoms: ["Attention difficulties", "Hyperactivity", "Impulsive speech", "Impulsivity",
      "Restlessness", "Difficulty concentrating", "Forgetfulness", "Poor decision-making",
      "Risk-taking behavior"],
    description: "A neurodevelopmental disorder marked by persistent inattention, hyperactivity-impulsivity, or both, interfering with functioning across settings.",
    selfCare: [
      "Use structured planning tools (calendars, reminders, checklists)",
      "Break tasks into smaller, timed intervals (Pomodoro method)",
      "Minimize distractions in work/study environments",
      "Exercise daily — strong evidence for symptom reduction",
      "Maintain consistent sleep and nutrition",
      "Practice body-doubling or accountability partnerships",
    ],
    doctor: "Psychiatrist / Neurologist",
    doctorNote: "Stimulant medications (methylphenidate, amphetamines) or non-stimulants may be prescribed. Behavioral therapy is complementary.",
    urgency: "low",
  },
  {
    id: "asd",
    name: "Autism Spectrum Disorder",
    category: "Neurodevelopmental Disorder",
    symptoms: ["Difficulty with social cues", "Restricted interests", "Repetitive movements",
      "Avoidance behavior", "Emotional detachment", "Flat affect",
      "Attention difficulties", "Hyperactivity"],
    description: "A neurodevelopmental condition characterized by differences in social communication, sensory processing, and presence of restricted or repetitive behaviors.",
    selfCare: [
      "Create predictable routines and minimize unexpected changes",
      "Identify and reduce sensory triggers in the environment",
      "Engage with special interests as a regulatory tool",
      "Use visual schedules and clear communication supports",
      "Connect with ASD community groups and peer support",
    ],
    doctor: "Neurologist / Developmental Psychiatrist",
    doctorNote: "Comprehensive developmental assessment is needed. Behavioral therapies (ABA, social skills training) and co-occurring condition management.",
    urgency: "low",
  },
  {
    id: "anorexia",
    name: "Anorexia Nervosa",
    category: "Eating Disorder",
    symptoms: ["Restrictive eating", "Distorted body image", "Fear of gaining weight",
      "Food preoccupation", "Weight changes", "Fatigue", "Loss of libido"],
    description: "A serious eating disorder characterized by severely restricted food intake, intense fear of weight gain, and a distorted perception of body weight or shape.",
    selfCare: [
      "Work with a registered dietitian on structured meal plans",
      "Avoid body checking and mirror avoidance behaviors",
      "Reach out to the National Alliance for Eating Disorders helpline",
      "Challenge food and body-related cognitive distortions with support",
      "Build a care team including medical, nutritional, and psychological professionals",
    ],
    doctor: "Psychiatrist + Dietitian + Physician",
    doctorNote: "Multidisciplinary treatment is essential. Medical monitoring for complications (electrolyte imbalance, cardiac risk) is critical.",
    urgency: "critical",
  },
  {
    id: "bulimia",
    name: "Bulimia Nervosa",
    category: "Eating Disorder",
    symptoms: ["Binge eating", "Purging behaviors", "Distorted body image",
      "Fear of gaining weight", "Food preoccupation", "Low self-esteem", "Mood swings"],
    description: "Characterized by recurrent binge eating followed by compensatory behaviors (purging, laxative use, excessive exercise) to prevent weight gain.",
    selfCare: [
      "Identify binge triggers and practice urge-surfing",
      "Avoid skipping meals — structured eating reduces binge urges",
      "Remove easy access to binge foods temporarily",
      "Practice self-compassion and challenge perfectionism",
      "Seek peer support through eating disorder communities",
    ],
    doctor: "Psychologist / Psychiatrist",
    doctorNote: "CBT for bulimia is the gold standard. Medical monitoring for purging-related complications is important.",
    urgency: "high",
  },
  {
    id: "insomnia",
    name: "Insomnia Disorder",
    category: "Sleep Disorder",
    symptoms: ["Insomnia", "Difficulty staying asleep", "Unrefreshing sleep",
      "Fatigue", "Irritability", "Difficulty concentrating", "Excessive daytime sleepiness"],
    description: "Persistent difficulty initiating or maintaining sleep, or early morning awakening with inability to return to sleep, causing daytime impairment.",
    selfCare: [
      "Follow sleep hygiene strictly (consistent bed/wake times)",
      "Avoid screens 1 hour before bed; use blue light filters",
      "Reserve the bed only for sleep and sex",
      "Try CBT-I (Cognitive Behavioral Therapy for Insomnia) apps",
      "Limit naps to under 20 minutes before 3 PM",
      "Avoid caffeine after noon",
    ],
    doctor: "Sleep Medicine Specialist / Psychiatrist",
    doctorNote: "CBT-I is the first-line treatment. Evaluation for underlying causes (sleep apnea, anxiety, depression) is essential.",
    urgency: "low",
  },
  {
    id: "borderline",
    name: "Borderline Personality Disorder",
    category: "Personality Disorder",
    symptoms: ["Mood swings", "Impulsivity", "Fear of losing control", "Self-harm urges",
      "Emotional numbness", "Unstable relationships", "Risk-taking behavior",
      "Anger outbursts", "Dissociation / Depersonalization", "Low self-esteem"],
    description: "Characterized by pervasive instability in emotions, self-image, and relationships, with intense fear of abandonment and impulsive behaviors.",
    selfCare: [
      "Practice DBT (Dialectical Behavior Therapy) skills: TIPP, STOP, PLEASE",
      "Build a crisis safety plan with specific contacts",
      "Use emotion regulation journaling daily",
      "Avoid impulsive decisions during emotional peaks",
      "Practice radical acceptance of difficult situations",
    ],
    doctor: "Psychiatrist / Psychologist",
    doctorNote: "DBT is the evidence-based treatment of choice. Psychiatric evaluation may address co-occurring depression or anxiety.",
    urgency: "high",
  },
  {
    id: "dissociative",
    name: "Dissociative Disorder",
    category: "Dissociative Disorder",
    symptoms: ["Dissociation / Depersonalization", "Emotional detachment", "Memory problems",
      "Confusion / Disorientation", "Flashbacks", "Emotional numbness", "Identity confusion"],
    description: "Disorders involving disruptions in consciousness, memory, identity, or perception, often as a response to overwhelming trauma.",
    selfCare: [
      "Use grounding techniques immediately when dissociation occurs",
      "Carry sensory grounding objects (ice pack, textured item)",
      "Create a safe, predictable living environment",
      "Limit substance use that worsens dissociation",
      "Track dissociative episodes to share with your therapist",
    ],
    doctor: "Psychiatrist / Trauma Psychologist",
    doctorNote: "Trauma-informed therapy (EMDR, Internal Family Systems) with experienced practitioners is essential.",
    urgency: "high",
  },
  {
    id: "dementia",
    name: "Neurocognitive Disorder (Dementia)",
    category: "Neurocognitive Disorder",
    symptoms: ["Memory problems", "Confusion / Disorientation", "Forgetfulness",
      "Slow thinking", "Poor decision-making", "Difficulty concentrating",
      "Mood swings", "Social withdrawal", "Behavioral changes"],
    description: "Progressive decline in cognitive function including memory, language, problem-solving, and behavior, interfering with daily functioning.",
    selfCare: [
      "Engage in regular cognitive stimulation (puzzles, reading, learning)",
      "Maintain physical exercise — strong protective evidence",
      "Use memory aids: labeled items, structured routines, calendars",
      "Reduce cardiovascular risk factors (blood pressure, diet)",
      "Ensure adequate social engagement",
    ],
    doctor: "Neurologist / Geriatric Psychiatrist",
    doctorNote: "Comprehensive neuropsychological evaluation required. Neurologist for diagnosis and medication management; geriatric psychiatrist for behavioral symptoms.",
    urgency: "high",
  },
  {
    id: "substance",
    name: "Substance Use Disorder",
    category: "Addictive Disorder",
    symptoms: ["Substance cravings", "Loss of control over use", "Mood swings",
      "Social withdrawal", "Impulsivity", "Risk-taking behavior", "Insomnia",
      "Fatigue", "Memory problems"],
    description: "A pattern of substance use leading to significant impairment or distress, including tolerance, withdrawal, and continued use despite consequences.",
    selfCare: [
      "Identify and avoid high-risk triggers for use",
      "Contact SAMHSA helpline (1-800-662-HELP) for resources",
      "Build a sober support network (AA, NA, SMART Recovery)",
      "Practice urge-surfing mindfulness technique",
      "Remove substances from living environment",
      "Engage in alternative reward activities",
    ],
    doctor: "Addiction Psychiatrist / Addiction Medicine Specialist",
    doctorNote: "Medication-assisted treatment (MAT) may be indicated. Detox should be medically supervised.",
    urgency: "high",
  },
];

const URGENCY_CONFIG = {
  low: { label: "Low Priority", color: "#4ade80", bg: "#f0fdf4", icon: "●" },
  medium: { label: "Moderate", color: "#f59e0b", bg: "#fffbeb", icon: "●" },
  high: { label: "High Priority", color: "#f97316", bg: "#fff7ed", icon: "●" },
  critical: { label: "Seek Care Urgently", color: "#ef4444", bg: "#fef2f2", icon: "⚠" },
};

function symptomMatch(selected, conditionSymptoms) {
  const matched = selected.filter((s) => conditionSymptoms.includes(s));
  return matched.length;
}

export default function App() {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState([]);
  const [results, setResults] = useState(null);
  const [animateIn, setAnimateIn] = useState(false);
  const resultsRef = useRef(null);

  const filtered = query
    ? SYMPTOMS_DB.filter(
        (s) =>
          s.toLowerCase().includes(query.toLowerCase()) &&
          !selected.includes(s)
      )
    : SYMPTOMS_DB.filter((s) => !selected.includes(s));

  function toggleSymptom(symptom) {
    setSelected((prev) =>
      prev.includes(symptom)
        ? prev.filter((s) => s !== symptom)
        : [...prev, symptom]
    );
  }

  function analyze() {
    if (selected.length === 0) return;

    const scored = CONDITIONS_MAP.map((c) => ({
      ...c,
      matchCount: symptomMatch(selected, c.symptoms),
      matchPercent: Math.round(
        (symptomMatch(selected, c.symptoms) / selected.length) * 100
      ),
    }))
      .filter((c) => c.matchCount >= 1)
      .sort((a, b) => b.matchCount - a.matchCount || b.matchPercent - a.matchPercent)
      .slice(0, 4);

    setResults(scored);
    setAnimateIn(false);
    setTimeout(() => setAnimateIn(true), 50);
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  }

  function reset() {
    setSelected([]);
    setResults(null);
    setQuery("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="header-inner">
          <div className="logo">
            <div className="logo-icon">
              <svg viewBox="0 0 32 32" fill="none">
                <circle cx="16" cy="16" r="14" stroke="currentColor" strokeWidth="1.5" />
                <path d="M10 16c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <circle cx="16" cy="19" r="2.5" fill="currentColor" fillOpacity="0.7" />
              </svg>
            </div>
            <div>
              <span className="logo-name">MindScreen</span>
              <span className="logo-sub">Mental Health Assessment</span>
            </div>
          </div>
          <div className="header-badge">For Educational Use Only</div>
        </div>
      </header>

      <main className="main">
        {/* Hero */}
        <section className="hero">
          <div className="hero-tag">Symptom Analysis Tool</div>
          <h1 className="hero-title">
            Understand your<br />
            <em>mental wellbeing</em>
          </h1>
          <p className="hero-desc">
            Select the symptoms you've been experiencing. Our assessment engine
            will identify possible conditions, provide self-care guidance, and
            recommend the right healthcare professional for your situation.
          </p>
          <div className="disclaimer-bar">
            <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clipRule="evenodd" />
            </svg>
            This tool is not a clinical diagnosis. Always consult a licensed healthcare professional.
          </div>
        </section>

        {/* Symptom Selector */}
        <section className="selector-section">
          <div className="section-header">
            <div className="section-num">01</div>
            <div>
              <h2 className="section-title">Select Your Symptoms</h2>
              <p className="section-sub">Choose all that apply over the past 2+ weeks</p>
            </div>
          </div>

          <div className="search-wrap">
            <svg className="search-icon" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="8.5" cy="8.5" r="5.5" />
              <path d="M13 13l3.5 3.5" strokeLinecap="round" />
            </svg>
            <input
              className="search-input"
              type="text"
              placeholder="Search symptoms..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            {query && (
              <button className="search-clear" onClick={() => setQuery("")}>×</button>
            )}
          </div>

          {selected.length > 0 && (
            <div className="selected-section">
              <div className="selected-label">
                Selected ({selected.length})
                <button className="clear-all" onClick={() => setSelected([])}>
                  Clear all
                </button>
              </div>
              <div className="chips-wrap">
                {selected.map((s) => (
                  <button
                    key={s}
                    className="chip chip-selected"
                    onClick={() => toggleSymptom(s)}
                  >
                    {s}
                    <span className="chip-remove">×</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="symptoms-grid">
            {filtered.map((symptom) => (
              <button
                key={symptom}
                className="symptom-btn"
                onClick={() => toggleSymptom(symptom)}
              >
                <span className="symptom-plus">+</span>
                {symptom}
              </button>
            ))}
          </div>

          <div className="analyze-bar">
            <div className="analyze-info">
              {selected.length === 0
                ? "Select at least one symptom to continue"
                : `${selected.length} symptom${selected.length > 1 ? "s" : ""} selected`}
            </div>
            <button
              className={`analyze-btn ${selected.length === 0 ? "disabled" : ""}`}
              onClick={analyze}
              disabled={selected.length === 0}
            >
              Analyze Symptoms
              <svg viewBox="0 0 20 20" fill="currentColor" width="18" height="18">
                <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </section>

        {/* Results */}
        {results !== null && (
          <section className={`results-section ${animateIn ? "animate-in" : ""}`} ref={resultsRef}>
            <div className="section-header">
              <div className="section-num">02</div>
              <div>
                <h2 className="section-title">Assessment Results</h2>
                <p className="section-sub">
                  Based on {selected.length} reported symptom{selected.length > 1 ? "s" : ""}
                </p>
              </div>
            </div>

            {results.length === 0 ? (
              <div className="no-results">
                <div className="no-results-icon">🔍</div>
                <p>No strong matches found. Consider selecting more specific symptoms or consulting a healthcare provider directly.</p>
              </div>
            ) : (
              <div className="results-grid">
                {results.map((r, i) => {
                  const urgency = URGENCY_CONFIG[r.urgency];
                  return (
                    <div
                      key={r.id}
                      className="result-card"
                      style={{ animationDelay: `${i * 0.1}s` }}
                    >
                      <div className="card-header">
                        <div className="card-rank">#{i + 1}</div>
                        <div className="card-meta">
                          <span className="card-category">{r.category}</span>
                          <span
                            className="urgency-badge"
                            style={{ color: urgency.color, background: urgency.bg }}
                          >
                            {urgency.icon} {urgency.label}
                          </span>
                        </div>
                      </div>

                      <h3 className="card-title">{r.name}</h3>

                      <div className="match-bar-wrap">
                        <div className="match-bar-label">
                          <span>Symptom Match</span>
                          <span className="match-count">{r.matchCount} / {r.symptoms.length} matched</span>
                        </div>
                        <div className="match-bar-bg">
                          <div
                            className="match-bar-fill"
                            style={{
                              width: `${Math.min(100, Math.round((r.matchCount / r.symptoms.length) * 100))}%`,
                              background: urgency.color,
                            }}
                          />
                        </div>
                      </div>

                      <p className="card-desc">{r.description}</p>

                      <div className="card-sections">
                        <div className="card-block">
                          <div className="block-header">
                            <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                            </svg>
                            Self-Care Guidance
                          </div>
                          <ul className="care-list">
                            {r.selfCare.map((tip, j) => (
                              <li key={j} className="care-item">
                                <span className="care-bullet" />
                                {tip}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="card-block doctor-block">
                          <div className="block-header">
                            <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
                              <path d="M10 9a3 3 0 100-6 3 3 0 000 6zM6 8a2 2 0 11-4 0 2 2 0 014 0zM1.49 15.326a.78.78 0 01-.358-.442 3 3 0 014.308-3.516 6.484 6.484 0 00-1.905 3.959c-.023.222-.014.442.025.654a4.97 4.97 0 01-2.07-.655zM16.44 15.98a4.97 4.97 0 002.07-.654.78.78 0 00.357-.442 3 3 0 00-4.308-3.517 6.484 6.484 0 011.907 3.96 2.32 2.32 0 01-.026.654zM18 8a2 2 0 11-4 0 2 2 0 014 0zM5.304 16.19a.844.844 0 01-.277-.71 5 5 0 019.947 0 .843.843 0 01-.277.71A6.975 6.975 0 0110 18a6.974 6.974 0 01-4.696-1.81z" />
                            </svg>
                            Recommended Specialist
                          </div>
                          <div className="doctor-name">{r.doctor}</div>
                          <p className="doctor-note">{r.doctorNote}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="results-footer">
              <div className="footer-disclaimer">
                <strong>Important Reminder:</strong> These results are for informational and educational
                purposes only and do not constitute medical advice, diagnosis, or treatment. Always
                consult a qualified mental health professional for an accurate assessment.
              </div>
              <button className="reset-btn" onClick={reset}>
                ← Start New Assessment
              </button>
            </div>
          </section>
        )}
      </main>

      <footer className="footer">
        <div className="footer-inner">
          <span>MindScreen © 2025 — For Educational Use Only</span>
          <span>Not a substitute for professional mental health care</span>
        </div>
      </footer>
    </div>
  );
}