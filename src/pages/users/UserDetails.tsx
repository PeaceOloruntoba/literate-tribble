import { useEffect, useRef } from "react";
import { Link, useParams } from "react-router";
import { useUserStore } from "../../store/useUserStore";

export default function UserDetails() {
  const { userId } = useParams<{ userId: string }>();
  const selectedUser = useUserStore((s) => s.selectedUser);
  const isLoading = useUserStore((s) => s.isLoading);
  const error = useUserStore((s) => s.error);
  const fetchUserById = useUserStore((s) => s.fetchUserById);
  const clearSelected = useUserStore((s) => s.clearSelected);

  // React 19 dev can mount effects twice; gate to avoid duplicate fetch
  const didFetchRef = useRef(false);

  useEffect(() => {
    if (!didFetchRef.current && userId) {
      didFetchRef.current = true;
      void fetchUserById(userId);
    }
    return () => clearSelected();
  }, [userId, fetchUserById, clearSelected]);

  return (
    <div className="p-4">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold">User Details</h1>
        <Link to="/users" className="text-blue-600 underline">
          Back to users
        </Link>
      </div>

      {isLoading && <div>Loading...</div>}
      {error && <div className="text-red-600">{error}</div>}

      {!isLoading && !error && selectedUser && (
        <div className="grid gap-2">
          <div>
            <span className="font-medium">ID:</span> {selectedUser.id}
          </div>
          <div>
            <span className="font-medium">Email:</span>{" "}
            {selectedUser.email ?? "—"}
          </div>
          <div>
            <span className="font-medium">Name:</span>{" "}
            {selectedUser.firstName || selectedUser.lastName
              ? `${selectedUser.firstName ?? ""} ${
                  selectedUser.lastName ?? ""
                }`.trim()
              : "—"}
          </div>
          <div>
            <span className="font-medium">Business:</span>{" "}
            {selectedUser.businessName ?? "—"}
          </div>
          <div>
            <span className="font-medium">Business Type:</span>{" "}
            {Array.isArray(selectedUser.businessType)
              ? selectedUser.businessType.join(", ")
              : selectedUser.businessType ?? "—"}
          </div>
          <div>
            <span className="font-medium">Plan:</span>{" "}
            {selectedUser.plan ?? "—"}
          </div>
          <div>
            <span className="font-medium">Subscription Active:</span>{" "}
            {selectedUser.isSubActive ? "Yes" : "No"}
          </div>
          <div>
            <span className="font-medium">Email Verified:</span>{" "}
            {selectedUser.isEmailVerified ? "Yes" : "No"}
          </div>
          <div>
            <span className="font-medium">Roles:</span>{" "}
            {(selectedUser.roles ?? []).join(", ") || "—"}
          </div>
          <div>
            <span className="font-medium">Created:</span>{" "}
            {selectedUser.createdAt
              ? new Date(selectedUser.createdAt).toLocaleString()
              : "—"}
          </div>
          <div>
            <span className="font-medium">Updated:</span>{" "}
            {selectedUser.updatedAt
              ? new Date(selectedUser.updatedAt).toLocaleString()
              : "—"}
          </div>
        </div>
      )}
    </div>
  );
}
