export class LoggedInUser {
  roles: Role[];
  userFullName: string;
  userToken: string;
}

export class Role {
    roleId: number;
    name: string;
    schools: School[];
}

export class School {
  schoolId: number;
  name: string;
  isPrimaryRole: boolean;
}
