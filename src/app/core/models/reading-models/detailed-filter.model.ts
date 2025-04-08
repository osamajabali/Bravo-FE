export class LearningOutcome {
    learningOutcomeId: number;
    name: string;
  }

  export class Grade {
    gradeId: number;
    name: string;
  }

  export class Subject {
    subjectId: number;
    name: string;
  }

  export class LearningHub {
    learningHubId: number;
    name: string;
  }

  export class IBLearnerProfile {
    ibLearnerProfileId: number;
    name: string;
  }

  export class Genre {
    genreId: number;
    name: string;
  }

  export class Author {
    authorId: number;
    name: string;
  }

  export class Publisher {
    publisherId: number;
    name: string;
  }

  export class Illustrator {
    illustratorId: number;
    name: string;
  }

  export class AgeGroup {
    ageGroupId: number;
    name: string;
  }

  export class DetailedFilter {
    learningOutcomes: LearningOutcome[];
    grades: Grade[];
    subjects: Subject[];
    learningHubs: LearningHub[];
    ibLearnerProfiles: IBLearnerProfile[];
    genres: Genre[];
    authors: Author[];
    publishers: Publisher[];
    illustrators: Illustrator[];
    ageGroups: AgeGroup[];
  }
  