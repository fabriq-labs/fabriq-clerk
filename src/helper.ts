import { format, addDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';

export const authObject: Record<string, Record<string, string[]>> = {
  "org:admin": {
    contact: ["GET", "POST", "PUT", "DELETE"],
    company: ["GET", "POST", "PUT", "DELETE"],
    ticket: ["GET", "POST", "PUT", "DELETE"],
    trademark: ["GET", "POST", "PUT", "DELETE"],
    user: ["GET", "POST", "PUT", "DELETE"],
  },
  "org:member": {
    contact: ["GET", "POST", "PUT", "DELETE"],
    company: ["GET", "POST", "PUT", "DELETE"],
    ticket: ["GET", "POST", "PUT", "DELETE"],
    trademark: ["GET", "POST", "PUT", "DELETE"],
    user: ["GET", "POST", "PUT", "DELETE"],
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
  { value: "OPEN", label: "OPEN" },
  {
    value: "IN PROGRESS",
    label: "IN PROGRESS",
  },
  { value: "HOLD", label: "HOLD" },
  {
    value: "WAITING FOR CUSOMER DOC/CONFIRMATION",
    label: "WAITING FOR CUSOMER DOC/CONFIRMATION",
  },
  { value: "DONE", label: "DONE" },
  { value: "CANCELLED", label: "CANCELLED" },
  { value: "DEFERRED ", label: "DEFERRED " },
  // { value: "INCORPORATION", label: "INCORPORATION" },
  // { value: "ANNUAL FILING-2023", label: "ANNUAL FILING-2023" },
  // { value: "CLOSURE", label: "CLOSURE" },
  // { value: "HIGH PRIORITY", label: "HIGH PRIORITY" },
  // { value: "PENDING FOR PAYMENT", label: "PENDING FOR PAYMENT" },
  // { value: "PENDING GOVERNMENT APPROVAL", label: "PENDING GOVERNMENT APPROVAL" },
  // { value: "PENDING WORK", label: "PENDING WORK" },
  // { value: "SIGNED COPY", label: "SIGNED COPY" },
  // { value: "TRADEMARK & LEI", label: "TRADEMARK & LEI" },
  // { value: "DONE", label: "DONE" },
  // { value: "MINUTES", label: "MINUTES" },
];

export const priorityTypeOptions: { value: any; label: React.ReactNode }[] = [
  { value: "High", label: "High" },
  {
    value: "Medium",
    label: "Medium",
  },
  {
    value: "Low",
    label: "Low",
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

export const associateOptions: { value: string; label: React.ReactNode }[] = [
  { value: "Director", label: "Director" },
  { value: "Whole Time Director", label: "Whole Time Director" },
  { value: "Independent Director", label: "Independent Director" },
  { value: "Additional Director", label: "Additional Director" },
  { value: "Managing Director", label: "Managing Director" },
  { value: "Designated Partner", label: "Designated Partner" },
  { value: "Statutory Auditor", label: "Statutory Auditor" },
  {
    value: "Full time - Company Secretary",
    label: "Full time - Company Secretary",
  },
  {
    value: "Full time - Company Accountant",
    label: "Full time - Company Accountant",
  },
  {
    value: "Full time - Cost Accountant",
    label: "Full time - Cost Accountant",
  },
  {
    value: "Practicing Company Secretary",
    label: "Practicing Company Secretary",
  },
  {
    value: "Practicing Chartered Accountant",
    label: "Practicing Chartered Accountant",
  },
  { value: "Practicing Cost Accountant", label: "Practicing Cost Accountant" },
  { value: "Proprietor", label: "Proprietor" },
  { value: "Partner - Partnership firm", label: "Partner - Partnership firm" },
  { value: "IT Practitioner", label: "IT Practitioner" },
  { value: "Other Professional", label: "Other Professional" },
  { value: "Company Finance Manager", label: "Company Finance Manager" },
  { value: "Company Accounts Team", label: "Company Accounts Team" },
  { value: "CA Firm", label: "CA Firm" },
  { value: "CS Firm", label: "CS Firm" },
  { value: "CWA Firm", label: "CWA Firm" },
  { value: "CEO", label: "CEO" },
  { value: "CFO", label: "CFO" },
  { value: "COO", label: "COO" },
  { value: "Share Holder", label: "Share Holder" },
];

export const serviceTypeOptions: { value: string; label: React.ReactNode }[] = [
  { value: "INCORPORATION", label: "INCORPORATION" },
  { value: "APPLYING FOR DIN", label: "APPLYING FOR DIN" },
  { value: "BANK ACCOUNT OPENING AND CLOSING", label: "BANK ACCOUNT OPENING AND CLOSING" },
  { value: "COMPANY NAME SEARCH", label: "COMPANY NAME SEARCH" },
  { value: "TRADEMARK & LEI", label: "TRADEMARK & LEI" },
  { value: "KMP - APPOINTMENT, RESIGNATION AND CHANGE IN DESIGNATION", label: "KMP - APPOINTMENT, RESIGNATION AND CHANGE IN DESIGNATION" },
  { value: "XBRL", label: "XBRL" },
  { value: "ANNUAL FILING", label: "ANNUAL FILING" },
  { value: "MSME", label: "MSME" },
  { value: "KYC", label: "KYC" },
  { value: "CHANGE COMPANY INFORMATION", label: "CHANGE COMPANY INFORMATION" },
  { value: "SEARCH REPORT", label: "SEARCH REPORT" },
  { value: "CHARGE", label: "CHARGE" },
  { value: "INFORMATION SERVICES", label: "INFORMATION SERVICES" },
  { value: "STPI", label: "STPI" },
  { value: "DSC ", label: "DSC" },
  { value: "CLOSE COMPANY", label: "CLOSE COMPANY" },
  { value: "AUDITOR APPOINTMENT", label: "AUDITOR APPOINTMENT" },
  { value: "APPROVAL SERVICES", label: "APPROVAL SERVICES" },
  { value: "AGM", label: "AGM" },
  { value: "MINUTES", label: "MINUTES" },
  { value: "LEI (LEGAL ENTITY IDENTIFIER)", label: "LEI (LEGAL ENTITY IDENTIFIER)" },
  { value: "DUE DILIGENCE", label: "DUE DILIGENCE" },
  { value: "FSSAI", label: "FSSAI" },
  { value: "SIGNED COPY", label: "SIGNED COPY" },
  { value: "PENDING WORK", label: "PENDING WORK" },
  { value: "PENDING FOR GOVERMENT APPROVEL", label: "PENDING FOR GOVERMENT APPROVEL" },
  { value: "PENDING FOR PAYMENT", label: "PENDING FOR PAYMENT" },
  { value: "HIGH PRIORITY", label: "HIGH PRIORITY" },
  { value: "CLOSURE", label: "CLOSURE" },
  { value: "ANNUAL FILING-2023", label: "ANNUAL FILING-2023" },
]