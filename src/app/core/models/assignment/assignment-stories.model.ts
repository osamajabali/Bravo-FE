import { SelectionType } from "../../../shared/components/new-assignment/assignment-book/assignment-book.component";
import { PaginationFilter } from "../shared-models/pagination.model";

export class AssignmentStories extends PaginationFilter {
  readingSubLevelId: number;
  assignmentTypeId: number;
}

export class Story {
  authorName: string;
  coverImageUrl: string;
  pagesCount: number;
  publisherName: string;
  storyId: number;
  title: string;
  wordsCount: number;
  mainLevelName: string;
  assignmentTypeName: string;

}

export class StoryPaginationResponse extends PaginationFilter {
  stories: Story[];
}

export class AssignmentReadingPayload {
  book: Story;
  isSelectBook: boolean;
  selectedType: SelectionType;
  assignmentStories: AssignmentStories;
  assignmentTypeName: string;
  bookSelectionCreteria : number
  correctionType : number
}