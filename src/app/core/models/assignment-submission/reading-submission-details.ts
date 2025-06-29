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

export interface QuestionSummary {
  title: string;
  value: string | number;
  iconUrl: string;
}

export interface Difficulty {
  text: string;
  textColor: string;
  backgroundColor: string;
  iconUrl: string;
}

export interface Question {
  questionId: number;
  text: string;
  color: string;
  difficulty: Difficulty;
  answerBtnText: string;
  answerBtnColor: string;
  answerBtnIconUrl: string;
}

export class SubmissionReadingDetails {
  submissionSummary: SubmissionCard[];
  storyDetails: StoryDetails;
  questionSummary: QuestionSummary[];
  questions: Question[];
}
