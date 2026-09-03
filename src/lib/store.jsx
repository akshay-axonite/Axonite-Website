import React, { createContext, useContext, useState } from "react";
import { blogPosts as defaultBlogPosts, jobs as defaultJobs } from "../data/content";

const KEYS = {
  blog: "axonite_blog_posts",
  jobs: "axonite_jobs",
  pageviews: "axonite_pageviews",
  sessions: "axonite_sessions",
  breakdown: "axonite_page_breakdown",
  auth: "axonite_admin_auth",
};

const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "axonite2026";

// --- Low-level storage utilities ---

const read = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

const write = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Fail silently when storage is restricted (e.g., private window)
  }
};

const seedIfEmpty = (key, seedData) => {
  if (localStorage.getItem(key) === null) {
    write(key, seedData);
  }
};

const initStore = () => {
  seedIfEmpty(
    KEYS.blog,
    defaultBlogPosts.map((p, i) => ({ id: `seed-post-${i}`, ...p }))
  );
  seedIfEmpty(
    KEYS.jobs,
    defaultJobs.map((j, i) => ({ id: `seed-job-${i}`, ...j }))
  );
};

if (typeof window !== "undefined") {
  initStore();
}

// --- Standalone Functions (preserves backward compatibility) ---

export const getBlogPosts = () => read(KEYS.blog, []);

export const saveBlogPost = (post) => {
  const posts = getBlogPosts();
  if (post.id) {
    const idx = posts.findIndex((p) => p.id === post.id);
    if (idx >= 0) {
      posts[idx] = post;
      write(KEYS.blog, posts);
      return post;
    }
  }
  const withId = { ...post, id: `post-${Date.now()}` };
  const updated = [withId, ...posts];
  write(KEYS.blog, updated);
  return withId;
};

export const deleteBlogPost = (id) => {
  const filtered = getBlogPosts().filter((p) => p.id !== id);
  write(KEYS.blog, filtered);
};

export const getJobs = () => read(KEYS.jobs, []);

export const saveJob = (job) => {
  const jobs = getJobs();
  if (job.id) {
    const idx = jobs.findIndex((j) => j.id === job.id);
    if (idx >= 0) {
      jobs[idx] = job;
      write(KEYS.jobs, jobs);
      return job;
    }
  }
  const withId = { ...job, id: `job-${Date.now()}` };
  write(KEYS.jobs, [withId, ...jobs]);
  return withId;
};

export const deleteJob = (id) => {
  const filtered = getJobs().filter((j) => j.id !== id);
  write(KEYS.jobs, filtered);
};

export const trackPageView = (path) => {
  const total = read(KEYS.pageviews, 0) + 1;
  write(KEYS.pageviews, total);

  const breakdown = read(KEYS.breakdown, {});
  breakdown[path] = (breakdown[path] || 0) + 1;
  write(KEYS.breakdown, breakdown);

  if (!sessionStorage.getItem("axonite_session_counted")) {
    sessionStorage.setItem("axonite_session_counted", "1");
    write(KEYS.sessions, read(KEYS.sessions, 0) + 1);
  }
};

export const getStats = () => ({
  pageviews: read(KEYS.pageviews, 0),
  sessions: read(KEYS.sessions, 0),
  breakdown: read(KEYS.breakdown, {}),
});

export const login = (username, password) => {
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    sessionStorage.setItem(KEYS.auth, "1");
    return true;
  }
  return false;
};

export const logout = () => {
  sessionStorage.removeItem(KEYS.auth);
};

export const isAuthed = () => sessionStorage.getItem(KEYS.auth) === "1";

// --- React Context Provider (JSX Integration) ---

const StoreContext = createContext(null);

export const AdminStoreProvider = ({ children }) => {
  const [blogPosts, setBlogPostsState] = useState(getBlogPosts);
  const [jobs, setJobsState] = useState(getJobs);
  const [authenticated, setAuthenticated] = useState(isAuthed);

  const handleSavePost = (post) => {
    const saved = saveBlogPost(post);
    setBlogPostsState(getBlogPosts());
    return saved;
  };

  const handleDeletePost = (id) => {
    deleteBlogPost(id);
    setBlogPostsState(getBlogPosts());
  };

  const handleSaveJob = (job) => {
    const saved = saveJob(job);
    setJobsState(getJobs());
    return saved;
  };

  const handleDeleteJob = (id) => {
    deleteJob(id);
    setJobsState(getJobs());
  };

  const handleLogin = (u, p) => {
    const success = login(u, p);
    setAuthenticated(success);
    return success;
  };

  const handleLogout = () => {
    logout();
    setAuthenticated(false);
  };

  return (
    <StoreContext.Provider
      value={{
        blogPosts,
        jobs,
        isAuthenticated: authenticated,
        saveBlogPost: handleSavePost,
        deleteBlogPost: handleDeletePost,
        saveJob: handleSaveJob,
        deleteJob: handleDeleteJob,
        login: handleLogin,
        logout: handleLogout,
        getStats,
        trackPageView,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useAdminStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useAdminStore must be used within an AdminStoreProvider");
  }
  return context;
};

// Add to KEYS in src/lib/store.jsx:
// applications: "axonite_applications",

// Seed data for demo applications
const defaultApplications = [
  {
    id: "app-1",
    qulifications: "B.Tech in Computer Science",
    candidateName: "Rohan Sharma",
    email: "rohan.sharma@example.com",
    role: "Frontend Engineer",
    appliedDate: "2026-08-28",
    status: "new", // "Pending" | "Selected" | "Rejected" | "Scheduled"
    interviewDate: null,
    resumeLink: "#"
  },
  {
    id: "app-2",
    qulifications: "B.Tech in Computer Science",
    candidateName: "Priya Patel",
    email: "priya.p@example.com",
    role: "Product Designer",
    appliedDate: "2026-08-30",
    status: "new",
    interviewDate: null,
    resumeLink: "#"
  }
];

export const getApplications = () => {
  seedIfEmpty(KEYS.applications, defaultApplications);
  return read(KEYS.applications, defaultApplications);
};

export const updateApplicationStatus = (id, status, interviewDate = null) => {
  const apps = getApplications();
  const updated = apps.map((app) =>
    app.id === id ? { ...app, status, interviewDate } : app
  );
  write(KEYS.applications, updated);
  return updated;
};