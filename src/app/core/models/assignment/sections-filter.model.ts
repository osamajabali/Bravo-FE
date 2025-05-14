export class SubjectGrade {
  subjectIds: number[];
  gradeIds: number[];
}

export class Grade {
  gradeId: number;
  name: string;
  isSelected: boolean;

}

export class Section {
  courseSectionId: number;
  name: string;
  isSelected: boolean;
}

export class Subject {
  subjectId: number;
  name: string;
  isSelected: boolean;
}

export class SectionFilter {
  grades: Grade[];
  sections: Section[];
  subjects: Subject[];
}
