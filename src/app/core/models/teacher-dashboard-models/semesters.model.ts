export class QuickSkill {
  name: string;
  isEnabled: boolean;
  activationDate: string;
  learningOutcomeId : number;
  }
  
  export class Semester {
    semesterId: number;
    name: string;
    inActiveSkills: number;
    activeSkills: number;
    quickSkills: QuickSkill[];
  }
  