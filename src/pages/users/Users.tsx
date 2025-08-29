import { useEffect } from "react";
import { Link } from "react-router";
import { useUserStore, type AppUser } from "../../store/useUserStore";

export default function Users() {
  const users = useUserStore((s) => s.users);
  const isLoading = useUserStore((s) => s.isLoading);
  const error = useUserStore((s) => s.error);
  const hasFetched = useUserStore((s) => s.hasFetched);
  const fetchUsers = useUserStore((s) => s.fetchUsers);

  useEffect(() => {
    if (!hasFetched) void fetchUsers();
  }, [hasFetched, fetchUsers]);

  return (
    <div className="p-4 w-full h-full flex-1">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold">Users</h1>
        <button
          className="rounded bg-blue-600 px-3 py-1.5 text-white disabled:opacity-60"
          disabled={isLoading}
          onClick={() => void fetchUsers()}
        >
          {isLoading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {error && <div className="mb-3 text-red-600">{error}</div>}

      <div className="overflow-x-auto">
        <table className="min-w-full border text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-3 py-2 text-left">Name</th>
              <th className="border px-3 py-2 text-left">Email</th>
              <th className="border px-3 py-2 text-left">Created</th>
              <th className="border px-3 py-2 text-left">Roles</th>
              <th className="border px-3 py-2 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {hasFetched && users.length === 0 && !isLoading ? (
              <tr>
                <td className="border px-3 py-2" colSpan={5}>
                  No users found.
                </td>
              </tr>
            ) : (
              users.map((u: AppUser) => (
                <tr key={u.id}>
                  <td className="border px-3 py-2">
                    {u.firstName || u.lastName
                      ? `${u.firstName ?? ""} ${u.lastName ?? ""}`.trim()
                      : "—"}
                  </td>
                  <td className="border px-3 py-2">{u.email ?? "—"}</td>
                  <td className="border px-3 py-2">
                    {u.createdAt ? new Date(u.createdAt).toLocaleString() : "—"}
                  </td>
                  <td className="border px-3 py-2">
                    {(u.roles ?? []).join(", ") || "—"}
                  </td>
                  <td className="border px-3 py-2">
                    <Link
                      className="text-blue-600 underline"
                      to={`/users/${u.id}`}
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

