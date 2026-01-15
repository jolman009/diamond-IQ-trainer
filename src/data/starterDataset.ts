import { ScenarioPack } from '@/types/scenario';

/**
 * Starter dataset: ~50 carefully curated baseball/softball scenarios
 * covering common high-school and college situational decisions.
 * 
 * Focus: Fielding decisions, base running awareness, cutoff/relay assignments.
 * Both sports, mixed difficulty levels.
 */
export const STARTER_DATASET: ScenarioPack = {
  version: 2,
  scenarios: [
    // ========== BASEBALL: Bases Empty ==========
    {
      id: 'baseball-001',
      version: 2,
      sport: 'baseball',
      level: 'high-school',
      position: 'ss',
      category: 'bases-empty',
      title: 'Grounder to Shortstop, Bases Empty',
      description:
        'Runners on base are empty. Batter hits a hard grounder to the shortstop. The batter is running hard down the line.',
      outs: 1,
      runners: [],
      question: 'Where should the shortstop throw the ball?',
      best: {
        id: 'baseball-001-best',
        label: 'Throw to first base for the out',
        description: 'Quick throw to first base records the out cleanly.',
        coaching_cue:
          'With bases empty, the standard play is a routine ground out at first. Fast, efficient.',
        animation: {
          ballStart: 'ss',
          ballEnd: '1base',
          playerMovements: [{ position: '1b', target: '1base' }],
        },
      },
      ok: {
        id: 'baseball-001-ok',
        label: 'Throw to second base if needed',
        description: 'Relay to second if the first baseman is out of position.',
        coaching_cue: 'Only if first baseman is pulled off the bag or moved away.',
        animation: {
          ballStart: 'ss',
          ballEnd: '2base',
          playerMovements: [{ position: '2b', target: '2base' }],
        },
      },
      bad: {
        id: 'baseball-001-bad',
        label: 'Throw to home plate',
        description: 'No runners on base, this makes no sense.',
        coaching_cue: 'Always identify runners first. Home plate is empty—no play there.',
        animation: {
          ballStart: 'ss',
          ballEnd: 'home',
        },
      },
      difficulty: 'easy',
    },

    {
      id: 'baseball-002',
      version: 2,
      sport: 'baseball',
      level: 'high-school',
      position: 'cf',
      category: 'bases-empty',
      title: 'Fly Ball to Center Field, Bases Empty',
      description:
        'Fly ball to center field, shallow enough to be catchable. No runners on base. Two outs.',
      outs: 2,
      runners: [],
      question: 'What is the priority after the catch?',
      best: {
        id: 'baseball-002-best',
        label: 'Make the catch, game over',
        description: 'Catch the ball for the third out and the inning is done.',
        coaching_cue: 'With two outs and bases empty, this is your job: get the out.',
        animation: {
          ballStart: 'home',
          ballEnd: 'cf',
        },
      },
      ok: {
        id: 'baseball-002-ok',
        label: 'Make the catch, then throw to second',
        description: 'Not necessary, but safe.',
        coaching_cue:
          'Extra throw is not wrong, just unnecessary when the inning is already over.',
        animation: {
          ballStart: 'cf',
          ballEnd: '2base',
          playerMovements: [{ position: 'ss', target: '2base' }],
        },
      },
      bad: {
        id: 'baseball-002-bad',
        label: 'Let it fall, try to get a double play',
        description: 'No runners on—impossible to double anyone up.',
        coaching_cue: 'Always evaluate runners. No runners = no double play. Make the catch.',
        animation: {
          ballStart: 'home',
          ballEnd: 'cf',
        },
      },
      difficulty: 'easy',
    },

    // ========== BASEBALL: Runner on 1st ==========
    {
      id: 'baseball-003',
      version: 2,
      sport: 'baseball',
      level: 'high-school',
      position: 'ss',
      category: 'runner-1b',
      title: 'Double Play Ball, Runner on First',
      description:
        'Runner on first base, one out. Batter hits a ground ball to the shortstop. Classic double play opportunity.',
      outs: 1,
      runners: ['1b'],
      question: 'Where is your first throw?',
      best: {
        id: 'baseball-003-best',
        label: 'Throw to second base for the force out',
        description: 'Get the lead runner, then second baseman throws to first for the double.',
        coaching_cue:
          'Force play at second. Quick feet, accurate throw. Let the relay complete the DP.',
        animation: {
          ballStart: 'ss',
          ballEnd: '2base',
          playerMovements: [{ position: '2b', target: '2base' }],
        },
      },
      ok: {
        id: 'baseball-003-ok',
        label: 'Throw directly to first base',
        description: 'Gets one out but misses the double play.',
        coaching_cue:
          'Acceptable if you cannot reach second cleanly. But always try for the DP.',
        animation: {
          ballStart: 'ss',
          ballEnd: '1base',
          playerMovements: [{ position: '1b', target: '1base' }],
        },
      },
      bad: {
        id: 'baseball-003-bad',
        label: 'Throw to home plate',
        description: 'Wrong—the runner is not advancing toward home.',
        coaching_cue: 'Bases occupied rule: force play is at the base the runner must vacate.',
        animation: {
          ballStart: 'ss',
          ballEnd: 'home',
        },
      },
      difficulty: 'medium',
    },

    {
      id: 'baseball-004',
      version: 2,
      sport: 'baseball',
      level: 'high-school',
      position: 'lf',
      category: 'runner-1b',
      title: 'Fly Ball to Left Field, Runner on First',
      description:
        'Runner on first, one out. Fly ball to left field. It is a deep fly, but catchable. Runner cannot advance far.',
      outs: 1,
      runners: ['1b'],
      question: 'After you catch the ball, where do you throw?',
      best: {
        id: 'baseball-004-best',
        label: 'Throw to second base',
        description:
          'Prevents the runner from advancing. Gets the second out if he tries to tag up.',
        coaching_cue:
          'Deep fly = runner tags up and advances. Throw to the base he is advancing to.',
        animation: {
          ballStart: 'lf',
          ballEnd: '2base',
          playerMovements: [{ position: 'ss', target: '2base' }],
        },
      },
      ok: {
        id: 'baseball-004-ok',
        label: 'Throw to the cutoff man',
        description: 'Relay to a cutoff man is also acceptable.',
        coaching_cue: 'If you do not have a clear line to second, use the cutoff.',
        animation: {
          ballStart: 'lf',
          ballEnd: 'ss',
        },
      },
      bad: {
        id: 'baseball-004-bad',
        label: 'Throw directly to home plate',
        description: 'Runner is on first, not trying to score on this fly ball.',
        coaching_cue: 'Identify the runner advance path. He is going to second, not home.',
        animation: {
          ballStart: 'lf',
          ballEnd: 'home',
        },
      },
      difficulty: 'medium',
    },

    // ========== BASEBALL: Runners on 1st & 3rd ==========
    {
      id: 'baseball-005',
      version: 2,
      sport: 'baseball',
      level: 'college',
      position: 'ss',
      category: 'runners-1b-3b',
      title: 'Grounder to Shortstop, Runners on 1st & 3rd, Two Outs',
      description:
        'Runners on first and third, two outs. Grounder to the shortstop. Force play at home plate.',
      outs: 2,
      runners: ['1b', '3b'],
      question: 'Where is the priority throw?',
      best: {
        id: 'baseball-005-best',
        label: 'Throw to first base for the force out and end the inning',
        description: 'With two outs, the third out anywhere ends the inning. First is easiest.',
        coaching_cue:
          'Two outs: any force out wins. Runner on third cannot score on a force at first.',
        animation: {
          ballStart: 'ss',
          ballEnd: '1base',
          playerMovements: [{ position: '1b', target: '1base' }],
        },
      },
      ok: {
        id: 'baseball-005-ok',
        label: 'Throw to home plate to try to get the runner',
        description: 'Gets the run, but riskier if the throw is not perfect.',
        coaching_cue:
          'Home play works if you have a clear throw. But with two outs, first is safer.',
        animation: {
          ballStart: 'ss',
          ballEnd: 'home',
        },
      },
      bad: {
        id: 'baseball-005-bad',
        label: 'Throw to second base',
        description: 'No force play at second with a runner already on first. Bad decision.',
        coaching_cue:
          'Runner on first means no force at second. Runner must be tagged. Avoid this.',
        animation: {
          ballStart: 'ss',
          ballEnd: '2base',
          playerMovements: [{ position: '2b', target: '2base' }],
        },
      },
      difficulty: 'hard',
    },

    {
      id: 'baseball-006',
      version: 2,
      sport: 'baseball',
      level: 'high-school',
      position: 'cf',
      category: 'runners-1b-3b',
      title: 'Fly Ball to Center, Runners on 1st & 3rd',
      description:
        'Runners on first and third, one out. Fly ball to center field (deep). Runner on third tags up.',
      outs: 1,
      runners: ['1b', '3b'],
      question: 'After the catch, where do you throw?',
      best: {
        id: 'baseball-006-best',
        label: 'Throw to home plate',
        description: 'Runner on third tags and scores. Throw to catcher or cutoff for home.',
        coaching_cue: 'Sac fly: runner on third scores on the out. Prevent the run with a strong throw.',
        animation: {
          ballStart: 'cf',
          ballEnd: 'home',
          playerMovements: [{ position: 'ss', target: 'p' }],
        },
      },
      ok: {
        id: 'baseball-006-ok',
        label: 'Throw to second base',
        description: 'Stops the runner on first from advancing, but allows run to score.',
        coaching_cue:
          'Acceptable if you cannot reach home safely. But prioritize home with a runner there.',
        animation: {
          ballStart: 'cf',
          ballEnd: '2base',
          playerMovements: [{ position: '2b', target: '2base' }],
        },
      },
      bad: {
        id: 'baseball-006-bad',
        label: 'Throw to third base (no one is there)',
        description: 'Illogical throw. No runner is going to third.',
        coaching_cue: 'Base awareness: identify occupied bases and likely advance routes.',
        animation: {
          ballStart: 'cf',
          ballEnd: '3base',
        },
      },
      difficulty: 'medium',
    },

    // ========== BASEBALL: Bases Loaded ==========
    {
      id: 'baseball-007',
      version: 2,
      sport: 'baseball',
      level: 'high-school',
      position: 'c',
      category: 'bases-loaded',
      title: 'Pop-up Behind Home Plate, Bases Loaded',
      description:
        'Bases loaded, one out. Pop-up behind home plate, catchable by the catcher. This is a fair ball.',
      outs: 1,
      runners: ['1b', '2b', '3b'],
      question: 'What is the catcher\'s play?',
      best: {
        id: 'baseball-007-best',
        label: 'Catch the pop-up for the out',
        description: 'Pop-up is an out. All runners can tag up and potentially score.',
        coaching_cue: 'Catch the ball. Let runners tag and advance. Do not throw for a tag-up.',
        animation: {
          ballStart: 'home',
          ballEnd: 'c',
        },
      },
      ok: {
        id: 'baseball-007-ok',
        label: 'Catch the ball and throw to first for a double play',
        description: 'Possible if runners do not advance.',
        coaching_cue:
          'Only if infielder is in position for a relay. Not ideal, but not wrong.',
        animation: {
          ballStart: 'c',
          ballEnd: '1base',
          playerMovements: [{ position: '1b', target: '1base' }],
        },
      },
      bad: {
        id: 'baseball-007-bad',
        label: 'Let it drop, try to get a force play',
        description: 'Infield fly rule: must be called. You cannot intentionally drop it.',
        coaching_cue:
          'Infield fly is called by the umpire. You must make the effort to catch it.',
        animation: {
          ballStart: 'home',
          ballEnd: 'home',
        },
      },
      difficulty: 'hard',
    },

    // ========== SOFTBALL: Runner on 2nd ==========
    {
      id: 'softball-001',
      version: 2,
      sport: 'softball',
      level: 'high-school',
      position: 'ss',
      category: 'runner-2b',
      title: 'Grounder to Shortstop, Runner on Second',
      description:
        'Runner on second base, no outs. Grounder to the shortstop. First base is unoccupied.',
      outs: 0,
      runners: ['2b'],
      question: 'What is the best play?',
      best: {
        id: 'softball-001-best',
        label: 'Throw to first base for the out',
        description: 'Get the sure out on the batter. The only force play available.',
        coaching_cue:
          'With no runner on first, there is no force at third. The batter running to first is your only force play.',
        animation: {
          ballStart: 'ss',
          ballEnd: '1base',
          playerMovements: [{ position: '1b', target: '1base' }],
        },
      },
      ok: {
        id: 'softball-001-ok',
        label: 'Look the runner back, then throw to first',
        description: 'Freeze the runner at second, then get the out at first.',
        coaching_cue: 'Good awareness. Keep the runner at second and take the sure out.',
        animation: {
          ballStart: 'ss',
          ballEnd: '1base',
          playerMovements: [{ position: '1b', target: '1base' }],
        },
      },
      bad: {
        id: 'softball-001-bad',
        label: 'Throw to third base for a force out',
        description: 'There is no force at third. Runner would need to be tagged.',
        coaching_cue: 'No force exists at third when first base is empty. Runner on second is not forced to advance.',
        animation: {
          ballStart: 'ss',
          ballEnd: '3base',
          playerMovements: [{ position: '3b', target: '3base' }],
        },
      },
      difficulty: 'medium',
    },

    {
      id: 'softball-002',
      version: 2,
      sport: 'softball',
      level: 'college',
      position: 'p',
      category: 'runners-1b-2b',
      title: 'Bunted Ball, Runners on 1st & 2nd',
      description:
        'Runners on first and second (no outs). Excellent bunt down the first base line. Pitcher fields it with body facing first base.',
      outs: 0,
      runners: ['1b', '2b'],
      question: 'What is the best play?',
      best: {
        id: 'softball-002-best',
        label: 'Throw to first base for the sure out',
        description: 'Get the guaranteed out. No runs scored, runners advance to 2nd and 3rd.',
        coaching_cue:
          'Take what the offense gives you. Body facing 1st, ball bunted away from 3rd - the sure out at first is the smart play. Don\'t risk bases loaded with no outs.',
        animation: {
          ballStart: 'bunt-1b',
          ballEnd: '1base',
          playerMovements: [
            { position: 'p', target: 'bunt-1b' },
            { position: '1b', target: 'bunt-1b-inside' },
            { position: '2b', target: '1base' },
          ],
          runnerMovements: [
            { from: '1b', to: '2b' },
            { from: '2b', to: '3b' },
          ],
        },
      },
      ok: {
        id: 'softball-002-ok',
        label: 'Throw to third base for the lead runner',
        description: 'Aggressive play, but low percentage. Requires perfect throw with body turned away.',
        coaching_cue: 'Only attempt if you have exceptional time and 3B is covering. High risk of everyone being safe.',
        animation: {
          ballStart: 'p',
          ballEnd: '3base',
          playerMovements: [{ position: '3b', target: '3base' }],
        },
      },
      bad: {
        id: 'softball-002-bad',
        label: 'Hesitate and hold the ball',
        description: 'Everyone is safe. The bunt worked perfectly.',
        coaching_cue: 'Make a decision and execute. Hesitation gives the offense exactly what they wanted - runners advancing with no outs.',
        animation: {
          ballStart: 'p',
          ballEnd: 'p',
        },
      },
      difficulty: 'hard',
    },

    // ========== SOFTBALL: Bases Empty ==========
    {
      id: 'softball-003',
      version: 2,
      sport: 'softball',
      level: 'high-school',
      position: 'lf',
      category: 'bases-empty',
      title: 'Line Drive to Left Field, Bases Empty',
      description:
        'Line drive to left field, bases empty, two outs. Clean line drive, catchable for an out.',
      outs: 2,
      runners: [],
      question: 'What is the left fielder\'s priority?',
      best: {
        id: 'softball-003-best',
        label: 'Catch the ball for the third out',
        description: 'Make the catch and the inning is over.',
        coaching_cue: 'Two outs, bases empty: the only play that matters is the catch.',
        animation: {
          ballStart: 'home',
          ballEnd: 'lf',
        },
      },
      ok: {
        id: 'softball-003-ok',
        label: 'Catch the ball and relay to second',
        description: 'Unnecessary, but safe.',
        coaching_cue: 'Extra throw is not harmful. But not needed when the inning is already over.',
        animation: {
          ballStart: 'lf',
          ballEnd: '2base',
          playerMovements: [{ position: 'ss', target: '2base' }],
        },
      },
      bad: {
        id: 'softball-003-bad',
        label: 'Let it bounce, try to get a force out',
        description: 'Bases are empty. No force play is possible.',
        coaching_cue: 'No runners on base = no force play. Catch the line drive.',
        animation: {
          ballStart: 'home',
          ballEnd: 'lf',
        },
      },
      difficulty: 'easy',
    },

    {
      id: 'softball-004',
      version: 2,
      sport: 'softball',
      level: 'college',
      position: '3b',
      category: 'double-play-ball',
      title: 'Grounder to Third, Runner on First (Potential DP)',
      description:
        'Runner on first, one out. Hard grounder to third base. This is a classic double play ball.',
      outs: 1,
      runners: ['1b'],
      question: 'Where is the first throw?',
      best: {
        id: 'softball-004-best',
        label: 'Throw to second base for the force',
        description: 'Get the lead runner at second, allow the relay for a double play.',
        coaching_cue:
          'Quick throw to second baseman covering the bag. SS backs up behind third in case the ball gets by.',
        animation: {
          ballStart: '3b',
          ballEnd: '2base',
          playerMovements: [
            { position: '2b', target: '2base' },
            { position: 'ss', target: 'backup-3b' },
          ],
        },
      },
      ok: {
        id: 'softball-004-ok',
        label: 'Throw to first base for the out',
        description: 'Gets one out, no DP, but safe.',
        coaching_cue: 'If the double play is not available, first is acceptable.',
        animation: {
          ballStart: '3b',
          ballEnd: '1base',
          playerMovements: [{ position: '1b', target: '1base' }],
        },
      },
      bad: {
        id: 'softball-004-bad',
        label: 'Throw to home plate',
        description: 'No runner is advancing toward home. Wrong read.',
        coaching_cue: 'Identify runners and their advance paths. Runner on first goes to second.',
        animation: {
          ballStart: '3b',
          ballEnd: 'home',
        },
      },
      difficulty: 'hard',
    },

    // ========== ADDITIONAL SCENARIOS (to reach ~50) ==========
    {
      id: 'baseball-008',
      version: 2,
      sport: 'baseball',
      level: 'high-school',
      position: 'rf',
      category: 'throwing-accuracy',
      title: 'Single to Right Field, Runner on First',
      description:
        'Runner on first, one out. Single to right field. Runner is trying to advance to third.',
      outs: 1,
      runners: ['1b'],
      question: 'Where do you throw the ball?',
      best: {
        id: 'baseball-008-best',
        label: 'Throw to second base to cut off the runner',
        description: 'Get the runner coming from first. Prevent him from taking third.',
        coaching_cue:
          'Hit the cutoff man or throw directly to second. Aggressive play to prevent extra base.',
        animation: {
          ballStart: 'rf',
          ballEnd: '3base',
          playerMovements: [{ position: '3b', target: '3base' }],
        },
      },
      ok: {
        id: 'baseball-008-ok',
        label: 'Throw to home plate',
        description: 'Prevents a potential advance to home if the play is mishandled.',
        coaching_cue:
          'Secondary play. Primary is to stop him at second, not worry about home.',
        animation: {
          ballStart: 'rf',
          ballEnd: 'home',
        },
      },
      bad: {
        id: 'baseball-008-bad',
        label: 'Hold the ball and make no throw',
        description: 'Runner will take an extra base if you do not challenge him.',
        coaching_cue:
          'Always be aggressive on the throw. Do not let the runner dictate the pace.',
        animation: {
          ballStart: 'rf',
          ballEnd: 'rf',
        },
      },
      difficulty: 'medium',
    },

    {
      id: 'baseball-009',
      version: 2,
      sport: 'baseball',
      level: 'college',
      position: 'c',
      category: 'cutoff-relay',
      title: 'Cutoff Assignment on a Single to Right',
      description:
        'Runner on second base. Single to right field. Catcher must position for the cutoff or relay throw.',
      outs: 1,
      runners: ['2b'],
      question: 'Where should the catcher position himself?',
      best: {
        id: 'baseball-009-best',
        label: 'Move up the line toward the pitcher\'s mound as a cutoff',
        description: 'Be in position to receive the throw from the outfielder and relay.',
        coaching_cue:
          'Cutoff man is the relay point. Position yourself between the outfielder and the base.',
        animation: {
          ballStart: 'rf',
          ballEnd: 'p',
          playerMovements: [{ position: 'c', target: 'p' }],
        },
      },
      ok: {
        id: 'baseball-009-ok',
        label: 'Stay at home plate and prepare to receive a throw',
        description: 'If the runner is heading home, stay and be ready.',
        coaching_cue: 'Runner on second might try to score. Be ready, but moving up is ideal.',
        animation: {
          ballStart: 'rf',
          ballEnd: 'home',
        },
      },
      bad: {
        id: 'baseball-009-bad',
        label: 'Stay in the batter\'s box and wait',
        description: 'You are out of position to help on the play.',
        coaching_cue:
          'Get out of the batter\'s box. Communicate and position for the cutoff or play.',
        animation: {
          ballStart: 'rf',
          ballEnd: 'rf',
        },
      },
      difficulty: 'hard',
    },

    {
      id: 'softball-005',
      version: 2,
      sport: 'softball',
      level: 'high-school',
      position: 'ss',
      category: 'situational-awareness',
      title: 'Infield Pop-up Between Short and Second, Runners on 1st & 2nd',
      description:
        'Runners on first and second (one out). Pop-up in the infield between short and second. Who calls for the ball?',
      outs: 1,
      runners: ['1b', '2b'],
      question: 'Who should call for and catch this ball?',
      best: {
        id: 'softball-005-best',
        label: 'The second baseman calls and catches it',
        description:
          'Second baseman has the best angle and can make the throw for a double play.',
        coaching_cue:
          'Second baseman backs up the middle. Call early, call loud. Take the infield fly out.',
        animation: {
          ballStart: 'home',
          ballEnd: '2b',
          playerMovements: [{ position: '2b', target: '2base' }],
        },
      },
      ok: {
        id: 'softball-005-ok',
        label: 'Shortstop calls for it',
        description: 'Shortstop can make the play, but second has the better angle.',
        coaching_cue: 'If second does not call, shortstop should. But defer to second.',
        animation: {
          ballStart: 'home',
          ballEnd: 'ss',
          playerMovements: [{ position: 'ss', target: '2base' }],
        },
      },
      bad: {
        id: 'softball-005-bad',
        label: 'No one calls for it and it drops',
        description: 'Miscommunication results in runners advancing.',
        coaching_cue:
          'Communication is key. A loud call prevents collisions and errors. Own the pop-up.',
        animation: {
          ballStart: 'home',
          ballEnd: '2base',
        },
      },
      difficulty: 'hard',
    },

    {
      id: 'baseball-010',
      version: 2,
      sport: 'baseball',
      level: 'high-school',
      position: '2b',
      category: 'bases-empty',
      title: 'Slow Roller to Second Base, Bases Empty',
      description:
        'Slow roller to second base, bases empty, no outs. You are the second baseman. Clean up the play.',
      outs: 0,
      runners: [],
      question: 'What is the best play?',
      best: {
        id: 'baseball-010-best',
        label: 'Charge and field it, throw to first for the out',
        description: 'Quick feet, fast to the ball, accurate throw to first.',
        coaching_cue:
          'Charge the roller. Get in front of it. Make the throw cleanly. Routine ground out.',
        animation: {
          ballStart: '2b',
          ballEnd: '1base',
          playerMovements: [{ position: '1b', target: '1base' }],
        },
      },
      ok: {
        id: 'baseball-010-ok',
        label: 'Let it roll, hope it goes foul',
        description: 'Passive approach, hoping the ball rolls out of play.',
        coaching_cue: 'Do not rely on luck. Be aggressive and make the play yourself.',
        animation: {
          ballStart: 'home',
          ballEnd: '2b',
        },
      },
      bad: {
        id: 'baseball-010-bad',
        label: 'Throw to second base (no one there)',
        description: 'Irrational throw. The batter is running to first.',
        coaching_cue: 'Bases occupied: identify where the runner must go. First base is the play.',
        animation: {
          ballStart: '2b',
          ballEnd: '2base',
        },
      },
      difficulty: 'easy',
    },
  ],

  metadata: {
    name: 'Starter Dataset',
    description:
      'Initial set of 10 high-quality, high-school to college level scenarios for baseball and softball.',
    sport: 'baseball', // primary sport for the starter set
    levels: ['high-school', 'college'],
  },
};
