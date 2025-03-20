import { useContext, useState, useEffect } from "react";
import { AdminContext } from "../../context/AdminContext";
import { AppContext } from "../../context/AppContext";
import { assets } from "../../assets/assets";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

function AllAppointments() {
  const { aToken, appointments, getAllAppointments, cancleAppointment } =
    useContext(AdminContext);
  const { calculateAge, slotDateFormat } = useContext(AppContext);

  // State for filtering, pagination, and modal
  const [filter, setFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New state for cancel confirmation popup
  const [showCancelPopup, setShowCancelPopup] = useState(false);
  const [appointmentToCancel, setAppointmentToCancel] = useState(null);

  useEffect(() => {
    if (aToken) {
      getAllAppointments();
    }
  }, [aToken, getAllAppointments]);

  // Filter appointments based on status
  const filteredAppointments = appointments.filter((appointment) => {
    if (filter === "all") return true;
    if (filter === "completed") return appointment.completed;
    if (filter === "pending")
      return !appointment.completed && !appointment.cancelled;
    if (filter === "cancelled") return appointment.cancelled;
    return true;
  });

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentAppointments = [...filteredAppointments]
    .reverse()
    .slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredAppointments.length / itemsPerPage);

  // Handle page changes
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Open appointment details modal
  const openAppointmentDetails = (appointment) => {
    setSelectedAppointment(appointment);
    setIsModalOpen(true);
  };

  // Close appointment details modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedAppointment(null);
  };

  // Show cancel confirmation popup
  const showCancelConfirmation = (appointmentId, e) => {
    if (e) e.stopPropagation(); // Prevent opening modal when clicking cancel
    setAppointmentToCancel(appointmentId);
    setShowCancelPopup(true);
  };

  // Handle cancel confirmation
  const handleCancelConfirm = () => {
    cancleAppointment(appointmentToCancel);
    setShowCancelPopup(false);
    setAppointmentToCancel(null);
    // Close details modal if cancellation was initiated from there
    if (
      isModalOpen &&
      selectedAppointment &&
      selectedAppointment._id === appointmentToCancel
    ) {
      closeModal();
    }
  };

  // Close cancel confirmation popup
  const closeCancelPopup = () => {
    setShowCancelPopup(false);
    setAppointmentToCancel(null);
  };

  // Export data as CSV
  const exportToCSV = () => {
    const headers = [
      "Patient Name",
      "Age",
      "Date & Time",
      "Doctor",
      "Fee",
      "Status",
    ];

    const data = filteredAppointments.map((item) => [
      item.userData.name,
      calculateAge(item.userData.dob),
      `${slotDateFormat(item.slotDate)}, ${item.slotTime}`,
      item.docData.name,
      `$${item.amount}`,
      item.cancelled ? "Cancelled" : item.completed ? "Completed" : "Pending",
    ]);

    const csvContent = [
      headers.join(","),
      ...data.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `appointments_${new Date().toISOString().split("T")[0]}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export data as PDF
  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text("Appointment Report", 14, 10);

    const tableData = filteredAppointments.map((item, index) => [
      index + 1,
      item.docData.name,
      item.docData.speciality,
      item.slotDate,
      item.slotTime,
      item.docData.available,
    ]);

    autoTable(doc, {
      head: [["S.No", "Doctor Name", "Speciality", "Date", "Time", "Status"]],
      body: tableData,
    });

    doc.save("Appointment_Report.pdf");
  };

  return (
    <div className="w-full max-w-6xl m-5">
      <div className="flex justify-between items-center mb-4">
        <p className="text-lg font-semibold">All Appointments</p>
        <div className="flex items-center gap-4">
          {/* Filters */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Filter:</span>
            <select
              className="border rounded px-2 py-1 text-sm"
              value={filter}
              onChange={(e) => {
                setFilter(e.target.value);
                setCurrentPage(1); // Reset to first page when filter changes
              }}
            >
              <option value="all">All</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {/* Export buttons */}
          <div className="flex gap-2">
            <button
              onClick={exportToCSV}
              className="bg-green-500 text-white px-3 py-1 rounded text-sm flex items-center gap-1"
            >
              <span>CSV</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
            </button>
            <button
              onClick={downloadPDF}
              className="bg-red-500 text-white px-3 py-1 rounded text-sm flex items-center gap-1"
            >
              <span>PDF</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white border rounded max-h-[80vh] min-h-[60vh] overflow-y-auto">
        <div className="hidden sm:grid grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] py-3 px-6 border-b">
          <p>#</p>
          <p>Patient</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Doctor</p>
          <p>Fee</p>
          <p>Action</p>
        </div>

        {currentAppointments.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            No appointments found matching the selected filter.
          </div>
        ) : (
          currentAppointments.map((item, index) => (
            <div
              key={index}
              className="flex flex-wrap justify-between gap-2 max-sm:grid-2 sm:grid sm:grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] items-center text-gary-500 py-3 px-6 border-b hover:bg-gray-50 cursor-pointer"
              onClick={() => openAppointmentDetails(item)}
            >
              <p className="max-sm:hidden">{indexOfFirstItem + index + 1}</p>
              <div className="flex items-center gap-2">
                <img
                  className="w-8 h-8 rounded-full object-cover"
                  src={item.userData.image}
                  alt=""
                />
                <p>{item.userData.name}</p>
              </div>
              <p className="max-sm:hidden">{calculateAge(item.userData.dob)}</p>
              <p>
                {slotDateFormat(item.slotDate)}, {item.slotTime}
              </p>
              <div className="flex items-center gap-2">
                <img
                  src={item.docData.image}
                  alt=""
                  className="w-8 h-8 rounded-full bg-gray-200 object-cover"
                />
                <p>{item.docData.name}</p>
              </div>
              <p>${item.amount}</p>
              <div className="flex items-center gap-2">
                {item.cancelled ? (
                  <span className="text-red-400 text-xs font-medium px-2 py-1 bg-red-50 rounded">
                    Cancelled
                  </span>
                ) : item.completed ? (
                  <span className="text-green-500 text-xs font-medium px-2 py-1 bg-green-50 rounded">
                    Completed
                  </span>
                ) : (
                  <span className="text-yellow-500 text-xs font-medium px-2 py-1 bg-yellow-50 rounded">
                    Pending
                  </span>
                )}
                {!item.cancelled && !item.completed && (
                  <img
                    onClick={(e) => showCancelConfirmation(item._id, e)}
                    className="w-6 h-6 cursor-pointer"
                    src={assets.cancel_icon}
                    alt="Cancel"
                  />
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-4">
          <nav className="flex items-center gap-1">
            <button
              onClick={() => paginate(currentPage > 1 ? currentPage - 1 : 1)}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded ${
                currentPage === 1
                  ? "bg-gray-200 text-gray-500"
                  : "bg-gray-300 text-gray-700 hover:bg-gray-400"
              }`}
            >
              &lt;
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map(
              (number) => (
                <button
                  key={number}
                  onClick={() => paginate(number)}
                  className={`px-3 py-1 rounded ${
                    currentPage === number
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {number}
                </button>
              )
            )}

            <button
              onClick={() =>
                paginate(
                  currentPage < totalPages ? currentPage + 1 : totalPages
                )
              }
              disabled={currentPage === totalPages}
              className={`px-3 py-1 rounded ${
                currentPage === totalPages
                  ? "bg-gray-200 text-gray-500"
                  : "bg-gray-300 text-gray-700 hover:bg-gray-400"
              }`}
            >
              &gt;
            </button>
          </nav>
        </div>
      )}

      {/* Appointment Details Modal */}
      {isModalOpen && selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Appointment Details</h2>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Patient Information */}
              <div className="bg-gray-50 p-4 rounded">
                <h3 className="font-medium mb-2 text-gray-700">
                  Patient Information
                </h3>
                <div className="flex items-center gap-3 mb-3">
                  <img
                    src={selectedAppointment.userData.image}
                    alt="Patient"
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-medium">
                      {selectedAppointment.userData.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      Age: {calculateAge(selectedAppointment.userData.dob)}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <p className="text-gray-500">Email:</p>
                  <p>{selectedAppointment.userData.email}</p>
                  <p className="text-gray-500">Phone:</p>
                  <p>{selectedAppointment.userData.phone || "Not provided"}</p>
                  <p className="text-gray-500">Gender:</p>
                  <p>{selectedAppointment.userData.gender || "Not provided"}</p>
                </div>
              </div>

              {/* Doctor Information */}
              <div className="bg-gray-50 p-4 rounded">
                <h3 className="font-medium mb-2 text-gray-700">
                  Doctor Information
                </h3>
                <div className="flex items-center gap-3 mb-3">
                  <img
                    src={selectedAppointment.docData.image}
                    alt="Doctor"
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-medium">
                      {selectedAppointment.docData.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {selectedAppointment.docData.speciality}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <p className="text-gray-500">Degree:</p>
                  <p>{selectedAppointment.docData.degree}</p>
                  <p className="text-gray-500">Experience:</p>
                  <p>{selectedAppointment.docData.experience} years</p>
                </div>
              </div>

              {/* Appointment Details */}
              <div className="bg-gray-50 p-4 rounded col-span-1 md:col-span-2">
                <h3 className="font-medium mb-2 text-gray-700">
                  Appointment Details
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Date</p>
                    <p className="font-medium">
                      {slotDateFormat(selectedAppointment.slotDate)}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Time</p>
                    <p className="font-medium">
                      {selectedAppointment.slotTime}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Fee</p>
                    <p className="font-medium">${selectedAppointment.amount}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Status</p>
                    <p
                      className={`font-medium ${
                        selectedAppointment.cancelled
                          ? "text-red-500"
                          : selectedAppointment.completed
                          ? "text-green-500"
                          : "text-yellow-500"
                      }`}
                    >
                      {selectedAppointment.cancelled
                        ? "Cancelled"
                        : selectedAppointment.completed
                        ? "Completed"
                        : "Pending"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Patient History */}
              <div className="bg-gray-50 p-4 rounded col-span-1 md:col-span-2">
                <h3 className="font-medium mb-2 text-gray-700">
                  Patient History
                </h3>
                {selectedAppointment.userData.medicalHistory ? (
                  <div className="text-sm">
                    <p className="mb-2">
                      {selectedAppointment.userData.medicalHistory}
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">
                    No medical history available
                  </p>
                )}

                {/* Previous Appointments */}
                <h4 className="font-medium mt-4 mb-2 text-gray-700">
                  Previous Appointments
                </h4>
                {appointments.filter(
                  (app) =>
                    app.userData._id === selectedAppointment.userData._id &&
                    app._id !== selectedAppointment._id
                ).length > 0 ? (
                  <div className="max-h-40 overflow-y-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-left text-gray-500 border-b">
                          <th className="pb-1">Date</th>
                          <th className="pb-1">Doctor</th>
                          <th className="pb-1">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {appointments
                          .filter(
                            (app) =>
                              app.userData._id ===
                                selectedAppointment.userData._id &&
                              app._id !== selectedAppointment._id
                          )
                          .map((app, idx) => (
                            <tr key={idx} className="border-b last:border-b-0">
                              <td className="py-1">
                                {slotDateFormat(app.slotDate)}
                              </td>
                              <td className="py-1">{app.docData.name}</td>
                              <td className="py-1">
                                <span
                                  className={`px-2 py-0.5 rounded-full text-xs ${
                                    app.cancelled
                                      ? "bg-red-100 text-red-500"
                                      : app.completed
                                      ? "bg-green-100 text-green-500"
                                      : "bg-yellow-100 text-yellow-500"
                                  }`}
                                >
                                  {app.cancelled
                                    ? "Cancelled"
                                    : app.completed
                                    ? "Completed"
                                    : "Pending"}
                                </span>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">
                    No previous appointments
                  </p>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 mt-6">
              {!selectedAppointment.cancelled &&
                !selectedAppointment.completed && (
                  <button
                    onClick={() =>
                      showCancelConfirmation(selectedAppointment._id)
                    }
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Cancel Appointment
                  </button>
                )}
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Confirmation Popup */}
      {showCancelPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="text-center mb-6">
              <div className="mx-auto w-12 h-12 flex items-center justify-center rounded-full bg-red-100 mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-red-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900">
                Cancel Appointment
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                Are you sure you want to cancel this appointment? This action
                cannot be undone.
              </p>
            </div>
            <div className="flex justify-center gap-3">
              <button
                onClick={closeCancelPopup}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
              >
                No, Keep it
              </button>
              <button
                onClick={handleCancelConfirm}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AllAppointments;
