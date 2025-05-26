export enum Role {
  USER = 'user',
  ADMIN = 'admin',
  MODERATOR = 'moderator',
  GUEST = 'guest'
}

export const RoleLevel: Record<Role, number> = {
  [Role.USER]: 3,
  [Role.ADMIN]: 1,
  [Role.MODERATOR]: 2,
  [Role.GUEST]: 4
};