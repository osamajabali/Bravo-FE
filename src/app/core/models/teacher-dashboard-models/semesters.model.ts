export class QuickSkill {
    skillId: number;
    name: string;
    isEnabled : boolean;
  }
  
  export class Semester {
    semesterId: number;
    name: string;
    inActiveSkills: number;
    activeSkills: number;
    quickSkills: QuickSkill[];
  }
  