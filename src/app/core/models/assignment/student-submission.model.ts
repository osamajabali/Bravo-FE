export interface Skill {
  expanded: boolean;
  skillId: number;
  name: string;
  flags: Flag[];
}

export class Flag {
  iconUrl!: string;
  title!: string;
  value!: string;
}


export interface SubmissionCard {
  value: string;
  text: string;
  color: string;
  backgroundColor: string;
  isHighlighted: boolean;
  iconUrl?: string;
}

export class StudentSubmission {
  skills: Skill[];
  submissionCards: SubmissionCard[];
}

export class SubmissionQuestion {
  answerBtnColor!: string;
  answerBtnIconUrl!: string;
  answerBtnText!: string;
  color!: string;
  difficulty!: { text: string; color: string };
  questionId!: number;
  text!: string;
}
