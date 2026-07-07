// src/app/routes.tsx

import { Routes, Route } from "react-router-dom";
import { HomePage } from "@/Modules/home/pages/HomePage";
import { AboutPage } from "@/Modules/about/pages/AboutPage";
import { ProjectsListPage } from "@/Modules/projects/pages/ProjectsListPage";
import { ProjectsDetailsPage } from "@/Modules/projects/pages/ProjectsDetailsPage";
import { BlogListPage } from "@/Modules/blog/pages/BlogListPage";
import { BlogDetailsPage } from "@/Modules/blog/pages/BlogDetailsPage";
import { ContactPage } from "@/Modules/contact/pages/ContactPage";
import { ROUTES } from "@/common/constants/routes";

// Admin routes intentionally left out — admin dashboard work is on hold
// per project handoff. Re-add here once admin work resumes:
// import { RequireAdminAuth } from "@/common/guards/RequireAdminAuth";
// import { AdminLoginPage } from "@/Modules/admin/auth/pages/AdminLoginPage";
// import { AdminDashboardPage } from "@/Modules/admin/dashboard/pages/AdminDashboardPage";

export function AppRoutes() {
  return (
    <Routes>
      <Route path={ROUTES.home} element={<HomePage />} />
      <Route path={ROUTES.about} element={<AboutPage />} />
      <Route path={ROUTES.projects} element={<ProjectsListPage />} />
      <Route path={`${ROUTES.projects}/:slug`} element={<ProjectsDetailsPage />} />
      <Route path={ROUTES.blog} element={<BlogListPage />} />
      <Route path={`${ROUTES.blog}/:slug`} element={<BlogDetailsPage />} />
      <Route path={ROUTES.contact} element={<ContactPage />} />

      {/*
        <Route
          path="/admin/login"
          element={<AdminLoginPage />}
        />
        <Route
          path="/admin/dashboard"
          element={
            <RequireAdminAuth>
              <AdminDashboardPage />
            </RequireAdminAuth>
          }
        />
      */}
    </Routes>
  );
}