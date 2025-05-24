import React, { useEffect, useState } from "react";
import ServiceCard from "./ServiceCard";
import { BASE_URL } from "../../config";

const ServiceList = () => {
  const [services, setServices] = useState([]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch(`${BASE_URL}/services`);
        if (!res.ok) {
          throw new Error(`Failed to fetch services: ${res.statusText}`);
        }
        const data = await res.json();
        setServices(data);
      } catch (err) {
        console.error("Failed to fetch services:", err);
      }
    };

    fetchServices();
  }, []);

  return (
    <section className="flex justify-center items-center min-h-[50vh]">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((items, index) => (
            <ServiceCard key={items.id || index} items={items} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServiceList;
