import Dashboard from "views/Dashboard/Dashboard";
import UserProfile from "views/UserProfile/UserProfile";
import TableList from "views/TableList/TableList";
import Typography from "views/Typography/Typography";
import Icons from "views/Icons/Icons";
import Notifications from "views/Notifications/Notifications";
import Patients from "views/Patients/Patients";
import CurrentApplication from "views/CurrentApplication/CurrentApplication";
import PastSessions from "views/PastSessions/PastSessions";


const dashboardRoutes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: "pe-7s-graph",
    component: Dashboard
  },
  {
    path: "/inuse",
    name: "Current Application",
    icon: "pe-7s-display1",
    component: CurrentApplication
  },
  {
    path: "/pastsessions",
    name: "Past Sessions",
    icon: "pe-7s-note2",
    component: PastSessions
  },
  {
    path: "/pat",
    name: "Patients",
    icon: "pe-7s-users",
    component: Patients
  },
  // {
  //   path: "/user",
  //   name: "User Profile",
  //   icon: "pe-7s-user",
  //   component: UserProfile
  // },
  // {
  //   path: "/table1",
  //   name: "Table List",
  //   icon: "pe-7s-note2",
  //   component: TableList
  // },
  // {
  //   path: "/typography",
  //   name: "Typography",
  //   icon: "pe-7s-news-paper",
  //   component: Typography
  // },
  // { path: "/icons", name: "Icons", icon: "pe-7s-science", component: Icons },
  //
  // {
  //   path: "/notifications",
  //   name: "Notifications",
  //   icon: "pe-7s-bell",
  //   component: Notifications
  // },

  { redirect: true, path: "/", to: "/dashboard", name: "Dashboard" }
];

export default dashboardRoutes;
