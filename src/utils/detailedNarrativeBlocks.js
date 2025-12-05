/**
 * DETAILED NARRATIVE BLOCKS FOR ADHD ASSESSMENT
 * 
 * Comprehensive real-life examples and clinical explanations
 * for candidates and healthcare professionals
 * 
 * @version 2.1.0 - Enhanced Detail System
 */

// ============================================================================
// DOMAIN-SPECIFIC DETAILED EXPLANATIONS
// ============================================================================

export const domainExplanations = {
  workingMemory: {
    simple: "Your brain's 'notepad' - how much you can hold in mind at once",
    detailed: "Working memory is your brain's temporary workspace. It's what lets you remember a phone number long enough to dial it, follow multi-step instructions, or hold the beginning of a sentence in mind while reading to the end.",
    
    // Score-based explanations
    severelyImpaired: {
      whatItMeans: "Your mental workspace is very limited. You can only hold 1-2 pieces of information before losing track.",
      everydayImpact: [
        "You forget what you were going to say mid-sentence",
        "Following 3+ step instructions feels impossible - you remember the first step, forget the rest",
        "Reading long paragraphs means re-reading multiple times because you lose the thread",
        "During conversations, you forget what the person said while formulating your response",
        "You walk into a room and forget why you came",
        "Cooking from recipes is frustrating - you keep re-checking every step"
      ],
      workImpact: [
        "Multi-step projects feel overwhelming",
        "You need everything written down - you cannot rely on mental notes",
        "Meetings are hard - by the time it's your turn to speak, you've forgotten your point",
        "Email chains confuse you - you lose track of who said what",
        "You double-book or miss appointments despite trying to remember"
      ],
      relationshipImpact: [
        "Partners may feel you don't listen because you forget what they said",
        "Friends repeat themselves often",
        "You may miss important dates or commitments"
      ],
      strategies: [
        { method: "External Brain", description: "Use a notes app for EVERYTHING. Phone, Notion, paper - doesn't matter. The key is capturing information immediately, not later.", why: "Your internal memory is unreliable, so you need an external system" },
        { method: "One-Touch Rule", description: "When someone tells you something, write it down immediately. Don't say 'I'll remember' - you won't.", why: "Information decays rapidly in limited working memory" },
        { method: "Chunking", description: "Break everything into 2-3 step maximum chunks. Complete those, then get the next steps.", why: "Keeps you under your capacity limit" },
        { method: "Repeat Back", description: "When given instructions, repeat them back immediately. This encodes them better and catches errors.", why: "Verbal rehearsal strengthens encoding" }
      ]
    },
    
    moderatelyImpaired: {
      whatItMeans: "Your mental workspace is smaller than average. You can hold 2-3 things, but 4+ causes overload.",
      everydayImpact: [
        "You occasionally forget the point you were making",
        "Complex instructions need to be broken down",
        "You prefer written over verbal instructions",
        "When interrupted, you often lose your place"
      ],
      workImpact: [
        "You rely on lists and notes more than colleagues",
        "Complex projects need more external tracking",
        "You may need to ask for clarification more often"
      ],
      strategies: [
        { method: "Task Lists", description: "Keep running lists for all projects. Check them frequently.", why: "Offloads memory burden to external system" },
        { method: "Visual Reminders", description: "Use sticky notes, phone reminders, and calendar alerts liberally.", why: "Visual cues trigger memory without relying on recall" }
      ]
    },
    
    borderline: {
      whatItMeans: "Your working memory is on the lower end of typical. Most things work fine, but you notice limits under pressure.",
      everydayImpact: [
        "Generally fine, but stress or fatigue reduces capacity",
        "Very complex tasks require external support",
        "You function best with routines and systems"
      ],
      strategies: [
        { method: "Buffer Systems", description: "Build in redundancy - calendar + phone reminder + sticky note for important things.", why: "Multiple cues ensure nothing falls through" }
      ]
    },
    
    adequate: {
      whatItMeans: "Your working memory is typical. You can hold multiple pieces of information and manipulate them effectively.",
      strength: "This is a cognitive strength you can leverage to compensate for other areas."
    }
  },

  sustainedAttention: {
    simple: "How long you can stay focused before your mind wanders",
    detailed: "Sustained attention is your ability to maintain focus on a task over time. It's what lets you read a book chapter, watch a full movie, or work on a project for hours without losing concentration.",
    
    severelyImpaired: {
      whatItMeans: "Your attention fades quickly - typically within 5-10 minutes - and requires frequent re-engagement.",
      everydayImpact: [
        "You start reading and realize several paragraphs later that you have no idea what you read",
        "Movies and shows are hard to follow - you miss plot points because your mind wandered",
        "Conversations drift - you catch yourself not listening mid-sentence",
        "You jump between tasks constantly, finishing none",
        "Time 'disappears' - you space out and suddenly 20 minutes have passed",
        "You need background stimulation (music, TV) but it also distracts you"
      ],
      workImpact: [
        "Long meetings are torture - you zone out within 10 minutes",
        "Deep work sessions are nearly impossible",
        "You start tasks, get distracted, and return to find you don't remember where you were",
        "Reading long documents or reports feels overwhelming",
        "You procrastinate on tasks that require sustained focus"
      ],
      studyImpact: [
        "Lectures are extremely difficult to follow",
        "Studying for more than 15-20 minutes without a break is ineffective",
        "You re-read the same material repeatedly",
        "Exam focus is inconsistent - performance varies day to day"
      ],
      strategies: [
        { method: "Pomodoro Technique", description: "Work in short bursts: 15-20 minutes of focus, then 5-minute break. Repeat.", why: "Works WITH your natural attention cycle instead of against it" },
        { method: "Body Doubling", description: "Work alongside someone else (even virtually). Their presence keeps you accountable.", why: "Social accountability maintains external focus pressure" },
        { method: "Active Engagement", description: "Never passively read/listen. Take notes, highlight, summarize out loud.", why: "Active processing prevents attention drift" },
        { method: "Movement Breaks", description: "Physical movement resets attention. Stand, stretch, walk between focus blocks.", why: "Physical activation restores cognitive resources" },
        { method: "Environmental Control", description: "Remove all distractions. Phone in another room. Use website blockers.", why: "When attention wavers, nothing is there to capture it" }
      ]
    },
    
    moderatelyImpaired: {
      whatItMeans: "Your attention is variable. You can focus for 15-25 minutes before drift occurs.",
      everydayImpact: [
        "Focus is possible but requires effort to maintain",
        "You notice when your mind wanders and can usually pull back",
        "Interest level significantly affects focus duration"
      ],
      strategies: [
        { method: "Interest Alignment", description: "Make tasks more engaging. Add challenge, gamification, or personal relevance.", why: "Interest dramatically extends attention span" },
        { method: "Scheduled Breaks", description: "Plan breaks before attention fails. 25 min work, 5 min break.", why: "Prevents attention depletion" }
      ]
    },
    
    borderline: {
      whatItMeans: "Focus is adequate for most tasks but may strain during very long or boring activities.",
      strategies: [
        { method: "Task Variety", description: "Alternate between different types of tasks to maintain engagement.", why: "Novelty refreshes attention" }
      ]
    },
    
    adequate: {
      whatItMeans: "You can maintain focus well. This is a strength.",
      strength: "Your sustained attention is reliable. Use this for deep work and complex tasks."
    }
  },

  responseInhibition: {
    simple: "Your ability to stop yourself from acting on impulse",
    detailed: "Response inhibition is your brain's 'brake pedal.' It stops you from blurting things out, making impulsive decisions, or acting without thinking. It's the voice that says 'wait' before you do something you'll regret.",
    
    severelyImpaired: {
      whatItMeans: "Your brain's 'brake pedal' is weak. You act before thinking, often regretting it immediately after.",
      everydayImpact: [
        "You interrupt people constantly - the words come out before you can stop them",
        "Impulse purchases are a problem - you buy things you don't need in the moment",
        "You say things you regret almost immediately",
        "Road rage or quick anger - you react before considering consequences",
        "You click send on messages before proofreading",
        "You start new projects impulsively before finishing existing ones",
        "Eating, drinking, or other habits feel hard to control"
      ],
      workImpact: [
        "You interrupt colleagues in meetings",
        "You respond to emails too quickly, sometimes inappropriately",
        "You commit to things impulsively, then can't deliver",
        "Quick reactions may create conflict with coworkers",
        "You struggle with tasks requiring patience"
      ],
      socialImpact: [
        "Conversations feel one-sided - you talk over others",
        "Friends may describe you as 'intense' or 'reactive'",
        "Arguments escalate because you respond before calming down",
        "You may overshare personal information impulsively"
      ],
      strategies: [
        { method: "Pause Protocol", description: "Before any action (speaking, clicking send, buying), count to 5. Ask 'Do I really want to do this?'", why: "Creates physical delay for prefrontal cortex to catch up" },
        { method: "Structured Response", description: "For emails/messages, draft, then wait 30 minutes before sending.", why: "Removes impulse from communication" },
        { method: "Environmental Barriers", description: "Remove credit cards from online shopping sites. Make impulsive actions require extra steps.", why: "Friction prevents impulse follow-through" },
        { method: "Impulse Log", description: "Track impulses for a week. Notice patterns. What triggers them?", why: "Awareness is the first step to control" }
      ]
    },
    
    moderatelyImpaired: {
      whatItMeans: "You can usually control impulses but struggle under stress, fatigue, or strong emotion.",
      strategies: [
        { method: "Stress Management", description: "Your impulse control degrades with stress. Prioritize stress reduction.", why: "Prefrontal function is stress-sensitive" }
      ]
    },
    
    adequate: {
      whatItMeans: "You have good impulse control. This is a strength that protects against many ADHD-related difficulties.",
      strength: "Strong inhibition helps compensate for attention difficulties."
    }
  },

  cognitiveFlexibility: {
    simple: "How easily you can switch between tasks or adapt to changes",
    detailed: "Cognitive flexibility is your brain's ability to shift gears - switching from one task to another, adapting when plans change, or seeing problems from different angles. It's mental agility.",
    
    severelyImpaired: {
      whatItMeans: "Transitions are very hard. Once locked into something, switching is mentally painful. Changes to plans cause significant distress.",
      everydayImpact: [
        "Unexpected changes to plans are extremely stressful",
        "You get 'stuck' on one task and can't switch even when you need to",
        "Interruptions derail you completely - you can't get back to what you were doing",
        "You prefer strict routines and get upset when they're disrupted",
        "Seeing alternative viewpoints in arguments is difficult",
        "You tend to hyperfocus on one thing while neglecting everything else"
      ],
      workImpact: [
        "Priority changes cause significant stress",
        "Multitasking is nearly impossible",
        "You struggle when projects get reprioritized",
        "Transitioning between meetings/tasks takes significant time"
      ],
      strategies: [
        { method: "Transition Rituals", description: "Create a physical ritual between tasks (stand up, walk around, drink water). This signals 'switch' to your brain.", why: "Physical action helps cognitive transition" },
        { method: "Advance Warning", description: "Ask for advance notice of changes when possible. Sudden shifts are hardest.", why: "Preparation reduces transition cost" },
        { method: "Task Batching", description: "Group similar tasks together to minimize switches needed.", why: "Fewer transitions = less cognitive cost" }
      ]
    },
    
    adequate: {
      whatItMeans: "You switch between tasks relatively easily. This is a strength.",
      strength: "Good flexibility helps in dynamic environments."
    }
  },

  interferenceControl: {
    simple: "How well you filter out distractions",
    detailed: "Interference control is your brain's ability to filter out irrelevant information and stay focused on what matters. It's what lets you work in a noisy café or ignore your phone while studying.",
    
    severelyImpaired: {
      whatItMeans: "Everything grabs your attention. Filtering out distractions is extremely difficult.",
      everydayImpact: [
        "Background noise (conversations, TV, traffic) makes focus impossible",
        "Visual clutter is overwhelming - messy environments are distracting",
        "You can't ignore notifications - they pull your attention immediately",
        "Studying in public spaces is nearly impossible",
        "Your mind picks up every sound, movement, or change around you",
        "Open office environments are torture"
      ],
      strategies: [
        { method: "Environmental Control", description: "Minimize distractions proactively. Noise-canceling headphones, clean desk, phone in another room.", why: "If it's not there, it can't distract you" },
        { method: "Single-Task Focus", description: "Close all tabs except what you need. One thing at a time.", why: "Fewer stimuli = less interference" },
        { method: "Quiet Workspace", description: "Find or create a distraction-free zone. Library, private room, or off-hours office.", why: "Environment matters more than willpower" }
      ]
    },
    
    adequate: {
      whatItMeans: "You can filter distractions effectively. This is a strength.",
      strength: "Good filtering supports focus in challenging environments."
    }
  },

  processingSpeed: {
    simple: "How quickly you can process information and respond",
    detailed: "Processing speed is how fast your brain takes in information, makes sense of it, and produces a response. It's mental quickness - not intelligence, but cognitive tempo.",
    
    severelyImpaired: {
      whatItMeans: "You process information more slowly than most. This isn't about intelligence - it's about speed. You're thorough, not slow-minded.",
      everydayImpact: [
        "You need more time to respond in conversations - others may finish your sentences",
        "Timed tests don't reflect your true ability",
        "Fast-paced games, sports, or activities are frustrating",
        "You prefer to think things through rather than respond immediately",
        "Quick decisions feel uncomfortable"
      ],
      workImpact: [
        "You may need more time than colleagues for similar tasks",
        "High-pressure rapid decisions are stressful",
        "You work best when given adequate time without rushing"
      ],
      strategies: [
        { method: "Self-Pacing", description: "When possible, control your own pace. Don't let others rush you.", why: "You're more accurate when not rushed" },
        { method: "Preview Time", description: "Ask for materials in advance so you can process before meetings/discussions.", why: "Preparation compensates for speed" },
        { method: "Accuracy Over Speed", description: "Embrace your style - slower processing often means more thorough thinking.", why: "This is a feature, not a bug, in many contexts" }
      ]
    },
    
    adequate: {
      whatItMeans: "Your processing speed is typical or above. This is a strength.",
      strength: "Quick processing supports performance in fast-paced environments."
    }
  }
};

// ============================================================================
// CLINICAL INDICATORS - DETAILED EXPLANATIONS FOR DOCTORS
// ============================================================================

export const clinicalIndicators = {
  inattention: {
    clinicalMeaning: "Primary attention dysregulation affecting sustained focus and vigilance",
    dsm5Mapping: "DSM-5 Criterion A (Inattention) - 6+ symptoms for 6+ months",
    neurobiological: "Prefrontal cortex hypoactivation, default mode network (DMN) intrusion, norepinephrine dysregulation",
    testIndicators: [
      "Elevated RT variability (ISI-RT > 150ms)",
      "High tau values (>80ms) indicating attention lapses",
      "Omission errors in CPT (missing targets)",
      "Decline in performance over time (vigilance decrement)"
    ],
    differentialConsiderations: [
      "Sleep disorders (similar attention patterns)",
      "Depression (reduced engagement vs attention dysregulation)",
      "Anxiety (hypervigilance may mask or mimic)",
      "Thyroid dysfunction"
    ],
    treatmentImplications: "Often responds well to both stimulant and non-stimulant medications. Atomoxetine may be particularly effective for predominantly inattentive presentation. Behavioral strategies focusing on external structure critical."
  },

  hyperactivity: {
    clinicalMeaning: "Motor restlessness and excessive activity dysregulation",
    dsm5Mapping: "DSM-5 Criterion A (Hyperactivity-Impulsivity) - Motor symptoms",
    neurobiological: "Striatal dopamine dysregulation, motor cortex disinhibition, basal ganglia dysfunction",
    testIndicators: [
      "Fast but inaccurate responses",
      "Difficulty sustaining withhold in Go/No-Go",
      "Motor overflow or fidgeting during testing (observation)",
      "Preference for action over waiting"
    ],
    treatmentImplications: "Typically responsive to stimulant medication. Consider environmental modifications for physical activity. Behavioral interventions for motor self-regulation."
  },

  impulsivity: {
    clinicalMeaning: "Response inhibition failure and action without forethought",
    dsm5Mapping: "DSM-5 Criterion A (Hyperactivity-Impulsivity) - Impulsivity symptoms",
    neurobiological: "Right inferior frontal gyrus dysfunction, anterior cingulate cortex hypoactivation, dopamine reward pathway dysregulation",
    testIndicators: [
      "Commission errors (false alarms) in CPT/Go-No-Go",
      "Fast error responses (rapid incorrect clicks)",
      "Poor post-error slowing (doesn't learn from mistakes)",
      "Risk-taking behavior in tasks"
    ],
    differentialConsiderations: [
      "Bipolar disorder (impulsivity during mania)",
      "Substance use disorders (disinhibition)",
      "Antisocial personality traits",
      "Brain injury (frontal lobe damage)"
    ],
    treatmentImplications: "Response inhibition often improves with stimulants. Consider comorbid risk factors. Behavioral interventions critical for real-world impulse management."
  },

  workingMemoryDeficit: {
    clinicalMeaning: "Reduced capacity to hold and manipulate information in active memory",
    neurobiological: "Dorsolateral prefrontal cortex dysfunction, frontoparietal network inefficiency, possible acetylcholine system involvement",
    testIndicators: [
      "N-Back accuracy <70%",
      "Decline with increasing working memory load",
      "Difficulty with dual-task performance",
      "Serial information recall deficits"
    ],
    treatmentImplications: "Stimulants may improve prefrontal function. Cognitive rehabilitation strategies essential. External memory aids critical for daily function. Atomoxetine may benefit working memory specifically."
  },

  variability: {
    clinicalMeaning: "Inconsistent cognitive performance - the hallmark ADHD signature",
    neurobiological: "Default mode network (DMN) intrusion, unstable cortical arousal, norepinephrine fluctuation",
    testIndicators: [
      "High reaction time coefficient of variation (CV > 0.25)",
      "Wide RT distribution (long tails)",
      "Performance inconsistent across task blocks",
      "Good and bad moments within same session"
    ],
    clinicalSignificance: "Variability is MORE diagnostic of ADHD than mean performance. Many individuals with ADHD score 'normal' on average but show extreme variability. This inconsistency is the core neurological signature.",
    treatmentImplications: "Variability often responds dramatically to stimulant medication. Reduction in RT variability is a key treatment response indicator."
  },

  compensation: {
    clinicalMeaning: "Active cognitive effort to mask underlying dysfunction",
    neurobiological: "Prefrontal overactivation compensating for other network deficits, increased metabolic cost",
    testIndicators: [
      "High accuracy (>90%) WITH elevated RT (>500ms)",
      "High accuracy WITH high RT variability",
      "Performance maintained but cognitive cost elevated",
      "Fatigue or exhaustion despite good results"
    ],
    clinicalSignificance: "CRITICAL: This pattern is commonly missed in high-IQ or high-functioning individuals. Standard accuracy metrics look normal, but underlying dysfunction is masked by effortful compensation. These individuals often present with burnout, anxiety, or depression secondary to unsustainable cognitive effort.",
    treatmentImplications: "Treatment should reduce cognitive load and prevent burnout. Medication may 'unload' compensatory effort. Psychoeducation about sustainable pacing critical. High risk for burnout if untreated."
  },

  hyperfocus: {
    clinicalMeaning: "Paradoxical intense focus on stimulating/interesting tasks alongside poor sustained attention for routine tasks",
    neurobiological: "Dopamine reward pathway activation during high-interest tasks, normal attention mechanisms engaged when reward/novelty sufficient",
    clinicalSignificance: "Often used to argue against ADHD diagnosis ('but they can focus for hours on video games!'). Actually SUPPORTS diagnosis - it demonstrates attention is reward-dependent, not volitionally controlled.",
    treatmentImplications: "Hyperfocus can be leveraged therapeutically. Help patient identify hyperfocus-compatible activities. Recognize that non-stimulating tasks will always require more effort."
  },

  executiveOverload: {
    clinicalMeaning: "System breakdown when multiple executive functions needed simultaneously",
    neurobiological: "Frontoparietal network capacity exceeded, working memory buffer overflow, attention resources depleted",
    testIndicators: [
      "Performance drops significantly in complex vs simple tasks",
      "Flanker incongruent >> congruent difference",
      "Trail B >> Trail A time difference",
      "Dual-task performance significantly worse than single-task"
    ],
    treatmentImplications: "Task simplification essential. Break complex tasks into single-focus components. Environmental structuring to reduce simultaneous demands."
  }
};

// ============================================================================
// COMPREHENSIVE REAL-LIFE SCENARIO LIBRARY
// ============================================================================

export const realLifeScenarios = {
  workplace: {
    context: "WORKPLACE & CAREER",
    scenarios: [
      {
        situation: "Meetings & Presentations",
        inattentive: {
          whatHappens: "You zone out within 10 minutes. By the time it's your turn to speak, you've missed half the discussion. You may ask questions that were already answered.",
          whyItHappens: "Passive listening exhausts your attention system. Without active engagement, focus collapses.",
          solution: "Take notes during every meeting. Give yourself a 'listening job' (track action items, note blockers). Review notes before speaking."
        },
        hyperactive: {
          whatHappens: "You fidget constantly, tap your pen, bounce your leg. You may interrupt others frequently or blurt out answers before questions are finished.",
          whyItHappens: "Motor restlessness needs an outlet. Mental hyperactivity makes waiting physically uncomfortable.",
          solution: "Bring a discrete fidget tool. Take standing breaks when possible. If you catch yourself about to interrupt, write down your thought instead."
        },
        combined: {
          whatHappens: "You zone out AND interrupt. You miss information AND respond impulsively to what you did catch. Colleagues may be frustrated.",
          solution: "Active engagement is critical. Notes + fidget tool + 'pause before speaking' rule."
        }
      },
      {
        situation: "Email & Communication",
        inattentive: {
          whatHappens: "Emails sit unread for days. Long email threads are overwhelming. You miss important details buried in paragraphs.",
          whyItHappens: "Reading dense text requires sustained attention. Email volume exceeds attention capacity.",
          solution: "Process email at set times only (e.g., 9am, 1pm, 5pm). Use AI summarization for long threads. Flag important emails for dedicated focus time."
        },
        impulsive: {
          whatHappens: "You reply too quickly, sometimes with incomplete information or inappropriate tone. You may send before proofreading.",
          whyItHappens: "The urge to respond immediately is overwhelming. The 'send' button is too easy to click.",
          solution: "Draft, wait 30 minutes, then review before sending. For important emails, draft in a separate document first."
        }
      },
      {
        situation: "Project Management",
        inattentive: {
          whatHappens: "You lose track of deadlines. Projects with many moving parts feel overwhelming. You forget where you left off.",
          solution: "External project tracking is non-negotiable. Use Asana/Trello/Notion. Break projects into tiny next actions. Daily review of project status."
        },
        impulsive: {
          whatHappens: "You commit to too many projects. You start new things before finishing existing work. You underestimate time required.",
          solution: "Before saying yes, wait 24 hours. Keep a 'current commitments' list visible. Time estimates should be 2x your gut feeling."
        }
      },
      {
        situation: "Open Office Environment",
        filteringDifficulty: {
          whatHappens: "Every conversation, notification, movement grabs your attention. Productive focus is nearly impossible.",
          solution: "Noise-canceling headphones are essential. Book meeting rooms for deep work. Consider remote work days for complex tasks."
        }
      }
    ]
  },

  education: {
    context: "LEARNING & EDUCATION",
    scenarios: [
      {
        situation: "Lectures & Classes",
        inattentive: {
          whatHappens: "You start listening, then your mind wanders. You 'wake up' realizing 15 minutes passed. Notes are incomplete. Reviewing later, there are gaps.",
          solution: "Record lectures (with permission). Take active notes even if incomplete. Review within 24 hours while memory is fresh. Ask for slides in advance."
        },
        hyperactive: {
          whatHappens: "Sitting still for an hour is torture. You fidget, shift position, feel restless. This makes it hard to focus on content.",
          solution: "Sit in the back or near the door for movement freedom. Use a discrete fidget. Take notes by hand (engages motor system)."
        }
      },
      {
        situation: "Studying & Reading",
        inattentive: {
          whatHappens: "You read a page and realize you absorbed nothing. You re-read the same paragraph multiple times. Dense material is exhausting.",
          solution: "Active reading only: highlight, annotate, summarize paragraphs in own words. Read in 15-minute blocks with breaks. Use text-to-speech for variety."
        },
        workingMemoryDifficulty: {
          whatHappens: "You can't hold multiple concepts in mind to connect them. Complex subjects feel overwhelming.",
          solution: "Create visual diagrams and mind maps. Connect new information to things you already know. Teach concepts out loud to yourself."
        }
      },
      {
        situation: "Exams & Tests",
        inattentive: {
          whatHappens: "You know the material but lose focus mid-exam. Careless errors accumulate. Your performance doesn't reflect your knowledge.",
          solution: "Request accommodations (extended time, quiet room). Take micro-breaks during the exam (close eyes, breathe for 30 seconds). Circle back to check work."
        },
        impulsive: {
          whatHappens: "You rush through, answering before fully reading questions. You finish early but with many avoidable errors.",
          solution: "Force yourself to read each question twice before answering. Cover the answers while reading the question. Use all available time."
        }
      }
    ]
  },

  personalLife: {
    context: "PERSONAL LIFE & RELATIONSHIPS",
    scenarios: [
      {
        situation: "Conversations with Partner/Family",
        inattentive: {
          whatHappens: "Your partner talks, you nod, but minutes later you can't remember what was said. They feel ignored or unimportant.",
          solution: "Eye contact and active listening cues. Repeat back key points. Put away phone/screens. Schedule important conversations for high-focus times."
        },
        impulsive: {
          whatHappens: "You interrupt. You react strongly before fully hearing the other person. Conversations become arguments.",
          solution: "Practice the 'let them finish' rule. If you have a thought, write it down and wait. Take a breath before responding."
        }
      },
      {
        situation: "Household Management",
        inattentive: {
          whatHappens: "Bills are paid late. Appointments are missed. Household tasks pile up. You start cleaning one room, get distracted, nothing gets finished.",
          solution: "Automate everything possible (auto-pay bills). Shared family calendar with alerts. Cleaning in short focused bursts (15 min timer, one task)."
        },
        executiveDifficulty: {
          whatHappens: "You're overwhelmed by how much needs to be done. Planning and prioritizing feels impossible.",
          solution: "Focus on ONE next action only. Don't think about everything - just 'what is the very next step?' Take it. Repeat."
        }
      },
      {
        situation: "Time Management & Punctuality",
        inattentive: {
          whatHappens: "You lose track of time. Getting ready takes longer than expected. You're chronically late despite good intentions.",
          solution: "Multiple alarms (30 min before, 15 min before, 'leave now'). Prepare everything the night before. Build in 15-minute buffer for everything."
        },
        hyperfocus: {
          whatHappens: "You get absorbed in something and completely lose track of time. Hours pass without noticing.",
          solution: "Set hard stop alarms that you cannot ignore. Use phone timers with annoying ringtones. Have someone externally interrupt you."
        }
      }
    ]
  }
};

// ============================================================================
// CLINICAL INTERPRETATION GUIDE FOR DOCTORS
// ============================================================================

export const clinicalInterpretationGuide = {
  scoreInterpretation: {
    als: {
      ranges: [
        { range: "75-100", interpretation: "High likelihood of ADHD", clinicalAction: "Full diagnostic workup recommended. Consider referral to psychiatrist/neurologist." },
        { range: "60-74", interpretation: "Elevated indicators suggesting possible ADHD", clinicalAction: "Further assessment warranted. Rule out differentials. Consider DSM-5 structured interview." },
        { range: "45-59", interpretation: "Some indicators present but subthreshold", clinicalAction: "May not meet full criteria but functional impairment possible. Monitor and support." },
        { range: "0-44", interpretation: "Low likelihood based on cognitive testing", clinicalAction: "ADHD less likely based on cognitive profile. Consider other explanations for presenting concerns." }
      ],
      limitations: "ALS is a screening composite. Does NOT replace clinical judgment. Some individuals (high-IQ compensators, predominantly hyperactive type) may score lower despite meeting diagnostic criteria."
    },
    
    mcIndex: {
      clinicalSignificance: "MC Index measures response consistency (attention stability). It's derived from RT standard deviation, tau (attention lapses), and cross-task variability.",
      interpretation: [
        { range: "75-100", meaning: "Stable attention - low variability, consistent performance" },
        { range: "60-74", meaning: "Some variability present but within functional range" },
        { range: "45-59", meaning: "Elevated variability consistent with attention dysregulation" },
        { range: "0-44", meaning: "Marked inconsistency strongly suggestive of attention disorder" }
      ]
    },
    
    tau: {
      clinicalSignificance: "Tau (τ) is the exponential component of the ex-Gaussian RT distribution. It captures attention LAPSES - the 'slow tail' of responses where attention temporarily disengages.",
      interpretation: [
        { range: "<50ms", meaning: "Normal - minimal attention lapse signature" },
        { range: "50-80ms", meaning: "Borderline - some attention lapses present" },
        { range: "80-120ms", meaning: "Elevated - meaningful attention lapse pattern" },
        { range: ">120ms", meaning: "Severe - frequent and significant attention lapses" }
      ],
      whyItMatters: "Tau is MORE sensitive to ADHD than mean RT. Even when average performance looks normal, elevated tau reveals underlying attention instability."
    },
    
    cpi: {
      clinicalSignificance: "Cognitive Processing Index measures how performance degrades under cognitive load (working memory demand, inhibition requirement, interference, task switching).",
      interpretation: [
        { range: "0-20", meaning: "Low cognitive cost - maintains performance under load" },
        { range: "21-40", meaning: "Moderate cognitive cost - some performance degradation" },
        { range: "41-60", meaning: "Elevated cognitive cost - significant load effects" },
        { range: ">60", meaning: "High cognitive cost - performance significantly impacted by complexity" }
      ]
    }
  },
  
  flagInterpretation: {
    compensation: {
      criticalNote: "COMPENSATION IS THE MOST COMMONLY MISSED PATTERN. High-functioning individuals often have normal accuracy but underlying metrics reveal the cognitive cost. Look for: High accuracy + Elevated RT + High RT variability + Subjective exhaustion after cognitive tasks.",
      missedDiagnosis: "Many adults with ADHD, especially women and those with high IQ, have been missed because their compensation masks deficits. They appear 'fine' but are exhausted, anxious, or depressed from unsustainable effort."
    },
    variability: {
      keyIndicator: "Response time variability is the #1 cognitive marker of ADHD. It reflects moment-to-moment attention fluctuation. Even normal mean performance with high variability is concerning."
    }
  },
  
  differentialDiagnosis: {
    sleepDisorders: {
      similarity: "Sleep deprivation causes attention and memory deficits similar to ADHD",
      differentiating: "Sleep disorders typically show consistent impairment; ADHD shows variability. Sleep disorders often improve with sleep; ADHD is persistent."
    },
    depression: {
      similarity: "Depression causes concentration difficulty and reduced motivation",
      differentiating: "Depression shows reduced baseline engagement; ADHD shows variable engagement. Depression improves with mood; ADHD is persistent regardless of mood."
    },
    anxiety: {
      similarity: "Anxiety can impair attention through worry/hypervigilance",
      differentiating: "Anxiety often shows HYPERvigilance (fast responses, high accuracy); ADHD shows variability. Anxiety improves when threat is removed; ADHD is persistent."
    },
    bipolar: {
      similarity: "Manic episodes show impulsivity and distractibility",
      differentiating: "Bipolar is episodic; ADHD is persistent from childhood. Bipolar impulsivity occurs during mood episodes; ADHD impulsivity is consistent."
    }
  }
};

export default {
  domainExplanations,
  clinicalIndicators,
  realLifeScenarios,
  clinicalInterpretationGuide
};
