/**
 * ADHD Cognitive Assessment - Narrative Blocks System
 * 
 * Composable, variation-rich narrative generation without AI.
 * Uses rule-based block selection with randomization for natural variation.
 * 
 * Features:
 * ✔ Composable narrative blocks (maintainable)
 * ✔ Random variation (prevents repetition)
 * ✔ Audience adaptation (patient vs clinician)
 * ✔ 100% deterministic (legally defensible)
 * ✔ Context-aware combinations
 * ✔ Real-world impairment summaries
 * ✔ Symptom pattern mapping
 * ✔ Clinical questions for psychologists
 * ✔ Functional domain tables
 * ✔ Pattern recognition labels
 * ✔ Environment-based interpretation
 * ✔ Personalized interventions
 * ✔ Trait-based summaries
 * ✔ Risk indicators
 * 
 * @version 3.0.0 - Clinical Enhancement System
 */

// ============================================================================
// NARRATIVE BLOCKS LIBRARY
// ============================================================================

export const narrativeBlocks = {
  // ========== MC INDEX NARRATIVES ==========
  mc_intro: {
    veryLow: [
      "exhibited substantial cognitive variability throughout testing",
      "demonstrated marked attention inconsistency across all tasks",
      "showed significant performance fluctuations indicative of attention dysregulation",
      "displayed pronounced moment-to-moment attention variability",
      "revealed considerable instability in sustained cognitive performance"
    ],
    low: [
      "displayed notable attention variability during assessment",
      "showed inconsistent cognitive regulation patterns",
      "demonstrated below-average attention stability",
      "exhibited meaningful fluctuations in focus maintenance",
      "revealed difficulty maintaining consistent cognitive performance"
    ],
    moderate: [
      "exhibited moderate attention consistency throughout testing",
      "demonstrated variable but manageable cognitive control",
      "showed acceptable though not optimal attention stability",
      "displayed typical levels of performance fluctuation",
      "revealed average attention regulation capacity"
    ],
    high: [
      "maintained stable cognitive performance across all tasks",
      "showed consistent attention regulation throughout testing",
      "demonstrated excellent focus stability",
      "exhibited strong moment-to-moment attention consistency",
      "displayed above-average cognitive steadiness"
    ]
  },

  mc_technical: {
    veryLow: [
      "falling significantly below normative expectations",
      "placing in the clinical concern range",
      "substantially deviating from typical performance",
      "indicating marked departure from expected consistency"
    ],
    low: [
      "placing below the expected range for age",
      "indicating suboptimal attention regulation",
      "falling in the borderline-concern range"
    ],
    moderate: [
      "within the average range for age-matched peers",
      "consistent with typical cognitive variation",
      "meeting expected performance standards"
    ],
    high: [
      "exceeding normative expectations",
      "placing in the above-average range",
      "demonstrating superior consistency"
    ]
  },

  // ========== CPI NARRATIVES ==========
  cpi_context: {
    veryHigh: [
      "with severe executive function bottlenecks under cognitive load",
      "revealing significant breakdown when managing competing demands",
      "showing marked interference when multiple systems engaged",
      "indicating substantial cognitive coordination difficulties"
    ],
    high: [
      "showing significant cognitive interference patterns",
      "with notable executive function strain under load",
      "revealing meaningful cognitive bottlenecks",
      "demonstrating elevated processing costs"
    ],
    moderate: [
      "with manageable executive function challenges",
      "showing some cognitive coordination effort required",
      "revealing typical processing demands",
      "demonstrating average cognitive load handling"
    ],
    low: [
      "maintaining efficient cognitive control throughout",
      "with minimal interference between cognitive systems",
      "showing robust executive coordination",
      "demonstrating smooth cognitive integration"
    ]
  },

  cpi_implications: {
    veryHigh: [
      "This level of cognitive interference often manifests as difficulty completing multi-step tasks, frequent mental fatigue, and challenges in environments requiring sustained complex thinking.",
      "Such elevated cognitive costs typically translate to real-world difficulties with planning, prioritization, and maintaining focus during demanding activities.",
      "This pattern suggests that everyday tasks requiring cognitive flexibility may feel disproportionately exhausting."
    ],
    high: [
      "This degree of cognitive load sensitivity may contribute to inconsistent task completion and mental fatigue during demanding activities.",
      "Such patterns often correlate with difficulty in fast-paced environments or when managing multiple responsibilities.",
      "This suggests meaningful effort is required to coordinate cognitive resources effectively."
    ],
    moderate: [
      "While some cognitive load effects are present, they fall within typical ranges and should not significantly impair daily functioning.",
      "This level of cognitive coordination challenge is common and manageable with appropriate strategies."
    ],
    low: [
      "This efficient cognitive integration suggests strong executive capacity that supports complex task management.",
      "Such smooth cognitive coordination is a notable strength that facilitates effective daily functioning."
    ]
  },

  // ========== TAU (ATTENTION LAPSES) NARRATIVES ==========
  tau_intro: {
    severe: [
      "The ex-Gaussian tau parameter revealed frequent attention lapses",
      "Response distribution analysis indicated substantial attentional drift",
      "The attention lapse signature showed marked elevation",
      "Tau analysis revealed a pronounced 'slow response tail'"
    ],
    elevated: [
      "The tau parameter showed elevated attention lapse frequency",
      "Response analysis indicated meaningful attentional fluctuation",
      "The attention lapse indicator was above expected ranges"
    ],
    borderline: [
      "The tau parameter fell in the borderline range",
      "Response distribution showed modest attention lapse presence",
      "Attentional consistency was variable but not markedly impaired"
    ],
    normal: [
      "The tau parameter remained within normal limits",
      "Response distribution showed minimal attention lapse signatures",
      "Attentional consistency was well-maintained throughout"
    ]
  },

  tau_explanation: {
    severe: [
      "indicating that attention periodically 'drops out' leading to substantially delayed responses—a hallmark ADHD cognitive signature",
      "suggesting frequent momentary disengagement from the task at hand",
      "reflecting the characteristic 'attention blink' pattern seen in attention disorders"
    ],
    elevated: [
      "suggesting periodic attention drift requiring re-engagement with the task",
      "indicating occasional momentary focus lapses",
      "reflecting some difficulty maintaining continuous vigilance"
    ],
    borderline: [
      "suggesting attention that occasionally wavers but generally remains adequate",
      "indicating subtle attention fluctuations within manageable ranges"
    ],
    normal: [
      "suggesting well-sustained attention without significant lapses",
      "indicating robust vigilance maintenance throughout testing"
    ]
  },

  // ========== FLAG-SPECIFIC NARRATIVES ==========
  flags: {
    hyperfocus: {
      detected: [
        "Evidence of compensatory hyperfocus was observed, where periods of intense concentration alternated with attention lapses. This paradoxical pattern—high engagement followed by significant drift—is characteristic of ADHD with active compensation.",
        "Testing revealed the 'hyperfocus signature': intervals of exceptional focus interspersed with attention drops. This pattern suggests the brain engages more intensely during novel or challenging moments while struggling with sustained routine attention.",
        "The hyperfocus compensation pattern was evident, indicating the individual may achieve excellent performance in bursts while experiencing difficulty during less stimulating periods."
      ],
      absent: ""
    },
    compensated: {
      detected: [
        "Testing revealed a compensated ADHD pattern, where excellent accuracy was achieved at significant cognitive cost. The individual appears to expend substantial mental resources to maintain performance—a pattern that often leads to fatigue and is unsustainable long-term.",
        "A compensatory effort signature was identified: high accuracy paired with elevated response times and variability. This suggests the individual works considerably harder than typical to achieve results, masking underlying attention difficulties.",
        "The assessment detected effortful symptom management. Despite strong accuracy scores, underlying metrics reveal the cognitive price paid—a common presentation in high-functioning individuals with ADHD."
      ],
      absent: ""
    },
    masking: {
      detected: [
        "Indicators of strategic masking were present, where conscious effort was applied to suppress impulsive responses. While this demonstrates good inhibitory capacity, it also suggests that control requires active effort rather than automatic regulation.",
        "The masking pattern was evident: suppressed variability but persistent slow response signatures. This suggests the individual actively controls outward performance while internal cognitive fluctuation continues.",
        "Strategic overcontrol was detected—the individual appears to consciously regulate attention and impulses, which while effective, represents an energy-intensive coping strategy."
      ],
      absent: ""
    },
    executiveOverload: {
      detected: [
        "Executive overload was indicated by the cognitive pair analysis. When multiple executive systems needed to work together (memory + inhibition + attention), performance degraded substantially—a key ADHD vulnerability.",
        "The assessment revealed executive function bottlenecking: the cognitive system became overwhelmed when multiple demands competed for limited executive resources.",
        "Significant executive overload was present, suggesting difficulty managing cognitive complexity. This often manifests as trouble with multi-step tasks, planning, and situations requiring simultaneous mental operations."
      ],
      absent: ""
    },
    highVariability: {
      detected: [
        "High response variability (elevated tau) represents one of the strongest cognitive signatures of attention dysregulation. This 'inconsistency of inconsistency' distinguishes ADHD-type attention from simple carelessness or motivation issues.",
        "The high variability signature—characterized by unpredictable response timing—was clearly present. This pattern indicates attention that fluctuates moment-to-moment rather than degrading steadily.",
        "Marked variability in cognitive performance was detected, representing a core neurobiological feature of attention disorders rather than a behavioral or motivational issue."
      ],
      absent: ""
    },
    practiceEffect: {
      detected: [
        "Some practice effect was noted, with performance improving somewhat over the testing session. This may slightly underestimate attention difficulties, as familiarity with the tasks may have aided performance.",
        "Testing showed evidence of task familiarization, where later performance exceeded initial trials. Results should be interpreted with this learning effect in mind."
      ],
      absent: ""
    }
  },

  // ========== CLINICAL IMPLICATIONS BY SCORE COMBINATION ==========
  implications: {
    'low_mc_high_cpi': [
      "This combination is highly characteristic of ADHD, where both attention stability and executive efficiency are compromised. The pattern suggests neurobiological attention dysregulation rather than situational factors.",
      "The convergence of attention variability and executive bottlenecking creates a clinically significant pattern strongly associated with ADHD presentations.",
      "Both core markers—attention consistency and cognitive efficiency—show impairment, representing a classic ADHD cognitive profile."
    ],
    'low_mc_low_cpi': [
      "The discrepancy between attention variability and preserved executive efficiency is noteworthy. This may suggest compensated ADHD, high cognitive reserve, or attention difficulties in a specific domain.",
      "While attention stability is impaired, executive coordination remains intact—a pattern sometimes seen in predominantly inattentive presentations or when strong compensation strategies are employed.",
      "This pattern warrants careful interpretation: attention instability without executive breakdown may represent subclinical ADHD, specific attention vulnerabilities, or effective compensation."
    ],
    'high_mc_high_cpi': [
      "While attention remains relatively stable, high cognitive costs suggest effortful maintenance of performance. This 'hidden struggle' pattern may represent masked ADHD or compensated attention difficulties.",
      "The combination of adequate consistency with elevated cognitive costs indicates that performance may be maintained through extra effort—a pattern often seen in high-functioning individuals managing attention challenges.",
      "Stable attention paired with executive strain suggests compensation is occurring. The individual may appear unimpaired but is working harder than typical to achieve results."
    ],
    'high_mc_low_cpi': [
      "Both attention stability and cognitive efficiency fall within expected ranges, making ADHD unlikely based on these objective measures.",
      "The pattern of strong attention consistency and smooth cognitive integration does not align with typical ADHD presentations.",
      "Cognitive performance across domains was robust, suggesting intact attention and executive systems."
    ]
  },

  // ========== WORKING MEMORY LOAD NARRATIVES ==========
  wmLoad: {
    collapse: [
      "Working memory showed significant load sensitivity: performance dropped sharply as memory demands increased. This 'cognitive cliff' pattern suggests limited working memory capacity that becomes overwhelmed under pressure.",
      "The working memory load response revealed a collapse pattern, where increasing demands triggered disproportionate performance degradation. This vulnerability often impacts tasks requiring mental juggling.",
      "Under working memory load, performance deteriorated substantially. This pattern indicates difficulty maintaining information while simultaneously processing—a common ADHD-related challenge."
    ],
    decline: [
      "Working memory showed moderate load sensitivity, with performance declining somewhat as demands increased. This represents some vulnerability to cognitive load, though not as severe as a collapse pattern.",
      "The working memory load response showed a gradual decline, indicating some difficulty scaling to increased demands while maintaining adequate baseline function."
    ],
    stable: [
      "Working memory remained stable under increasing load, demonstrating robust capacity to maintain and manipulate information even as demands escalated.",
      "The working memory load response was impressive, with performance maintained across difficulty levels—suggesting strong working memory capacity."
    ]
  },

  // ========== CONFLICT SENSITIVITY NARRATIVES ==========
  conflict: {
    high: [
      "Conflict sensitivity was elevated, with distracting information significantly impacting response speed and accuracy. This suggests difficulty filtering irrelevant stimuli—a common attention-related challenge.",
      "The interference control analysis revealed high susceptibility to conflicting information, indicating that distractions may substantially impact focus and performance.",
      "Significant conflict cost was observed, suggesting the filtering mechanisms that screen out irrelevant information are working less efficiently than typical."
    ],
    moderate: [
      "Conflict sensitivity was within typical ranges, showing some impact from distracting information but within manageable levels.",
      "The interference control pattern showed moderate conflict effects, consistent with normal variation in distraction filtering."
    ],
    low: [
      "Conflict sensitivity was low, with minimal impact from distracting information. This suggests robust filtering of irrelevant stimuli.",
      "Excellent interference control was demonstrated, with distracting information having little effect on performance."
    ],
    paradoxical: [
      "Interestingly, performance during high-conflict trials was paradoxically strong—a pattern sometimes seen in ADHD where increased challenge engages hyperfocus mechanisms.",
      "The conflict response showed a paradoxical pattern: better performance under distraction. This 'engagement under challenge' signature is characteristic of ADHD-related hyperfocus."
    ]
  },

  // ========== DSM-5 CORRELATION NARRATIVES ==========
  dsm5_alignment: {
    strong: [
      "Your cognitive test performance strongly aligns with your self-reported symptoms, creating a convergent picture. Both objective measures and subjective experience point in the same direction, increasing confidence in these findings.",
      "The correlation between self-reported symptoms and objective cognitive patterns is strong. This alignment of internal experience with measurable performance adds validity to the overall assessment.",
      "Subjective and objective data converge meaningfully: what you experience internally matches what cognitive testing reveals, strengthening the clinical significance of these findings."
    ],
    objective_elevated: [
      "Cognitive tests revealed more difficulty than you reported subjectively. This pattern is common when individuals have normalized their struggles, developed strong coping strategies, or have high standards that mask relative difficulties.",
      "Your objective performance suggests more attention-related challenges than your self-report indicated. This may reflect high self-expectations, effective compensation strategies, or difficulty recognizing symptoms that have become 'normal.'",
      "The discrepancy between low self-reported symptoms and elevated objective markers may indicate successful masking, high cognitive reserve compensating for difficulties, or challenges with symptom awareness."
    ],
    subjective_elevated: [
      "Your self-reported symptoms exceed what cognitive tests revealed. This may indicate that difficulties are situational, that other factors (stress, mood, sleep) are contributing to your experience, or that testing conditions don't fully capture your daily challenges.",
      "Subjective experience was elevated relative to objective measures. This pattern can occur when symptoms are context-dependent, when testing conditions (novel, structured) bring out better performance, or when other conditions contribute to attention complaints.",
      "The discrepancy between elevated self-report and moderate objective findings warrants exploration. Daily life may present challenges that structured testing doesn't capture, or other factors may be contributing to experienced difficulties."
    ],
    concordant_low: [
      "Both self-report and objective testing are within normal ranges, suggesting adequate attention function. If difficulties are experienced, they may be situational or related to factors outside the scope of this assessment.",
      "The convergence of low symptoms and normal cognitive performance suggests that ADHD is unlikely. Any attention difficulties experienced may be situational, stress-related, or within normal human variation."
    ]
  },

  // ========== SUBTYPE NARRATIVES ==========
  subtype: {
    inattentive: {
      intro: [
        "Your cognitive profile aligns with the Predominantly Inattentive presentation pattern. The core feature is attention instability without significant motor impulsivity.",
        "The assessment pattern is most consistent with an inattentive cognitive architecture—difficulty maintaining steady focus without the hyperactive-impulsive features.",
        "Testing revealed the 'quiet' ADHD pattern: internal attention drift rather than external hyperactivity."
      ],
      characteristics: [
        "This presentation often manifests as difficulty with sustained mental effort, losing track of conversations, forgetting tasks, and mental fatigue. Others may describe you as 'spacey' or 'daydreamy' rather than hyperactive.",
        "Common experiences include: mind wandering during reading or conversations, forgetting why you walked into a room, difficulty following multi-step instructions, and feeling mentally exhausted after tasks others find routine.",
        "This pattern often goes unrecognized because there are no obvious behavioral signs. The struggle is internal—requiring significant effort to maintain focus that others achieve automatically."
      ]
    },
    hyperactive: {
      intro: [
        "Your cognitive profile aligns with the Predominantly Hyperactive-Impulsive presentation pattern. The core feature is elevated impulsivity with relatively preserved attention stability.",
        "The assessment pattern is most consistent with a hyperactive-impulsive cognitive architecture—difficulty inhibiting responses while attention maintenance remains relatively intact.",
        "Testing revealed an impulsivity-dominant pattern: response control challenges without marked attention instability."
      ],
      characteristics: [
        "This presentation often manifests as interrupting others, acting without thinking, difficulty waiting, restlessness, and making quick decisions without considering consequences.",
        "Common experiences include: feeling driven to move or talk, difficulty staying seated, making hasty decisions you later regret, and feeling internal restlessness even when physically still.",
        "This pattern is often more visible than the inattentive type, though in adults, the hyperactivity often becomes internal restlessness rather than obvious motor hyperactivity."
      ]
    },
    combined: {
      intro: [
        "Your cognitive profile aligns with the Combined presentation pattern, showing features of both attention instability and impulsivity.",
        "The assessment pattern is consistent with combined-type cognitive architecture—difficulties in both sustained attention and impulse control domains.",
        "Testing revealed both attention variability and impulse control challenges, suggesting a combined presentation."
      ],
      characteristics: [
        "This presentation combines difficulties with sustained focus AND impulse control, creating challenges across many daily activities. Both 'spacing out' and 'acting without thinking' may be familiar experiences.",
        "Common experiences include: difficulty focusing on one task while also struggling to wait your turn, mental wandering combined with physical restlessness, and challenges in both slow/boring and fast-paced situations.",
        "The combined pattern often represents the most pervasive impact, as difficulties span multiple domains of cognitive control."
      ]
    },
    subthreshold: {
      intro: [
        "Your cognitive profile shows some elevated markers but does not fit a clear clinical pattern. You may experience situational difficulties without meeting full diagnostic criteria.",
        "Testing revealed subclinical patterns—some attention or impulse markers elevated without reaching clear diagnostic thresholds.",
        "The assessment suggests some cognitive vulnerabilities without a dominant presentation pattern."
      ],
      characteristics: [
        "You may notice attention challenges in specific situations (stress, fatigue, low interest) while functioning well in others. This variability is common in subclinical presentations.",
        "Situational factors like sleep, stress, motivation, and environmental stimulation may significantly influence your attention and impulse control.",
        "While not meeting full criteria, these patterns may still benefit from attention strategies and environmental modifications."
      ]
    }
  },

  // ========== REAL-LIFE IMPACT NARRATIVES ==========
  realLife: {
    variability: {
      title: "Why Plans Fall Apart",
      icon: "📋",
      descriptions: [
        "Your attention fluctuates naturally, meaning you might start a task with full focus but find yourself drifting after a few minutes. This isn't laziness—your brain's 'focus fuel' burns unevenly.",
        "The attention variability pattern means focus comes in waves rather than streams. You may have noticed that starting tasks feels different from sustaining them.",
        "Your brain's attention regulation works differently: instead of steady focus, you experience peaks and valleys. This explains why some moments feel crystal clear while others feel foggy."
      ],
      tips: [
        "Break tasks into 15-20 minute chunks with brief movement breaks.",
        "Use timers to work with your attention cycles rather than against them.",
        "Build natural stopping points into tasks before attention typically fades."
      ]
    },
    workingMemory: {
      title: "Why You Forget What You Were Doing",
      icon: "🧠",
      descriptions: [
        "Your working memory—the mental 'sticky note'—has limited capacity. When interrupted, the information simply falls off. This is biological, not carelessness.",
        "Working memory is like a small whiteboard that gets erased easily. Once information fades, it's gone—which is why interruptions can be so disruptive.",
        "Your mental 'holding space' fills up quickly. This explains losing track mid-task, forgetting why you walked into a room, or struggling to hold multiple pieces of information."
      ],
      tips: [
        "Externalize everything: use lists, reminders, and visual cues.",
        "Write things down immediately—don't trust that you'll remember.",
        "Use consistent locations for important items to reduce memory load."
      ]
    },
    compensation: {
      title: "Why You Feel Exhausted",
      icon: "😓",
      descriptions: [
        "Your brain is working overtime to appear 'normal.' The high accuracy you achieve comes at a massive energy cost. This compensatory effort is exhausting and may explain why you feel drained after tasks others find easy.",
        "You're running a cognitive marathon while others jog. The effort to maintain focus and control responses is genuinely depleting—your tiredness is real and earned.",
        "Compensation is like driving a car that requires constant steering correction. You arrive at the destination, but you're exhausted from the effort that should have been automatic."
      ],
      tips: [
        "Give yourself permission to rest—your brain IS working harder.",
        "Schedule recovery time after demanding tasks.",
        "Recognize that 'easy' tasks for others may genuinely be harder for you."
      ]
    },
    hyperfocus: {
      title: "Why Focus Comes Randomly",
      icon: "🔥",
      descriptions: [
        "Your brain can achieve intense focus—but it's not controllable. This 'hyperfocus' often activates for novel, urgent, or highly interesting tasks, while routine tasks feel impossible.",
        "The same brain that can't focus on boring tasks can hyper-lock onto engaging ones. This isn't a contradiction—it's how your attention system responds to stimulation levels.",
        "Hyperfocus is your brain's 'high engagement' mode. The challenge is that you can't summon it on demand—it responds to interest and urgency more than importance."
      ],
      tips: [
        "Leverage interest: find ways to make important tasks more engaging.",
        "Add urgency through accountability partners or deadlines.",
        "Accept that some tasks will never feel interesting—use external structure instead."
      ]
    },
    switching: {
      title: "Why Switching Tasks Is Hard",
      icon: "🔄",
      descriptions: [
        "Your brain needs more time to shift between different activities. Quick context-switching that others do easily requires significant mental effort for you.",
        "Task switching involves 'mental gear changes' that happen slowly for your brain. This isn't resistance—it's processing time.",
        "Transitions between activities are cognitively expensive for you. This explains difficulty stopping one thing to start another, even when you want to."
      ],
      tips: [
        "Batch similar tasks together to minimize switching.",
        "Build transition rituals that signal your brain to shift.",
        "Allow buffer time between different types of activities."
      ]
    },
    notLaziness: {
      title: "Why This Isn't Laziness",
      icon: "❤️",
      descriptions: [
        "These patterns are neurological, not motivational. You're not choosing to be inconsistent or forgetful—your brain processes attention differently. Understanding this can help reduce self-blame.",
        "Willpower doesn't fix brain wiring. The difficulties you experience come from cognitive architecture, not character flaws.",
        "You're not broken—you're different. Your brain has a different operating system that society isn't designed for."
      ],
      tips: [
        "Self-compassion is not an excuse—it's accurate self-knowledge.",
        "Design your environment to work with your brain, not against it.",
        "Seek support from those who understand neurological differences."
      ]
    }
  },

  // ========== RECOMMENDATION TEMPLATES ==========
  recommendations: {
    professional: [
      "Schedule a comprehensive evaluation with a qualified healthcare provider (psychiatrist, psychologist, or ADHD specialist) for formal assessment and diagnosis discussion.",
      "Consult with a mental health professional experienced in adult ADHD for comprehensive evaluation.",
      "Consider neuropsychological testing for detailed cognitive profiling and treatment planning."
    ],
    treatment: [
      "Discuss potential treatment options including behavioral therapy and/or medication with a qualified provider.",
      "Explore evidence-based interventions such as cognitive behavioral therapy adapted for ADHD.",
      "Consider working with an ADHD coach to develop personalized coping strategies."
    ],
    compensation_specific: [
      "Discuss compensation strategies with a professional—while helpful, they may be depleting your mental resources.",
      "Consider whether current coping mechanisms are sustainable long-term.",
      "Evaluate whether your high performance comes at an unsustainable energy cost."
    ],
    variability_specific: [
      "Practice attention training exercises and mindfulness meditation.",
      "Use external structure, timers, and reminders to maintain consistency.",
      "Design your environment to support focus rather than relying solely on internal regulation."
    ],
    general: [
      "Maintain consistent sleep schedule (7-9 hours)—sleep profoundly affects attention.",
      "Regular physical exercise (shown to improve attention and executive function).",
      "Consider environmental modifications to reduce distractions.",
      "Use productivity tools designed for attention challenges (timers, blocking apps, visual reminders)."
    ],
    lifestyle: [
      "Prioritize sleep: it's foundational for attention regulation.",
      "Regular exercise: 30 minutes, 4-5 times/week has strong evidence for improving attention.",
      "Reduce decision fatigue through routines and habits.",
      "Optimize your environment: minimize distractions, use visual cues."
    ]
  },

  // ========== SIMPLE SUMMARY NARRATIVES ==========
  simpleSummary: {
    typical: [
      "Your brain's attention systems are working well. Your results are within the typical range.",
      "Good news: both your focus and impulse control appear to be functioning normally.",
      "Your cognitive assessment results don't show patterns typically associated with ADHD."
    ],
    mild: [
      "Your brain shows some attention inconsistencies, but nothing severe. You might benefit from some focus strategies.",
      "There are some mild attention patterns worth noting, though they don't reach clinical concern levels.",
      "Your results show some variability that might occasionally affect daily life, but overall function appears adequate."
    ],
    moderate: [
      "Your brain shows notable attention patterns that may be causing daily challenges. Professional evaluation could be helpful.",
      "The assessment revealed patterns consistent with attention difficulties that may benefit from professional evaluation.",
      "Your cognitive profile suggests attention regulation challenges that warrant further exploration with a specialist."
    ],
    significant: [
      "Your brain shows significant attention patterns strongly associated with ADHD. We recommend professional evaluation.",
      "The assessment revealed clear patterns consistent with ADHD. Consulting with a healthcare provider is strongly recommended.",
      "Your cognitive profile shows substantial attention dysregulation. Professional evaluation and support could make a meaningful difference."
    ],
    compensated: [
      "Important: Your accuracy looks good, but you're working extra hard to achieve it. Your brain is compensating, which is exhausting.",
      "Your results reveal a hidden struggle: good performance achieved at high cognitive cost. This compensation pattern is common in undiagnosed ADHD.",
      "While your accuracy appears strong, underlying patterns suggest you're working much harder than typical to maintain performance."
    ]
  },

  // ========== VALIDITY INDICATORS ==========
  validity: {
    good: [
      "Session validity confirmed with consistent response patterns throughout testing.",
      "Data quality indicators suggest valid, effortful engagement with all tasks.",
      "Response consistency and timing patterns support reliable interpretation of results."
    ],
    moderate: [
      "Testing showed acceptable validity with some noted variability in engagement.",
      "Results appear valid overall, though some inconsistency in response patterns was noted."
    ],
    concerns: [
      "Some validity concerns were noted. Results should be interpreted with caution.",
      "Response patterns showed some irregularity that may affect interpretation accuracy."
    ]
  },

  // ========== INTAKE SUMMARY ==========
  intake: {
    welcome: [
      "Thank you for completing this comprehensive cognitive assessment. This report summarizes your performance across multiple attention and executive function tasks.",
      "This report presents the findings from your comprehensive cognitive assessment battery. We analyzed your performance across several attention and executive function measures.",
      "Welcome to your cognitive assessment results. The following report details your performance across standardized attention and executive function tasks."
    ],
    ageContext: [
      "At {age} years of age, your cognitive profile has been compared against age-appropriate norms.",
      "Your results have been interpreted considering your age ({age} years) and relevant developmental expectations.",
      "As a {age}-year-old, your performance is evaluated against standardized norms for your age group."
    ],
    combined: [
      "Based on your self-reported symptoms, you indicated experiencing difficulties in both attention/focus AND hyperactivity/impulsivity domains.",
      "Your symptom profile shows challenges across both attention regulation and impulse control domains.",
      "Self-reported symptoms reveal a combined pattern affecting both sustained attention and behavioral inhibition."
    ],
    inattentive: [
      "Based on your self-reported symptoms, you primarily indicated difficulties with attention and focus.",
      "Your symptom profile shows predominant challenges with attention regulation and concentration.",
      "Self-reported symptoms suggest primary difficulties with sustained attention, organization, and focus."
    ],
    hyperactive: [
      "Based on your self-reported symptoms, you primarily indicated difficulties with restlessness and impulse control.",
      "Your symptom profile shows predominant challenges with impulse control and physical restlessness.",
      "Self-reported symptoms suggest primary difficulties with behavioral inhibition and activity regulation."
    ],
    criteriaNote: [
      "Notably, your self-reported symptoms meet DSM-5 symptom count thresholds for {domains}. This does NOT constitute a diagnosis, as additional criteria must be evaluated by a qualified clinician.",
      "Your symptom endorsements reach clinical threshold for {domains} per DSM-5 criteria. Remember: a formal diagnosis requires comprehensive clinical evaluation.",
      "Symptom counts for {domains} meet DSM-5 thresholds. Professional evaluation is needed to confirm diagnosis and rule out other conditions."
    ],
    closing: [
      "The following analysis integrates both your reported experiences and measured cognitive performance to provide a comprehensive picture of your attention-related functioning.",
      "This report combines your subjective experiences with objective cognitive measurements for a holistic understanding of your attention patterns.",
      "Below you'll find an integrated analysis merging your self-reported experiences with standardized cognitive test results."
    ]
  },

  // ========== REAL-WORLD IMPAIRMENT BLOCKS ==========
  realWorldImpairment: {
    inattention: {
      severe: [
        "Inattention significantly impacts daily functioning. Common experiences include: frequently losing important items, missing deadlines despite good intentions, difficulty completing routine tasks, and struggling to follow through on commitments.",
        "Daily life is substantially affected by attention difficulties. This often manifests as chronic disorganization, difficulty managing time, frequent task abandonment, and challenges maintaining focus during conversations.",
        "Attention dysregulation creates pervasive daily challenges including: task initiation paralysis, chronic lateness, difficulty prioritizing, and a pattern of starting many projects but completing few."
      ],
      moderate: [
        "Inattention creates noticeable daily challenges. Common experiences include: occasional forgetfulness, difficulty sustaining focus on less interesting tasks, and inconsistent follow-through on longer projects.",
        "Attention variability affects daily routines in meaningful ways. This may include: periodic difficulty with organization, mind-wandering during meetings, and needing extra effort to stay on track.",
        "Moderate attention difficulties may manifest as: uneven productivity, occasional missed details, and difficulty maintaining focus when tasks lack immediate interest or urgency."
      ],
      mild: [
        "Mild attention variability may occasionally affect daily tasks, particularly during periods of stress, fatigue, or low motivation.",
        "Some attention fluctuation is present but generally manageable. May notice occasional difficulty with sustained focus on routine tasks.",
        "Attention is mostly stable with minor fluctuations that rarely significantly impact daily functioning."
      ]
    },
    impulsivity: {
      severe: [
        "Impulsivity significantly affects relationships and decision-making. Common patterns include: interrupting others frequently, making hasty decisions with regret, difficulty waiting turn, and emotional reactions that feel disproportionate.",
        "High impulsivity creates interpersonal challenges. This often manifests as: speaking without thinking, difficulty in conflict situations, impulsive purchases or commitments, and strained relationships due to perceived insensitivity.",
        "Impulsive patterns substantially impact social and professional relationships. Common experiences include: blurting out thoughts inappropriately, difficulty with patience, and acting on emotions before processing them."
      ],
      moderate: [
        "Impulsivity creates some interpersonal friction. May include: occasional interrupting, sometimes acting before fully thinking, and periodic difficulty with patience in slow-moving situations.",
        "Moderate impulsivity affects some interactions. This may manifest as: occasional premature responses, some difficulty with delayed gratification, and periodic regret over hasty decisions.",
        "Some impulsive tendencies are noticeable in relationships. May experience occasional speaking out of turn or making decisions that later seem hasty."
      ],
      mild: [
        "Mild impulsivity is present but generally well-managed. Occasional hasty responses may occur under stress.",
        "Impulse control is mostly adequate with minor challenges in high-emotion or high-pressure situations.",
        "Impulsivity is within normal range with occasional minor difficulties waiting or holding back responses."
      ]
    },
    processingSpeed: {
      slow: [
        "Slower processing speed significantly affects academic and work performance. Common impacts include: needing extra time to complete tasks, feeling rushed on timed activities, difficulty keeping up with fast-paced discussions, and high mental fatigue.",
        "Processing speed difficulties create substantial challenges. This often manifests as: understanding concepts but responding slowly, requiring extra time on tests and assignments, and mental exhaustion from effortful processing.",
        "Slow processing significantly impacts productivity. Common experiences include: difficulty with time-pressured tasks, falling behind in fast-paced environments, and completing fewer tasks despite understanding and capability."
      ],
      moderate: [
        "Moderate processing speed challenges may affect some timed or fast-paced activities. May need occasional extra time to gather thoughts or complete complex tasks.",
        "Processing speed is somewhat slower than typical. This may create challenges with rapid task-switching, keeping pace in group discussions, or completing timed assessments.",
        "Some processing speed limitations are present. May experience occasional difficulty with time pressure but generally compensates adequately."
      ],
      adequate: [
        "Processing speed is within expected ranges and should not significantly impact academic or work performance.",
        "Cognitive processing occurs at a typical pace, allowing adequate response to time-pressured situations.",
        "Processing speed supports efficient task completion in most contexts."
      ]
    },
    workingMemory: {
      impaired: [
        "Working memory difficulties significantly impact daily function. Common experiences include: forgetting what you were about to say, losing track mid-task, difficulty following multi-step instructions, and mental overload when juggling information.",
        "Working memory limitations create substantial challenges. This often manifests as: difficulty holding information while using it, forgetting items from short lists, losing place in complex tasks, and needing to re-read or re-hear information.",
        "Impaired working memory significantly affects cognitive efficiency. Common impacts include: difficulty with mental math, forgetting earlier parts of conversations, and struggling with tasks requiring simultaneous information management."
      ],
      moderate: [
        "Moderate working memory limitations may affect some complex tasks. May occasionally lose track of information when managing multiple demands.",
        "Working memory shows some vulnerability. This may manifest as occasional difficulty holding information while processing it, particularly under stress or fatigue.",
        "Some working memory challenges are present. May need external aids like notes or lists more than typical to manage complex information."
      ],
      adequate: [
        "Working memory capacity is adequate for most daily demands.",
        "Working memory functions within expected ranges and supports typical cognitive tasks.",
        "Working memory is a relative strength that helps compensate for other areas."
      ]
    }
  },

  // ========== SYMPTOM PATTERN MAPPING ==========
  symptomPatternMapping: {
    sustainedAttention: {
      high: {
        score: "High (80-100%)",
        strengths: [
          "Can focus well on structured or externally guided tasks",
          "Maintains attention during engaging or novel activities",
          "Completes tasks efficiently when interested"
        ],
        challenges: [
          "May struggle when tasks are long, boring, or self-directed",
          "Focus quality drops significantly with low stimulation",
          "May rely heavily on interest/urgency for engagement"
        ]
      },
      moderate: {
        score: "Moderate (50-79%)",
        strengths: [
          "Can sustain attention adequately for moderate periods",
          "Generally maintains focus with some effort"
        ],
        challenges: [
          "Attention wavers during extended tasks",
          "May need breaks or external structure to stay on track",
          "Inconsistent focus depending on task characteristics"
        ]
      },
      low: {
        score: "Low (0-49%)",
        strengths: [
          "May perform well in short, high-interest bursts"
        ],
        challenges: [
          "Significant difficulty sustaining attention",
          "Frequent mind-wandering and task disengagement",
          "Requires substantial external structure and support"
        ]
      }
    },
    processingSpeed: {
      high: {
        score: "High (80-100%)",
        strengths: [
          "Quick to respond and process information",
          "Handles time pressure well",
          "Efficient completion of routine tasks"
        ],
        challenges: [
          "May sacrifice accuracy for speed",
          "Could miss details in rush to complete",
          "May become impatient with slower processes"
        ]
      },
      moderate: {
        score: "Moderate (50-79%)",
        strengths: [
          "Adequate pace for most tasks",
          "Reasonable balance of speed and accuracy"
        ],
        challenges: [
          "May struggle with strict time limits",
          "Some tasks may feel rushed"
        ]
      },
      low: {
        score: "Low (0-49%)",
        strengths: [
          "Understands material despite slower response",
          "May be more thorough due to deliberate pace"
        ],
        challenges: [
          "Responds slower than expected despite understanding",
          "Needs extra time to complete tasks",
          "High mental fatigue risk with extended effort"
        ]
      }
    },
    inhibitoryControl: {
      high: {
        score: "High (80-100%)",
        strengths: [
          "Strong impulse control",
          "Can pause before reacting",
          "Makes deliberate decisions"
        ],
        challenges: [
          "May over-control responses (slow, hesitant)",
          "Could appear overly cautious"
        ]
      },
      moderate: {
        score: "Moderate (50-79%)",
        strengths: [
          "Generally adequate impulse control",
          "Can inhibit when focused"
        ],
        challenges: [
          "Occasional impulsive responses",
          "Control weakens under stress or fatigue"
        ]
      },
      low: {
        score: "Low (0-49%)",
        strengths: [
          "Quick reactions in emergencies",
          "Spontaneous, action-oriented"
        ],
        challenges: [
          "Frequent impulsive responses",
          "Difficulty stopping automatic reactions",
          "May interrupt or blurt out inappropriately"
        ]
      }
    },
    workingMemory: {
      high: {
        score: "High (80-100%)",
        strengths: [
          "Can hold and manipulate multiple pieces of information",
          "Follows complex instructions well",
          "Strong mental calculation ability"
        ],
        challenges: [
          "May overload by taking on too much mentally"
        ]
      },
      moderate: {
        score: "Moderate (50-79%)",
        strengths: [
          "Adequate capacity for typical demands"
        ],
        challenges: [
          "May struggle with complex multi-step tasks",
          "Benefits from external memory aids"
        ]
      },
      low: {
        score: "Low (0-49%)",
        strengths: [
          "Works well with single-focus tasks"
        ],
        challenges: [
          "Easily loses track of information",
          "Difficulty following multi-step instructions",
          "Forgets earlier parts of conversations or tasks"
        ]
      }
    },
    cognitiveFlexibility: {
      high: {
        score: "High (80-100%)",
        strengths: [
          "Adapts quickly to changing demands",
          "Switches between tasks efficiently",
          "Handles unexpected changes well"
        ],
        challenges: [
          "May switch too quickly without completion"
        ]
      },
      moderate: {
        score: "Moderate (50-79%)",
        strengths: [
          "Can shift focus when given time to adjust"
        ],
        challenges: [
          "Transitions between tasks require extra effort",
          "May feel disrupted by unexpected changes"
        ]
      },
      low: {
        score: "Low (0-49%)",
        strengths: [
          "Strong focus once engaged in a task"
        ],
        challenges: [
          "Significant difficulty switching tasks",
          "Gets stuck in mental sets",
          "Struggles with unexpected changes to plans"
        ]
      }
    }
  },

  // ========== CLINICAL QUESTIONS FOR PSYCHOLOGIST ==========
  clinicalQuestions: {
    attention: [
      "When did you first notice attention difficulties?",
      "How do attention challenges affect your work or academic performance?",
      "Do you notice different attention patterns depending on task interest level?",
      "What strategies have you tried to manage attention difficulties?",
      "How does your attention compare in structured vs. unstructured environments?"
    ],
    impulsivity: [
      "How often do you act without thinking through consequences?",
      "Have impulsive decisions created problems in relationships or at work?",
      "Do you notice patterns in when impulsivity is worse?",
      "What helps you pause before acting impulsively?",
      "How do others describe your communication style?"
    ],
    processingSpeed: [
      "Do you often feel like you need more time than others?",
      "How do you cope with time-pressured situations?",
      "Does mental fatigue significantly impact your day?",
      "What accommodations have been helpful for you?",
      "How does processing speed affect your confidence?"
    ],
    workingMemory: [
      "How often do you lose track of what you were doing?",
      "What strategies do you use to remember information?",
      "How does forgetfulness affect your relationships?",
      "Do you rely heavily on external reminders?",
      "How do you manage multi-step tasks?"
    ],
    compensation: [
      "Do you feel you work harder than others to achieve similar results?",
      "How exhausted do you feel at the end of a typical day?",
      "What coping strategies have you developed over time?",
      "Do you mask or hide your difficulties from others?",
      "Has compensation become unsustainable at times?"
    ],
    emotionalRegulation: [
      "How quickly do your emotions shift?",
      "Do you experience emotional reactions that feel disproportionate?",
      "How sensitive are you to rejection or criticism?",
      "Do you struggle with frustration tolerance?",
      "How do emotions affect your cognitive performance?"
    ],
    history: [
      "Were similar patterns present in childhood?",
      "How have symptoms changed over time?",
      "What was your academic experience like?",
      "Are there family members with similar patterns?",
      "What major life events have affected your symptoms?"
    ]
  },

  // ========== FUNCTIONAL DOMAIN TABLE DATA ==========
  functionalDomains: {
    academics: {
      domain: "Academics/Learning",
      strengthPatterns: {
        highAttention: "Grasps concepts well in structured settings",
        highWM: "Strong comprehension and information retention",
        highProcessing: "Completes assignments efficiently",
        highInhibition: "Good test-taking behavior",
        highFlexibility: "Adapts to different subjects easily"
      },
      challengePatterns: {
        lowAttention: "Difficulty with long lectures or reading assignments",
        lowWM: "Struggles to remember instructions or earlier material",
        lowProcessing: "Slow completion despite understanding",
        lowInhibition: "Careless errors on tests",
        lowFlexibility: "Difficulty shifting between subjects or approaches"
      }
    },
    work: {
      domain: "Work/Professional",
      strengthPatterns: {
        highAttention: "Productive in focused work environments",
        highWM: "Handles complex projects well",
        highProcessing: "Meets deadlines efficiently",
        highInhibition: "Professional communication",
        highFlexibility: "Adapts to changing priorities"
      },
      challengePatterns: {
        lowAttention: "Inconsistent productivity, missed details",
        lowWM: "Difficulty with multi-project management",
        lowProcessing: "Struggles with fast-paced environments",
        lowInhibition: "May speak impulsively in meetings",
        lowFlexibility: "Task switching difficulty, gets stuck"
      }
    },
    social: {
      domain: "Social/Relationships",
      strengthPatterns: {
        highAttention: "Engaged listener in conversations",
        highWM: "Remembers details about others",
        highProcessing: "Quick-witted in social situations",
        highInhibition: "Thoughtful, measured responses",
        highFlexibility: "Adapts well to social dynamics"
      },
      challengePatterns: {
        lowAttention: "Loses track in conversations, seems disinterested",
        lowWM: "Forgets names, plans, commitments",
        lowProcessing: "Delayed responses, difficulty keeping up",
        lowInhibition: "Interrupting, impulsive reactions",
        lowFlexibility: "Difficulty with unexpected social situations"
      }
    },
    dailyLife: {
      domain: "Daily Life/Self-Care",
      strengthPatterns: {
        highAttention: "Consistent routines possible",
        highWM: "Manages schedules and tasks well",
        highProcessing: "Efficient in daily tasks",
        highInhibition: "Good health choices",
        highFlexibility: "Handles daily surprises well"
      },
      challengePatterns: {
        lowAttention: "Chronic disorganization, loses items",
        lowWM: "Forgetfulness, time-blindness",
        lowProcessing: "Tasks take longer than expected",
        lowInhibition: "Impulsive spending, eating, decisions",
        lowFlexibility: "Distress when routines are disrupted"
      }
    },
    emotional: {
      domain: "Emotional/Self-Regulation",
      strengthPatterns: {
        highAttention: "Can focus on emotional regulation strategies",
        highWM: "Remembers coping strategies in moment",
        highProcessing: "Processes emotions efficiently",
        highInhibition: "Controls emotional expressions well",
        highFlexibility: "Recovers from setbacks quickly"
      },
      challengePatterns: {
        lowAttention: "Difficulty maintaining emotional awareness",
        lowWM: "Forgets coping strategies when needed",
        lowProcessing: "Slow to process emotional events",
        lowInhibition: "Quick emotional reactions",
        lowFlexibility: "Gets stuck in emotional states"
      }
    }
  },

  // ========== PATTERN RECOGNITION LABELS ==========
  patternLabels: {
    compensatedADHD: {
      label: "Compensated ADHD Pattern",
      criteria: ["highAccuracy", "highRT", "elevatedVariability", "highCognitiveEffort"],
      description: "High accuracy achieved through significant cognitive effort. Performance appears normal but is metabolically costly and often unsustainable.",
      clinicalNote: "Consider hidden struggle—individual may appear unimpaired but experiences substantial fatigue and effort.",
      icon: "🎭"
    },
    executiveDysfunction: {
      label: "Executive Dysfunction Profile",
      criteria: ["lowWM", "lowFlexibility", "highCPI", "taskManagementDifficulty"],
      description: "Primary challenges in executive control systems affecting planning, organization, and task management rather than pure attention.",
      clinicalNote: "May benefit more from organizational interventions than attention-focused strategies.",
      icon: "🧩"
    },
    inconsistentAttention: {
      label: "Inconsistent Attentional Regulation",
      criteria: ["highVariability", "lowMC", "fluctuatingPerformance"],
      description: "Attention that fluctuates unpredictably rather than steadily declining. Performance varies moment-to-moment.",
      clinicalNote: "Classic ADHD signature—inconsistency itself is the core feature.",
      icon: "📊"
    },
    processingMismatch: {
      label: "Slow Processing + High Focus Mismatch",
      criteria: ["lowProcessingSpeed", "highSustainedAttention", "discrepantPattern"],
      description: "Individual maintains good focus but processes information slowly. Creates a frustrating pattern of 'knowing but not showing.'",
      clinicalNote: "May be misinterpreted as inattentive when actually processing-limited. Consider processing speed accommodations.",
      icon: "⏱️"
    },
    hyperfocusPattern: {
      label: "Hyperfocus-Dominant Pattern",
      criteria: ["hyperfocusDetected", "interestDependentPerformance", "extremeVariability"],
      description: "Attention is highly interest-dependent. Capable of intense focus on engaging tasks but struggles severely with low-stimulation activities.",
      clinicalNote: "Leverage interests for engagement strategies. Consider stimulation-matching interventions.",
      icon: "🔥"
    },
    impulsivityDominant: {
      label: "Impulsivity-Dominant Profile",
      criteria: ["highCommissionErrors", "lowInhibition", "preservedAttention"],
      description: "Primary challenge is inhibitory control rather than sustained attention. Actions precede thought.",
      clinicalNote: "Focus interventions on response-delay techniques and impulse management.",
      icon: "⚡"
    },
    anxietyOverlay: {
      label: "Anxiety-Attention Interaction",
      criteria: ["elevatedRT", "overcautious", "possibleAnxietyMarkers"],
      description: "Performance pattern suggests anxiety may be interacting with or masking attention patterns.",
      clinicalNote: "Consider anxiety evaluation. Determine whether attention difficulties are primary or secondary to anxiety.",
      icon: "😰"
    },
    cognitiveSlowing: {
      label: "Generalized Cognitive Slowing",
      criteria: ["slowProcessing", "slowRT", "preservedAccuracy"],
      description: "Globally slower cognitive tempo affecting multiple domains while accuracy is preserved.",
      clinicalNote: "Consider differential diagnosis including depression, sleep disorders, or sluggish cognitive tempo.",
      icon: "🐢"
    },
    workingMemoryDeficit: {
      label: "Working Memory Deficit Pattern",
      criteria: ["lowWM", "wmLoadCollapse", "forgettingPattern"],
      description: "Primary limitation in working memory capacity affecting multiple cognitive domains.",
      clinicalNote: "Prioritize external memory supports and reduce cognitive load in recommendations.",
      icon: "💭"
    },
    maskingPattern: {
      label: "Active Masking/Suppression Pattern",
      criteria: ["suppressedVariability", "elevatedEffort", "controlledPresentation"],
      description: "Individual actively controls and suppresses symptoms, creating artificially stable appearance.",
      clinicalNote: "True difficulty level may be underestimated. Explore masking behaviors and their costs.",
      icon: "🎪"
    }
  },

  // ========== ENVIRONMENT-BASED INTERPRETATION ==========
  environmentInterpretation: {
    structured: {
      environment: "Structured Environment",
      description: "Clear expectations, external deadlines, organized workflow",
      expectedPerformance: {
        typical: "Performance may be significantly better than in unstructured settings",
        adhd: "ADHD individuals often perform much better with external structure"
      },
      examples: ["Supervised work", "Clear schedules", "Defined tasks", "Regular check-ins"]
    },
    unstructured: {
      environment: "Unstructured Environment",
      description: "Self-directed work, flexible deadlines, open-ended tasks",
      expectedPerformance: {
        typical: "May struggle significantly without external structure",
        adhd: "Often where ADHD-related difficulties become most apparent"
      },
      examples: ["Remote work", "Self-paced learning", "Creative projects", "Open schedules"]
    },
    highStimulation: {
      environment: "High Stimulation Environment",
      description: "Fast-paced, novel, varied, or urgent contexts",
      expectedPerformance: {
        typical: "May paradoxically perform better due to engagement activation",
        adhd: "Urgency and novelty often recruit hyperfocus mechanisms"
      },
      examples: ["Emergencies", "New projects", "Interesting tasks", "Deadline pressure"]
    },
    lowStimulation: {
      environment: "Low Stimulation Environment",
      description: "Routine, boring, repetitive, or slow-paced contexts",
      expectedPerformance: {
        typical: "Likely to show most difficulty with sustained engagement",
        adhd: "Classic ADHD struggle—insufficient stimulation fails to engage attention"
      },
      examples: ["Routine paperwork", "Long meetings", "Repetitive tasks", "Waiting"]
    },
    multitasking: {
      environment: "Multitasking/Interruption-Heavy Environment",
      description: "Frequent task-switching, multiple demands, interruptions",
      expectedPerformance: {
        typical: "May struggle with cognitive switching costs",
        adhd: "Often particularly challenging due to working memory and flexibility demands"
      },
      examples: ["Open offices", "Multiple projects", "Frequent meetings", "Customer-facing roles"]
    },
    isolatedFocus: {
      environment: "Isolated Focus Environment",
      description: "Single task, minimal distractions, deep work context",
      expectedPerformance: {
        typical: "Performance depends on task interest and stimulation level",
        adhd: "May excel if interested, struggle if not—very context-dependent"
      },
      examples: ["Private office", "Single project", "Deep work blocks", "Solo tasks"]
    }
  },

  // ========== PERSONALIZED INTERVENTIONS ==========
  personalizedInterventions: {
    slowProcessingHighWM: {
      profile: "Slow Processing + Good Working Memory",
      interventions: [
        "Request extended time accommodations—you understand well but need time to demonstrate it",
        "Front-load processing: review materials before meetings/classes",
        "Use your strong working memory to pre-plan responses",
        "Minimize task-switching to reduce repeated processing costs",
        "Create templates and systems to reduce processing demands"
      ],
      rationale: "Your working memory is a strength—use it to compensate for processing speed by preparing in advance."
    },
    highImpulsivityHighAttention: {
      profile: "High Impulsivity + Good Sustained Attention",
      interventions: [
        "Use response-delay techniques: pause, count, then respond",
        "Implement 'wait 24 hours' rule for important decisions",
        "Channel impulsivity into rapid task initiation (strength)",
        "Create friction for impulsive actions (delete apps, add steps)",
        "Use your attention strength to focus on impulse monitoring"
      ],
      rationale: "Your attention is intact—use it to consciously monitor and delay impulsive responses."
    },
    lowWMHighProcessing: {
      profile: "Low Working Memory + Good Processing Speed",
      interventions: [
        "Externalize everything: write down immediately, don't hold in mind",
        "Use speed to your advantage: act quickly before forgetting",
        "Create robust external memory systems (notes, apps, visual cues)",
        "Break tasks into single-focus steps rather than multi-step sequences",
        "Use consistent locations and routines to reduce memory load"
      ],
      rationale: "Process quickly to capture information externally before working memory fades."
    },
    highVariabilityLowConsistency: {
      profile: "High Attention Variability",
      interventions: [
        "Work in short, focused bursts (25-minute Pomodoro or shorter)",
        "Build movement breaks into your routine to reset attention",
        "Use timers and alarms to create external structure",
        "Accept variability: plan for 'low' periods with easier tasks",
        "Track your energy patterns to optimize task-timing"
      ],
      rationale: "Work with your attention cycles rather than fighting them."
    },
    compensatedPattern: {
      profile: "Compensated/High-Effort Pattern",
      interventions: [
        "Reduce compensation: you don't have to maintain perfect performance",
        "Schedule genuine rest, not just task-switching",
        "Identify which situations drain you most and modify them",
        "Consider whether treatment could reduce the compensation burden",
        "Practice 'good enough' rather than exhausting perfection"
      ],
      rationale: "Your compensation is exhausting—the goal is sustainable performance, not perfect performance."
    },
    executiveDysfunctionPattern: {
      profile: "Executive Dysfunction Pattern",
      interventions: [
        "Use external planning tools: calendars, task managers, visual schedules",
        "Break every task into specific, concrete next actions",
        "Create decision templates for recurring situations",
        "Reduce choices by establishing defaults and routines",
        "Use body-doubling or accountability partners for task initiation"
      ],
      rationale: "Externalize executive functions since internal regulation is challenged."
    },
    lowFlexibilityHighFocus: {
      profile: "Low Flexibility + High Focus",
      interventions: [
        "Build transition buffers between different activities",
        "Create transition rituals that signal your brain to shift",
        "Prepare for transitions in advance when possible",
        "Batch similar tasks to reduce switching needs",
        "Use your focus strength for deep work on single projects"
      ],
      rationale: "Leverage your focus ability while reducing the switching demands that challenge you."
    },
    hyperfocusPattern: {
      profile: "Hyperfocus-Dependent Pattern",
      interventions: [
        "Gamify boring tasks to increase engagement",
        "Add accountability, deadlines, or social components for activation",
        "Use the two-minute rule: if it takes two minutes, do it now",
        "Create artificial urgency for low-priority but important tasks",
        "Accept that some tasks will never be interesting—use external structure instead"
      ],
      rationale: "Your attention responds to interest and urgency—create those conditions strategically."
    }
  },

  // ========== TRAIT-BASED SUMMARY TEMPLATES ==========
  traitSummary: {
    highCapacityHighCost: [
      "This profile suggests a highly capable but energy-costly cognitive system. Strong performance is achieved through significant mental effort, creating a pattern where capability masks difficulty. This 'hidden struggle' often leads to exhaustion, burnout, and underestimation of support needs by others.",
      "Your cognitive profile reveals substantial ability paired with elevated cognitive costs. You can meet demands but at a higher energy price than typical. This creates an unsustainable pattern if unaddressed—appearing capable while quietly depleting resources.",
      "The assessment reveals a compensated cognitive pattern: strong output achieved through intense effort. While this demonstrates real capability, the metabolic cost is high. Without intervention, this pattern often leads to cycles of productivity followed by burnout."
    ],
    inconsistentBrilliance: [
      "This profile reflects inconsistent but sometimes excellent cognitive function. Performance varies dramatically based on context, interest, and stimulation level. The gap between 'best' and 'worst' performance may be much larger than typical.",
      "Your cognitive pattern shows 'inconsistent brilliance'—capable of excellent performance in the right conditions, but struggling significantly in others. This variability is the core challenge, not a lack of ability.",
      "The assessment reveals a context-dependent cognitive profile. Your brain engages powerfully under certain conditions (interest, urgency, novelty) but struggles in others. Understanding these patterns is key to optimizing your environment."
    ],
    slowButSteady: [
      "This profile indicates a slower but reliable cognitive tempo. Processing takes longer but is generally accurate and thorough. The main challenge is time pressure and environments that don't accommodate thoughtful processing.",
      "Your cognitive profile shows deliberate, steady processing. Understanding is intact but speed is limited. Accommodations that provide additional time allow your true capabilities to show.",
      "The assessment reveals a methodical processing style. You arrive at correct conclusions through careful thought rather than rapid response. This is a valid cognitive style that is often pathologized by time-pressured environments."
    ],
    impulsiveEngine: [
      "This profile suggests a fast-reactive cognitive style. Responses come quickly, sometimes too quickly. The challenge is not ability but control—slowing down enough to optimize responses rather than acting on first impulse.",
      "Your cognitive pattern shows a 'quick-draw' style: fast processing and response with challenges in inhibition. Strategies focus on creating pause before action rather than improving understanding.",
      "The assessment reveals an action-oriented cognitive profile. You process and act quickly, which is a strength in many contexts but creates difficulty when delay or deliberation is required."
    ],
    overloadedExecutive: [
      "This profile indicates executive function as the primary bottleneck. Attention and processing may be adequate, but planning, organizing, and managing cognitive resources is challenged. Daily life feels chaotic despite capability.",
      "Your cognitive profile shows intact basic abilities with executive control challenges. The struggle is not understanding or attending but rather organizing, prioritizing, and managing the flow of cognitive work.",
      "The assessment reveals an executive control limitation pattern. Mental resources are available but not efficiently deployed. Interventions should focus on external executive supports and organizational systems."
    ],
    anxietyComorbid: [
      "This profile suggests possible anxiety interaction with cognitive performance. Overcautious patterns and elevated response times may reflect anxiety-driven second-guessing. Consider whether attention difficulties are primary or secondary to anxiety.",
      "Your cognitive pattern shows characteristics that may involve anxiety. Slow, careful responses and potential hypervigilance warrant exploration of how anxiety and attention difficulties interact.",
      "The assessment reveals a pattern where anxiety may be affecting cognitive performance. Distinguishing between anxiety-based hesitation and ADHD-based difficulties is important for treatment planning."
    ]
  },

  // ========== RISK INDICATORS ==========
  riskIndicators: {
    emotionalDysregulation: {
      indicator: "Emotional Dysregulation Risk",
      markers: ["rapidMoodShifts", "disproportionateReactions", "difficultyRecovering"],
      description: "Indicators suggest possible challenges with emotional regulation. Emotions may be more intense, shift more rapidly, or be harder to modulate than typical.",
      questions: [
        "Do emotions feel more intense than seems appropriate?",
        "Do you have difficulty calming down once upset?",
        "Do small frustrations trigger large reactions?"
      ],
      recommendations: [
        "Discuss emotional regulation patterns with clinician",
        "Consider DBT-informed skills training",
        "Evaluate for rejection sensitive dysphoria"
      ],
      icon: "💔"
    },
    burnoutRisk: {
      indicator: "Burnout Risk",
      markers: ["highCompensation", "sustainedEffort", "resourceDepletion"],
      description: "Pattern suggests high cognitive effort to maintain performance. This compensation pattern is associated with burnout risk, especially in demanding environments.",
      questions: [
        "Do you feel chronically exhausted despite adequate sleep?",
        "Do you have less resilience than you used to?",
        "Are you functioning but feel like you're 'running on empty'?"
      ],
      recommendations: [
        "Evaluate current life demands vs. available resources",
        "Consider whether current compensation strategies are sustainable",
        "Discuss workload modifications and recovery needs"
      ],
      icon: "🔥"
    },
    maskingCompensation: {
      indicator: "Masking/Compensation Pattern",
      markers: ["suppressedVariability", "hiddenStruggle", "socialMasking"],
      description: "Indicators suggest active suppression or masking of difficulties. Performance appears more stable than underlying regulation, which is exhausting and may delay recognition of support needs.",
      questions: [
        "Do you work hard to appear 'normal' or hide your struggles?",
        "Do others underestimate your difficulties?",
        "Do you feel like you're performing a role?"
      ],
      recommendations: [
        "Explore the cost of masking behaviors",
        "Consider selective disclosure to trusted supports",
        "Discuss authentic self-presentation strategies"
      ],
      icon: "🎭"
    },
    rejectionSensitivity: {
      indicator: "Rejection Sensitivity Indicators",
      markers: ["sensitivityToFeedback", "socialAnxietyFeatures", "avoidanceBehaviors"],
      description: "Pattern may include heightened sensitivity to perceived rejection or criticism. This is common in ADHD and can significantly impact relationships and self-esteem.",
      questions: [
        "Do you feel devastated by criticism or rejection?",
        "Do you avoid situations where you might fail or be judged?",
        "Do you interpret neutral feedback as negative?"
      ],
      recommendations: [
        "Discuss rejection sensitive dysphoria with clinician",
        "Consider CBT for cognitive restructuring",
        "Evaluate for social anxiety comorbidity"
      ],
      icon: "💔"
    },
    substanceRisk: {
      indicator: "Self-Medication Risk",
      markers: ["untreatedSymptoms", "seekingSelfRegulation", "impulsivityElevated"],
      description: "Untreated ADHD is associated with increased risk of self-medication through substances, excessive caffeine, or other regulatory behaviors. This is not a moral failing but a regulatory seeking behavior.",
      questions: [
        "Do you use caffeine, nicotine, or other substances to help focus?",
        "Do you notice increased substance use during high-demand periods?",
        "Have you ever used substances to regulate emotions or energy?"
      ],
      recommendations: [
        "Discuss current substance use patterns openly",
        "Evaluate for possible self-medication behaviors",
        "Consider whether treatment might reduce self-medication need"
      ],
      icon: "⚠️"
    },
    sleepDisruption: {
      indicator: "Sleep Disruption Pattern",
      markers: ["delayedSleep", "inconsistentSchedule", "hyperfocusNighttime"],
      description: "ADHD is commonly associated with sleep difficulties including delayed sleep phase, difficulty winding down, and inconsistent sleep schedules. Sleep disruption can exacerbate attention difficulties.",
      questions: [
        "Do you have difficulty falling asleep at a reasonable time?",
        "Does your mind 'come alive' at night?",
        "Is your sleep schedule irregular?"
      ],
      recommendations: [
        "Evaluate sleep patterns and sleep hygiene",
        "Consider chronotype and delayed sleep phase",
        "Discuss bidirectional ADHD-sleep relationship"
      ],
      icon: "🌙"
    },
    anxietyComorbidity: {
      indicator: "Anxiety Comorbidity Indicators",
      markers: ["overcautiousPattern", "elevatedRT", "worryMarkers"],
      description: "Pattern includes markers that may indicate anxiety interaction. Anxiety and ADHD commonly co-occur and can complicate each other's presentation and treatment.",
      questions: [
        "Do you experience significant worry or anxiety?",
        "Does anxiety affect your ability to start or complete tasks?",
        "Do you avoid situations due to fear of failure or judgment?"
      ],
      recommendations: [
        "Screen for generalized anxiety and other anxiety disorders",
        "Determine whether anxiety is primary, secondary, or comorbid",
        "Consider integrated treatment approach"
      ],
      icon: "😰"
    },
    depressionComorbidity: {
      indicator: "Depression Comorbidity Indicators",
      markers: ["cognitiveSlowing", "motivationalDeficit", "anhedoniaMarkers"],
      description: "Some patterns may indicate depression interaction. ADHD and depression commonly co-occur, and each can mimic or exacerbate the other.",
      questions: [
        "Do you experience persistent low mood or hopelessness?",
        "Has interest in previously enjoyed activities decreased?",
        "Do motivation difficulties feel different from attention difficulties?"
      ],
      recommendations: [
        "Screen for depressive symptoms",
        "Determine temporal relationship between attention and mood symptoms",
        "Consider how ADHD experiences may contribute to mood"
      ],
      icon: "🌧️"
    }
  },

  // ========== EXECUTIVE SUMMARY ==========
  executiveSummary: {
    opener: [
      "Based on comprehensive analysis of your cognitive performance across all tasks:",
      "Integrating all assessment data, the following key findings emerge:",
      "Your cognitive profile reveals the following integrated findings:"
    ],
    lowRisk: [
      "Your overall cognitive profile does not show patterns typically associated with ADHD. Attention, inhibition, and working memory appear to be functioning within normal limits.",
      "Assessment results suggest typical cognitive functioning. No significant attention or executive function concerns were identified.",
      "Your performance across tasks falls within expected ranges. The cognitive profile does not indicate ADHD-related impairment."
    ],
    moderateRisk: [
      "Your cognitive profile shows some patterns worth noting. While not strongly indicative of ADHD, certain attention or executive function areas may benefit from targeted strategies.",
      "Assessment reveals mild to moderate attention-related patterns. Results suggest potential benefit from focus optimization strategies.",
      "Your profile shows some cognitive variability that may occasionally impact daily functioning. Monitoring and proactive strategies are recommended."
    ],
    elevatedRisk: [
      "Your cognitive profile shows notable patterns consistent with attention regulation challenges. Professional evaluation is recommended.",
      "Assessment reveals significant patterns across multiple attention domains. These findings warrant clinical follow-up.",
      "Your performance profile indicates substantial attention and/or executive function challenges. We strongly recommend professional evaluation."
    ],
    highRisk: [
      "Your cognitive profile shows strong patterns consistent with ADHD across multiple domains. Professional evaluation is strongly recommended.",
      "Assessment reveals pronounced attention dysregulation patterns. Comprehensive clinical evaluation is strongly advised.",
      "Your profile demonstrates significant and consistent attention challenges. Prompt professional consultation is recommended."
    ]
  }
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Randomly select one item from an array
 * Uses seeded random based on a hash of input values for reproducibility within session
 */
export function randomSelect(array, seed = null) {
  if (!array || array.length === 0) return '';
  if (array.length === 1) return array[0];
  
  // Use provided seed or random
  const index = seed !== null 
    ? Math.abs(seed) % array.length 
    : Math.floor(Math.random() * array.length);
  
  return array[index];
}

/**
 * Generate a simple hash from a string for seeded randomization
 */
export function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash;
}

/**
 * Get MC Index level classification
 */
export function getMCLevel(mc) {
  if (mc < 35) return 'veryLow';
  if (mc < 50) return 'low';
  if (mc < 65) return 'moderate';
  return 'high';
}

/**
 * Get CPI level classification
 */
export function getCPILevel(cpi) {
  if (cpi > 70) return 'veryHigh';
  if (cpi > 50) return 'high';
  if (cpi > 30) return 'moderate';
  return 'low';
}

/**
 * Get Tau level classification
 */
export function getTauLevel(tau) {
  if (tau > 100) return 'severe';
  if (tau > 60) return 'elevated';
  if (tau > 40) return 'borderline';
  return 'normal';
}

/**
 * Get WM Load Response classification
 */
export function getWMLoadLevel(wmLoadDrop) {
  if (wmLoadDrop > 25) return 'collapse';
  if (wmLoadDrop > 15) return 'decline';
  return 'stable';
}

/**
 * Get conflict sensitivity level
 */
export function getConflictLevel(flankerEffect, hyperfocus = false) {
  if (hyperfocus && flankerEffect < 30) return 'paradoxical';
  if (flankerEffect > 100) return 'high';
  if (flankerEffect > 50) return 'moderate';
  return 'low';
}

/**
 * Get implication key based on MC and CPI levels
 */
export function getImplicationKey(mcLevel, cpiLevel) {
  const mcGroup = (mcLevel === 'veryLow' || mcLevel === 'low') ? 'low' : 'high';
  const cpiGroup = (cpiLevel === 'veryHigh' || cpiLevel === 'high') ? 'high' : 'low';
  return `${mcGroup}_mc_${cpiGroup}_cpi`;
}

/**
 * Get DSM-5 alignment type
 */
export function getDSM5Alignment(objectiveConcern, subjectiveConcern) {
  if (objectiveConcern && subjectiveConcern) return 'strong';
  if (objectiveConcern && !subjectiveConcern) return 'objective_elevated';
  if (!objectiveConcern && subjectiveConcern) return 'subjective_elevated';
  return 'concordant_low';
}

/**
 * Get ALS category
 */
export function getALSCategory(als) {
  if (als <= 30) return 'typical';
  if (als <= 50) return 'mild';
  if (als <= 70) return 'moderate';
  return 'significant';
}

// ============================================================================
// AUDIENCE ADAPTATION
// ============================================================================

/**
 * Technical term mappings for patient-friendly language
 */
export const patientFriendlyTerms = {
  'MC Index': 'Focus Consistency Score',
  'Meta-Consistency Index': 'Focus Consistency Score',
  'CPI': 'Mental Effort Score',
  'Cognitive Pair Index': 'Mental Effort Score',
  'ex-Gaussian tau': 'attention lapse indicator',
  'tau parameter': 'attention lapse measure',
  'cognitive variability': 'attention ups and downs',
  'response variability': 'reaction time inconsistency',
  'executive function': 'mental control and organization',
  'executive bottleneck': 'mental overload',
  'inhibition': 'impulse control',
  'inhibitory control': 'ability to stop automatic reactions',
  'working memory': 'mental holding space',
  'cognitive load': 'mental demands',
  'interference control': 'distraction filtering',
  'commission errors': 'impulsive mistakes',
  'omission errors': 'missed targets',
  'intra-individual variability': 'personal inconsistency',
  'vigilance': 'sustained attention',
  'attentional drift': 'mind wandering',
  'neurobiological': 'brain-based',
  'subclinical': 'below diagnostic threshold'
};

/**
 * Convert text to patient-friendly language
 */
export function simplifyForPatient(text) {
  let simplified = text;
  
  Object.entries(patientFriendlyTerms).forEach(([technical, friendly]) => {
    const regex = new RegExp(technical, 'gi');
    simplified = simplified.replace(regex, friendly);
  });
  
  return simplified;
}

/**
 * Add technical details for clinician audience
 */
export function enhanceForClinician(content, metrics) {
  return {
    ...content,
    technicalNotes: [
      `MC Index: ${metrics.mcIndex?.toFixed(1) || 'N/A'} (RT CV: ${metrics.rtCV?.toFixed(2) || 'N/A'})`,
      `CPI: ${metrics.cpi?.toFixed(1) || 'N/A'} (Component breakdown available)`,
      `Tau (τ): ${metrics.tau?.toFixed(1) || 'N/A'}ms`,
      `Effect size vs normative: d=${metrics.effectSize?.toFixed(2) || 'N/A'}`,
      `Validity indicators: ${metrics.validityScore >= 80 ? 'Good' : 'Adequate'}`
    ],
    diagnosticCodes: [
      'F90.0 - ADHD Predominantly Inattentive',
      'F90.1 - ADHD Predominantly Hyperactive',
      'F90.2 - ADHD Combined Type',
      'F90.8 - Other ADHD',
      'F90.9 - ADHD Unspecified'
    ]
  };
}

// ============================================================================
// MAIN NARRATIVE COMPOSITION FUNCTIONS
// ============================================================================

/**
 * Generate Core ADHD Markers narrative section
 */
export function generateCoreMarkersNarrative(metrics, flags = []) {
  const mc = metrics.mcIndex || metrics.mc || 50;
  const cpi = metrics.cpi || 30;
  const tau = metrics.tau || 40;
  
  const mcLevel = getMCLevel(mc);
  const cpiLevel = getCPILevel(cpi);
  const tauLevel = getTauLevel(tau);
  const implicationKey = getImplicationKey(mcLevel, cpiLevel);
  
  // Build paragraph 1: MC and CPI overview
  const mcIntro = randomSelect(narrativeBlocks.mc_intro[mcLevel]);
  const mcTechnical = randomSelect(narrativeBlocks.mc_technical[mcLevel]);
  const cpiContext = randomSelect(narrativeBlocks.cpi_context[cpiLevel]);
  
  const paragraph1 = `Testing ${mcIntro} (MC Index: ${mc.toFixed(1)}), ${mcTechnical}. Cognitive efficiency analysis revealed ${cpiContext} (CPI: ${cpi.toFixed(1)}).`;
  
  // Build paragraph 2: Tau and clinical implication
  const tauIntro = randomSelect(narrativeBlocks.tau_intro[tauLevel]);
  const tauExplanation = randomSelect(narrativeBlocks.tau_explanation[tauLevel]);
  const implication = randomSelect(narrativeBlocks.implications[implicationKey]);
  
  const paragraph2 = `${tauIntro} (τ = ${tau.toFixed(1)}ms), ${tauExplanation}. ${implication}`;
  
  // Build paragraph 3: Flags (if any)
  const flagTexts = [];
  if (flags.includes('hyperfocus') || flags.includes('HF=1')) {
    flagTexts.push(randomSelect(narrativeBlocks.flags.hyperfocus.detected));
  }
  if (flags.includes('compensated') || flags.includes('CA=1')) {
    flagTexts.push(randomSelect(narrativeBlocks.flags.compensated.detected));
  }
  if (flags.includes('masking') || flags.includes('MASK=1')) {
    flagTexts.push(randomSelect(narrativeBlocks.flags.masking.detected));
  }
  if (flags.includes('executiveOverload') || flags.includes('EO=1')) {
    flagTexts.push(randomSelect(narrativeBlocks.flags.executiveOverload.detected));
  }
  if (flags.includes('highVariability') || flags.includes('HV=1')) {
    flagTexts.push(randomSelect(narrativeBlocks.flags.highVariability.detected));
  }
  
  const paragraph3 = flagTexts.length > 0 ? flagTexts.join(' ') : '';
  
  return {
    title: "Core ADHD Markers",
    subtitle: "Key Cognitive Signatures",
    paragraphs: [paragraph1, paragraph2, paragraph3].filter(p => p.length > 0)
  };
}

/**
 * Generate Working Memory narrative
 */
export function generateWMNarrative(metrics) {
  const wmLoadDrop = metrics.wmLoadDrop || metrics.nback?.wmLoadDrop || 10;
  const wmLevel = getWMLoadLevel(wmLoadDrop);
  
  const wmText = randomSelect(narrativeBlocks.wmLoad[wmLevel]);
  
  return {
    title: "Working Memory Load Response",
    content: wmText
  };
}

/**
 * Generate Conflict/Interference narrative
 */
export function generateConflictNarrative(metrics, hasHyperfocus = false) {
  const flankerEffect = metrics.flankerEffect || metrics.flanker?.flankerEffect || 50;
  const conflictLevel = getConflictLevel(flankerEffect, hasHyperfocus);
  
  const conflictText = randomSelect(narrativeBlocks.conflict[conflictLevel]);
  
  return {
    title: "Interference Control",
    content: conflictText
  };
}

/**
 * Generate DSM-5 Correlation narrative
 */
export function generateDSM5Narrative(metrics, dsm5Summary) {
  const objectiveConcern = (metrics.als || 50) > 50;
  const subjectiveConcern = (dsm5Summary?.totalScore || 0) > 20 || 
                           dsm5Summary?.riskLevel === 'high' || 
                           dsm5Summary?.riskLevel === 'moderate';
  
  const alignment = getDSM5Alignment(objectiveConcern, subjectiveConcern);
  const alignmentText = randomSelect(narrativeBlocks.dsm5_alignment[alignment]);
  
  return {
    title: "Symptom-Performance Correlation",
    subtitle: "Subjective & Objective Alignment",
    alignment,
    content: alignmentText
  };
}

/**
 * Generate Subtype narrative
 */
export function generateSubtypeNarrative(inferredSubtype) {
  const subtypeKey = inferredSubtype?.toLowerCase().includes('inattentive') ? 'inattentive' :
                     inferredSubtype?.toLowerCase().includes('hyperactive') ? 'hyperactive' :
                     inferredSubtype?.toLowerCase().includes('combined') ? 'combined' : 'subthreshold';
  
  const subtypeBlock = narrativeBlocks.subtype[subtypeKey];
  
  return {
    title: "Cognitive Profile Pattern",
    subtitle: "Presentation Style",
    intro: randomSelect(subtypeBlock.intro),
    characteristics: randomSelect(subtypeBlock.characteristics)
  };
}

/**
 * Generate Real-Life Impact narratives
 */
export function generateRealLifeImpact(flags, metrics) {
  const impacts = [];
  
  // Variability impact
  if (flags.includes('variability') || flags.includes('HV=1') || (metrics.mcIndex || 100) < 60) {
    const block = narrativeBlocks.realLife.variability;
    impacts.push({
      title: block.title,
      icon: block.icon,
      description: randomSelect(block.descriptions),
      tip: randomSelect(block.tips)
    });
  }
  
  // Working memory impact
  if (flags.includes('workingMemoryDeficit') || (metrics.workingMemoryScore || 100) < 60) {
    const block = narrativeBlocks.realLife.workingMemory;
    impacts.push({
      title: block.title,
      icon: block.icon,
      description: randomSelect(block.descriptions),
      tip: randomSelect(block.tips)
    });
  }
  
  // Compensation impact
  if (flags.includes('compensation') || flags.includes('compensated') || flags.includes('CA=1')) {
    const block = narrativeBlocks.realLife.compensation;
    impacts.push({
      title: block.title,
      icon: block.icon,
      description: randomSelect(block.descriptions),
      tip: randomSelect(block.tips)
    });
  }
  
  // Hyperfocus impact
  if (flags.includes('hyperfocus') || flags.includes('HF=1')) {
    const block = narrativeBlocks.realLife.hyperfocus;
    impacts.push({
      title: block.title,
      icon: block.icon,
      description: randomSelect(block.descriptions),
      tip: randomSelect(block.tips)
    });
  }
  
  // Switching impact
  if ((metrics.switchingCost || 0) > 50) {
    const block = narrativeBlocks.realLife.switching;
    impacts.push({
      title: block.title,
      icon: block.icon,
      description: randomSelect(block.descriptions),
      tip: randomSelect(block.tips)
    });
  }
  
  // Always include the "not laziness" message
  const notLazy = narrativeBlocks.realLife.notLaziness;
  impacts.push({
    title: notLazy.title,
    icon: notLazy.icon,
    description: randomSelect(notLazy.descriptions),
    tip: randomSelect(notLazy.tips)
  });
  
  return {
    title: "What This Means For You",
    subtitle: "Daily Life Impact",
    impacts
  };
}

/**
 * Generate Recommendations
 */
export function generateRecommendations(metrics, flags) {
  const recommendations = [];
  const als = metrics.als || 50;
  
  // Professional evaluation recommendation
  if (als > 50) {
    recommendations.push({
      category: 'Professional Evaluation',
      priority: 'HIGH',
      icon: '👨‍⚕️',
      recommendation: randomSelect(narrativeBlocks.recommendations.professional),
      reason: 'Multiple cognitive markers suggest attention-related difficulties that warrant professional evaluation.'
    });
  }
  
  // Treatment discussion
  if (als > 70) {
    recommendations.push({
      category: 'Treatment Discussion',
      priority: 'HIGH',
      icon: '💊',
      recommendation: randomSelect(narrativeBlocks.recommendations.treatment),
      reason: 'Significant cognitive patterns suggest potential benefit from evidence-based interventions.'
    });
  }
  
  // Compensation-specific
  if (flags.includes('compensation') || flags.includes('compensated') || flags.includes('CA=1')) {
    recommendations.push({
      category: 'Compensation Management',
      priority: 'HIGH',
      icon: '⚡',
      recommendation: randomSelect(narrativeBlocks.recommendations.compensation_specific),
      reason: 'Compensatory patterns detected that may be unsustainable long-term.'
    });
  }
  
  // Variability-specific
  if (flags.includes('variability') || flags.includes('HV=1')) {
    recommendations.push({
      category: 'Attention Strategies',
      priority: 'MEDIUM',
      icon: '🎯',
      recommendation: randomSelect(narrativeBlocks.recommendations.variability_specific),
      reason: 'Attention variability patterns indicate need for external support structures.'
    });
  }
  
  // General recommendations (always include some)
  narrativeBlocks.recommendations.general.slice(0, 3).forEach(rec => {
    recommendations.push({
      category: 'Lifestyle',
      priority: 'MEDIUM',
      icon: '🌟',
      recommendation: rec,
      reason: 'Evidence-based strategies for attention and executive function support.'
    });
  });
  
  return {
    title: "Personalized Recommendations",
    subtitle: "Next Steps & Strategies",
    recommendations
  };
}

/**
 * Generate Simple Summary
 */
export function generateSimpleSummary(metrics, flags) {
  const als = metrics.als || 50;
  const category = getALSCategory(als);
  const hasCompensation = flags.includes('compensation') || flags.includes('compensated') || flags.includes('CA=1');
  
  const paragraphs = [];
  
  // Main finding
  paragraphs.push(randomSelect(narrativeBlocks.simpleSummary[category]));
  
  // Compensation note
  if (hasCompensation) {
    paragraphs.push(randomSelect(narrativeBlocks.simpleSummary.compensated));
  }
  
  // Closing encouragement
  paragraphs.push("Understanding your brain is the first step. These patterns can be managed with the right strategies and support.");
  
  return {
    title: "Simple Summary",
    subtitle: "In Plain Words",
    paragraphs,
    emoji: als <= 30 ? '✅' : als <= 50 ? '💡' : als <= 70 ? '⚠️' : '🔴',
    oneLineSummary: als <= 50 
      ? "Your attention is mostly stable with room for optimization."
      : "Your attention shows patterns that deserve professional attention."
  };
}

// ============================================================================
// LEVEL 1: CLINICALLY USEFUL MUST-HAVES
// ============================================================================

/**
 * Generate Real-World Impairment Summary
 * Describes how score patterns affect daily life
 */
export function generateRealWorldImpairment(metrics, flags = []) {
  const impairments = [];
  
  // Inattention impact
  const attentionScore = metrics.sustainedAttention || metrics.mcIndex || 50;
  const inattentionLevel = attentionScore < 40 ? 'severe' : attentionScore < 60 ? 'moderate' : 'mild';
  if (attentionScore < 70) {
    impairments.push({
      domain: "Inattention Impact",
      icon: "🎯",
      severity: inattentionLevel,
      description: randomSelect(narrativeBlocks.realWorldImpairment.inattention[inattentionLevel]),
      commonExperiences: [
        "Task initiation difficulty",
        "Mind-wandering during low-stimulation tasks",
        "Difficulty shifting between tasks",
        "Inconsistent performance across situations"
      ].slice(0, inattentionLevel === 'severe' ? 4 : inattentionLevel === 'moderate' ? 3 : 2)
    });
  }
  
  // Impulsivity impact
  const impulsivityScore = metrics.inhibitoryControl || metrics.goNoGo?.accuracy || 70;
  const impulsivityLevel = impulsivityScore < 50 ? 'severe' : impulsivityScore < 70 ? 'moderate' : 'mild';
  if (impulsivityScore < 80 || flags.includes('highImpulsivity')) {
    impairments.push({
      domain: "Impulsivity Impact",
      icon: "⚡",
      severity: impulsivityLevel,
      description: randomSelect(narrativeBlocks.realWorldImpairment.impulsivity[impulsivityLevel]),
      commonExperiences: [
        "Interrupting others in conversation",
        "Making hasty decisions with later regret",
        "Difficulty waiting turn",
        "Impulsive reactions in relationships"
      ].slice(0, impulsivityLevel === 'severe' ? 4 : impulsivityLevel === 'moderate' ? 3 : 2)
    });
  }
  
  // Processing speed impact
  const processingScore = metrics.processingSpeed || metrics.cpt?.meanRT ? (600 - metrics.cpt.meanRT) / 4 : 60;
  const processingLevel = processingScore < 40 ? 'slow' : processingScore < 60 ? 'moderate' : 'adequate';
  if (processingScore < 70) {
    impairments.push({
      domain: "Processing Speed Impact",
      icon: "⏱️",
      severity: processingLevel,
      description: randomSelect(narrativeBlocks.realWorldImpairment.processingSpeed[processingLevel]),
      commonExperiences: [
        "Slow task completion despite good focus",
        "Difficulty keeping up with fast-paced discussions",
        "High mental fatigue with extended effort",
        "Needing extra time for assignments and tests"
      ].slice(0, processingLevel === 'slow' ? 4 : processingLevel === 'moderate' ? 3 : 2)
    });
  }
  
  // Working memory impact
  const wmScore = metrics.workingMemoryScore || metrics.nback?.accuracy || 60;
  const wmLevel = wmScore < 50 ? 'impaired' : wmScore < 70 ? 'moderate' : 'adequate';
  if (wmScore < 75) {
    impairments.push({
      domain: "Working Memory Impact",
      icon: "🧠",
      severity: wmLevel,
      description: randomSelect(narrativeBlocks.realWorldImpairment.workingMemory[wmLevel]),
      commonExperiences: [
        "Forgetting what you were about to say",
        "Losing track mid-task",
        "Difficulty following multi-step instructions",
        "Mental overload when juggling information"
      ].slice(0, wmLevel === 'impaired' ? 4 : wmLevel === 'moderate' ? 3 : 2)
    });
  }
  
  return {
    title: "Real-World Impairment Summary",
    subtitle: "How These Patterns Affect Daily Life",
    introduction: "Based on score patterns, individuals with this profile often experience:",
    impairmentAreas: impairments.map(imp => ({
      domain: imp.domain,
      severity: imp.severity,
      description: imp.description,
      examples: imp.commonExperiences
    })),
    impairments,
    overallSeverity: impairments.length > 2 ? 'significant' : impairments.length > 0 ? 'moderate' : 'minimal'
  };
}

/**
 * Generate Symptom Pattern Mapping
 * Maps each domain score to real-world behaviors
 */
export function generateSymptomPatternMapping(metrics) {
  const mappings = [];
  
  // Helper to get level
  const getLevel = (score) => score >= 80 ? 'high' : score >= 50 ? 'moderate' : 'low';
  
  // Sustained Attention
  const attentionScore = metrics.sustainedAttention || metrics.mcIndex || 50;
  const attentionLevel = getLevel(attentionScore);
  const attentionMapping = narrativeBlocks.symptomPatternMapping.sustainedAttention[attentionLevel];
  mappings.push({
    domain: "Sustained Attention",
    score: attentionScore,
    scoreLabel: attentionMapping.score,
    level: attentionLevel,
    icon: "🎯",
    strengths: attentionMapping.strengths,
    challenges: attentionMapping.challenges
  });
  
  // Processing Speed
  const processingScore = metrics.processingSpeed || 60;
  const processingLevel = getLevel(processingScore);
  const processingMapping = narrativeBlocks.symptomPatternMapping.processingSpeed[processingLevel];
  mappings.push({
    domain: "Processing Speed",
    score: processingScore,
    scoreLabel: processingMapping.score,
    level: processingLevel,
    icon: "⏱️",
    strengths: processingMapping.strengths,
    challenges: processingMapping.challenges
  });
  
  // Inhibitory Control
  const inhibitionScore = metrics.inhibitoryControl || metrics.goNoGo?.accuracy || 70;
  const inhibitionLevel = getLevel(inhibitionScore);
  const inhibitionMapping = narrativeBlocks.symptomPatternMapping.inhibitoryControl[inhibitionLevel];
  mappings.push({
    domain: "Inhibitory Control",
    score: inhibitionScore,
    scoreLabel: inhibitionMapping.score,
    level: inhibitionLevel,
    icon: "🛑",
    strengths: inhibitionMapping.strengths,
    challenges: inhibitionMapping.challenges
  });
  
  // Working Memory
  const wmScore = metrics.workingMemoryScore || metrics.nback?.accuracy || 60;
  const wmLevel = getLevel(wmScore);
  const wmMapping = narrativeBlocks.symptomPatternMapping.workingMemory[wmLevel];
  mappings.push({
    domain: "Working Memory",
    score: wmScore,
    scoreLabel: wmMapping.score,
    level: wmLevel,
    icon: "🧠",
    strengths: wmMapping.strengths,
    challenges: wmMapping.challenges
  });
  
  // Cognitive Flexibility
  const flexScore = metrics.cognitiveFlexibility || metrics.trailMaking?.switchCost ? Math.max(20, 100 - metrics.trailMaking.switchCost) : 60;
  const flexLevel = getLevel(flexScore);
  const flexMapping = narrativeBlocks.symptomPatternMapping.cognitiveFlexibility[flexLevel];
  mappings.push({
    domain: "Cognitive Flexibility",
    score: flexScore,
    scoreLabel: flexMapping.score,
    level: flexLevel,
    icon: "🔄",
    strengths: flexMapping.strengths,
    challenges: flexMapping.challenges
  });
  
  return {
    title: "Symptom Pattern Mapping",
    subtitle: "Real-World Behaviors by Domain",
    domains: mappings.map(m => ({
      domain: m.domain,
      score: m.score,
      level: m.level,
      behaviors: [...(m.challenges || []), ...(m.strengths || [])].slice(0, 4),
      cognitivePattern: `${m.scoreLabel} - ${m.strengths?.[0] || ''}`
    })),
    mappings
  };
}

/**
 * Generate Clinical Questions for Psychologist
 * Suggested discussion points based on assessment findings
 */
export function generateClinicalQuestions(metrics, flags = []) {
  const questionSets = [];
  
  // Attention-related questions
  if ((metrics.mcIndex || 100) < 60 || (metrics.sustainedAttention || 100) < 60) {
    questionSets.push({
      domain: "Attention Difficulties",
      icon: "🎯",
      priority: "HIGH",
      questions: narrativeBlocks.clinicalQuestions.attention
    });
  }
  
  // Impulsivity-related questions
  if ((metrics.inhibitoryControl || 100) < 70 || flags.includes('highImpulsivity')) {
    questionSets.push({
      domain: "Impulsivity Patterns",
      icon: "⚡",
      priority: (metrics.inhibitoryControl || 100) < 50 ? "HIGH" : "MEDIUM",
      questions: narrativeBlocks.clinicalQuestions.impulsivity
    });
  }
  
  // Processing speed questions
  if ((metrics.processingSpeed || 100) < 60) {
    questionSets.push({
      domain: "Processing Speed",
      icon: "⏱️",
      priority: (metrics.processingSpeed || 100) < 40 ? "HIGH" : "MEDIUM",
      questions: narrativeBlocks.clinicalQuestions.processingSpeed
    });
  }
  
  // Working memory questions
  if ((metrics.workingMemoryScore || 100) < 60) {
    questionSets.push({
      domain: "Working Memory",
      icon: "🧠",
      priority: (metrics.workingMemoryScore || 100) < 40 ? "HIGH" : "MEDIUM",
      questions: narrativeBlocks.clinicalQuestions.workingMemory
    });
  }
  
  // Compensation questions
  if (flags.includes('compensated') || flags.includes('CA=1') || flags.includes('masking')) {
    questionSets.push({
      domain: "Compensation & Coping",
      icon: "🎭",
      priority: "HIGH",
      questions: narrativeBlocks.clinicalQuestions.compensation
    });
  }
  
  // Emotional regulation questions (based on variability patterns)
  if (flags.includes('emotionalDysregulation') || (metrics.tau || 0) > 80) {
    questionSets.push({
      domain: "Emotional Regulation",
      icon: "💔",
      priority: "MEDIUM",
      questions: narrativeBlocks.clinicalQuestions.emotionalRegulation
    });
  }
  
  // Always include history questions
  questionSets.push({
    domain: "History & Context",
    icon: "📋",
    priority: "STANDARD",
    questions: narrativeBlocks.clinicalQuestions.history
  });
  
  return {
    title: "Clinical Discussion Points",
    subtitle: "Suggested Questions for Psychologist",
    introduction: "Based on this assessment, the following areas may warrant clinical exploration:",
    questions: questionSets.flatMap(qs => 
      (qs.questions || []).map(q => ({
        category: qs.domain,
        question: q.question || q,
        rationale: q.rationale || `Relevant to ${qs.domain.toLowerCase()} assessment`
      }))
    ),
    questionSets
  };
}

// ============================================================================
// LEVEL 2: PROFESSIONAL LEVEL ENHANCEMENTS
// ============================================================================

/**
 * Generate Functional Domain Table
 * Expected strengths and challenges by life domain
 */
export function generateFunctionalDomainTable(metrics) {
  const domains = [];
  
  // Helper to get metric levels
  const attentionLevel = (metrics.mcIndex || metrics.sustainedAttention || 50) >= 60 ? 'high' : 'low';
  const wmLevel = (metrics.workingMemoryScore || 50) >= 60 ? 'high' : 'low';
  const processingLevel = (metrics.processingSpeed || 60) >= 60 ? 'high' : 'low';
  const inhibitionLevel = (metrics.inhibitoryControl || 70) >= 60 ? 'high' : 'low';
  const flexLevel = (metrics.cognitiveFlexibility || 60) >= 60 ? 'high' : 'low';
  
  // Build each domain
  Object.entries(narrativeBlocks.functionalDomains).forEach(([key, domainData]) => {
    const strengths = [];
    const challenges = [];
    
    // Add relevant strengths
    if (attentionLevel === 'high') strengths.push(domainData.strengthPatterns.highAttention);
    if (wmLevel === 'high') strengths.push(domainData.strengthPatterns.highWM);
    if (processingLevel === 'high') strengths.push(domainData.strengthPatterns.highProcessing);
    if (inhibitionLevel === 'high') strengths.push(domainData.strengthPatterns.highInhibition);
    if (flexLevel === 'high') strengths.push(domainData.strengthPatterns.highFlexibility);
    
    // Add relevant challenges
    if (attentionLevel === 'low') challenges.push(domainData.challengePatterns.lowAttention);
    if (wmLevel === 'low') challenges.push(domainData.challengePatterns.lowWM);
    if (processingLevel === 'low') challenges.push(domainData.challengePatterns.lowProcessing);
    if (inhibitionLevel === 'low') challenges.push(domainData.challengePatterns.lowInhibition);
    if (flexLevel === 'low') challenges.push(domainData.challengePatterns.lowFlexibility);
    
    domains.push({
      domain: domainData.domain,
      key,
      strengths: strengths.length > 0 ? strengths : ["No specific strengths identified in this domain"],
      challenges: challenges.length > 0 ? challenges : ["No specific challenges identified in this domain"]
    });
  });
  
  return {
    title: "Functional Domain Analysis",
    subtitle: "Expected Strengths & Challenges by Life Area",
    domains
  };
}

/**
 * Detect and generate Pattern Recognition Labels
 * Identifies clinical subtypes and patterns
 */
export function generatePatternLabels(metrics, flags = []) {
  const detectedPatterns = [];
  
  // Check for each pattern
  const patterns = narrativeBlocks.patternLabels;
  
  // Compensated ADHD Pattern
  if ((metrics.accuracy || 0) > 85 && (metrics.meanRT || 0) > 500 && 
      ((metrics.rtCV || 0) > 0.25 || flags.includes('CA=1') || flags.includes('compensated'))) {
    detectedPatterns.push({
      ...patterns.compensatedADHD,
      confidence: 'HIGH',
      evidenceStrength: 'Strong convergent evidence'
    });
  }
  
  // Executive Dysfunction Profile
  if ((metrics.workingMemoryScore || 100) < 60 && (metrics.cognitiveFlexibility || 100) < 60 && 
      (metrics.cpi || 0) > 50) {
    detectedPatterns.push({
      ...patterns.executiveDysfunction,
      confidence: 'HIGH',
      evidenceStrength: 'Multiple executive markers affected'
    });
  }
  
  // Inconsistent Attentional Regulation
  if ((metrics.mcIndex || 100) < 50 || (metrics.rtCV || 0) > 0.3 || flags.includes('HV=1')) {
    detectedPatterns.push({
      ...patterns.inconsistentAttention,
      confidence: (metrics.mcIndex || 100) < 40 ? 'HIGH' : 'MODERATE',
      evidenceStrength: 'Variability metrics elevated'
    });
  }
  
  // Processing Mismatch
  if ((metrics.processingSpeed || 100) < 50 && (metrics.sustainedAttention || 0) > 70) {
    detectedPatterns.push({
      ...patterns.processingMismatch,
      confidence: 'MODERATE',
      evidenceStrength: 'Discrepant speed vs. attention pattern'
    });
  }
  
  // Hyperfocus Pattern
  if (flags.includes('hyperfocus') || flags.includes('HF=1')) {
    detectedPatterns.push({
      ...patterns.hyperfocusPattern,
      confidence: 'MODERATE',
      evidenceStrength: 'Interest-dependent performance detected'
    });
  }
  
  // Impulsivity Dominant
  if ((metrics.commissionErrors || 0) > 20 && (metrics.inhibitoryControl || 100) < 60 && 
      (metrics.sustainedAttention || 0) > 50) {
    detectedPatterns.push({
      ...patterns.impulsivityDominant,
      confidence: 'HIGH',
      evidenceStrength: 'Commission errors with preserved attention'
    });
  }
  
  // Anxiety Overlay
  if ((metrics.meanRT || 0) > 600 && (metrics.commissionErrors || 100) < 10 && 
      (metrics.accuracy || 0) > 90) {
    detectedPatterns.push({
      ...patterns.anxietyOverlay,
      confidence: 'MODERATE',
      evidenceStrength: 'Overcautious response pattern'
    });
  }
  
  // Cognitive Slowing
  if ((metrics.processingSpeed || 100) < 40 && (metrics.meanRT || 0) > 550 && 
      (metrics.accuracy || 0) > 80) {
    detectedPatterns.push({
      ...patterns.cognitiveSlowing,
      confidence: 'MODERATE',
      evidenceStrength: 'Globally slowed with preserved accuracy'
    });
  }
  
  // Working Memory Deficit Pattern
  if ((metrics.workingMemoryScore || 100) < 50 || (metrics.wmLoadDrop || 0) > 25) {
    detectedPatterns.push({
      ...patterns.workingMemoryDeficit,
      confidence: (metrics.wmLoadDrop || 0) > 30 ? 'HIGH' : 'MODERATE',
      evidenceStrength: 'Working memory load collapse detected'
    });
  }
  
  // Masking Pattern
  if (flags.includes('masking') || flags.includes('MASK=1')) {
    detectedPatterns.push({
      ...patterns.maskingPattern,
      confidence: 'MODERATE',
      evidenceStrength: 'Suppression indicators present'
    });
  }
  
  // Fallback: If no patterns detected, provide "Typical" pattern
  if (detectedPatterns.length === 0) {
    detectedPatterns.push({
      label: "Typical Cognitive Profile",
      description: "No specific clinical patterns were strongly detected. Performance falls within typical ranges across most cognitive domains.",
      clinicalNote: "Continue standard assessment protocols if concerns persist.",
      icon: "✓",
      confidence: 'HIGH',
      evidenceStrength: 'Metrics within normal ranges'
    });
  }
  
  return {
    title: "Pattern Recognition Analysis",
    subtitle: "Identified Cognitive Subtypes",
    introduction: detectedPatterns.length > 1 
      ? "The following clinical patterns were detected based on score configurations:"
      : "Based on score configurations, the following pattern was identified:",
    patterns: detectedPatterns.map(p => ({
      pattern: p.label || p.pattern,
      label: p.label || p.pattern,
      detected: true,
      description: p.description || "Pattern detected based on cognitive metrics.",
      implications: p.implications || [],
      confidence: p.confidence || 'MODERATE',
      clinicalNote: p.clinicalNote || null,
      icon: p.icon || "📊"
    })),
    primaryPattern: detectedPatterns[0]
  };
}

/**
 * Generate Environment-Based Interpretation
 * How performance varies by environment type
 */
export function generateEnvironmentInterpretation(metrics, flags = []) {
  const environments = [];
  const envData = narrativeBlocks.environmentInterpretation;
  
  // Determine individual's likely response in each environment
  const hasVariability = (metrics.mcIndex || 100) < 60 || flags.includes('HV=1');
  const hasHyperfocus = flags.includes('hyperfocus') || flags.includes('HF=1');
  const hasExecutiveIssues = (metrics.workingMemoryScore || 100) < 60 || (metrics.cpi || 0) > 50;
  const hasProcessingIssues = (metrics.processingSpeed || 100) < 60;
  
  // Structured Environment
  environments.push({
    ...envData.structured,
    prediction: hasVariability ? 'BETTER' : 'TYPICAL',
    reasoning: hasVariability 
      ? "External structure compensates for internal regulation difficulties. Expect notably better performance than in self-directed settings."
      : "Should perform consistently well in structured settings.",
    icon: "📋"
  });
  
  // Unstructured Environment
  environments.push({
    ...envData.unstructured,
    prediction: hasVariability || hasExecutiveIssues ? 'CHALLENGED' : 'TYPICAL',
    reasoning: hasVariability 
      ? "Without external structure, attention regulation difficulties become most apparent. This is often where ADHD-related impairment is most visible."
      : hasExecutiveIssues 
        ? "Executive function demands are highest in unstructured settings, likely causing difficulty."
        : "Should manage adequately with self-direction.",
    icon: "🌊"
  });
  
  // High Stimulation
  environments.push({
    ...envData.highStimulation,
    prediction: hasHyperfocus ? 'EXCELLENT' : hasVariability ? 'BETTER' : 'TYPICAL',
    reasoning: hasHyperfocus 
      ? "High stimulation engages hyperfocus mechanisms—may paradoxically perform best in intense, urgent situations."
      : hasVariability 
        ? "Novelty and urgency often recruit better attention engagement."
        : "Should handle high-stimulation environments appropriately.",
    icon: "🔥"
  });
  
  // Low Stimulation
  environments.push({
    ...envData.lowStimulation,
    prediction: hasVariability || hasHyperfocus ? 'CHALLENGED' : 'TYPICAL',
    reasoning: hasVariability || hasHyperfocus 
      ? "This is the classic ADHD challenge—insufficient stimulation fails to engage attention systems. Expect significant difficulty with routine, boring, or slow-paced tasks."
      : "Should manage routine tasks adequately.",
    icon: "😴"
  });
  
  // Multitasking
  environments.push({
    ...envData.multitasking,
    prediction: hasExecutiveIssues || hasVariability ? 'CHALLENGED' : 'TYPICAL',
    reasoning: hasExecutiveIssues 
      ? "Executive function limitations make managing multiple demands particularly difficult. Working memory and flexibility are heavily taxed."
      : hasVariability 
        ? "Attention variability is exacerbated by frequent switching demands."
        : "Should manage typical multitasking demands.",
    icon: "🔀"
  });
  
  // Isolated Focus
  environments.push({
    ...envData.isolatedFocus,
    prediction: hasHyperfocus ? 'VARIABLE' : hasVariability ? 'VARIABLE' : 'GOOD',
    reasoning: hasHyperfocus 
      ? "Performance will depend heavily on task interest—excellent if engaging, poor if not. Very context-dependent."
      : hasVariability 
        ? "May struggle if the task doesn't provide enough stimulation to maintain engagement."
        : "Should perform well in focused, distraction-free settings.",
    icon: "🎯"
  });
  
  return {
    title: "Environment-Based Predictions",
    subtitle: "Performance May Vary Depending on Setting",
    introduction: "Understanding how different environments affect performance can guide accommodation and strategy planning:",
    environments: environments.map(e => ({
      environment: e.environment || e.name,
      performance: e.prediction || e.performance,
      description: e.reasoning,
      tips: e.strategies || e.tips || []
    }))
  };
}

// ============================================================================
// LEVEL 3: NEXT LEVEL UNIQUE FEATURES
// ============================================================================

/**
 * Generate Personalized Interventions
 * Specific strategies based on exact score patterns
 */
export function generatePersonalizedInterventions(metrics, flags = []) {
  const interventionSets = [];
  const interventions = narrativeBlocks.personalizedInterventions;
  
  // Slow Processing + Good WM
  if ((metrics.processingSpeed || 100) < 60 && (metrics.workingMemoryScore || 0) >= 60) {
    interventionSets.push({
      ...interventions.slowProcessingHighWM,
      priority: 'HIGH',
      icon: '⏱️🧠'
    });
  }
  
  // High Impulsivity + Good Attention
  if ((metrics.inhibitoryControl || 100) < 60 && (metrics.sustainedAttention || 0) >= 60) {
    interventionSets.push({
      ...interventions.highImpulsivityHighAttention,
      priority: 'HIGH',
      icon: '⚡🎯'
    });
  }
  
  // Low WM + Good Processing
  if ((metrics.workingMemoryScore || 100) < 60 && (metrics.processingSpeed || 0) >= 60) {
    interventionSets.push({
      ...interventions.lowWMHighProcessing,
      priority: 'HIGH',
      icon: '🧠⏱️'
    });
  }
  
  // High Variability
  if ((metrics.mcIndex || 100) < 50 || flags.includes('HV=1')) {
    interventionSets.push({
      ...interventions.highVariabilityLowConsistency,
      priority: 'HIGH',
      icon: '📊'
    });
  }
  
  // Compensated Pattern
  if (flags.includes('compensated') || flags.includes('CA=1')) {
    interventionSets.push({
      ...interventions.compensatedPattern,
      priority: 'CRITICAL',
      icon: '🎭'
    });
  }
  
  // Executive Dysfunction
  if ((metrics.cpi || 0) > 50 || ((metrics.workingMemoryScore || 100) < 60 && (metrics.cognitiveFlexibility || 100) < 60)) {
    interventionSets.push({
      ...interventions.executiveDysfunctionPattern,
      priority: 'HIGH',
      icon: '🧩'
    });
  }
  
  // Low Flexibility + High Focus
  if ((metrics.cognitiveFlexibility || 100) < 60 && (metrics.sustainedAttention || 0) >= 60) {
    interventionSets.push({
      ...interventions.lowFlexibilityHighFocus,
      priority: 'MEDIUM',
      icon: '🔄🎯'
    });
  }
  
  // Hyperfocus Pattern
  if (flags.includes('hyperfocus') || flags.includes('HF=1')) {
    interventionSets.push({
      ...interventions.hyperfocusPattern,
      priority: 'MEDIUM',
      icon: '🔥'
    });
  }
  
  return {
    title: "Personalized Intervention Strategies",
    subtitle: "Tailored to Your Specific Score Pattern",
    introduction: "These strategies are matched to your unique cognitive profile:",
    interventions: interventionSets.map(i => ({
      targetArea: i.targetArea || i.profile || i.pattern,
      area: i.targetArea || i.profile || i.pattern,
      priority: i.priority,
      rationale: i.rationale || i.whyItHelps || '',
      strategies: i.strategies || [],
      tools: i.tools || []
    })),
    interventionSets,
    generalNote: "These interventions are starting points—work with a professional to adapt them to your specific situation."
  };
}

/**
 * Generate Trait-Based Summary
 * One-paragraph holistic profile description
 */
export function generateTraitBasedSummary(metrics, flags = []) {
  const summaries = narrativeBlocks.traitSummary;
  let selectedSummary;
  let profileType;
  
  const hasCompensation = flags.includes('compensated') || flags.includes('CA=1');
  const hasVariability = (metrics.mcIndex || 100) < 50 || flags.includes('HV=1');
  const hasSlowProcessing = (metrics.processingSpeed || 100) < 50;
  const hasImpulsivity = (metrics.inhibitoryControl || 100) < 50;
  const hasExecutiveIssues = (metrics.cpi || 0) > 50;
  const hasAnxietyMarkers = (metrics.meanRT || 0) > 600 && (metrics.accuracy || 0) > 90;
  
  // Determine primary profile type
  if (hasCompensation) {
    selectedSummary = randomSelect(summaries.highCapacityHighCost);
    profileType = "High-Capacity, High-Cost";
  } else if (hasVariability && flags.includes('hyperfocus')) {
    selectedSummary = randomSelect(summaries.inconsistentBrilliance);
    profileType = "Inconsistent Brilliance";
  } else if (hasSlowProcessing && !hasVariability) {
    selectedSummary = randomSelect(summaries.slowButSteady);
    profileType = "Deliberate Processor";
  } else if (hasImpulsivity && !hasVariability) {
    selectedSummary = randomSelect(summaries.impulsiveEngine);
    profileType = "Fast-Reactive";
  } else if (hasExecutiveIssues) {
    selectedSummary = randomSelect(summaries.overloadedExecutive);
    profileType = "Executive Overload";
  } else if (hasAnxietyMarkers) {
    selectedSummary = randomSelect(summaries.anxietyComorbid);
    profileType = "Possible Anxiety Interaction";
  } else if (hasVariability) {
    selectedSummary = randomSelect(summaries.inconsistentBrilliance);
    profileType = "Variable Performer";
  } else {
    selectedSummary = "This cognitive profile falls within typical ranges. While some variability is present, it does not suggest significant attention or executive function concerns. Any situational difficulties may be related to factors outside the scope of this assessment.";
    profileType = "Typical Range";
  }
  
  return {
    title: "Trait-Based Profile Summary",
    subtitle: profileType,
    profileSummary: selectedSummary,
    summary: selectedSummary,
    icon: hasCompensation ? '🎭' : hasVariability ? '📊' : hasSlowProcessing ? '🐢' : hasImpulsivity ? '⚡' : '✨'
  };
}

/**
 * Generate Risk Indicators
 * Flags for common comorbid patterns to explore
 */
export function generateRiskIndicators(metrics, flags = []) {
  const indicators = [];
  const riskData = narrativeBlocks.riskIndicators;
  
  // Emotional Dysregulation Risk
  if ((metrics.tau || 0) > 80 || flags.includes('emotionalDysregulation')) {
    indicators.push({
      ...riskData.emotionalDysregulation,
      severity: 'EXPLORE',
      detected: true
    });
  }
  
  // Burnout Risk
  if (flags.includes('compensated') || flags.includes('CA=1') || 
      ((metrics.accuracy || 0) > 90 && (metrics.meanRT || 0) > 500 && (metrics.cpi || 0) > 50)) {
    indicators.push({
      ...riskData.burnoutRisk,
      severity: 'HIGH',
      detected: true
    });
  }
  
  // Masking/Compensation
  if (flags.includes('masking') || flags.includes('MASK=1') || flags.includes('compensated')) {
    indicators.push({
      ...riskData.maskingCompensation,
      severity: 'MODERATE',
      detected: true
    });
  }
  
  // Rejection Sensitivity
  if (flags.includes('rejectionSensitivity') || 
      ((metrics.inhibitoryControl || 100) < 60 && flags.includes('emotionalDysregulation'))) {
    indicators.push({
      ...riskData.rejectionSensitivity,
      severity: 'EXPLORE',
      detected: true
    });
  }
  
  // Substance Risk (if significant untreated symptoms)
  if ((metrics.als || 0) > 70 && !flags.includes('treated')) {
    indicators.push({
      ...riskData.substanceRisk,
      severity: 'MONITOR',
      detected: true
    });
  }
  
  // Sleep Disruption
  if (flags.includes('sleepIssues') || (metrics.tau || 0) > 60) {
    indicators.push({
      ...riskData.sleepDisruption,
      severity: 'EXPLORE',
      detected: true
    });
  }
  
  // Anxiety Comorbidity
  if ((metrics.meanRT || 0) > 600 && (metrics.commissionErrors || 100) < 10) {
    indicators.push({
      ...riskData.anxietyComorbidity,
      severity: 'EVALUATE',
      detected: true
    });
  }
  
  // Depression Comorbidity
  if ((metrics.processingSpeed || 100) < 40 && flags.includes('motivationalDeficit')) {
    indicators.push({
      ...riskData.depressionComorbidity,
      severity: 'EVALUATE',
      detected: true
    });
  }
  
  return {
    title: "Risk Indicators",
    subtitle: "Patterns to Explore Further",
    disclaimer: "These are NOT diagnoses. They are patterns that warrant clinical exploration.",
    risks: indicators.map(i => ({
      indicator: i.indicator || i.risk || i.label,
      risk: i.indicator || i.risk || i.label,
      severity: i.severity,
      description: i.description || '',
      recommendation: i.recommendation || i.clinicalAction || '',
      monitoringNeeded: i.monitoringNeeded || i.screening || ''
    })),
    indicators,
    hasSignificantRisks: indicators.some(i => i.severity === 'HIGH' || i.severity === 'EVALUATE')
  };
}

/**
 * Generate Hidden Markers Narrative (MSSD + Fatigue Slope)
 * For detecting compensated high-performers who pass cognitive tests
 * but show micro-behavioral instability
 */
export function generateHiddenMarkersNarrative(hiddenMarkers, compensationAnalysis) {
  if (!hiddenMarkers || !hiddenMarkers.available) {
    return {
      title: "Micro-Behavioral Analysis",
      subtitle: "Hidden ADHD Markers",
      available: false,
      interpretation: "Reaction time data insufficient for micro-behavioral analysis.",
      compensatedPattern: false
    };
  }
  
  const mssdStatus = hiddenMarkers.mssd?.avgStatus || 'normal';
  const fatigueStatus = hiddenMarkers.fatigueSlope?.hasSignificantDecline ? 'elevated' : 'normal';
  const compensatedPattern = hiddenMarkers.compensatedPattern;
  
  // Generate interpretation based on findings
  let interpretation = '';
  
  if (compensatedPattern) {
    interpretation = `
⚠️ COMPENSATED HIGH-PERFORMER PATTERN DETECTED

This assessment reveals a critical finding: Despite adequate overall accuracy scores, 
your brain's moment-to-moment performance tells a different story.

TRIAL-TO-TRIAL VOLATILITY (MSSD): ${mssdStatus === 'high' ? 'HIGH' : mssdStatus === 'elevated' ? 'ELEVATED' : 'NORMAL'}
- What this means: Your reaction times jump dramatically from one trial to the next
- Hidden marker value: ${hiddenMarkers.mssd?.avgValue || 0}
- Interpretation: ${hiddenMarkers.mssd?.interpretation || 'N/A'}

COGNITIVE FATIGUE (Fatigue Slope): ${fatigueStatus === 'elevated' ? 'DETECTED' : 'MINIMAL'}
- What this means: Your performance ${fatigueStatus === 'elevated' ? 'declined significantly over time' : 'remained stable'}
- Slope: ${hiddenMarkers.fatigueSlope?.avgValue || 0} ms/trial
- Interpretation: ${hiddenMarkers.fatigueSlope?.interpretation || 'N/A'}

WHY THIS MATTERS:
Many high-functioning individuals with ADHD develop sophisticated compensation strategies 
that allow them to "pass" cognitive tests. However, these micro-behavioral markers reveal 
the hidden cognitive cost of that compensation:

1. You may be working 2-3x harder than neurotypical individuals to achieve similar results
2. This extra effort is mentally exhausting and often leads to burnout
3. Traditional testing misses this pattern because it only looks at final accuracy

CLINICAL IMPLICATION:
This pattern strongly supports further ADHD evaluation, even if standard test scores 
appear within normal limits. The compensation cost is real and clinically significant.
`.trim();
  } else if (mssdStatus !== 'normal' || fatigueStatus !== 'normal') {
    interpretation = `
Micro-behavioral analysis detected some subtle attention markers:

TRIAL-TO-TRIAL VOLATILITY (MSSD): ${mssdStatus.toUpperCase()}
- Value: ${hiddenMarkers.mssd?.avgValue || 0}
- ${hiddenMarkers.mssd?.interpretation || ''}

COGNITIVE FATIGUE: ${fatigueStatus === 'elevated' ? 'PRESENT' : 'MINIMAL'}
- Slope: ${hiddenMarkers.fatigueSlope?.avgValue || 0} ms/trial
- ${hiddenMarkers.fatigueSlope?.interpretation || ''}

While not meeting the threshold for "Compensated High-Performer" pattern, 
these findings suggest some attention variability worth monitoring.
`.trim();
  } else {
    interpretation = `
Micro-behavioral analysis shows stable performance:

TRIAL-TO-TRIAL VOLATILITY (MSSD): NORMAL
- Your reaction times were consistent from trial to trial
- Value: ${hiddenMarkers.mssd?.avgValue || 0}

COGNITIVE FATIGUE: MINIMAL
- Your performance remained stable throughout testing
- Slope: ${hiddenMarkers.fatigueSlope?.avgValue || 0} ms/trial

No hidden compensated ADHD pattern was detected.
`.trim();
  }
  
  return {
    title: "Micro-Behavioral Analysis",
    subtitle: "Hidden ADHD Markers (MSSD + Fatigue Slope)",
    available: true,
    compensatedPattern,
    mssd: hiddenMarkers.mssd,
    fatigueSlope: hiddenMarkers.fatigueSlope,
    tasks: hiddenMarkers.tasks,
    interpretation,
    summary: hiddenMarkers.summary,
    clinicalRelevance: compensatedPattern 
      ? "HIGH - Strong indicator of compensated ADHD requiring further evaluation"
      : mssdStatus !== 'normal' || fatigueStatus !== 'normal'
        ? "MODERATE - Some attention markers present, worth clinical consideration"
        : "LOW - No hidden ADHD markers detected"
  };
}

/**
 * Generate complete narrative report using blocks system
 */
export function generateBlockBasedNarrative(metrics, flags = [], dsm5Summary = {}, audienceType = 'patient') {
  // Generate all sections
  const coreMarkers = generateCoreMarkersNarrative(metrics, flags);
  const wmNarrative = generateWMNarrative(metrics);
  const conflictNarrative = generateConflictNarrative(metrics, flags.includes('hyperfocus'));
  const dsm5Narrative = generateDSM5Narrative(metrics, dsm5Summary);
  const subtypeNarrative = generateSubtypeNarrative(metrics.inferredSubtype);
  const realLifeImpact = generateRealLifeImpact(flags, metrics);
  const recommendations = generateRecommendations(metrics, flags);
  const simpleSummary = generateSimpleSummary(metrics, flags);
  
  // NEW: Level 1 - Clinically Useful Must-Haves
  const realWorldImpairment = generateRealWorldImpairment(metrics, flags);
  const symptomPatternMapping = generateSymptomPatternMapping(metrics);
  const clinicalQuestions = generateClinicalQuestions(metrics, flags);
  
  // NEW: Level 2 - Professional Level Enhancements
  const functionalDomainTable = generateFunctionalDomainTable(metrics);
  const patternLabels = generatePatternLabels(metrics, flags);
  const environmentInterpretation = generateEnvironmentInterpretation(metrics, flags);
  
  // NEW: Level 3 - Next Level Unique Features
  const personalizedInterventions = generatePersonalizedInterventions(metrics, flags);
  const traitBasedSummary = generateTraitBasedSummary(metrics, flags);
  const riskIndicators = generateRiskIndicators(metrics, flags);
  
  let narrative = {
    // Original sections
    coreMarkers,
    workingMemory: wmNarrative,
    interferenceControl: conflictNarrative,
    dsm5Correlation: dsm5Narrative,
    subtypeInference: subtypeNarrative,
    realLifeImpact,
    recommendations,
    simpleSummary,
    
    // Level 1: Clinically Useful Must-Haves
    realWorldImpairment,
    symptomPatternMapping,
    clinicalQuestions,
    
    // Level 2: Professional Level Enhancements
    functionalDomainTable,
    patternLabels,
    environmentInterpretation,
    
    // Level 3: Next Level Unique Features
    personalizedInterventions,
    traitBasedSummary,
    riskIndicators
  };
  
  // Adapt for audience
  if (audienceType === 'patient') {
    // Simplify technical terms
    narrative = adaptNarrativeForPatient(narrative);
  } else if (audienceType === 'clinician') {
    // Add technical details
    narrative = enhanceForClinician(narrative, metrics);
  }
  
  return narrative;
}

/**
 * Adapt narrative for patient audience
 */
function adaptNarrativeForPatient(narrative) {
  const adapted = JSON.parse(JSON.stringify(narrative)); // Deep clone
  
  // Recursively simplify all string values
  function simplifyObject(obj) {
    for (const key in obj) {
      if (typeof obj[key] === 'string') {
        obj[key] = simplifyForPatient(obj[key]);
      } else if (Array.isArray(obj[key])) {
        obj[key] = obj[key].map(item => 
          typeof item === 'string' ? simplifyForPatient(item) : 
          typeof item === 'object' ? simplifyObject(item) : item
        );
      } else if (typeof obj[key] === 'object' && obj[key] !== null) {
        simplifyObject(obj[key]);
      }
    }
    return obj;
  }
  
  return simplifyObject(adapted);
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  // Data blocks
  narrativeBlocks,
  
  // Utility functions
  randomSelect,
  hashString,
  getMCLevel,
  getCPILevel,
  getTauLevel,
  getWMLoadLevel,
  getConflictLevel,
  getImplicationKey,
  getDSM5Alignment,
  getALSCategory,
  
  // Audience adaptation
  simplifyForPatient,
  enhanceForClinician,
  patientFriendlyTerms,
  
  // Original narrative generators
  generateCoreMarkersNarrative,
  generateWMNarrative,
  generateConflictNarrative,
  generateDSM5Narrative,
  generateSubtypeNarrative,
  generateRealLifeImpact,
  generateRecommendations,
  generateSimpleSummary,
  
  // Level 1: Clinically Useful Must-Haves
  generateRealWorldImpairment,
  generateSymptomPatternMapping,
  generateClinicalQuestions,
  
  // Level 2: Professional Level Enhancements
  generateFunctionalDomainTable,
  generatePatternLabels,
  generateEnvironmentInterpretation,
  
  // Level 3: Next Level Unique Features
  generatePersonalizedInterventions,
  generateTraitBasedSummary,
  generateRiskIndicators,
  
  // Level 3.5: Hidden Markers
  generateHiddenMarkersNarrative,
  
  // Main generator
  generateBlockBasedNarrative
};
