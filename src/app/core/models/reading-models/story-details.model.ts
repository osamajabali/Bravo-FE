export class StoryDetails {
    mainDetails: MainDetails;
    quickStats: QuickStats;
    details: Detail[];
    files: FileDetails[];
  }
  
  export class MainDetails {
    title: string;
    cover: string;
  }
  
  export class QuickStats {
    read: Stat;
    questionsSolved: Stat;
    timeSpent: Stat;
  }
  
  export class Stat {
    labelName: string;
    title: string;
    color: string;
    icon: string;
  }
  
  export class Detail {
    labelName: string;
    title: string | null;
    color: string;
    icon: string;
  }
  
  export class FileDetails {
    fileId: number;
    fileName: string;
    uploadDate: string;
    fileSize: string;
    fileIcon: string;
    type : any;
    fileURL: string;
  }
  