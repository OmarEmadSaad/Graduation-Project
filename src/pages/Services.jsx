import React, { useEffect, useState } from "react";
import ServiceCard from "../Components/Services/ServiceCard";
import { service_URL } from "../config";

function Services() {
  const [services, setServices] = useState([]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch(`${service_URL}`);
        const data = await res.json();
        setServices(data);
      } catch (error) {
        console.error("Faild to fetch data:", error);
      }
    };

    fetchServices();
  }, []);

  return (
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-1">
        {services.map((items, index) => (
          <ServiceCard index={index} key={items.id || index} items={items} />
        ))}
      </div>
    </div>
  );
}

export default Services;
