export type TFormNumberType =
    'overall_rate' |

    'novel' | 'character' | 'reason' |

    'directing' | 'acting' | 'editing' |
    'visualization' | 'sound' | 'music' |

    'violence_range' |
    'insulting_range' |
    'sexual_content' |
    'unsuitable_wearing' |
    'addiction_promotion' |
    'horror_content' |
    'suicide_encouragement' |
    'breaking_law_encouragement' |
    'gambling_promotion' |
    'alcoholic_promotion' |

    'family_subject' |
    'individual_social_behavior' |
    'feminism_exposure' |
    'justice_seeking' |
    'theism' |
    'bright_future_exposure' |
    'hope' |
    'iranian_life_style' |
    'true_vision_of_enemy' |
    'true_historiography'
    ;

export const formNumberTypeList: TFormNumberType[] = [
    'overall_rate',

    'novel', 'character', 'reason',

    'directing', 'acting', 'editing',
    'visualization', 'sound', 'music',

    'violence_range',
    'insulting_range',
    'sexual_content',
    'unsuitable_wearing',
    'addiction_promotion',
    'horror_content',
    'suicide_encouragement',
    'breaking_law_encouragement',
    'gambling_promotion',
    'alcoholic_promotion',

    'family_subject',
    'individual_social_behavior',
    'feminism_exposure',
    'justice_seeking',
    'theism',
    'bright_future_exposure',
    'hope',
    'iranian_life_style',
    'true_vision_of_enemy',
    'true_historiography'
];

export type TGroupTitle = 'story' | 'form' | 'norm' | 'content';

interface IRatingFormStructure {
    groups: Array<{
        title: TGroupTitle;
        items: Array<{ title: string; adj?: boolean; }>,
        mode: 1 | 2 | 3
    }>;
}

export const ratingFormStructure: IRatingFormStructure = {
    groups: [
        {
            title: 'story',
            items: [{ title: 'novel' }, { title: 'character' }, { title: 'reason' }],
            mode: 1
        },
        {
            title: 'form',
            items: [{ title: 'directing' }, { title: 'acting' }, { title: 'editing' }, { title: 'visualization' }, { title: 'sound' }, { title: 'music' }],
            mode: 1
        },
        {
            title: 'norm',
            items: [{ title: 'violence_range', adj: false }, { title: 'insulting_range', adj: false }, { title: 'sexual_content', adj: false }, { title: 'unsuitable_wearing', adj: false }, { title: 'addiction_promotion', adj: false }, { title: 'horror_content', adj: false }, { title: 'suicide_encouragement', adj: false }, { title: 'breaking_law_encouragement', adj: false }, { title: 'gambling_promotion', adj: false }, { title: 'alcoholic_promotion', adj: false }],
            mode: 2
        },
        {
            title: 'content',
            items: [{ title: 'family_subject' }, { title: 'individual_social_behavior' }, { title: 'feminism_exposure' }, { title: 'justice_seeking' }, { title: 'theism' }, { title: 'bright_future_exposure' }, { title: 'hope' }, { title: 'iranian_life_style' }, { title: 'true_vision_of_enemy' }, { title: 'true_historiography' }],
            mode: 3
        }
    ]
};

export function getRateList(mode: 1 | 2 | 3): Array<{ title: string, value: number }> {
    switch (mode) {
        case 1:
            return [
                { title: 'perfect', value: 5 },
                { title: 'good', value: 4 },
                { title: 'average', value: 3 },
                { title: 'bad', value: 2 },
                { title: 'poor', value: 1 }
            ];
        case 2:
            return [
                { title: 'very_much', value: 5 },
                { title: 'much', value: 4 },
                { title: 'normal', value: 3 },
                { title: 'low', value: 2 },
                { title: 'not_at_all', value: 1 }
            ];
        case 3:
            return [
                { title: 'promoter', value: 5 },
                { title: 'agree', value: 4 },
                { title: 'neutral', value: 3 },
                { title: 'disagree', value: 2 },
                { title: 'destructive', value: 1 },
            ];
    }
}

export function getRateAdjValue(mode: 1 | 2 | 3, value: number, adj?: boolean): number {
    if (adj === true || adj === undefined) return value;

    return 6 - value; // 5 + 1

    // if (mode === 1 || mode === 2) {
    //     return 6 - value; // 5 + 1
    // } else { // if (mode === 3) {
    //     return 4 - value; // 3 + 1
    // }
}
