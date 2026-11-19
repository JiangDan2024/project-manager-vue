import useUserStore from '@/stores/modules/user'

function authPermission(permission) {
  const all_permission = '*:*:*'
  const permissionList = useUserStore().permissions
  if (permissionList && permissionList.length > 0) {
    return permissions.some((v) => {
      return all_permission === v || v === permission
    })
  } else {
    return false
  }
}

function authRole(role) {
  const all_roles = 'admin'
  const roles = useUserStore().roles
  if (roles && roles.length > 0) {
    return roles.some((v) => {
      return v === all_roles || v === role
    })
  } else {
    return false
  }
}

export default {
  //验证用户是否具备某权限
  hasPermi(permission) {
    return authPermission(permission)
  },
  //验证用户是否具备指定权限，只需包含其中一个
  hasPermiOr(permissions) {
    return permissions.some((v) => {
      return authPermission(v)
    })
  },
  //验证用户是否包含指定权限，必须全部拥有
  hasPermiAnd(permissions) {
    return permissions.every((v) => {
      return authPermission(v)
    })
  },
  //验证用户是否具备某个角色
  hasRole(role) {
    return authRole(role)
  },
  //验证用户是否具备指定角色，只需包含其中一个
  hasRoleOr(roles) {
    return roles.some((r) => {
      return authRole(r)
    })
  },
  //验证用户是否具备指定角色，必须全部包含
  hasRoleAnd(roles) {
    return roles.every((r) => {
      return authRole(r)
    })
  },
}
