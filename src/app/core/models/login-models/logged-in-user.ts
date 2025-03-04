export class LoggedInUser {
    roles: { roleId: number; name: string }[];
    userFullName: string;
    userToken: string;
}
