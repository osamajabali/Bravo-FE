export class Classes {
    roleId: number; 
    subjectId: number; 
    gradeId: number;
  }
  

  export class Grade {
    gradeId: number;
    name: string;
    isSelected: boolean;
  }
  
  export class Section {
    sectionId: number;
    name: string;
    isSelected: boolean;
  }
  
  export class Subject {
    subjectId: number;
    name: string;
    isSelected: boolean;
  }
  
  export class ClassesData {
    grades: Grade[];
    sections: Section[];
    subjects: Subject[];
  }
  