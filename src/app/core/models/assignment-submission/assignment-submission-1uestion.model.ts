export class Skill {
    skillId: number;
    skillName: string;
    flags: Flag[];
    questions: Question[];
    expanded: boolean;
}

export class Flag {
    title: string;
    value: string;
    iconUrl: string;
}

export class Question {
    questionId: number;
    text: string;
    color: string;
    answerBtnIconUrl: string;
    answerBtnText: string;
    difficulty: Difficulty;
}

export class Difficulty {
    color: string;
    iconUrl: string;
    text: string;
}

export class SkillData {
    skills: Skill[];
}
