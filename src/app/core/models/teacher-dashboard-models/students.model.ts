export class Student {
    studentName: string;
    currentLevelId: number;
    isMastered: boolean;
    isInProgress: boolean;
  }
  
  export class Level {
    levelId: number;
    levelName: string;
    students: Student[];
  }
  