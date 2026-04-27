const recentCommutes = [
  {
    name: "Kim Minjun",
    status: "Checked in",
    time: "08:42",
    location: "Engineering Hall",
  },
  {
    name: "Lee Seoyeon",
    status: "On route",
    time: "08:55",
    location: "Main Gate",
  },
  {
    name: "Park Jiho",
    status: "Late",
    time: "09:12",
    location: "Student Center",
  },
];

export function RecentCommuteTable() {
  return (
    <section className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
      <div className="border-b border-gray-200 px-5 py-4">
        <h2 className="text-base font-bold text-gray-950">Recent Commutes</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase">
            <tr>
              <th className="px-5 py-3">Name</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3">Time</th>
              <th className="px-5 py-3">Location</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {recentCommutes.map((commute) => (
              <tr key={commute.name}>
                <td className="px-5 py-4 font-semibold text-gray-950">
                  {commute.name}
                </td>
                <td className="px-5 py-4 text-gray-600">{commute.status}</td>
                <td className="px-5 py-4 text-gray-600">{commute.time}</td>
                <td className="px-5 py-4 text-gray-600">{commute.location}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
