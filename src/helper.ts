export const authObject: Record<string, Record<string, string[]>> = {
  "org:admin": {
    contact: ["GET", "POST", "PUT", "DELETE"],
    company: ["GET", "POST", "PUT", "DELETE"],
    ticket: ["GET", "POST", "PUT", "DELETE"],
    trademark: ["GET", "POST", "PUT", "DELETE"],
  },
  "org:member": {
    contact: ["GET"],
    company: ["GET"],
    ticket: ["GET"],
    trademark: ["GET"],
  },
};

export function authorize(
  role: string,
  pathname: string,
  method: string
): boolean {
  let lastSegment: any = getPath(pathname);

  return (
    authObject[role] &&
    authObject[role][lastSegment] &&
    authObject[role][lastSegment].includes(method)
  );
}

export function getPath(pathname: string) {
  const trimmedPathname = pathname.startsWith("/")
    ? pathname.substring(1)
    : pathname;

  const pathSegments = trimmedPathname.split("/");

  if (pathSegments.length === 0) {
    return false;
  }

  const lastSegmentIsNumber = !isNaN(
    parseInt(pathSegments[pathSegments.length - 1])
  );

  const lastSegment: string = lastSegmentIsNumber
    ? pathSegments.slice(-2, -1).join("/")
    : pathSegments[pathSegments.length - 1];

  return lastSegment;
}
