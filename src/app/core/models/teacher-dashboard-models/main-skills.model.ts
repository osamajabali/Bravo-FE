import { QuickSkill } from "./semesters.model";

export class Skills{
    activeSkills: number;
    domainId: number;
    inActiveSkills: number;
    name: string;
    quickSkills : QuickSkill[]
}

export class SkillsDomain{
    domains : Skills[];
}