import { useRoleContext } from '@context/RoleContext';

export const useRole = () => {
  return useRoleContext();
};
