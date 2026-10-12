import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getProviderServiceRequests,
  updateServiceRequestStatus,
} from "../../services/serviceRequestService";

function ServiceRequests() {
  const navigate = useNavigate();

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getProviderId = () => {
    const savedUser = localStorage.getItem("neighbourhub_user");

    if (!savedUser) {
      return null;
    }

    try {
      const user = JSON.parse(savedUser);
      return user?.id;
    } catch {
      return null;
    }
  };

  const loadRequests = async () => {
    try {
      setLoading(true);
      setError("");

      const providerId = getProviderId();

      if (!providerId) {
        throw new Error("Provider information not found. Please login again.");
      }

      const data = await getProviderServiceRequests(providerId);

      setRequests(data || []);
    } catch (err) {
      setError(err.message || "Unable to load requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const changeStatus = async (requestId, status) => {
    try {
      await updateServiceRequestStatus(requestId, status);
      await loadRequests();
    } catch (err) {
      alert(err.message || "Unable to update request");
    }
  };

  if (loading) {
    return (
      <div className="service-requests-page">
        <div className="requests-loading">
          Loading service requests...
        </div>
      </div>
    );
  }

  return (
    <div className="service-requests-page">
      <div className="requests-header">
        <div>
          <h1>Service Requests</h1>
          <p>Manage requests from your customers.</p>
        </div>

        <button
          className="back-button"
          onClick={() =>
            navigate("/service-provider/dashboard")
          }
        >
          Back to Dashboard
        </button>
      </div>

      {error && (
        <div className="requests-error">
          {error}
        </div>
      )}

      {requests.length === 0 ? (
        <div className="empty-requests">
          <div className="empty-icon">📋</div>

          <h2>No Service Requests</h2>

          <p>
            Customer service requests will appear here.
          </p>
        </div>
      ) : (
        <div className="requests-grid">
          {requests.map((request) => (
            <div
              className="request-card"
              key={request.id}
            >
              <div className="request-card-top">
                <div>
                  <span className="request-label">
                    Service
                  </span>

                  <h2>
                    {request.serviceName ||
                      "Service Request"}
                  </h2>
                </div>

                <span
                  className={`request-status ${request.status?.toLowerCase()}`}
                >
                  {request.status}
                </span>
              </div>

              <div className="request-details">
                <div className="detail-row">
                  <span>Customer</span>
                  <strong>
                    {request.customerName || "N/A"}
                  </strong>
                </div>

                <div className="detail-row">
                  <span>Phone</span>
                  <strong>
                    {request.customerPhone || "N/A"}
                  </strong>
                </div>

                <div className="detail-row">
                  <span>Address</span>
                  <strong>
                    {request.address || "N/A"}
                  </strong>
                </div>

                <div className="detail-row">
                  <span>Message</span>
                  <strong>
                    {request.message || "No message"}
                  </strong>
                </div>

                <div className="detail-row">
                  <span>Requested On</span>
                  <strong>
                    {request.createdAt
                      ? new Date(
                          request.createdAt
                        ).toLocaleString()
                      : "N/A"}
                  </strong>
                </div>
              </div>

              <div className="request-actions">
                {request.status === "PENDING" && (
                  <>
                    <button
                      className="accept-button"
                      onClick={() =>
                        changeStatus(
                          request.id,
                          "ACCEPTED"
                        )
                      }
                    >
                      Accept
                    </button>

                    <button
                      className="reject-button"
                      onClick={() =>
                        changeStatus(
                          request.id,
                          "REJECTED"
                        )
                      }
                    >
                      Reject
                    </button>
                  </>
                )}

                {request.status === "ACCEPTED" && (
                  <button
                    className="complete-button"
                    onClick={() =>
                      changeStatus(
                        request.id,
                        "COMPLETED"
                      )
                    }
                  >
                    Mark Completed
                  </button>
                )}

                {request.status === "REJECTED" && (
                  <span className="final-status">
                    Request rejected
                  </span>
                )}

                {request.status === "COMPLETED" && (
                  <span className="final-status">
                    Service completed
                  </span>
                )}

                {request.status === "CANCELLED" && (
                  <span className="final-status">
                    Request cancelled
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ServiceRequests;