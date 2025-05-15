
import Modal from "react-modal";

// Modal styles
const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    borderRadius: "12px",
    padding: "24px",
    maxWidth: "400px",
    width: "100%",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
};

const ConfirmationModal = ({ isOpen, onClose, onConfirm, doctor, selectedDate, selectedTime, fee, currencySymbol }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      style={customStyles}
      contentLabel="Appointment Confirmation"
    >
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-4">Confirm Appointment</h2>
        <img
          src={doctor.image}
          alt={doctor.name}
          className="w-24 h-24 rounded-full mx-auto mb-4"
        />
        <p className="text-lg font-medium">{doctor.name}</p>
        <p className="text-sm text-gray-600">{doctor.degree} - {doctor.speciality}</p>
        <div className="mt-4 space-y-2">
          <p>📅 Date: {selectedDate}</p>
          <p>⏰ Time: {selectedTime}</p>
          <p>💰 Fee: {currencySymbol}{fee}</p>
        </div>
        <div className="flex justify-center gap-4 mt-6">
          <button
            onClick={onClose}
            className="bg-gray-300 text-gray-700 px-6 py-2 rounded-full hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="bg-primary text-white px-6 py-2 rounded-full hover:bg-primary-dark"
          >
            Confirm
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmationModal;
