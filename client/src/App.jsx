import { Routes, Route, Navigate } from "react-router-dom";

/* USER */
import UserLayout from "./Layouts/UserLayout";
import Home from "./Components/Home";
import About from "./Components/About";
import Login from "./Components/Login";
import Register from "./Components/Register";
import Account from "./Components/Account";

/* USER PAGES */
import UserFaculty from "./pages/UserFaculty";
import FacultySemester from "./pages/FacultySemester";
import Subject from "./pages/Subject";
import SubjectResources from "./pages/SubjectResources";
import UserNotes from "./pages/UserNotes";
import UserQuestions from "./pages/UserQuestions";
import UserSyllabus from "./pages/UserSyllabus";
import UserPresentation from "./pages/UserPresentation";
import FacultySyllabus from "./pages/FacultySyllabus";

/* ADMIN */
import AdminNavbar from "./Admin/AdminNavbar";
import Dashboard from "./Admin/Dashboard";
import Notes from "./Admin/Notes";
import AdminPresentation from "./Admin/Presentation";
import AdminQuestions from "./Admin/Questions";
import Users from "./Admin/Users";
import AdminFaculty from "./Admin/Faculty";
import AdminSubject from "./Admin/Subject";
import AdminSemester from "./Admin/Semester";

/* ADMIN AUTH */
import AdminLogin from "./Admin/AdminLogin";
import AdminRegister from "./Admin/AdminRegister";
import ProtectedAdminRoute from "./Admin/Security/ProtectedAdminRoute";

export default function App() {
  return (
    <Routes>
      {/* USER */}
      <Route element={<UserLayout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="account" element={<Account />} />

        <Route path="faculty" element={<UserFaculty />} />
        <Route path="usernotes" element={<UserNotes />} />
        <Route path="presentation" element={<UserPresentation />} />
        <Route path="questions" element={<UserQuestions />} />

        <Route path="syllabus" element={<UserSyllabus />} />
        <Route path="syllabus/:facultyId" element={<FacultySyllabus />} />

        <Route path="faculty/:facultyId">
          <Route index element={<FacultySemester />} />
          <Route path="semester/:semesterId">
            <Route index element={<Subject />} />
            <Route path="subject/:subjectId" element={<SubjectResources />} />
          </Route>
        </Route>
      </Route>

      {/* ADMIN PUBLIC */}
      <Route path="admin/login" element={<AdminLogin />} />
      <Route path="admin/register" element={<AdminRegister />} />

      {/* ADMIN PROTECTED */}
      <Route
        path="admin"
        element={
          <ProtectedAdminRoute>
            <AdminNavbar />
          </ProtectedAdminRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="notes" element={<Notes />} />
        <Route path="presentation" element={<AdminPresentation />} />
        <Route path="questions" element={<AdminQuestions />} />
        <Route path="users" element={<Users />} />
        <Route path="faculty" element={<AdminFaculty />} />
        <Route path="subject" element={<AdminSubject />} />
        <Route path="semester" element={<AdminSemester />} />
      </Route>

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
