import { SubmissionCard } from "../assignment/student-submission.model";

export interface StoryDetails {
  storyId: number;
  title: string;
  mainLevelName: string;
  subLevelName: string;
  authorName: string;
  coverUrl: string;
  audioUrl: string;
}

export class Page {
  storyPageId: number;
  title: string;
  length: string;
  recordedDate: string;
  recordUrl: string;
}

export class OralSubmissionDetails {
  fullAnswersAudio: string;
  submissionSummary: SubmissionCard[];
  storyDetails: StoryDetails;
  studentAnswers: number;
  pages: Page[];
}
