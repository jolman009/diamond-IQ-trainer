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

    // ========== NEW SCENARIOS: Runner on Third ==========
    {
      id: 'baseball-011',
      version: 2,
      sport: 'baseball',
      level: 'high-school',
      position: 'ss',
      category: 'runner-3b',
      title: 'Grounder to Short, Runner on Third, Less Than Two Outs',
      description:
        'Runner on third base only, one out. Ground ball hit to the shortstop. Runner is holding at third.',
      outs: 1,
      runners: ['3b'],
      question: 'Where should the shortstop throw?',
      best: {
        id: 'baseball-011-best',
        label: 'Throw to first base for the out',
        description: 'Get the sure out at first. Runner on third cannot score on this play.',
        coaching_cue:
          'With runner on third holding, take the guaranteed out at first. Do not force a play at home.',
        animation: {
          ballStart: 'ss',
          ballEnd: '1base',
          playerMovements: [{ position: '1b', target: '1base' }],
        },
      },
      ok: {
        id: 'baseball-011-ok',
        label: 'Check the runner, then throw to first',
        description: 'Quick glance keeps runner honest, still get the out.',
        coaching_cue: 'Good awareness to check the runner, but do not hesitate too long.',
        animation: {
          ballStart: 'ss',
          ballEnd: '1base',
          playerMovements: [{ position: '1b', target: '1base' }],
        },
      },
      bad: {
        id: 'baseball-011-bad',
        label: 'Throw home immediately',
        description: 'Runner is not advancing. No play at home.',
        coaching_cue: 'Read the runner. If he is holding, there is no play at home. Take the out at first.',
        animation: {
          ballStart: 'ss',
          ballEnd: 'home',
        },
      },
      difficulty: 'medium',
    },

    {
      id: 'baseball-012',
      version: 2,
      sport: 'baseball',
      level: 'college',
      position: '3b',
      category: 'runner-3b',
      title: 'Squeeze Bunt, Runner on Third',
      description:
        'Runner on third, one out. Batter squares to bunt. The ball is bunted toward third base. Runner breaks for home.',
      outs: 1,
      runners: ['3b'],
      question: 'What is the third baseman\'s play?',
      best: {
        id: 'baseball-012-best',
        label: 'Field and throw home to get the runner',
        description: 'Stop the run from scoring. This is a suicide squeeze.',
        coaching_cue:
          'On a squeeze, the priority is preventing the run. Quick throw home if you have a play.',
        animation: {
          ballStart: 'bunt-3b',
          ballEnd: 'home',
          playerMovements: [{ position: '3b', target: 'bunt-3b' }],
          runnerMovements: [{ from: '3b', to: 'home' }],
        },
      },
      ok: {
        id: 'baseball-012-ok',
        label: 'Field and throw to first for the out',
        description: 'Get the sure out, but the run scores.',
        coaching_cue: 'If the throw home is not clean, take the out at first. One run is better than bases loaded.',
        animation: {
          ballStart: 'bunt-3b',
          ballEnd: '1base',
          playerMovements: [{ position: '3b', target: 'bunt-3b' }],
        },
      },
      bad: {
        id: 'baseball-012-bad',
        label: 'Hold the ball and watch',
        description: 'Both runner scores and batter reaches safely.',
        coaching_cue: 'Never freeze on a squeeze. Make a decision and execute.',
        animation: {
          ballStart: 'bunt-3b',
          ballEnd: '3b',
        },
      },
      difficulty: 'hard',
    },

    // ========== NEW SCENARIOS: Runners on Second and Third ==========
    {
      id: 'baseball-013',
      version: 2,
      sport: 'baseball',
      level: 'high-school',
      position: 'ss',
      category: 'runners-2b-3b',
      title: 'Grounder to Short, Runners on 2nd & 3rd, One Out',
      description:
        'Runners on second and third, one out. Ground ball to the shortstop. Infield is playing in to cut off the run.',
      outs: 1,
      runners: ['2b', '3b'],
      question: 'Where is the priority throw?',
      best: {
        id: 'baseball-013-best',
        label: 'Throw home to cut off the run',
        description: 'With infield in, the priority is preventing the run from scoring.',
        coaching_cue:
          'Infield in means run prevention is the priority. Quick throw home if you have a play on the runner.',
        animation: {
          ballStart: 'ss',
          ballEnd: 'home',
          runnerMovements: [{ from: '3b', to: 'home' }],
        },
      },
      ok: {
        id: 'baseball-013-ok',
        label: 'Throw to first for the sure out',
        description: 'Gets an out but allows the run to score.',
        coaching_cue: 'Acceptable if the throw home is not clean. But understand a run will score.',
        animation: {
          ballStart: 'ss',
          ballEnd: '1base',
          playerMovements: [{ position: '1b', target: '1base' }],
        },
      },
      bad: {
        id: 'baseball-013-bad',
        label: 'Throw to third base',
        description: 'Runner has already left third. No play there.',
        coaching_cue: 'Third base is empty once the runner breaks. Read the play correctly.',
        animation: {
          ballStart: 'ss',
          ballEnd: '3base',
        },
      },
      difficulty: 'hard',
    },

    {
      id: 'baseball-014',
      version: 2,
      sport: 'baseball',
      level: 'high-school',
      position: 'cf',
      category: 'runners-2b-3b',
      title: 'Fly Ball to Center, Runners on 2nd & 3rd, One Out',
      description:
        'Runners on second and third, one out. Deep fly ball to center field. Both runners tag up.',
      outs: 1,
      runners: ['2b', '3b'],
      question: 'After the catch, where do you throw?',
      best: {
        id: 'baseball-014-best',
        label: 'Throw to home plate',
        description: 'Try to get the runner tagging from third.',
        coaching_cue:
          'Runner on third is the lead runner and will score if you do not throw home. Make a strong, accurate throw.',
        animation: {
          ballStart: 'cf',
          ballEnd: 'home',
          runnerMovements: [{ from: '3b', to: 'home' }],
        },
      },
      ok: {
        id: 'baseball-014-ok',
        label: 'Throw to third base',
        description: 'Try to get the runner advancing from second.',
        coaching_cue: 'If the run is conceded, you can try for the out at third on the trailing runner.',
        animation: {
          ballStart: 'cf',
          ballEnd: '3base',
          playerMovements: [{ position: '3b', target: '3base' }],
          runnerMovements: [{ from: '2b', to: '3b' }],
        },
      },
      bad: {
        id: 'baseball-014-bad',
        label: 'Throw to second base',
        description: 'No runner is going to second. Wasted throw.',
        coaching_cue: 'Read the runners. Both are advancing toward home, not retreating.',
        animation: {
          ballStart: 'cf',
          ballEnd: '2base',
        },
      },
      difficulty: 'medium',
    },

    // ========== NEW SCENARIOS: Runners on First and Second ==========
    {
      id: 'baseball-015',
      version: 2,
      sport: 'baseball',
      level: 'high-school',
      position: '3b',
      category: 'runners-1b-2b',
      title: 'Grounder to Third, Runners on 1st & 2nd, No Outs',
      description:
        'Runners on first and second, no outs. Sharp grounder to third base. Classic bunt/DP situation.',
      outs: 0,
      runners: ['1b', '2b'],
      question: 'Where is the best throw?',
      best: {
        id: 'baseball-015-best',
        label: 'Step on third and throw to first for double play',
        description: 'Force at third, then relay to first for the double play.',
        coaching_cue:
          'With runners on first and second, you have a force at third. Step on the bag and complete the DP.',
        animation: {
          ballStart: '3b',
          ballEnd: '3base',
          playerMovements: [{ position: '1b', target: '1base' }],
        },
      },
      ok: {
        id: 'baseball-015-ok',
        label: 'Throw to second base for the force',
        description: 'Gets one out and starts a potential DP through second.',
        coaching_cue: 'Alternative DP route. Works but stepping on third is more direct.',
        animation: {
          ballStart: '3b',
          ballEnd: '2base',
          playerMovements: [{ position: 'ss', target: '2base' }],
        },
      },
      bad: {
        id: 'baseball-015-bad',
        label: 'Throw directly to first',
        description: 'Only gets one out, runners advance to second and third.',
        coaching_cue: 'With force plays available at multiple bases, maximize outs. Do not settle for one.',
        animation: {
          ballStart: '3b',
          ballEnd: '1base',
          playerMovements: [{ position: '1b', target: '1base' }],
        },
      },
      difficulty: 'medium',
    },

    // ========== NEW SCENARIOS: Bases Loaded Additional ==========
    {
      id: 'baseball-016',
      version: 2,
      sport: 'baseball',
      level: 'college',
      position: 'ss',
      category: 'bases-loaded',
      title: 'Grounder to Short, Bases Loaded, Two Outs',
      description:
        'Bases loaded, two outs. Ground ball to the shortstop. Any force out ends the inning.',
      outs: 2,
      runners: ['1b', '2b', '3b'],
      question: 'Where should you throw?',
      best: {
        id: 'baseball-016-best',
        label: 'Throw to second base for the force',
        description: 'Shortest throw, highest percentage. Ends the inning.',
        coaching_cue:
          'With two outs and bases loaded, any force ends it. Second base is the closest and safest throw.',
        animation: {
          ballStart: 'ss',
          ballEnd: '2base',
          playerMovements: [{ position: '2b', target: '2base' }],
        },
      },
      ok: {
        id: 'baseball-016-ok',
        label: 'Throw to third base for the force',
        description: 'Gets the out, but longer throw than second.',
        coaching_cue: 'Still ends the inning, just a slightly longer throw. Acceptable.',
        animation: {
          ballStart: 'ss',
          ballEnd: '3base',
          playerMovements: [{ position: '3b', target: '3base' }],
        },
      },
      bad: {
        id: 'baseball-016-bad',
        label: 'Throw home',
        description: 'Longest throw with highest risk of error.',
        coaching_cue: 'Home is the longest throw. Why risk it when second is so close?',
        animation: {
          ballStart: 'ss',
          ballEnd: 'home',
        },
      },
      difficulty: 'medium',
    },

    {
      id: 'baseball-017',
      version: 2,
      sport: 'baseball',
      level: 'high-school',
      position: '1b',
      category: 'bases-loaded',
      title: 'Grounder to First, Bases Loaded, No Outs',
      description:
        'Bases loaded, no outs. Sharp grounder hit directly to the first baseman. Multiple force plays available.',
      outs: 0,
      runners: ['1b', '2b', '3b'],
      question: 'What is the first baseman\'s best play?',
      best: {
        id: 'baseball-017-best',
        label: 'Step on first, then throw home for double play',
        description: 'Remove the force at home, then tag the runner trying to score.',
        coaching_cue:
          'Step on first for the force, eliminating the runner behind you. Then throw home where catcher can tag the runner.',
        animation: {
          ballStart: '1b',
          ballEnd: '1base',
          playerMovements: [{ position: 'c', target: 'home' }],
        },
      },
      ok: {
        id: 'baseball-017-ok',
        label: 'Throw home for the force, then back to first',
        description: 'Gets the home-to-first double play.',
        coaching_cue: 'Works, but stepping on first yourself is more reliable.',
        animation: {
          ballStart: '1b',
          ballEnd: 'home',
        },
      },
      bad: {
        id: 'baseball-017-bad',
        label: 'Throw to second for the 3-6-3 double play',
        description: 'Overly complicated. Allows runner on third to score.',
        coaching_cue: 'Do not ignore the run. First-to-home DP prevents the run and gets two outs.',
        animation: {
          ballStart: '1b',
          ballEnd: '2base',
          playerMovements: [{ position: 'ss', target: '2base' }],
        },
      },
      difficulty: 'hard',
    },

    // ========== NEW SOFTBALL SCENARIOS ==========
    {
      id: 'softball-006',
      version: 2,
      sport: 'softball',
      level: 'high-school',
      position: 'rf',
      category: 'runner-3b',
      title: 'Fly Ball to Right, Runner on Third, Less Than Two Outs',
      description:
        'Runner on third, one out. Fly ball to right field. The runner will tag up and try to score.',
      outs: 1,
      runners: ['3b'],
      question: 'After catching the ball, where do you throw?',
      best: {
        id: 'softball-006-best',
        label: 'Throw home to get the tagging runner',
        description: 'Strong throw to home plate to beat the runner.',
        coaching_cue:
          'Sac fly situation. Runner tags and goes. Your job is to make an accurate throw home.',
        animation: {
          ballStart: 'rf',
          ballEnd: 'home',
          runnerMovements: [{ from: '3b', to: 'home' }],
        },
      },
      ok: {
        id: 'softball-006-ok',
        label: 'Throw to the cutoff (second baseman)',
        description: 'Use the cutoff if you cannot make a direct throw home.',
        coaching_cue: 'If arm strength is not there, hit the cutoff and let them relay.',
        animation: {
          ballStart: 'rf',
          ballEnd: '2b',
          playerMovements: [{ position: '2b', target: 'p' }],
        },
      },
      bad: {
        id: 'softball-006-bad',
        label: 'Hold the ball',
        description: 'Runner scores easily with no challenge.',
        coaching_cue: 'Always challenge the runner. Make them prove they can beat your throw.',
        animation: {
          ballStart: 'rf',
          ballEnd: 'rf',
        },
      },
      difficulty: 'medium',
    },

    {
      id: 'softball-007',
      version: 2,
      sport: 'softball',
      level: 'college',
      position: 'c',
      category: 'runners-2b-3b',
      title: 'Passed Ball, Runners on 2nd & 3rd',
      description:
        'Runners on second and third, one out. Pitch gets past the catcher. Both runners advance.',
      outs: 1,
      runners: ['2b', '3b'],
      question: 'What is the catcher\'s priority?',
      best: {
        id: 'softball-007-best',
        label: 'Retrieve ball, throw to pitcher covering home',
        description: 'Try to get the runner from third if there is a play.',
        coaching_cue:
          'On a passed ball, retrieve quickly. If you have a play at home, take it. Pitcher should cover.',
        animation: {
          ballStart: 'c',
          ballEnd: 'home',
          playerMovements: [{ position: 'p', target: 'home' }],
        },
      },
      ok: {
        id: 'softball-007-ok',
        label: 'Retrieve ball and hold',
        description: 'Concede the run if no play is available.',
        coaching_cue: 'If the throw is not there, eat the ball. Do not compound the error.',
        animation: {
          ballStart: 'c',
          ballEnd: 'c',
        },
      },
      bad: {
        id: 'softball-007-bad',
        label: 'Throw to third base',
        description: 'Runner from third is going home, not back to third.',
        coaching_cue: 'Read the runners. Third is vacated—no play there.',
        animation: {
          ballStart: 'c',
          ballEnd: '3base',
        },
      },
      difficulty: 'hard',
    },

    {
      id: 'softball-008',
      version: 2,
      sport: 'softball',
      level: 'high-school',
      position: 'ss',
      category: 'bases-loaded',
      title: 'Line Drive to Short, Bases Loaded, One Out',
      description:
        'Bases loaded, one out. Line drive caught by the shortstop. Runners frozen on bases.',
      outs: 1,
      runners: ['1b', '2b', '3b'],
      question: 'After catching the line drive, what do you do?',
      best: {
        id: 'softball-008-best',
        label: 'Step on second base for the unassisted double play',
        description: 'Runner on second cannot get back. Easy double play.',
        coaching_cue:
          'Line drive freezes runners. Step on second to double off the runner who left early.',
        animation: {
          ballStart: 'ss',
          ballEnd: '2base',
        },
      },
      ok: {
        id: 'softball-008-ok',
        label: 'Throw to third base to double off the runner',
        description: 'Gets the double play, but requires a throw.',
        coaching_cue: 'Works, but stepping on second is easier if you are closer.',
        animation: {
          ballStart: 'ss',
          ballEnd: '3base',
          playerMovements: [{ position: '3b', target: '3base' }],
        },
      },
      bad: {
        id: 'softball-008-bad',
        label: 'Throw home',
        description: 'Runner on third was frozen and is safe. No play there.',
        coaching_cue: 'Runners freeze on line drives. Look for the double play, not the tag.',
        animation: {
          ballStart: 'ss',
          ballEnd: 'home',
        },
      },
      difficulty: 'medium',
    },

    {
      id: 'softball-009',
      version: 2,
      sport: 'softball',
      level: 'high-school',
      position: '2b',
      category: 'runner-1b',
      title: 'Steal Attempt, Runner on First',
      description:
        'Runner on first, one out. The runner breaks for second on the pitch. Catcher throws to second.',
      outs: 1,
      runners: ['1b'],
      question: 'As the second baseman, what is your responsibility?',
      best: {
        id: 'softball-009-best',
        label: 'Cover second base and receive the throw',
        description: 'Standard coverage. Second baseman takes the throw on a steal.',
        coaching_cue:
          'On a steal to second from the right side, 2B typically covers. Get to the bag and make the tag.',
        animation: {
          ballStart: 'c',
          ballEnd: '2base',
          playerMovements: [{ position: '2b', target: '2base' }],
        },
      },
      ok: {
        id: 'softball-009-ok',
        label: 'Let the shortstop cover while you back up',
        description: 'Coverage by SS works, but 2B should be primary.',
        coaching_cue: 'Communication is key. If SS calls it, back them up. But default is 2B covers.',
        animation: {
          ballStart: 'c',
          ballEnd: '2base',
          playerMovements: [{ position: 'ss', target: '2base' }],
        },
      },
      bad: {
        id: 'softball-009-bad',
        label: 'Stay in position, let the ball go through',
        description: 'No one covers. Runner takes the base easily.',
        coaching_cue: 'Someone must cover on a steal. Never let a base go undefended.',
        animation: {
          ballStart: 'c',
          ballEnd: 'cf',
        },
      },
      difficulty: 'easy',
    },

    {
      id: 'softball-010',
      version: 2,
      sport: 'softball',
      level: 'college',
      position: 'lf',
      category: 'runners-1b-3b',
      title: 'Single to Left, Runners on 1st & 3rd',
      description:
        'Runners on first and third, one out. Clean single to left field. Runner on third scores easily.',
      outs: 1,
      runners: ['1b', '3b'],
      question: 'Where should the left fielder throw?',
      best: {
        id: 'softball-010-best',
        label: 'Throw to second base through the cutoff',
        description: 'Keep the trailing runner at first from taking second.',
        coaching_cue:
          'Run from third scores. Focus on the runner from first—do not let them take an extra base.',
        animation: {
          ballStart: 'lf',
          ballEnd: '2base',
          playerMovements: [{ position: 'ss', target: '2base' }],
        },
      },
      ok: {
        id: 'softball-010-ok',
        label: 'Throw home (even though runner scored)',
        description: 'Cut the ball home in case of a play on trailing runners.',
        coaching_cue: 'If another runner tries to advance home, be ready. But primary play is second.',
        animation: {
          ballStart: 'lf',
          ballEnd: 'home',
        },
      },
      bad: {
        id: 'softball-010-bad',
        label: 'Hold the ball in the outfield',
        description: 'Allows runners to take extra bases without challenge.',
        coaching_cue: 'Always get the ball back to the infield. Challenge every runner.',
        animation: {
          ballStart: 'lf',
          ballEnd: 'lf',
        },
      },
      difficulty: 'medium',
    },

    // ========== More Bases Empty Scenarios ==========
    {
      id: 'baseball-018',
      version: 2,
      sport: 'baseball',
      level: 'high-school',
      position: '3b',
      category: 'bases-empty',
      title: 'Bunt Down Third Base Line, Bases Empty',
      description:
        'Bases empty, no outs. Batter bunts the ball down the third base line. Ball is rolling fair.',
      outs: 0,
      runners: [],
      question: 'What is the third baseman\'s play?',
      best: {
        id: 'baseball-018-best',
        label: 'Field and throw to first for the out',
        description: 'Routine bunt fielding. Get the out at first.',
        coaching_cue:
          'Charge the bunt, field cleanly, and make an accurate throw to first. Routine play.',
        animation: {
          ballStart: 'bunt-3b',
          ballEnd: '1base',
          playerMovements: [{ position: '3b', target: 'bunt-3b' }],
        },
      },
      ok: {
        id: 'baseball-018-ok',
        label: 'Let the pitcher field it',
        description: 'Pitcher can make the play if closer.',
        coaching_cue: 'Communication matters. If pitcher has a better angle, let them take it.',
        animation: {
          ballStart: 'bunt-3b',
          ballEnd: '1base',
          playerMovements: [{ position: 'p', target: 'bunt-3b' }],
        },
      },
      bad: {
        id: 'baseball-018-bad',
        label: 'Let it roll hoping it goes foul',
        description: 'Ball may stay fair, batter reaches safely.',
        coaching_cue: 'Never gamble on foul balls. Field the ball and make the play.',
        animation: {
          ballStart: 'bunt-3b',
          ballEnd: 'bunt-3b',
        },
      },
      difficulty: 'easy',
    },

    {
      id: 'baseball-019',
      version: 2,
      sport: 'baseball',
      level: 'college',
      position: 'cf',
      category: 'bases-empty',
      title: 'Gap Shot to Center, Bases Empty, Two Outs',
      description:
        'Bases empty, two outs. Ball hit in the gap between center and left field. Batter-runner rounding first hard.',
      outs: 2,
      runners: [],
      question: 'As the center fielder, what is your play?',
      best: {
        id: 'baseball-019-best',
        label: 'Field and throw to second through the cutoff',
        description: 'Hold the runner to a single if possible.',
        coaching_cue:
          'Get to the ball quickly, hit your cutoff man aligned to second. Keep it a single.',
        animation: {
          ballStart: 'cf',
          ballEnd: '2base',
          playerMovements: [{ position: 'ss', target: '2base' }],
        },
      },
      ok: {
        id: 'baseball-019-ok',
        label: 'Field and throw directly to second',
        description: 'Skip the cutoff if you have a strong, accurate arm.',
        coaching_cue: 'Direct throw works with a strong arm, but cutoff is safer.',
        animation: {
          ballStart: 'cf',
          ballEnd: '2base',
        },
      },
      bad: {
        id: 'baseball-019-bad',
        label: 'Lob the ball back to the infield',
        description: 'Runner takes second easily, maybe third.',
        coaching_cue: 'Urgency matters. Two outs means get outs, not allow extra bases.',
        animation: {
          ballStart: 'cf',
          ballEnd: 'ss',
        },
      },
      difficulty: 'medium',
    },

    {
      id: 'baseball-020',
      version: 2,
      sport: 'baseball',
      level: 'high-school',
      position: 'p',
      category: 'runner-2b',
      title: 'Comebacker to Pitcher, Runner on Second',
      description:
        'Runner on second, one out. Ground ball hit back to the pitcher. Runner holds at second.',
      outs: 1,
      runners: ['2b'],
      question: 'Where should the pitcher throw?',
      best: {
        id: 'baseball-020-best',
        label: 'Throw to first base for the out',
        description: 'Get the sure out. Runner is not advancing.',
        coaching_cue:
          'With runner holding at second, take the guaranteed out at first. Simple play.',
        animation: {
          ballStart: 'p',
          ballEnd: '1base',
          playerMovements: [{ position: '1b', target: '1base' }],
        },
      },
      ok: {
        id: 'baseball-020-ok',
        label: 'Check the runner then throw to first',
        description: 'Quick glance keeps runner honest.',
        coaching_cue: 'Good awareness, but do not waste time. Get the out.',
        animation: {
          ballStart: 'p',
          ballEnd: '1base',
          playerMovements: [{ position: '1b', target: '1base' }],
        },
      },
      bad: {
        id: 'baseball-020-bad',
        label: 'Throw to third base',
        description: 'No force at third. Runner would need to be tagged.',
        coaching_cue: 'No force exists at third with only a runner on second. Take the out at first.',
        animation: {
          ballStart: 'p',
          ballEnd: '3base',
          playerMovements: [{ position: '3b', target: '3base' }],
        },
      },
      difficulty: 'easy',
    },

    // ========== BUNT DEFENSE: Runner on 1st Base ==========
    // Full defensive coverage: 1B/3B/P/C crash, 2B covers 1st, SS covers 2nd,
    // RF backs up 1st (foul line), CF backs up 2B area, LF backs up 3rd (foul line)

    // Bunt to Third Base Side - 0 Outs
    {
      id: 'bunt-r1-3b-0out',
      version: 2,
      sport: 'softball',
      level: 'high-school',
      position: '3b',
      category: 'bunt-defense',
      title: 'Bunt to 3B Side, Runner on 1st, No Outs',
      description:
        'Runner on first base, no outs. Sacrifice bunt is placed down the third base line. You are the third baseman charging the ball. 2B is covering first base.',
      outs: 0,
      runners: ['1b'],
      question: 'Where do you throw the ball?',
      best: {
        id: 'bunt-r1-3b-0out-best',
        label: 'Throw to first base for the out',
        description: 'Get the sure out at first. Runner advances to second.',
        coaching_cue:
          'TAKE THE OUT AT 1ST BASE! Going for the lead runner at second is fool\'s gold - you\'d be lucky to make that play 10% of the time. The 2B is covering first.',
        animation: {
          ballStart: 'bunt-3b',
          ballEnd: '1base',
          playerMovements: [
            { position: '3b', target: 'bunt-3b' },
            { position: '1b', target: 'bunt-1b-inside' },
            { position: 'p', target: 'bunt-3b-inside' },
            { position: 'c', target: 'bunt-1b-inside' },
            { position: '2b', target: '1base' },
            { position: 'ss', target: '2base' },
            { position: 'rf', target: 'backup-rf-foul' },
            { position: 'cf', target: 'backup-cf-shallow' },
            { position: 'lf', target: 'backup-lf-foul' },
          ],
          runnerMovements: [{ from: '1b', to: '2b' }],
        },
      },
      ok: {
        id: 'bunt-r1-3b-0out-ok',
        label: 'Let pitcher or catcher field it',
        description: 'If they have a better angle, defer to them.',
        coaching_cue:
          'As the 3B, you are the "General" on bunt plays. Call out who should field it based on who has the best play.',
        animation: {
          ballStart: 'bunt-3b',
          ballEnd: '1base',
          playerMovements: [
            { position: 'p', target: 'bunt-3b' },
            { position: '3b', target: 'bunt-3b-inside' },
            { position: '1b', target: 'bunt-1b-inside' },
            { position: 'c', target: 'bunt-1b-inside' },
            { position: '2b', target: '1base' },
            { position: 'ss', target: '2base' },
            { position: 'rf', target: 'backup-rf-foul' },
            { position: 'cf', target: 'backup-cf-shallow' },
            { position: 'lf', target: 'backup-lf-foul' },
          ],
          runnerMovements: [{ from: '1b', to: '2b' }],
        },
      },
      bad: {
        id: 'bunt-r1-3b-0out-bad',
        label: 'Throw to second base for the lead runner',
        description: 'Extremely low percentage play. Both runners likely safe.',
        coaching_cue:
          'Don\'t even consider going for the lead runner at 2nd - it\'s fool\'s gold. You\'d be lucky to make that play 10% of the time. Take the sure out.',
        animation: {
          ballStart: 'bunt-3b',
          ballEnd: '2base',
          playerMovements: [
            { position: '3b', target: 'bunt-3b' },
            { position: '1b', target: 'bunt-1b-inside' },
            { position: 'p', target: 'bunt-3b-inside' },
            { position: 'c', target: 'bunt-1b-inside' },
            { position: '2b', target: '1base' },
            { position: 'ss', target: '2base' },
            { position: 'rf', target: 'backup-rf-foul' },
            { position: 'cf', target: 'backup-cf-shallow' },
            { position: 'lf', target: 'backup-lf-foul' },
          ],
        },
      },
      difficulty: 'medium',
    },

    // Bunt to Third Base Side - 1 Out
    {
      id: 'bunt-r1-3b-1out',
      version: 2,
      sport: 'softball',
      level: 'high-school',
      position: '3b',
      category: 'bunt-defense',
      title: 'Bunt to 3B Side, Runner on 1st, One Out',
      description:
        'Runner on first base, one out. Sacrifice bunt down the third base line. You are the third baseman charging. Getting an out here is critical.',
      outs: 1,
      runners: ['1b'],
      question: 'Where do you throw?',
      best: {
        id: 'bunt-r1-3b-1out-best',
        label: 'Throw to first base for the out',
        description: 'Get the sure out. Now there are two outs with runner on second.',
        coaching_cue:
          'With one out, the sure out at first is even more valuable. Two outs changes everything - next batter must get a hit to score the runner.',
        animation: {
          ballStart: 'bunt-3b',
          ballEnd: '1base',
          playerMovements: [
            { position: '3b', target: 'bunt-3b' },
            { position: '1b', target: 'bunt-1b-inside' },
            { position: 'p', target: 'bunt-3b-inside' },
            { position: 'c', target: 'bunt-1b-inside' },
            { position: '2b', target: '1base' },
            { position: 'ss', target: '2base' },
            { position: 'rf', target: 'backup-rf-foul' },
            { position: 'cf', target: 'backup-cf-shallow' },
            { position: 'lf', target: 'backup-lf-foul' },
          ],
          runnerMovements: [{ from: '1b', to: '2b' }],
        },
      },
      ok: {
        id: 'bunt-r1-3b-1out-ok',
        label: 'Check runner then throw to first',
        description: 'Quick glance to freeze the runner, then get the out.',
        coaching_cue:
          'A quick look can keep the runner honest, but don\'t hesitate. Get the ball to first quickly.',
        animation: {
          ballStart: 'bunt-3b',
          ballEnd: '1base',
          playerMovements: [
            { position: '3b', target: 'bunt-3b' },
            { position: '1b', target: 'bunt-1b-inside' },
            { position: 'p', target: 'bunt-3b-inside' },
            { position: 'c', target: 'bunt-1b-inside' },
            { position: '2b', target: '1base' },
            { position: 'ss', target: '2base' },
            { position: 'rf', target: 'backup-rf-foul' },
            { position: 'cf', target: 'backup-cf-shallow' },
            { position: 'lf', target: 'backup-lf-foul' },
          ],
          runnerMovements: [{ from: '1b', to: '2b' }],
        },
      },
      bad: {
        id: 'bunt-r1-3b-1out-bad',
        label: 'Throw to second for the force',
        description: 'Low percentage throw. Risk having everyone safe.',
        coaching_cue:
          'The throw to second is away from your momentum and difficult to execute. Take the sure out at first.',
        animation: {
          ballStart: 'bunt-3b',
          ballEnd: '2base',
          playerMovements: [
            { position: '3b', target: 'bunt-3b' },
            { position: '1b', target: 'bunt-1b-inside' },
            { position: 'p', target: 'bunt-3b-inside' },
            { position: 'c', target: 'bunt-1b-inside' },
            { position: '2b', target: '1base' },
            { position: 'ss', target: '2base' },
            { position: 'rf', target: 'backup-rf-foul' },
            { position: 'cf', target: 'backup-cf-shallow' },
            { position: 'lf', target: 'backup-lf-foul' },
          ],
        },
      },
      difficulty: 'medium',
    },

    // Bunt to Third Base Side - 2 Outs
    {
      id: 'bunt-r1-3b-2out',
      version: 2,
      sport: 'softball',
      level: 'high-school',
      position: '3b',
      category: 'bunt-defense',
      title: 'Bunt to 3B Side, Runner on 1st, Two Outs',
      description:
        'Runner on first base, two outs. Batter bunts down the third base line (likely bunting for a hit). You charge and field cleanly.',
      outs: 2,
      runners: ['1b'],
      question: 'Where do you throw?',
      best: {
        id: 'bunt-r1-3b-2out-best',
        label: 'Throw to first for the third out',
        description: 'Get the out, inning over. Runner advancement doesn\'t matter.',
        coaching_cue:
          'With two outs, only the out matters. Get the batter at first and the inning is over. Don\'t overthink it.',
        animation: {
          ballStart: 'bunt-3b',
          ballEnd: '1base',
          playerMovements: [
            { position: '3b', target: 'bunt-3b' },
            { position: '1b', target: 'bunt-1b-inside' },
            { position: 'p', target: 'bunt-3b-inside' },
            { position: 'c', target: 'bunt-1b-inside' },
            { position: '2b', target: '1base' },
            { position: 'ss', target: '2base' },
            { position: 'rf', target: 'backup-rf-foul' },
            { position: 'cf', target: 'backup-cf-shallow' },
            { position: 'lf', target: 'backup-lf-foul' },
          ],
        },
      },
      ok: {
        id: 'bunt-r1-3b-2out-ok',
        label: 'Throw to second for the force',
        description: 'Still ends the inning, but longer throw.',
        coaching_cue:
          'Either force out ends the inning. First is shorter and easier, but second works too.',
        animation: {
          ballStart: 'bunt-3b',
          ballEnd: '2base',
          playerMovements: [
            { position: '3b', target: 'bunt-3b' },
            { position: '1b', target: 'bunt-1b-inside' },
            { position: 'p', target: 'bunt-3b-inside' },
            { position: 'c', target: 'bunt-1b-inside' },
            { position: '2b', target: '1base' },
            { position: 'ss', target: '2base' },
            { position: 'rf', target: 'backup-rf-foul' },
            { position: 'cf', target: 'backup-cf-shallow' },
            { position: 'lf', target: 'backup-lf-foul' },
          ],
        },
      },
      bad: {
        id: 'bunt-r1-3b-2out-bad',
        label: 'Hold the ball',
        description: 'Everyone is safe. Bunt succeeds.',
        coaching_cue:
          'With two outs you must get an out. Any hesitation lets the batter reach safely.',
        animation: {
          ballStart: 'bunt-3b',
          ballEnd: '3b',
          playerMovements: [
            { position: '3b', target: 'bunt-3b' },
            { position: '1b', target: 'bunt-1b-inside' },
            { position: 'p', target: 'bunt-3b-inside' },
            { position: 'c', target: 'bunt-1b-inside' },
            { position: '2b', target: '1base' },
            { position: 'ss', target: '2base' },
            { position: 'rf', target: 'backup-rf-foul' },
            { position: 'cf', target: 'backup-cf-shallow' },
            { position: 'lf', target: 'backup-lf-foul' },
          ],
        },
      },
      difficulty: 'easy',
    },

    // Bunt to First Base Side - 0 Outs
    {
      id: 'bunt-r1-1b-0out',
      version: 2,
      sport: 'softball',
      level: 'high-school',
      position: '1b',
      category: 'bunt-defense',
      title: 'Bunt to 1B Side, Runner on 1st, No Outs',
      description:
        'Runner on first base, no outs. Bunt is placed down the first base line. You are the first baseman charging. The second baseman is covering first base behind you.',
      outs: 0,
      runners: ['1b'],
      question: 'Where do you throw after fielding?',
      best: {
        id: 'bunt-r1-1b-0out-best',
        label: 'Throw to second baseman covering first',
        description: 'Get the sure out. Your momentum carries you toward home, so throw back to 1B.',
        coaching_cue:
          'The 2B has responsibility to cover 1st base on bunts. Field the ball and throw to the bag where 2B is waiting. Take the sure out!',
        animation: {
          ballStart: 'bunt-1b',
          ballEnd: '1base',
          playerMovements: [
            { position: '1b', target: 'bunt-1b' },
            { position: '3b', target: 'bunt-3b' },
            { position: 'p', target: 'bunt-1b-inside' },
            { position: 'c', target: 'bunt-1b-inside' },
            { position: '2b', target: '1base' },
            { position: 'ss', target: '2base' },
            { position: 'rf', target: 'backup-rf-foul' },
            { position: 'cf', target: 'backup-cf-shallow' },
            { position: 'lf', target: 'backup-lf-foul' },
          ],
          runnerMovements: [{ from: '1b', to: '2b' }],
        },
      },
      ok: {
        id: 'bunt-r1-1b-0out-ok',
        label: 'Let pitcher field it if he has better angle',
        description: 'Pitcher may have momentum toward first.',
        coaching_cue:
          'The 3B is the General and makes the call. If pitcher is in better position, let them take it.',
        animation: {
          ballStart: 'bunt-1b',
          ballEnd: '1base',
          playerMovements: [
            { position: 'p', target: 'bunt-1b' },
            { position: '1b', target: 'bunt-1b-inside' },
            { position: '3b', target: 'bunt-3b' },
            { position: 'c', target: 'bunt-1b-inside' },
            { position: '2b', target: '1base' },
            { position: 'ss', target: '2base' },
            { position: 'rf', target: 'backup-rf-foul' },
            { position: 'cf', target: 'backup-cf-shallow' },
            { position: 'lf', target: 'backup-lf-foul' },
          ],
          runnerMovements: [{ from: '1b', to: '2b' }],
        },
      },
      bad: {
        id: 'bunt-r1-1b-0out-bad',
        label: 'Throw to second base for the lead runner',
        description: 'Difficult throw against your momentum. High risk of error.',
        coaching_cue:
          'Your momentum is toward home plate, throwing to second is against your body. Take the sure out at first.',
        animation: {
          ballStart: 'bunt-1b',
          ballEnd: '2base',
          playerMovements: [
            { position: '1b', target: 'bunt-1b' },
            { position: '3b', target: 'bunt-3b' },
            { position: 'p', target: 'bunt-1b-inside' },
            { position: 'c', target: 'bunt-1b-inside' },
            { position: '2b', target: '1base' },
            { position: 'ss', target: '2base' },
            { position: 'rf', target: 'backup-rf-foul' },
            { position: 'cf', target: 'backup-cf-shallow' },
            { position: 'lf', target: 'backup-lf-foul' },
          ],
        },
      },
      difficulty: 'medium',
    },

    // Bunt to First Base Side - 1 Out
    {
      id: 'bunt-r1-1b-1out',
      version: 2,
      sport: 'softball',
      level: 'high-school',
      position: '1b',
      category: 'bunt-defense',
      title: 'Bunt to 1B Side, Runner on 1st, One Out',
      description:
        'Runner on first base, one out. Sacrifice bunt down the first base line. You are the first baseman. Getting an out puts you in great position.',
      outs: 1,
      runners: ['1b'],
      question: 'What is your play?',
      best: {
        id: 'bunt-r1-1b-1out-best',
        label: 'Field and throw to 2B covering first',
        description: 'Get the out at first. Two outs with runner on second.',
        coaching_cue:
          'With one out, the sure out is critical. Two outs means the runner on second must get a hit to score. Take the guaranteed out.',
        animation: {
          ballStart: 'bunt-1b',
          ballEnd: '1base',
          playerMovements: [
            { position: '1b', target: 'bunt-1b' },
            { position: '3b', target: 'bunt-3b' },
            { position: 'p', target: 'bunt-1b-inside' },
            { position: 'c', target: 'bunt-1b-inside' },
            { position: '2b', target: '1base' },
            { position: 'ss', target: '2base' },
            { position: 'rf', target: 'backup-rf-foul' },
            { position: 'cf', target: 'backup-cf-shallow' },
            { position: 'lf', target: 'backup-lf-foul' },
          ],
          runnerMovements: [{ from: '1b', to: '2b' }],
        },
      },
      ok: {
        id: 'bunt-r1-1b-1out-ok',
        label: 'Flip to pitcher covering first',
        description: 'If pitcher beats you to the bag, give them the ball.',
        coaching_cue:
          'Communication is key. If pitcher is closer to the bag, a soft flip works. Either way, get the out at first.',
        animation: {
          ballStart: 'bunt-1b',
          ballEnd: '1base',
          playerMovements: [
            { position: '1b', target: 'bunt-1b' },
            { position: 'p', target: '1base' },
            { position: '3b', target: 'bunt-3b' },
            { position: 'c', target: 'bunt-1b-inside' },
            { position: '2b', target: 'backup-1b' },
            { position: 'ss', target: '2base' },
            { position: 'rf', target: 'backup-rf-foul' },
            { position: 'cf', target: 'backup-cf-shallow' },
            { position: 'lf', target: 'backup-lf-foul' },
          ],
          runnerMovements: [{ from: '1b', to: '2b' }],
        },
      },
      bad: {
        id: 'bunt-r1-1b-1out-bad',
        label: 'Throw to second for the force out',
        description: 'Risky throw. Miss it and both runners are safe.',
        coaching_cue:
          'Throwing to second against your momentum is high risk. If you miss, you have runners on first and second with still only one out.',
        animation: {
          ballStart: 'bunt-1b',
          ballEnd: '2base',
          playerMovements: [
            { position: '1b', target: 'bunt-1b' },
            { position: '3b', target: 'bunt-3b' },
            { position: 'p', target: 'bunt-1b-inside' },
            { position: 'c', target: 'bunt-1b-inside' },
            { position: '2b', target: '1base' },
            { position: 'ss', target: '2base' },
            { position: 'rf', target: 'backup-rf-foul' },
            { position: 'cf', target: 'backup-cf-shallow' },
            { position: 'lf', target: 'backup-lf-foul' },
          ],
        },
      },
      difficulty: 'medium',
    },

    // Bunt to First Base Side - 2 Outs
    {
      id: 'bunt-r1-1b-2out',
      version: 2,
      sport: 'softball',
      level: 'high-school',
      position: '1b',
      category: 'bunt-defense',
      title: 'Bunt to 1B Side, Runner on 1st, Two Outs',
      description:
        'Runner on first base, two outs. Batter bunts down the first base line (bunting for a hit). You charge and field the ball.',
      outs: 2,
      runners: ['1b'],
      question: 'What do you do?',
      best: {
        id: 'bunt-r1-1b-2out-best',
        label: 'Throw to 2B covering first for the out',
        description: 'Third out ends the inning.',
        coaching_cue:
          'With two outs, just get the out. Throw to whoever is covering first - typically the 2B. Inning over.',
        animation: {
          ballStart: 'bunt-1b',
          ballEnd: '1base',
          playerMovements: [
            { position: '1b', target: 'bunt-1b' },
            { position: '3b', target: 'bunt-3b' },
            { position: 'p', target: 'bunt-1b-inside' },
            { position: 'c', target: 'bunt-1b-inside' },
            { position: '2b', target: '1base' },
            { position: 'ss', target: '2base' },
            { position: 'rf', target: 'backup-rf-foul' },
            { position: 'cf', target: 'backup-cf-shallow' },
            { position: 'lf', target: 'backup-lf-foul' },
          ],
        },
      },
      ok: {
        id: 'bunt-r1-1b-2out-ok',
        label: 'Throw to second for the force',
        description: 'Still gets the third out.',
        coaching_cue:
          'Any force out ends it. Second is farther but still works if you have a clean throw.',
        animation: {
          ballStart: 'bunt-1b',
          ballEnd: '2base',
          playerMovements: [
            { position: '1b', target: 'bunt-1b' },
            { position: '3b', target: 'bunt-3b' },
            { position: 'p', target: 'bunt-1b-inside' },
            { position: 'c', target: 'bunt-1b-inside' },
            { position: '2b', target: '1base' },
            { position: 'ss', target: '2base' },
            { position: 'rf', target: 'backup-rf-foul' },
            { position: 'cf', target: 'backup-cf-shallow' },
            { position: 'lf', target: 'backup-lf-foul' },
          ],
        },
      },
      bad: {
        id: 'bunt-r1-1b-2out-bad',
        label: 'Hesitate and hold the ball',
        description: 'Batter reaches safely. Bunt for a hit succeeds.',
        coaching_cue:
          'Two outs - you must make a play. Any hesitation lets the batter reach. Be decisive.',
        animation: {
          ballStart: 'bunt-1b',
          ballEnd: '1b',
          playerMovements: [
            { position: '1b', target: 'bunt-1b' },
            { position: '3b', target: 'bunt-3b' },
            { position: 'p', target: 'bunt-1b-inside' },
            { position: 'c', target: 'bunt-1b-inside' },
            { position: '2b', target: '1base' },
            { position: 'ss', target: '2base' },
            { position: 'rf', target: 'backup-rf-foul' },
            { position: 'cf', target: 'backup-cf-shallow' },
            { position: 'lf', target: 'backup-lf-foul' },
          ],
        },
      },
      difficulty: 'easy',
    },

    // Bunt to Pitcher - 0 Outs
    {
      id: 'bunt-r1-p-0out',
      version: 2,
      sport: 'softball',
      level: 'high-school',
      position: 'p',
      category: 'bunt-defense',
      title: 'Bunt to Pitcher, Runner on 1st, No Outs',
      description:
        'Runner on first base, no outs. Bunt is placed directly in front of the mound. You are the pitcher and have the best angle on the ball.',
      outs: 0,
      runners: ['1b'],
      question: 'Where do you throw after fielding?',
      best: {
        id: 'bunt-r1-p-0out-best',
        label: 'Throw to first base for the out',
        description: 'Get the sure out. 2B is covering the bag.',
        coaching_cue:
          'As the pitcher, you likely have momentum toward first base. Take the sure out - don\'t try to be a hero and get the lead runner.',
        animation: {
          ballStart: 'p',
          ballEnd: '1base',
          playerMovements: [
            { position: 'p', target: 'bunt-3b-inside' },
            { position: '1b', target: 'bunt-1b' },
            { position: '3b', target: 'bunt-3b' },
            { position: 'c', target: 'bunt-1b-inside' },
            { position: '2b', target: '1base' },
            { position: 'ss', target: '2base' },
            { position: 'rf', target: 'backup-rf-foul' },
            { position: 'cf', target: 'backup-cf-shallow' },
            { position: 'lf', target: 'backup-lf-foul' },
          ],
          runnerMovements: [{ from: '1b', to: '2b' }],
        },
      },
      ok: {
        id: 'bunt-r1-p-0out-ok',
        label: 'Let catcher or 3B field if they call it',
        description: 'Defer if someone else has a better play.',
        coaching_cue:
          'Listen for the call from the 3B (the General). If catcher or corner infielder has it, clear out.',
        animation: {
          ballStart: 'p',
          ballEnd: '1base',
          playerMovements: [
            { position: 'c', target: 'bunt-3b-inside' },
            { position: 'p', target: 'bunt-1b-inside' },
            { position: '1b', target: 'bunt-1b' },
            { position: '3b', target: 'bunt-3b' },
            { position: '2b', target: '1base' },
            { position: 'ss', target: '2base' },
            { position: 'rf', target: 'backup-rf-foul' },
            { position: 'cf', target: 'backup-cf-shallow' },
            { position: 'lf', target: 'backup-lf-foul' },
          ],
          runnerMovements: [{ from: '1b', to: '2b' }],
        },
      },
      bad: {
        id: 'bunt-r1-p-0out-bad',
        label: 'Throw to second for the lead runner',
        description: 'Low percentage play. Risk both runners being safe.',
        coaching_cue:
          'Trying for the lead runner is fool\'s gold - 10% success rate. Take the guaranteed out at first every time.',
        animation: {
          ballStart: 'p',
          ballEnd: '2base',
          playerMovements: [
            { position: 'p', target: 'bunt-3b-inside' },
            { position: '1b', target: 'bunt-1b' },
            { position: '3b', target: 'bunt-3b' },
            { position: 'c', target: 'bunt-1b-inside' },
            { position: '2b', target: '1base' },
            { position: 'ss', target: '2base' },
            { position: 'rf', target: 'backup-rf-foul' },
            { position: 'cf', target: 'backup-cf-shallow' },
            { position: 'lf', target: 'backup-lf-foul' },
          ],
        },
      },
      difficulty: 'medium',
    },

    // Bunt to Pitcher - 1 Out
    {
      id: 'bunt-r1-p-1out',
      version: 2,
      sport: 'softball',
      level: 'high-school',
      position: 'p',
      category: 'bunt-defense',
      title: 'Bunt to Pitcher, Runner on 1st, One Out',
      description:
        'Runner on first base, one out. Sacrifice bunt placed in front of the mound. You field it cleanly as the pitcher.',
      outs: 1,
      runners: ['1b'],
      question: 'What is your throw?',
      best: {
        id: 'bunt-r1-p-1out-best',
        label: 'Throw to first base',
        description: 'Sure out at first. Two down with runner on second.',
        coaching_cue:
          'One out already - get the second. Two outs with runner on second is a much better situation than one out with runners on first and second.',
        animation: {
          ballStart: 'p',
          ballEnd: '1base',
          playerMovements: [
            { position: 'p', target: 'bunt-3b-inside' },
            { position: '1b', target: 'bunt-1b' },
            { position: '3b', target: 'bunt-3b' },
            { position: 'c', target: 'bunt-1b-inside' },
            { position: '2b', target: '1base' },
            { position: 'ss', target: '2base' },
            { position: 'rf', target: 'backup-rf-foul' },
            { position: 'cf', target: 'backup-cf-shallow' },
            { position: 'lf', target: 'backup-lf-foul' },
          ],
          runnerMovements: [{ from: '1b', to: '2b' }],
        },
      },
      ok: {
        id: 'bunt-r1-p-1out-ok',
        label: 'Flip to catcher if you\'re off balance',
        description: 'Catcher can relay to first if you can\'t make the throw.',
        coaching_cue:
          'If fielding puts you off balance toward home, a flip to the catcher who relays to first is acceptable.',
        animation: {
          ballStart: 'p',
          ballEnd: 'c',
          playerMovements: [
            { position: 'p', target: 'bunt-3b-inside' },
            { position: '1b', target: 'bunt-1b' },
            { position: '3b', target: 'bunt-3b' },
            { position: 'c', target: 'bunt-1b-inside' },
            { position: '2b', target: '1base' },
            { position: 'ss', target: '2base' },
            { position: 'rf', target: 'backup-rf-foul' },
            { position: 'cf', target: 'backup-cf-shallow' },
            { position: 'lf', target: 'backup-lf-foul' },
          ],
        },
      },
      bad: {
        id: 'bunt-r1-p-1out-bad',
        label: 'Throw to second base',
        description: 'Risky throw that often results in no outs.',
        coaching_cue:
          'The throw to second is difficult and often rushed. Miss it and you get no outs. Take the sure thing.',
        animation: {
          ballStart: 'p',
          ballEnd: '2base',
          playerMovements: [
            { position: 'p', target: 'bunt-3b-inside' },
            { position: '1b', target: 'bunt-1b' },
            { position: '3b', target: 'bunt-3b' },
            { position: 'c', target: 'bunt-1b-inside' },
            { position: '2b', target: '1base' },
            { position: 'ss', target: '2base' },
            { position: 'rf', target: 'backup-rf-foul' },
            { position: 'cf', target: 'backup-cf-shallow' },
            { position: 'lf', target: 'backup-lf-foul' },
          ],
        },
      },
      difficulty: 'medium',
    },

    // Bunt to Pitcher - 2 Outs
    {
      id: 'bunt-r1-p-2out',
      version: 2,
      sport: 'softball',
      level: 'high-school',
      position: 'p',
      category: 'bunt-defense',
      title: 'Bunt to Pitcher, Runner on 1st, Two Outs',
      description:
        'Runner on first base, two outs. Batter bunts for a base hit. Ball is in front of the mound. You field it as the pitcher.',
      outs: 2,
      runners: ['1b'],
      question: 'Where do you throw?',
      best: {
        id: 'bunt-r1-p-2out-best',
        label: 'Throw to first for the third out',
        description: 'End the inning with the out at first.',
        coaching_cue:
          'Two outs - just end it. Get the ball to first and the inning is over. Don\'t complicate it.',
        animation: {
          ballStart: 'p',
          ballEnd: '1base',
          playerMovements: [
            { position: 'p', target: 'bunt-3b-inside' },
            { position: '1b', target: 'bunt-1b' },
            { position: '3b', target: 'bunt-3b' },
            { position: 'c', target: 'bunt-1b-inside' },
            { position: '2b', target: '1base' },
            { position: 'ss', target: '2base' },
            { position: 'rf', target: 'backup-rf-foul' },
            { position: 'cf', target: 'backup-cf-shallow' },
            { position: 'lf', target: 'backup-lf-foul' },
          ],
        },
      },
      ok: {
        id: 'bunt-r1-p-2out-ok',
        label: 'Throw to second for the force',
        description: 'Also ends the inning.',
        coaching_cue:
          'Either out ends it. Second is a longer throw but works if first isn\'t an option.',
        animation: {
          ballStart: 'p',
          ballEnd: '2base',
          playerMovements: [
            { position: 'p', target: 'bunt-3b-inside' },
            { position: '1b', target: 'bunt-1b' },
            { position: '3b', target: 'bunt-3b' },
            { position: 'c', target: 'bunt-1b-inside' },
            { position: '2b', target: '1base' },
            { position: 'ss', target: '2base' },
            { position: 'rf', target: 'backup-rf-foul' },
            { position: 'cf', target: 'backup-cf-shallow' },
            { position: 'lf', target: 'backup-lf-foul' },
          ],
        },
      },
      bad: {
        id: 'bunt-r1-p-2out-bad',
        label: 'Pump fake and hold',
        description: 'Batter reaches. Runners now on first and second.',
        coaching_cue:
          'No time to hesitate with two outs. Make the play - any out ends the inning.',
        animation: {
          ballStart: 'p',
          ballEnd: 'p',
          playerMovements: [
            { position: 'p', target: 'bunt-3b-inside' },
            { position: '1b', target: 'bunt-1b' },
            { position: '3b', target: 'bunt-3b' },
            { position: 'c', target: 'bunt-1b-inside' },
            { position: '2b', target: '1base' },
            { position: 'ss', target: '2base' },
            { position: 'rf', target: 'backup-rf-foul' },
            { position: 'cf', target: 'backup-cf-shallow' },
            { position: 'lf', target: 'backup-lf-foul' },
          ],
        },
      },
      difficulty: 'easy',
    },

    // Catcher Fielding Bunt - 0 Outs
    {
      id: 'bunt-r1-c-0out',
      version: 2,
      sport: 'softball',
      level: 'college',
      position: 'c',
      category: 'bunt-defense',
      title: 'Catcher Fields Bunt, Runner on 1st, No Outs',
      description:
        'Runner on first base, no outs. Bunt is placed about 6 feet in front of home plate down the first base line. You are the catcher with momentum toward first base.',
      outs: 0,
      runners: ['1b'],
      question: 'Where do you throw?',
      best: {
        id: 'bunt-r1-c-0out-best',
        label: 'Throw to first base',
        description: 'Your momentum is toward first. Take the sure out.',
        coaching_cue:
          'This bunt placement is the hardest to field, but your momentum is toward first. The catcher is often the preferred choice since momentum is headed toward 1st base.',
        animation: {
          ballStart: 'bunt-1b-inside',
          ballEnd: '1base',
          playerMovements: [
            { position: 'c', target: 'bunt-1b-inside' },
            { position: '1b', target: 'bunt-1b' },
            { position: '3b', target: 'bunt-3b' },
            { position: 'p', target: 'bunt-1b-inside' },
            { position: '2b', target: '1base' },
            { position: 'ss', target: '2base' },
            { position: 'rf', target: 'backup-rf-foul' },
            { position: 'cf', target: 'backup-cf-shallow' },
            { position: 'lf', target: 'backup-lf-foul' },
          ],
          runnerMovements: [{ from: '1b', to: '2b' }],
        },
      },
      ok: {
        id: 'bunt-r1-c-0out-ok',
        label: 'Let 1B or P field if they have it',
        description: 'Defer if another fielder calls for it.',
        coaching_cue:
          'Team chemistry matters here. The 3B makes the call on who fields. If 1B or pitcher is in better position, let them take it.',
        animation: {
          ballStart: 'bunt-1b-inside',
          ballEnd: '1base',
          playerMovements: [
            { position: '1b', target: 'bunt-1b-inside' },
            { position: 'c', target: 'bunt-1b' },
            { position: '3b', target: 'bunt-3b' },
            { position: 'p', target: 'bunt-1b' },
            { position: '2b', target: '1base' },
            { position: 'ss', target: '2base' },
            { position: 'rf', target: 'backup-rf-foul' },
            { position: 'cf', target: 'backup-cf-shallow' },
            { position: 'lf', target: 'backup-lf-foul' },
          ],
          runnerMovements: [{ from: '1b', to: '2b' }],
        },
      },
      bad: {
        id: 'bunt-r1-c-0out-bad',
        label: 'Throw to second for the lead runner',
        description: 'Difficult throw with low success rate.',
        coaching_cue:
          'The throw to second is against your momentum and low percentage. Take the out your momentum gives you.',
        animation: {
          ballStart: 'bunt-1b-inside',
          ballEnd: '2base',
          playerMovements: [
            { position: 'c', target: 'bunt-1b-inside' },
            { position: '1b', target: 'bunt-1b' },
            { position: '3b', target: 'bunt-3b' },
            { position: 'p', target: 'bunt-1b-inside' },
            { position: '2b', target: '1base' },
            { position: 'ss', target: '2base' },
            { position: 'rf', target: 'backup-rf-foul' },
            { position: 'cf', target: 'backup-cf-shallow' },
            { position: 'lf', target: 'backup-lf-foul' },
          ],
        },
      },
      difficulty: 'hard',
    },

    // Catcher Fielding Bunt - 1 Out
    {
      id: 'bunt-r1-c-1out',
      version: 2,
      sport: 'softball',
      level: 'college',
      position: 'c',
      category: 'bunt-defense',
      title: 'Catcher Fields Bunt, Runner on 1st, One Out',
      description:
        'Runner on first base, one out. Well-placed bunt in front of home plate. Catcher pops out quickly and fields the ball.',
      outs: 1,
      runners: ['1b'],
      question: 'What is your play?',
      best: {
        id: 'bunt-r1-c-1out-best',
        label: 'Throw to first for the out',
        description: 'Two outs now with runner on second. Great situation.',
        coaching_cue:
          'Getting to two outs is huge. Take the sure out - the batter sacrificed themselves to move the runner. Make them pay by recording the out.',
        animation: {
          ballStart: 'bunt-1b-inside',
          ballEnd: '1base',
          playerMovements: [
            { position: 'c', target: 'bunt-1b-inside' },
            { position: '1b', target: 'bunt-1b' },
            { position: '3b', target: 'bunt-3b' },
            { position: 'p', target: 'bunt-1b-inside' },
            { position: '2b', target: '1base' },
            { position: 'ss', target: '2base' },
            { position: 'rf', target: 'backup-rf-foul' },
            { position: 'cf', target: 'backup-cf-shallow' },
            { position: 'lf', target: 'backup-lf-foul' },
          ],
          runnerMovements: [{ from: '1b', to: '2b' }],
        },
      },
      ok: {
        id: 'bunt-r1-c-1out-ok',
        label: 'Flip to pitcher covering the line',
        description: 'Quick exchange if pitcher is there.',
        coaching_cue:
          'If pitcher beats you to the first base line, a quick flip works. Communication is essential.',
        animation: {
          ballStart: 'bunt-1b-inside',
          ballEnd: 'p',
          playerMovements: [
            { position: 'c', target: 'bunt-1b-inside' },
            { position: 'p', target: 'bunt-1b' },
            { position: '1b', target: 'bunt-1b' },
            { position: '3b', target: 'bunt-3b' },
            { position: '2b', target: '1base' },
            { position: 'ss', target: '2base' },
            { position: 'rf', target: 'backup-rf-foul' },
            { position: 'cf', target: 'backup-cf-shallow' },
            { position: 'lf', target: 'backup-lf-foul' },
          ],
        },
      },
      bad: {
        id: 'bunt-r1-c-1out-bad',
        label: 'Try for the out at second',
        description: 'Low percentage. Likely no out recorded.',
        coaching_cue:
          'With one out already, you need the second out. Don\'t risk it all for a low-percentage play at second.',
        animation: {
          ballStart: 'bunt-1b-inside',
          ballEnd: '2base',
          playerMovements: [
            { position: 'c', target: 'bunt-1b-inside' },
            { position: '1b', target: 'bunt-1b' },
            { position: '3b', target: 'bunt-3b' },
            { position: 'p', target: 'bunt-1b-inside' },
            { position: '2b', target: '1base' },
            { position: 'ss', target: '2base' },
            { position: 'rf', target: 'backup-rf-foul' },
            { position: 'cf', target: 'backup-cf-shallow' },
            { position: 'lf', target: 'backup-lf-foul' },
          ],
        },
      },
      difficulty: 'hard',
    },

    // Catcher Fielding Bunt - 2 Outs
    {
      id: 'bunt-r1-c-2out',
      version: 2,
      sport: 'softball',
      level: 'college',
      position: 'c',
      category: 'bunt-defense',
      title: 'Catcher Fields Bunt, Runner on 1st, Two Outs',
      description:
        'Runner on first base, two outs. Batter drops a bunt trying to get on base. Catcher springs out and fields it cleanly.',
      outs: 2,
      runners: ['1b'],
      question: 'What do you do?',
      best: {
        id: 'bunt-r1-c-2out-best',
        label: 'Throw to first for the third out',
        description: 'Inning over. Simple play.',
        coaching_cue:
          'Two outs - end the inning. Throw to first (2B covering) and walk off the field.',
        animation: {
          ballStart: 'bunt-1b-inside',
          ballEnd: '1base',
          playerMovements: [
            { position: 'c', target: 'bunt-1b-inside' },
            { position: '1b', target: 'bunt-1b' },
            { position: '3b', target: 'bunt-3b' },
            { position: 'p', target: 'bunt-1b-inside' },
            { position: '2b', target: '1base' },
            { position: 'ss', target: '2base' },
            { position: 'rf', target: 'backup-rf-foul' },
            { position: 'cf', target: 'backup-cf-shallow' },
            { position: 'lf', target: 'backup-lf-foul' },
          ],
        },
      },
      ok: {
        id: 'bunt-r1-c-2out-ok',
        label: 'Throw to second for the force',
        description: 'Still ends the inning.',
        coaching_cue:
          'Either out works. First is easier, but second gets it done too.',
        animation: {
          ballStart: 'bunt-1b-inside',
          ballEnd: '2base',
          playerMovements: [
            { position: 'c', target: 'bunt-1b-inside' },
            { position: '1b', target: 'bunt-1b' },
            { position: '3b', target: 'bunt-3b' },
            { position: 'p', target: 'bunt-1b-inside' },
            { position: '2b', target: '1base' },
            { position: 'ss', target: '2base' },
            { position: 'rf', target: 'backup-rf-foul' },
            { position: 'cf', target: 'backup-cf-shallow' },
            { position: 'lf', target: 'backup-lf-foul' },
          ],
        },
      },
      bad: {
        id: 'bunt-r1-c-2out-bad',
        label: 'Double clutch and hold',
        description: 'Batter reaches safely. Rally continues.',
        coaching_cue:
          'No time to think with two outs. Field and throw. End the inning.',
        animation: {
          ballStart: 'bunt-1b-inside',
          ballEnd: 'c',
          playerMovements: [
            { position: 'c', target: 'bunt-1b-inside' },
            { position: '1b', target: 'bunt-1b' },
            { position: '3b', target: 'bunt-3b' },
            { position: 'p', target: 'bunt-1b-inside' },
            { position: '2b', target: '1base' },
            { position: 'ss', target: '2base' },
            { position: 'rf', target: 'backup-rf-foul' },
            { position: 'cf', target: 'backup-cf-shallow' },
            { position: 'lf', target: 'backup-lf-foul' },
          ],
        },
      },
      difficulty: 'medium',
    },
  ],

  metadata: {
    name: 'Starter Dataset',
    description:
      'Comprehensive set of 30 high-quality, high-school to college level scenarios for baseball and softball.',
    sport: 'baseball', // primary sport for the starter set
    levels: ['high-school', 'college'],
  },
};
