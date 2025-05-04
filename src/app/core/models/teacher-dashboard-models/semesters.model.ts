export class QuickSkill {
  name: string;
  isEnabled: boolean;
  activationDate: string;
  learningOutcomeId : number;
  isDisabled: boolean;
  }
  
  export class Semester {
    semesterId: number;
    name: string;
    inActiveSkills: number;
    activeSkills: number;
    quickSkills: QuickSkill[];
  }
  