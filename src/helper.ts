import { format, addDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';

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

// validationHelper.ts
export const isNameValid = (value: string): boolean => {
  return /^[a-zA-Z\s]*$/.test(value);
};

export const isPhoneNumberValid = (value: string): boolean => {
  return /^[0-9]+$/.test(value) && value.length <= 10;
};


export const userTypeOptions: { value: any; label: React.ReactNode }[] = [
  { value: 1, label: "KIRUTHIKA D" },
  {
    value: 2,
    label: "VAISHNAVI M",
  },
  { value: 3, label: "NANDHINI V" },
  { value: 4, label: "KIRUTHIKA V" },
  { value: 5, label: "RAJMOHAN NITHYA" },
  { value: 6, label: "GOKUL R" },
  { value: 7, label: "ARUN PRASANNA" },
  { value: 8, label: "MADHAN R" },
];

export const statusTypeOptions: { value: any; label: React.ReactNode }[] = [
  { value: "Open", label: "Open" },
  {
    value: "In-Progress",
    label: "In-Progress",
  },
  { value: "Hold", label: "Hold" },
  {
    value: "Waiting for Customer Doc/Confirmation",
    label: "Waiting for Customer Doc/Confirmation",
  },
  { value: "Completed", label: "Completed" },
  { value: "Cancelled", label: "Cancelled" },
  { value: "Deferred ", label: "Deferred " },
];

export const priorityTypeOptions: { value: any; label: React.ReactNode }[] = [
  { value: "1", label: "1" },
  {
    value: "2",
    label: "2",
  },
  {
    value: "3",
    label: "3",
  },
];

export const getStartAndEndDate = (filterType: string): { startDate: string, endDate: string } => {
  const currentDate = new Date();

  switch (filterType) {
    case 'thisWeek': {
      const startDate = format(startOfWeek(currentDate), 'yyyy-MM-dd');
      const endDate = format(endOfWeek(currentDate), 'yyyy-MM-dd');
      return { startDate, endDate };
    }
    case 'thisMonth': {
      const startDate = format(startOfMonth(currentDate), 'yyyy-MM-dd');
      const endDate = format(endOfMonth(currentDate), 'yyyy-MM-dd');
      return { startDate, endDate };
    }
    case 'overdue': {
      // Assuming 'Over Due' means until yesterday
      const yesterday = addDays(currentDate, -1);
      const startDate = '1990-01-01'; // Assuming a reasonable start date for overdue check
      const endDate = format(yesterday, 'yyyy-MM-dd');
      return { startDate, endDate };
    }
    default: {
      // Return an empty range by default
      return { startDate: '', endDate: '' };
    }
  }
};
