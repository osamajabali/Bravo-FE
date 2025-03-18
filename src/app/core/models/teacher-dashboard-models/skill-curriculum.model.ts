export interface SkillCurriculum {
    activationDate: string | null;
    domainName: string;
    id: number;
    isEnabled: boolean | null;
    isSkill: boolean;
    learningOutcomeDisplayName: string | null;
    noOfStudentsEasy: number;
    noOfStudentsHard: number;
    noOfStudentsMedium: number;
    numberOfSkills: number;
  }

  export interface SkillCurriculumResponse{
    learningOutcomes : SkillCurriculum[]
  }