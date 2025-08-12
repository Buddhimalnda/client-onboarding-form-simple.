export enum Role {
  OWNER = "OWNER",
  ADMIN = "ADMIN",
  DEV = "DEV",
  TESTING = "TESTING",
  AUDITING = "AUDITING",
  MANAGER = "MANAGER",
  SECRECTARY = "SECRECTARY",
  IT_MANAGER = "IT_MANAGER",
  IT_OFFICER = "IT_OFFICER",
  GUEST = "GUEST",
  CUSTOMER = "CUSTOMER",
  SUPPLIER = "SUPPLIER",
  EMPLOYEE = "EMPLOYEE",
}

export enum RoleGroup {
  LEVEL_0 = "LEVEL_0",
  LEVEL_1 = "LEVEL_1",
  LEVEL_2 = "LEVEL_2",
  LEVEL_3 = "LEVEL_3",
  LEVEL_4 = "LEVEL_4",
  LEVEL_5 = "LEVEL_5",
}

export const roleGroupMap = (group: RoleGroup) => {
  switch (group) {
    case RoleGroup.LEVEL_0:
      return [Role.DEV, Role.TESTING, Role.ADMIN];
    case RoleGroup.LEVEL_1:
      return [Role.OWNER, Role.AUDITING, Role.IT_MANAGER];
    case RoleGroup.LEVEL_2:
      return [Role.MANAGER];
    case RoleGroup.LEVEL_3:
      return [Role.IT_OFFICER, Role.SECRECTARY];
    case RoleGroup.LEVEL_4:
      return [Role.EMPLOYEE];
    case RoleGroup.LEVEL_5:
      return [Role.CUSTOMER, Role.SUPPLIER];
    default:
      return [Role.GUEST];
  }
};

export const roleLevelMap = (role: Role) => {
  switch (role) {
    case Role.DEV:
    case Role.TESTING:
    case Role.ADMIN:
      return 0; // LEVEL_0
    case Role.OWNER:
    case Role.AUDITING:
    case Role.IT_MANAGER:
      return 1; // LEVEL_1
    case Role.MANAGER:
      return 2; // LEVEL_2
    case Role.IT_OFFICER:
    case Role.SECRECTARY:
      return 3; // LEVEL_3
    case Role.EMPLOYEE:
      return 4; // LEVEL_4
    case Role.CUSTOMER:
    case Role.SUPPLIER:
      return 5; // LEVEL_5
    default:
      return -1; // GUEST or unknown role
  }
}

export const checkRoleHasAccess = (role: Role, group: number) => {
  switch (group) {
    case 0: // LEVEL_0
      return roleGroupMap(RoleGroup.LEVEL_0).includes(role);
    case 1: // LEVEL_1
      return roleGroupMap(RoleGroup.LEVEL_0)
        .concat(roleGroupMap(RoleGroup.LEVEL_1))
        .includes(role);
    case 2: // LEVEL_2
      return roleGroupMap(RoleGroup.LEVEL_0)
        .concat(roleGroupMap(RoleGroup.LEVEL_1))
        .concat(roleGroupMap(RoleGroup.LEVEL_2))
        .includes(role);
    case 3: // LEVEL_3
      return roleGroupMap(RoleGroup.LEVEL_0)
        .concat(roleGroupMap(RoleGroup.LEVEL_1))
        .concat(roleGroupMap(RoleGroup.LEVEL_2))
        .concat(roleGroupMap(RoleGroup.LEVEL_3))
        .includes(role);
    case 4: // LEVEL_4
      return roleGroupMap(RoleGroup.LEVEL_0)
        .concat(roleGroupMap(RoleGroup.LEVEL_1))
        .concat(roleGroupMap(RoleGroup.LEVEL_2))
        .concat(roleGroupMap(RoleGroup.LEVEL_3))
        .concat(roleGroupMap(RoleGroup.LEVEL_4))
        .includes(role);
    case 5: // LEVEL_5
      return roleGroupMap(RoleGroup.LEVEL_0)
        .concat(roleGroupMap(RoleGroup.LEVEL_1))
        .concat(roleGroupMap(RoleGroup.LEVEL_2))
        .concat(roleGroupMap(RoleGroup.LEVEL_3))
        .concat(roleGroupMap(RoleGroup.LEVEL_4))
        .concat(roleGroupMap(RoleGroup.LEVEL_5))
        .includes(role);
    default:
      return false;
  }
};
