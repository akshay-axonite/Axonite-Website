import { useState } from "react";
import { getApplications, updateApplicationStatus } from "../../lib/store";

export default function ApplicationsManager() {
  const [apps, setApps] = useState(() => getApplications());
  const [activeModalId, setActiveModalId] = useState(null);

  // Form state for scheduling
  const [scheduleData, setScheduleData] = useState({
    dateTime: "",
    mode: "Online", // "Online" | "Offline"
    locationOrLink: "",
  });

  const handleStatusChange = (id, newStatus) => {
    const updated = updateApplicationStatus(id, newStatus, null);
    setApps(updated);
  };

  const handleOpenScheduleModal = (app) => {
    setActiveModalId(app.id);
    setScheduleData({
      dateTime: app.interview?.dateTime || "",
      mode: app.interview?.mode || "Online",
      locationOrLink: app.interview?.locationOrLink || "",
    });
  };

  const handleScheduleSubmit = (e, id) => {
    e.preventDefault();
    if (!scheduleData.dateTime) return;

    const updated = updateApplicationStatus(id, "Scheduled", {
      dateTime: scheduleData.dateTime,
      mode: scheduleData.mode,
      locationOrLink: scheduleData.locationOrLink,
    });

    setApps(updated);
    setActiveModalId(null);
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Career Applications</h1>
          <p className="text-sm text-gray-500 mt-1">
            Review candidates, schedule online or in-person interviews, and track application states.
          </p>
        </div>
        <span className="text-xs font-mono bg-gray-100 px-3 py-1.5 rounded-full text-gray-600">
          Total: {apps.length}
        </span>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-200">
            <tr>
              <th className="px-6 py-4">Applicant</th>
              <th className="px-6 py-4">Applied Role</th>
              <th className="px-6 py-4">Applied Date</th>
              <th className="px-6 py-4">Status & Details</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {apps.map((app) => (
              <tr key={app.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-semibold text-gray-900">{app.candidateName}</div>
                  <div className="text-xs text-gray-500">{app.email}</div>
                </td>
                <td className="px-6 py-4 text-gray-700">{app.role}</td>
                <td className="px-6 py-4 text-gray-500 font-mono text-xs">{app.appliedDate}</td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-block px-2.5 py-0.5 text-xs rounded-full font-medium ${
                      app.status === "Scheduled"
                        ? "bg-blue-50 text-blue-700 border border-blue-200"
                        : app.status === "Selected"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : app.status === "Rejected"
                        ? "bg-rose-50 text-rose-700 border border-rose-200"
                        : "bg-amber-50 text-amber-700 border border-amber-200"
                    }`}
                  >
                    {app.status}
                  </span>

                  {app.status === "Scheduled" && app.interview && (
                    <div className="mt-2 space-y-1 text-xs text-gray-600 bg-gray-50 p-2.5 rounded border border-gray-100 max-w-xs">
                      <div className="flex items-center gap-1.5 font-medium text-gray-800">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                        <span>{app.interview.mode} Interview</span>
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
                  )}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="inline-flex items-center gap-2">
                    <button
                      onClick={() => handleStatusChange(app.id, "Selected")}
                      className="px-2.5 py-1 text-xs font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded border border-emerald-200 transition-colors"
                    >
                      Select
                    </button>

                    <button
                      onClick={() => handleOpenScheduleModal(app)}
                      className="px-2.5 py-1 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded border border-blue-200 transition-colors"
                    >
                      Schedule
                    </button>

                    <button
                      onClick={() => handleStatusChange(app.id, "Rejected")}
                      className="px-2.5 py-1 text-xs font-medium text-rose-700 bg-rose-50 hover:bg-rose-100 rounded border border-rose-200 transition-colors"
                    >
                      Reject
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Schedule Interview Modal */}
      {activeModalId && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl border border-gray-100">
            <h3 className="font-semibold text-gray-900 text-lg mb-1">Schedule Interview</h3>
            <p className="text-xs text-gray-500 mb-5">
              Set interview timing and location or meeting coordinates for the candidate.
            </p>

            <form onSubmit={(e) => handleScheduleSubmit(e, activeModalId)} className="space-y-4">
              {/* Interview Mode Selector */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">Interview Mode</label>
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

              {/* Date & Time Picker */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Date & Time</label>
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

              {/* Conditional Location / Link input */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  {scheduleData.mode === "Online" ? "Meeting Link (Google Meet / Zoom)" : "Office Venue / Floor"}
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
                    setScheduleData({ ...scheduleData, locationOrLink: e.target.value })
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
                  Save Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}