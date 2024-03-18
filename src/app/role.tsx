// import { useRouter } from "next/router";
import { useOrganizationList } from "@clerk/nextjs";


function hasRequiredPermissions(requiredPermissions: string[]): boolean {
  const { organizationList, isLoaded, setActive } = useOrganizationList();
  const rolesArray: string[] = [];
  organizationList && organizationList.map(item => {
    if (item.membership && item.membership.role) {
      rolesArray.push(item.membership.role);
    }
  });
  const userPermissions = organizationList || [];
  return requiredPermissions.some((permission) =>
  rolesArray.includes(permission)
  );
}

export function withRoles(
  Component: React.ComponentType<any>,
  requiredPermissions: string[]
) {
  return function WithRolesWrapper(props: any) {
    // const router = useRouter();
    const hasPermission = hasRequiredPermissions(requiredPermissions);

    if (hasPermission) {
      return <Component {...props} />;
    } else {
      // Redirect to the sign-in page if permission is not granted
        // router.push('/sign-in');
      return null;
    }
  };
}
