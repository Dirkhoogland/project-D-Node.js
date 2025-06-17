export enum Role {
  GUEST= 'guest',
  ADMIN = 'admin',
  EMPLOYEE = 'employee',

}

export const RoleLevel: Record<Role, number> = {
  [Role.GUEST]: 3,
  [Role.ADMIN]: 1,
  [Role.EMPLOYEE]: 2,
};