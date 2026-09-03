import React, { useState, useMemo, Fragment } from "react";
import { getApplications, updateApplicationStatus } from "../../lib/store";

export default function ApplicationsManager() {
  const [apps, setApps] = useState(() => getApplications());
  const [activeModalId, setActiveModalId] = useState(null);
  const [targetRound, setTargetRound] = useState(1);
  const [expandedRowId, setExpandedRowId] = useState(null);

  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");
  const [selectedExperience, setSelectedExperience] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [filterDate, setFilterDate] = useState("");

  // Form state for scheduling
  const [scheduleData, setScheduleData] = useState({
    dateTime: "",
    mode: "Online", // "Online" | "Offline"
    locationOrLink: "",
  });

  const toggleRowExpand = (id) => {
    setExpandedRowId((prev) => (prev === id ? null : id));
  };

  const handleStatusChange = (id, newStatus) => {
    const app = apps.find((a) => a.id === id);
    const updated = updateApplicationStatus(id, newStatus, app?.interview ?? null);
    setApps(updated);
  };

  const handleOpenScheduleModal = (app, roundNumber) => {
    setActiveModalId(app.id);
    setTargetRound(roundNumber);

    const isEditingCurrentRound = app.interview?.round === roundNumber;

    setScheduleData(
      isEditingCurrentRound
        ? {
            dateTime: app.interview?.dateTime || "",
            mode: app.interview?.mode || "Online",
            locationOrLink: app.interview?.locationOrLink || "",
          }
        : {
            dateTime: "",
            mode: "Online",
            locationOrLink: "",
          }
    );
  };

  const handleScheduleSubmit = (e, id) => {
    e.preventDefault();
    if (!scheduleData.dateTime) return;

    const updated = updateApplicationStatus(id, `Round ${targetRound} Scheduled`, {
      round: targetRound,
      dateTime: scheduleData.dateTime,
      mode: scheduleData.mode,
      locationOrLink: scheduleData.locationOrLink,
    });

    setApps(updated);
    setActiveModalId(null);
  };

  // Derive unique job roles from application dataset
  const availableRoles = useMemo(() => {
    const roles = apps.map((a) => a.role).filter(Boolean);
    return Array.from(new Set(roles));
  }, [apps]);

  // Filter and search logic
  const filteredApps = useMemo(() => {
    return apps.filter((app) => {
      const qualification =
        app.qualification || app.qualifications || app.degree || "";
      const searchTarget = `${app.candidateName || ""} ${app.email || ""} ${
        app.city || ""
      } ${qualification}`.toLowerCase();

      // Search matching
      if (
        searchQuery.trim() &&
        !searchTarget.includes(searchQuery.toLowerCase().trim())
      ) {
        return false;
      }

      // Role filter
      if (selectedRole !== "all" && app.role !== selectedRole) {
        return false;
      }

      // Status filter
      if (selectedStatus !== "all") {
        if (selectedStatus === "New" && (app.status && app.status !== "New")) {
          return false;
        } else if (
          selectedStatus === "Scheduled" &&
          !app.status?.includes("Scheduled")
        ) {
          return false;
        } else if (
          selectedStatus !== "New" &&
          selectedStatus !== "Scheduled" &&
          app.status !== selectedStatus
        ) {
          return false;
        }
      }

      // Date filter (applications on or after selected date)
      if (filterDate && app.appliedDate) {
        if (new Date(app.appliedDate) < new Date(filterDate)) {
          return false;
        }
      }

      // Experience parsing and filter
      if (selectedExperience !== "all") {
        const expDigits = parseInt(app.experience, 10);
        const expNum = isNaN(expDigits) ? 0 : expDigits;

        if (selectedExperience === "fresher" && expNum > 0) return false;
        if (selectedExperience === "1-3" && (expNum < 1 || expNum > 3)) return false;
        if (selectedExperience === "3-5" && (expNum < 3 || expNum > 5)) return false;
        if (selectedExperience === "5+" && expNum < 5) return false;
      }

      return true;
    });
  }, [
    apps,
    searchQuery,
    selectedRole,
    selectedStatus,
    filterDate,
    selectedExperience,
  ]);

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedRole("all");
    setSelectedExperience("all");
    setSelectedStatus("all");
    setFilterDate("");
  };

  const hasActiveFilters =
    searchQuery ||
    selectedRole !== "all" ||
    selectedExperience !== "all" ||
    selectedStatus !== "all" ||
    filterDate;

  // ---- Shared render helpers (used by both table rows and mobile cards) ----

  const StatusBadge = ({ app }) => {
    const isScheduled = app.status?.includes("Scheduled");
    return (
      <span
        className={`inline-block px-2.5 py-0.5 text-xs rounded-full font-medium ${
          isScheduled
            ? "bg-blue-50 text-blue-700 border border-blue-200"
            : app.status === "Selected"
            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
            : app.status === "Rejected"
            ? "bg-rose-50 text-rose-700 border border-rose-200"
            : "bg-amber-50 text-amber-700 border border-amber-200"
        }`}
      >
        {app.status || "New"}
      </span>
    );
  };

  const InterviewDetails = ({ app }) => {
    const isScheduled = app.status?.includes("Scheduled");
    if (!isScheduled || !app.interview) return null;
    return (
      <div className="mt-2 space-y-1 text-xs text-gray-600 bg-gray-50 p-2.5 rounded border border-gray-100 max-w-xs">
        <div className="flex items-center gap-1.5 font-medium text-gray-800">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
          <span>
            Round {app.interview.round || 1} ({app.interview.mode})
          </span>
        </div>
        <p className="text-[11px] text-gray-500 font-mono">
          {new Date(app.interview.dateTime).toLocaleString([], {
            dateStyle: "medium",
            timeStyle: "short",
          })}
        </p>
        {app.interview.locationOrLink && (
          <p className="text-[11px] text-gray-600 truncate">
            {app.interview.mode === "Online" ? "Link: " : "Venue: "}
            <span className="font-mono">{app.interview.locationOrLink}</span>
          </p>
        )}
      </div>
    );
  };

  const ActionButtons = ({ app, currentRound, wrap }) => (
    <div className={`inline-flex items-center gap-2 ${wrap ? "flex-wrap" : ""}`}>
      {currentRound > 0 && app.status !== "Selected" && app.status !== "Rejected" && (
        <button
          onClick={() => handleStatusChange(app.id, "Selected")}
          className="px-2.5 py-1 text-xs font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded border border-emerald-200 transition-colors"
        >
          Select
        </button>
      )}

      {app.status !== "Selected" && app.status !== "Rejected" && (
        <>
          {currentRound === 0 && (
            <button
              onClick={() => handleOpenScheduleModal(app, 1)}
              className="px-2.5 py-1 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded border border-blue-200 transition-colors"
            >
              Schedule Round 1
            </button>
          )}
          {currentRound === 1 && (
            <button
              onClick={() => handleOpenScheduleModal(app, 2)}
              className="px-2.5 py-1 text-xs font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded border border-indigo-200 transition-colors"
            >
              Schedule Round 2
            </button>
          )}
          {currentRound === 2 && (
            <button
              onClick={() => handleOpenScheduleModal(app, 3)}
              className="px-2.5 py-1 text-xs font-medium text-purple-700 bg-purple-50 hover:bg-purple-100 rounded border border-purple-200 transition-colors"
            >
              Schedule Round 3
            </button>
          )}
        </>
      )}

      {app.status !== "Rejected" && app.status !== "Selected" && (
        <button
          onClick={() => handleStatusChange(app.id, "Rejected")}
          className="px-2.5 py-1 text-xs font-medium text-rose-700 bg-rose-50 hover:bg-rose-100 rounded border border-rose-200 transition-colors"
        >
          Reject
        </button>
      )}
    </div>
  );

  const DetailsGrid = ({ app, qualification, cols = "grid-cols-2 md:grid-cols-5" }) => (
    <div className={`grid ${cols} gap-4 text-xs`}>
      <div>
        <span className="text-gray-400 font-medium block">Qualification</span>
        <span className="text-gray-800 font-medium">{qualification || "Not provided"}</span>
      </div>
      <div>
        <span className="text-gray-400 font-medium block">Phone Number</span>
        <span className="text-gray-800 font-mono">{app.phone || "Not provided"}</span>
      </div>
      <div>
        <span className="text-gray-400 font-medium block">Experience</span>
        <span className="text-gray-800">{app.experience || "Not provided"}</span>
      </div>
      <div>
        <span className="text-gray-400 font-medium block">City</span>
        <span className="text-gray-800">{app.city || "Not provided"}</span>
      </div>
      <div>
        <span className="text-gray-400 font-medium block">LinkedIn</span>
        {app.linkedinUrl ? (
          <a
            href={app.linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline truncate block"
          >
            {app.linkedinUrl.replace(/^https?:\/\/(www\.)?/, "")}
          </a>
        ) : (
          <span className="text-gray-400">Not provided</span>
        )}
      </div>
    </div>
  );

  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center gap-2 py-12 px-6 text-center text-gray-400">
      <svg className="w-8 h-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <p className="text-sm font-medium text-gray-500">No matching applications found</p>
      <button
        type="button"
        onClick={handleResetFilters}
        className="text-xs text-blue-600 underline hover:text-blue-800"
      >
        Clear search & filters
      </button>
    </div>
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Career Applications</h1>
          <p className="text-sm text-gray-500 mt-1">
            Review candidates, schedule multi-round interviews, and filter candidates.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono bg-gray-100 px-3 py-1.5 rounded-full text-gray-600">
            Showing: {filteredApps.length} / {apps.length}
          </span>
        </div>
      </div>

      {/* Filter and Search Bar Card */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6 shadow-sm space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Text Search Input */}
          <div className="sm:col-span-2 lg:col-span-2 relative">
            <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1">
              Search Candidate
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search by name, email, qualification, city..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <svg
                className="w-4 h-4 text-gray-400 absolute left-2.5 top-2.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>

          {/* Job Role Filter */}
          <div>
            <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1">
              Job Role
            </label>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="w-full px-2.5 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="all">All Roles</option>
              {availableRoles.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </div>

          {/* Experience Filter */}
          <div>
            <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1">
              Experience
            </label>
            <select
              value={selectedExperience}
              onChange={(e) => setSelectedExperience(e.target.value)}
              className="w-full px-2.5 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="all">All Experience</option>
              <option value="fresher">Fresher (0 Years)</option>
              <option value="1-3">1 - 3 Years</option>
              <option value="3-5">3 - 5 Years</option>
              <option value="5+">5+ Years</option>
            </select>
          </div>

          {/* Applied Date Filter */}
          <div>
            <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1">
              Applied From
            </label>
            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Secondary Filter Row: Status & Reset */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-gray-100">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-gray-500 font-medium">Status:</span>
            {["all", "New", "Scheduled", "Selected", "Rejected"].map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setSelectedStatus(status)}
                className={`px-2.5 py-1 rounded-md text-xs transition-colors capitalize ${
                  selectedStatus === status
                    ? "bg-black text-white font-medium shadow-sm"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="text-xs text-rose-600 hover:text-rose-800 font-medium flex items-center gap-1"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Mobile / small-screen card list — below md */}
      <div className="md:hidden space-y-3">
        {filteredApps.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
            <EmptyState />
          </div>
        ) : (
          filteredApps.map((app) => {
            const qualification =
              app.qualification || app.qualifications || app.degree || "";
            const currentRound =
              app.interview?.round ||
              (app.status === "Round 1 Scheduled"
                ? 1
                : app.status === "Round 2 Scheduled"
                ? 2
                : app.status === "Round 3 Scheduled"
                ? 3
                : app.status === "Scheduled"
                ? 1
                : 0);
            const isExpanded = expandedRowId === app.id;

            return (
              <div
                key={app.id}
                className="bg-white border border-gray-200 rounded-xl shadow-sm p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    {qualification ? (
                      <span className="inline-block text-[11px] font-medium tracking-wide text-indigo-700 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded mb-1">
                        {qualification}
                      </span>
                    ) : (
                      <span className="inline-block text-[10px] text-gray-400 italic mb-1">
                        No qualification listed
                      </span>
                    )}
                    <div className="font-semibold text-gray-900 leading-tight truncate">
                      {app.candidateName}
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5 truncate">{app.email}</div>
                    <div className="text-xs text-gray-700 mt-1">{app.role}</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleRowExpand(app.id)}
                    className="p-1 rounded text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors shrink-0"
                    title="View details"
                  >
                    <svg
                      className={`w-4 h-4 transform transition-transform ${
                        isExpanded ? "rotate-180" : ""
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                </div>

                <div className="flex items-center justify-between gap-2 mt-3">
                  <span className="text-[11px] text-gray-500 font-mono">{app.appliedDate}</span>
                  {(app.resumeUrl || app.resumeLink) && (
                    <a
                      href={app.resumeUrl || app.resumeLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-800 font-medium underline"
                    >
                      View Resume
                    </a>
                  )}
                </div>

                <div className="mt-3">
                  <StatusBadge app={app} />
                  <InterviewDetails app={app} />
                </div>

                {isExpanded && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <DetailsGrid app={app} qualification={qualification} cols="grid-cols-2" />
                  </div>
                )}

                <div className="mt-3 pt-3 border-t border-gray-100">
                  <ActionButtons app={app} currentRound={currentRound} wrap />
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Applications Table — md and up */}
      <div className="hidden md:block bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm min-w-[880px]">
            <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-200">
              <tr>
                <th className="px-4 py-4 w-10"></th>
                <th className="px-6 py-4">Applicant</th>
                <th className="px-6 py-4">Applied Role</th>
                <th className="px-6 py-4">Resume</th>
                <th className="px-6 py-4">Applied Date</th>
                <th className="px-6 py-4">Status & Details</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredApps.length === 0 ? (
                <tr>
                  <td colSpan={7}>
                    <EmptyState />
                  </td>
                </tr>
              ) : (
                filteredApps.map((app) => {
                  const qualification =
                    app.qualification || app.qualifications || app.degree || "";
                  const currentRound =
                    app.interview?.round ||
                    (app.status === "Round 1 Scheduled"
                      ? 1
                      : app.status === "Round 2 Scheduled"
                      ? 2
                      : app.status === "Round 3 Scheduled"
                      ? 3
                      : app.status === "Scheduled"
                      ? 1
                      : 0);
                  const isExpanded = expandedRowId === app.id;

                  return (
                    <Fragment key={app.id}>
                      <tr className="hover:bg-gray-50/50 transition-colors">
                        {/* Accordion toggle button */}
                        <td className="pl-4 py-4 text-center">
                          <button
                            type="button"
                            onClick={() => toggleRowExpand(app.id)}
                            className="p-1 rounded text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                            title="View details"
                          >
                            <svg
                              className={`w-4 h-4 transform transition-transform ${
                                isExpanded ? "rotate-180" : ""
                              }`}
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 9l-7 7-7-7"
                              />
                            </svg>
                          </button>
                        </td>

                        {/* Applicant & Qualification Tag */}
                        <td className="px-6 py-4">
                          {qualification ? (
                            <span className="inline-block text-[11px] font-medium tracking-wide text-indigo-700 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded mb-1">
                              {qualification}
                            </span>
                          ) : (
                            <span className="inline-block text-[10px] text-gray-400 italic mb-1">
                              No qualification listed
                            </span>
                          )}
                          <div className="font-semibold text-gray-900 leading-tight">
                            {app.candidateName}
                          </div>
                          <div className="text-xs text-gray-500 mt-0.5">{app.email}</div>
                        </td>

                        <td className="px-6 py-4 text-gray-700">{app.role}</td>

                        {/* Resume Column */}
                        <td className="px-6 py-4">
                          {app.resumeUrl || app.resumeLink ? (
                            <a
                              href={app.resumeUrl || app.resumeLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-800 font-medium underline"
                            >
                              <svg
                                className="w-3.5 h-3.5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                />
                              </svg>
                              View Resume
                            </a>
                          ) : (
                            <span className="text-xs text-gray-400">N/A</span>
                          )}
                        </td>

                        <td className="px-6 py-4 text-gray-500 font-mono text-xs">
                          {app.appliedDate}
                        </td>

                        {/* Status Display */}
                        <td className="px-6 py-4">
                          <StatusBadge app={app} />
                          <InterviewDetails app={app} />
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4 text-right">
                          <ActionButtons app={app} currentRound={currentRound} />
                        </td>
                      </tr>

                      {/* Accordion Detail Row */}
                      {isExpanded && (
                        <tr className="bg-gray-50/70 border-b border-gray-100">
                          <td colSpan={7} className="px-8 py-3.5">
                            <DetailsGrid app={app} qualification={qualification} />
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Schedule Interview Modal */}
      {activeModalId && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl border border-gray-100 max-h-[90vh] overflow-y-auto">
            <h3 className="font-semibold text-gray-900 text-lg mb-1">
              Schedule Interview — Round {targetRound}
            </h3>
            <p className="text-xs text-gray-500 mb-5">
              Set interview timing and location or video coordinates for this round.
            </p>

            <form
              onSubmit={(e) => handleScheduleSubmit(e, activeModalId)}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">
                  Interview Mode
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setScheduleData({ ...scheduleData, mode: "Online" })}
                    className={`py-2 text-xs font-medium rounded-lg border text-center transition-colors ${
                      scheduleData.mode === "Online"
                        ? "border-black bg-black text-white"
                        : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    Online (Video Call)
                  </button>
                  <button
                    type="button"
                    onClick={() => setScheduleData({ ...scheduleData, mode: "Offline" })}
                    className={`py-2 text-xs font-medium rounded-lg border text-center transition-colors ${
                      scheduleData.mode === "Offline"
                        ? "border-black bg-black text-white"
                        : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    Offline (In-Person)
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Date & Time
                </label>
                <input
                  type="datetime-local"
                  required
                  value={scheduleData.dateTime}
                  onChange={(e) =>
                    setScheduleData({ ...scheduleData, dateTime: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  {scheduleData.mode === "Online"
                    ? "Meeting Link (Google Meet / Zoom)"
                    : "Office Venue / Floor"}
                </label>
                <input
                  type="text"
                  placeholder={
                    scheduleData.mode === "Online"
                      ? "https://meet.google.com/xyz-abcd-efg"
                      : "Axonite HQ, 4th Floor, Pune Office"
                  }
                  value={scheduleData.locationOrLink}
                  onChange={(e) =>
                    setScheduleData({
                      ...scheduleData,
                      locationOrLink: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveModalId(null)}
                  className="px-3 py-2 text-xs text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs bg-black text-white hover:bg-gray-800 rounded-lg font-medium transition-colors"
                >
                  Confirm Round {targetRound}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}