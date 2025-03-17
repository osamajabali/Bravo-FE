export class QuickSkill {
    skillId: number;
    name: string;
  }
  
  export class Semester {
    semesterId: number;
    name: string;
    inActiveSkills: number;
    activeSkills: number;
    quickSkills: QuickSkill[];
  }
  