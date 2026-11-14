import { Route, Routes } from "react-router-dom";
import { AuthProvider } from "./auth";
import BlogPage from "./BlogPage";
import BlogPostPage from "./BlogPostPage";
import BlogEditorPage from "./BlogEditorPage";
import BlogCallbackPage from "./BlogCallbackPage";
import NotFoundPage from "../pages/NotFoundPage";
import "./blog.css";

/* Everything under /blog. Loaded lazily so the home page doesn't pay for the
   Markdown renderer. */
export default function BlogApp() {
  return (
    <AuthProvider>
      <Routes>
        <Route index element={<BlogPage />} />
        <Route path="new" element={<BlogEditorPage />} />
        <Route path="edit/:slug" element={<BlogEditorPage />} />
        <Route path="callback" element={<BlogCallbackPage />} />
        <Route path=":slug" element={<BlogPostPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AuthProvider>
  );
}
