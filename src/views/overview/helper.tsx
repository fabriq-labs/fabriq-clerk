import AppointmentLogo from "../../assets/medical-appointment.png";
import AdviceLogo from "../../assets/advice.png";
import MedicalTeamLogo from "../../assets/medical-team.png";
import BudgetLogo from "../../assets/budget.png";
import AmbulanceLogo from "../../assets/ambulance.png";
import BedLogo from "../../assets/hospital-bed.png";

export const cardData = [
  {
    title: "Appointments",
    content: { avg: 14.45, total: 480, status: "decreased" },
    image: AppointmentLogo,
  },
  {
    title: "Total Patients",
    content: { avg: 20.34, total: 250, status: "increased" },
    image: AdviceLogo,
  },
  {
    title: "Total Doctors",
    content: { avg: 33.5, total: 88, status: "decreased" },
    image: MedicalTeamLogo,
  },
  {
    title: "Revenue",
    content: { avg: 10, total: 342567, status: "increased" },
    image: BudgetLogo,
  },
  {
    title: "Ambulance",
    content: { avg: 10, total: 32, status: "increased" },
    image: AmbulanceLogo,
  },
  {
    title: "Total Beds",
    content: { avg: 10, total: 86, status: "increased" },
    image: BedLogo,
  },
];

export const data = [
  {
    name: "Feb 15",
    admitted: 120,
    discharged: 80,
  },
  {
    name: "Feb 16",
    admitted: 90,
    discharged: 52,
  },
  {
    name: "Feb 17",
    admitted: 60,
    discharged: 260,
  },
  {
    name: "Feb 18",
    admitted: 83,
    discharged: 146,
  },
  {
    name: "Feb 19",
    admitted: 57,
    discharged: 192,
  },
  {
    name: "Feb 20",
    admitted: 71,
    discharged: 95,
  },
  {
    name: "Feb 21",
    admitted: 104,
    discharged: 129,
  },
  {
    name: "Feb 22",
    admitted: 123,
    discharged: 89,
  },
];


export const healthData = [
  { name: "Critical Conditions", value: 15 },
  { name: "Serious Cases", value: 30 },
  { name: "Stable Situations", value: 50 },
  { name: "Routine Checkups", value: 25 },
  { name: "Post-Surgery", value: 12 },
  { name: "Chronic Disease", value: 40 },
];


export const tableData = [
  {
    id: "P001",
    name: "John Smith",
    age: 45,
    gender: "Male",
    diseases: ["Influenza", "Bronchitis"],
    appointmentDate: "2024-02-23",
    appointmentTime: "09:30 AM",
  },
  {
    id: "P002",
    name: "Emily Johnson",
    age: 38,
    gender: "Female",
    diseases: ["Migraine", "Upper Respiratory Infection"],
    appointmentDate: "2024-02-23",
    appointmentTime: "10:15 AM",
  },
  {
    id: "P003",
    name: "Robert Davis",
    age: 52,
    gender: "Male",
    diseases: ["Lower Back Pain"],
    appointmentDate: "2024-02-23",
    appointmentTime: "11:00 AM",
  },
  {
    id: "P004",
    name: "Alice Turner",
    age: 60,
    gender: "Female",
    diseases: ["Type 2 Diabetes", "Hypertension"],
    appointmentDate: "2024-02-23",
    appointmentTime: "02:45 PM",
  },
  {
    id: "P005",
    name: "Charlie Brown",
    age: 42,
    gender: "Male",
    diseases: ["Asthma"],
    appointmentDate: "2024-02-23",
    appointmentTime: "03:30 PM",
  },
  {
    id: "P006",
    name: "Eva Green",
    age: 55,
    gender: "Female",
    diseases: ["Arthritis"],
    appointmentDate: "2024-02-23",
    appointmentTime: "04:15 PM",
  },
  {
    id: "P007",
    name: "David White",
    age: 48,
    gender: "Male",
    diseases: ["Migraine", "Chronic Fatigue Syndrome"],
    appointmentDate: "2024-02-23",
    appointmentTime: "10:30 AM",
  },
  {
    id: "P008",
    name: "Grace Miller",
    age: 65,
    gender: "Female",
    diseases: ["Osteoporosis", "Iron-Deficiency Anemia"],
    appointmentDate: "2024-02-23",
    appointmentTime: "01:00 PM",
  },
  {
    id: "P009",
    name: "Frank Wilson",
    age: 32,
    gender: "Male",
    diseases: ["Allergic Rhinitis"],
    appointmentDate: "2024-02-23",
    appointmentTime: "11:45 AM",
  },
  {
    id: "P010",
    name: "Helen Davis",
    age: 58,
    gender: "Female",
    diseases: ["Coronary Artery Disease"],
    appointmentDate: "2024-02-23",
    appointmentTime: "09:00 AM",
  },
];

export const colors = [
  "0071ff",
  "00d5c6",
  "9385f7",
  "fe996c",
  "ff5733",
  "8a2be2",
];

export const barchartData = [
  {
    date: "Feb 15",
    scheduled: 20,
    cancelled: 10,
  },
  {
    date: "Feb 16",
    scheduled: 25,
    cancelled: 8,
  },
  {
    date: "Feb 17",
    scheduled: 18,
    cancelled: 12,
  },
  {
    date: "Feb 18",
    scheduled: 22,
    cancelled: 5,
  },
  {
    date: "Feb 19",
    scheduled: 30,
    cancelled: 7,
  },
  {
    date: "Feb 20",
    scheduled: 28,
    cancelled: 6,
  },
  {
    date: "Feb 21",
    scheduled: 35,
    cancelled: 9,
  },
  {
    date: "Feb 22",
    scheduled: 32,
    cancelled: 8,
  },
];

export const weeklyIncome = [
  { date: "2024-02-15", earnings: 14000 },
  { date: "2024-02-16", earnings: 12000 },
  { date: "2024-02-17", earnings: 24000 },
  { date: "2024-02-18", earnings: 28080 },
  { date: "2024-02-19", earnings: 18904 },
  { date: "2024-02-20", earnings: 23290 },
  { date: "2024-02-21", earnings: 34490 }
];

export const appointments = [
  { patient: "Alice Johnson", time: "10:00 AM" },
  { patient: "Smith", time: "13:00 PM" },
  { patient: "Charlie Brown", time: "10:00 AM" },
  { patient: "David White", time: "06:00 AM" },
  { patient: "Eva Davis", time: "10:00 AM" },
  { patient: "Frank Wilson", time: "14:30 PM" },
  { patient: "Grace Miller", time: "12:45 PM" },
  { patient: "Henry Taylor", time: "09:30 AM" },
  { patient: "Ivy Harris", time: "11:15 AM" },
  { patient: "Jack Turner", time: "15:20 PM" },
];


export const formatNumber = (value: number) => {
  if (value >= 1000000) {
    return ` ${(value / 1000000).toFixed(2)}m`;
  } else if (value >= 1000) {
    return `${(value / 1000).toFixed(2)}k`;
  } else {
    return value?.toString();
  }
};

export const emergencyRoomData = {
  occupancyRate: 75,
  patientsInQueue: 12,
  availableBeds: 28,
  averageWaitTime: 15,
};


