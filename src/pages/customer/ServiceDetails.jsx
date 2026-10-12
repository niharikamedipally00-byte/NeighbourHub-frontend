import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { createServiceRequest } from "../../services/serviceRequestService";

const services = {
  "ravi-plumbing": {
    id: 1,
    name: "Ravi Plumbing Services",
    category: "Plumbing",
    rating: "4.7",
    reviews: 128,
    distance: "0.9 km",
    status: "Available today",
    phone: "+91 98765 43210",
    address: "Main Road, Hyderabad",
    description:
      "Professional plumbing services for homes and small businesses. Available for regular repairs as well as urgent plumbing problems.",
    experience: "8+ years",
    services: [
      {
        name: "General Plumbing Repair",
        price: 300,
        duration: "1 hour",
      },
      {
        name: "Tap & Faucet Repair",
        price: 250,
        duration: "45 min",
      },
      {
        name: "Pipe Leakage Repair",
        price: 500,
        duration: "1–2 hours",
      },
      {
        name: "Emergency Plumbing",
        price: 700,
        duration: "1 hour",
      },
    ],
  },

  "powerfix-electricals": {
    id: 1,
    name: "PowerFix Electricals",
    category: "Electrical",
    rating: "4.8",
    reviews: 96,
    distance: "1.1 km",
    status: "Available today",
    phone: "+91 91234 56789",
    address: "Market Road, Hyderabad",
    description:
      "Reliable electrical installation, repair and maintenance services for residential and commercial requirements.",
    experience: "6+ years",
    services: [
      {
        name: "Electrical Repair",
        price: 300,
        duration: "1 hour",
      },
      {
        name: "Switch & Socket Repair",
        price: 200,
        duration: "30 min",
      },
      {
        name: "Fan Installation",
        price: 400,
        duration: "1 hour",
      },
      {
        name: "Emergency Electrical Service",
        price: 600,
        duration: "1 hour",
      },
    ],
  },

  "style-studio": {
    id: 1,
    name: "Style Studio",
    category: "Salon",
    rating: "4.6",
    reviews: 154,
    distance: "1.4 km",
    status: "Available today",
    phone: "+91 99887 66554",
    address: "Lake View Road, Hyderabad",
    description:
      "Professional grooming and beauty services with experienced stylists for everyday and special occasions.",
    experience: "5+ years",
    services: [
      {
        name: "Haircut",
        price: 250,
        duration: "30 min",
      },
      {
        name: "Hair Styling",
        price: 500,
        duration: "45 min",
      },
      {
        name: "Beard Grooming",
        price: 180,
        duration: "20 min",
      },
      {
        name: "Hair & Beard Combo",
        price: 400,
        duration: "50 min",
      },
    ],
  },
};

function ServiceDetails() {
  const { serviceId } = useParams();
  const navigate = useNavigate();

  const [saved, setSaved] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [requesting, setRequesting] = useState(false);

  const service = services[serviceId];

  const getCurrentUser = () => {
    const savedUser = localStorage.getItem("neighbourhub_user");

    if (!savedUser) {
      return null;
    }

    try {
      return JSON.parse(savedUser);
    } catch {
      return null;
    }
  };

  const handleRequestService = async () => {
    try {
      const user = getCurrentUser();

      if (!user?.id) {
        alert("Please login to request a service.");
        navigate("/login");
        return;
      }

      if (!selectedService) {
        alert("Please select a service first.");
        return;
      }

      const selected = service.services.find(
        (item) => item.name === selectedService
      );

      if (!selected) {
        alert("Please select a valid service.");
        return;
      }

      setRequesting(true);

      const requestData = {
        serviceId: service.id,
        customerId: user.id,
        customerName: user.name || "Customer",
        customerPhone: user.phone || "",
        message: `Requested service: ${selected.name}. Estimated price: ₹${selected.price}.`,
        address: user.address || "Hyderabad",
      };

      await createServiceRequest(requestData);

      alert("Service request sent successfully!");

      navigate("/customer/dashboard");
    } catch (error) {
      alert(
        error.message ||
          "Unable to send service request. Please try again."
      );
    } finally {
      setRequesting(false);
    }
  };

  if (!service) {
    return (
      <div className="not-found-page">
        <h1>Service not found</h1>

        <p>
          The service provider you're looking for
          doesn't exist.
        </p>

        <button
          onClick={() => navigate("/explore")}
        >
          Back to Explore
        </button>
      </div>
    );
  }

  return (
    <div className="service-details-page">

      <button
        className="back-button"
        onClick={() => navigate("/explore")}
      >
        ← Back to Explore
      </button>

      <section className="service-details-header">

        <div className="service-provider-avatar">
          {service.name.charAt(0)}
        </div>

        <div className="service-details-info">

          <span className="category">
            {service.category}
          </span>

          <h1>{service.name}</h1>

          <p className="service-description">
            {service.description}
          </p>

          <div className="service-details-meta">

            <span>
              Rating {service.rating}
            </span>

            <span>
              {service.reviews} reviews
            </span>

            <span>
              {service.distance}
            </span>

            <span className="available-status">
              {service.status}
            </span>

          </div>

          <div className="service-contact">

            <span>
              {service.address}
            </span>

            <span>
              {service.phone}
            </span>

            <span>
              {service.experience} experience
            </span>

          </div>

          <div className="service-actions">

            <button
              className="primary-button"
              onClick={handleRequestService}
              disabled={requesting}
            >
              {requesting
                ? "Sending Request..."
                : "Request Service"}
            </button>

            <button
              className="secondary-button"
              onClick={() =>
                setSaved(!saved)
              }
            >
              {saved
                ? "Saved"
                : "Save Provider"}
            </button>

          </div>

        </div>

      </section>

      <section className="services-offered-section">

        <div className="section-heading">

          <div>
            <h2>
              Services offered
            </h2>

            <p>
              Select a service to view pricing
              and duration.
            </p>
          </div>

          {selectedService && (
            <div className="selected-service">
              Selected: {selectedService}
            </div>
          )}

        </div>

        <div className="service-offerings-grid">

          {service.services.map(
            (item) => (
              <div
                className="service-offering-card"
                key={item.name}
              >

                <div className="service-offering-content">

                  <span className="service-category-label">
                    {service.category}
                  </span>

                  <h3>
                    {item.name}
                  </h3>

                  <p>
                    Estimated duration:{" "}
                    {item.duration}
                  </p>

                </div>

                <div className="service-offering-footer">

                  <strong>
                    ₹{item.price}
                  </strong>

                  <button
                    onClick={() =>
                      setSelectedService(
                        item.name
                      )
                    }
                  >
                    {selectedService === item.name
                      ? "Selected"
                      : "Select"}
                  </button>

                </div>

              </div>
            )
          )}

        </div>

      </section>

      <section className="provider-information">

        <div className="section-heading">

          <div>
            <h2>
              About the provider
            </h2>

            <p>
              Information about this local
              service provider.
            </p>
          </div>

        </div>

        <div className="provider-info-grid">

          <div className="provider-info-card">
            <span>Experience</span>
            <strong>
              {service.experience}
            </strong>
          </div>

          <div className="provider-info-card">
            <span>Customer rating</span>
            <strong>
              {service.rating}/5
            </strong>
          </div>

          <div className="provider-info-card">
            <span>Reviews</span>
            <strong>
              {service.reviews}
            </strong>
          </div>

          <div className="provider-info-card">
            <span>Service area</span>
            <strong>
              {service.distance}
            </strong>
          </div>

        </div>

      </section>

    </div>
  );
}

export default ServiceDetails;