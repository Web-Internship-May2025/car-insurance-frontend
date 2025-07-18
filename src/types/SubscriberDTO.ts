import type { GenderType, MaritalStatusType, UserRoleType } from "./UserServiceTypes";

export type SubscriberDTO = {
    firstName: string;
    lastName: string;
    jmbg: string;
    birthDate: string;
    gender: GenderType
    maritalStatus: MaritalStatusType;
    email: string;
    username: string;
    password: string;
    userRoleType: UserRoleType;
    subscriberRoleId: number;
}