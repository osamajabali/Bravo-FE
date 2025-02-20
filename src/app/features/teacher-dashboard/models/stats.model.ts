export interface Stats {
  activeSkills: SkillsProps;
  totalSkills: SkillsProps;
  masteredSkills: SkillsProps;
  skills: Skill[];
}
interface SkillsProps {
  title?: string ;
  completed: number;
  unCompleted: number;
}
export interface Skill {
  name: string;
  inactive: number;
  activated: number;
}