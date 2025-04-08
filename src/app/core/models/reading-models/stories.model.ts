import { PaginationFilter } from "../shared-models/pagination.model";

export class Story {
    storyId: number;
    title: string;
    coverUrl: string;
    levelName: string;
    authorName: string;
}

export class StoriesList extends PaginationFilter{
    stories: Story[];
}
