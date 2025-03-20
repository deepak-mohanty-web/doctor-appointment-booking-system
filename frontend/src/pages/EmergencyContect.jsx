import React, { useState } from "react";
import { Search } from "lucide-react";

const EmergencyContact = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const emergencyContacts = [
    {
      icon: "🚑",
      title: "Ambulance Service",
      number: "102 / 108",
      phone: "102",
      category: "Medical",
      description:
        "For medical emergencies requiring immediate transportation to hospital",
    },
    {
      icon: "☎",
      title: "Emergency Medical Helpline",
      number: "112",
      phone: "112",
      category: "Medical",
      description: "National emergency response system for all emergencies",
    },
    {
      icon: "🏥",
      title: "Find Nearest Hospitals",
      number: "Search on Google Maps",
      link: "https://www.google.com/maps/search/hospitals+near+me/",
      category: "Medical",
      description:
        "Locate closest medical facilities based on your current location",
    },
    {
      icon: "🔥",
      title: "Fire Department",
      number: "101",
      phone: "101",
      category: "Emergency",
      description: "For fire emergencies and rescue operations",
    },
    {
      icon: "👮",
      title: "Police Helpline",
      number: "100",
      phone: "100",
      category: "Emergency",
      description: "For reporting crimes and emergency police assistance",
    },
    {
      icon: "🆘",
      title: "Disaster Management",
      number: "108",
      phone: "108",
      category: "Emergency",
      description: "For natural disasters and large-scale emergencies",
    },
    {
      icon: "🩺",
      title: "Poison Control & First Aid",
      number: "1-800-222-1222",
      phone: "18002221222",
      category: "Medical",
      description: "For poisoning emergencies and first aid guidance",
    },
    {
      icon: "💬",
      title: "Mental Health Helpline",
      number: "1800-599-0019",
      phone: "18005990019",
      category: "Support",
      description: "24/7 counseling and support for mental health concerns",
    },
    {
      icon: "🚺",
      title: "Women Helpline",
      number: "1091",
      phone: "1091",
      category: "Support",
      description: "For women facing harassment or in distress",
    },
    {
      icon: "👶",
      title: "Child Helpline",
      number: "1098",
      phone: "1098",
      category: "Support",
      description: "For reporting child abuse or children in need",
    },
    {
      icon: "🩸",
      title: "Blood Bank Helpline",
      number: "1910",
      phone: "1910",
      category: "Medical",
      description: "For urgent blood requirements and donation information",
    },
    {
      icon: "💊",
      title: "Drug Helpline",
      number: "1800-11-0031",
      phone: "18001100031",
      category: "Medical",
      description: "For information on medicines and adverse drug reactions",
    },
    {
      icon: "🚗",
      title: "Road Accident Emergency",
      number: "1073",
      phone: "1073",
      category: "Emergency",
      description:
        "For reporting road accidents and requesting emergency assistance",
    },
    {
      icon: "🦠",
      title: "COVID-19 Helpline",
      number: "1075",
      phone: "1075",
      category: "Medical",
      description: "For COVID-19 related queries and assistance",
    },
    {
      icon: "🧓",
      title: "Senior Citizen Helpline",
      number: "14567",
      phone: "14567",
      category: "Support",
      description: "For elderly citizens requiring assistance",
    },
    {
      icon: "📱",
      title: "Clinic Appointment Hotline",
      number: "1800-XXX-XXXX",
      phone: "1800XXXXXXX",
      category: "Clinic",
      description: "Direct line to our clinic for urgent appointment requests",
    },
    {
      icon: "👨‍⚕️",
      title: "Doctor On Call",
      number: "1800-XXX-YYYY",
      phone: "1800XXXYYY",
      category: "Clinic",
      description: "24/7 doctor consultation service for registered patients",
    },
  ];

  const categories = ["All", "Medical", "Emergency", "Support", "Clinic"];

  const filteredContacts = emergencyContacts.filter((contact) => {
    const matchesSearch =
      contact.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || contact.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-4xl mx-auto my-10 p-6 bg-white rounded-lg shadow-lg">
      <div className="bg-red-600 text-white p-4 rounded-t-lg mb-6">
        <h2 className="text-2xl font-bold text-center">
          Emergency Contact & Helpline
        </h2>
        <p className="text-center mt-2">
          In case of an emergency, contact the numbers below for immediate
          assistance
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search emergency contacts..."
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex-shrink-0">
          <select
            className="w-full md:w-auto px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      {filteredContacts.length === 0 ? (
        <div className="text-center p-6 bg-gray-100 rounded-lg">
          <p className="text-gray-600">
            No emergency contacts found matching your search.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredContacts.map((contact, index) => (
            <div
              key={index}
              className="flex items-start bg-gray-50 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow border-l-4 border-red-500"
            >
              <div className="bg-red-100 p-3 rounded-full mr-4">
                <span className="text-2xl">{contact.icon}</span>
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-medium text-gray-800">
                    {contact.title}
                  </h3>
                  <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded-full">
                    {contact.category}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  {contact.description}
                </p>
                <p className="text-gray-700 mt-2 font-semibold">
                  {contact.phone ? (
                    <a
                      href={`tel:${contact.phone}`}
                      className="text-blue-600 hover:text-blue-800 hover:underline flex items-center"
                    >
                      <span className="mr-1">📞</span> {contact.number}
                    </a>
                  ) : contact.link ? (
                    <a
                      href={contact.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 hover:underline flex items-center"
                    >
                      <span className="mr-1">🔗</span> {contact.number}
                    </a>
                  ) : (
                    contact.number
                  )}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h3 className="text-lg font-semibold text-blue-800 mb-2">
          Important Note
        </h3>
        <p className="text-blue-700">
          For life-threatening emergencies, always dial 102 or 112 immediately.
          Our clinic staff are available during business hours, but emergency
          services should be contacted first in critical situations.
        </p>
      </div>
    </div>
  );
};

export default EmergencyContact;
