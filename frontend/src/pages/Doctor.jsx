import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { useContext, useEffect, useState, useCallback, useRef } from "react";

function Doctor() {
  const { speciality } = useParams();
  const { doctors } = useContext(AppContext);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("name");
  const [currentPage, setCurrentPage] = useState(1);
  const [favorites, setFavorites] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const searchTimeoutRef = useRef(null);
  const navigate = useNavigate();

  // Doctors per page for pagination
  const doctorsPerPage = 6;

  // Load favorites from local storage on component mount
  useEffect(() => {
    const savedFavorites = localStorage.getItem("favoriteDoctors");
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  // Save favorites to local storage whenever they change
  useEffect(() => {
    localStorage.setItem("favoriteDoctors", JSON.stringify(favorites));
  }, [favorites]);

  const applyFilter = useCallback(() => {
    let result = [...doctors];

    // Specialty filter
    if (speciality) {
      result = result.filter((item) => item.speciality === speciality);
    }

    // Search filter
    if (searchTerm) {
      result = result.filter(
        (item) =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.speciality.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sorting
    result.sort((a, b) => {
      switch (sortOption) {
        case "name":
          return a.name.localeCompare(b.name);
        case "availability":
          return b.available - a.available;
        case "experience":
          return (b.experience || 0) - (a.experience || 0);
        default:
          return 0;
      }
    });

    setFilteredDoctors(result);
  }, [doctors, speciality, searchTerm, sortOption]);

  // Debounced search input handler
  const handleSearchChange = (e) => {
    const value = e.target.value;

    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Set new timeout
    searchTimeoutRef.current = setTimeout(() => {
      setSearchTerm(value);
    }, 300); // 300ms delay
  };

  useEffect(() => {
    applyFilter();
  }, [applyFilter]);

  // Pagination calculation
  const indexOfLastDoctor = currentPage * doctorsPerPage;
  const indexOfFirstDoctor = indexOfLastDoctor - doctorsPerPage;
  const currentDoctors = filteredDoctors.slice(
    indexOfFirstDoctor,
    indexOfLastDoctor
  );

  // Pagination handler
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Favorites management
  const toggleFavorite = (doctorId) => {
    setFavorites((prev) =>
      prev.includes(doctorId)
        ? prev.filter((id) => id !== doctorId)
        : [...prev, doctorId]
    );
  };

  // Open doctor detail modal
  const openDoctorModal = (doctor) => {
    setSelectedDoctor(doctor);
  };

  // Close doctor detail modal
  const closeDoctorModal = () => {
    setSelectedDoctor(null);
  };

  return (
    <div>
      {/* Search and Sort Controls */}
      <div className="mb-4 flex space-x-2">
        <input
          type="text"
          placeholder="Search doctors"
          onChange={handleSearchChange}
          className="border p-2 rounded flex-grow"
        />
        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="name">Sort by Name</option>
          <option value="availability">Sort by Availability</option>
          <option value="experience">Sort by Experience</option>
        </select>
      </div>

      <p className="text-gray-600">Browse through the doctors speciality.</p>
      <div className="flex flex-col items-start gap-5 mt-5 sm:flex-row">
        <div className="flex-col gap-4 flex text-sm text-gray-600">
          {[
            "General physician",
            "Gynecologist",
            "Dermatologist",
            "Pediatricians",
            "Neurologist",
            "Gastroenterologist",
          ].map((spec) => (
            <p
              key={spec}
              onClick={() =>
                speciality == spec
                  ? navigate("/doctors")
                  : navigate(`/doctors/${spec}`)
              }
              className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${
                speciality === spec ? "bg-indigo-100 text-black" : ""
              }`}
            >
              {spec}
            </p>
          ))}
        </div>
        <div className="w-full grid grid-cols-auto gap-4 gap-y-6">
          {currentDoctors.map((item, index) => (
            <div
              key={index}
              className="border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500 relative group"
            >
              {/* Favorite Button with Tooltip */}
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(item._id);
                  }}
                  className={`absolute top-2 right-2 z-10 ${
                    favorites.includes(item._id)
                      ? "text-red-500"
                      : "text-gray-300"
                  } hover:scale-110 transition`}
                >
                  ♥
                </button>
                <div className="absolute top-10 right-2 hidden group-hover:block">
                  <div className="bg-black text-white text-xs px-2 py-1 rounded absolute right-0 -top-8">
                    {favorites.includes(item._id)
                      ? "Remove from Favorites"
                      : "Add to Favorites"}
                    <div className="absolute bottom-[-5px] right-2 w-2 h-2 bg-black rotate-45"></div>
                  </div>
                </div>
              </div>

              <img
                loading="lazy"
                className="bg-blue-50 w-full h-48 object-cover"
                src={item.image}
                alt={`Dr. ${item.name}`}
                onClick={() => openDoctorModal(item)}
              />
              <div className="p-4" onClick={() => openDoctorModal(item)}>
                <div className="flex items-center gap-2 text-xs text-center">
                  {item.available ? (
                    <>
                      <p className="w-2 h-2 bg-green-500 rounded-full"></p>
                      <p className="text-green-500">Available</p>
                    </>
                  ) : (
                    <>
                      <p className="w-2 h-2 bg-red-500 rounded-full"></p>
                      <p className="text-red-500"> Not Available</p>
                    </>
                  )}
                </div>
                <p className="text-lg font-medium text-gray-900">{item.name}</p>
                <p className="text-gray-600 text-sm">{item.speciality}</p>
                {item.rating && (
                  <div className="flex items-center mt-2">
                    <span className="text-yellow-500">★</span>
                    <span className="ml-1 text-sm">
                      {item.rating} ({item.reviews || 0} reviews)
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-4 space-x-2">
        {Array.from({
          length: Math.ceil(filteredDoctors.length / doctorsPerPage),
        }).map((_, index) => (
          <button
            key={index}
            onClick={() => paginate(index + 1)}
            className={`px-3 py-1 border rounded ${
              currentPage === index + 1 ? "bg-blue-500 text-white" : "bg-white"
            }`}
          >
            {index + 1}
          </button>
        ))}
      </div>

      {/* Doctor Detail Modal */}
      {selectedDoctor && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={closeDoctorModal}
        >
          <div
            className="bg-white p-6 rounded-lg max-w-md w-full relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeDoctorModal}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl"
            >
              ✕
            </button>
            <div className="text-center mb-4">
              <img
                loading="lazy"
                src={selectedDoctor.image}
                alt={`Dr. ${selectedDoctor.name}`}
                className="w-32 h-32 object-cover rounded-full mx-auto mb-4"
              />
              <h2 className="text-xl font-bold">{selectedDoctor.name}</h2>
              <p className="text-gray-600">{selectedDoctor.speciality}</p>
            </div>
            <div className="space-y-2 text-center">
              <p>
                <strong>Experience:</strong>{" "}
                {selectedDoctor.experience || "N/A"} years
              </p>
              <p>
                <strong>Availability:</strong>
                <span
                  className={
                    selectedDoctor.available ? "text-green-600" : "text-red-600"
                  }
                >
                  {selectedDoctor.available ? "Available" : "Not Available"}
                </span>
              </p>
              {selectedDoctor.rating && (
                <p>
                  <strong>Rating:</strong> {selectedDoctor.rating}(
                  {selectedDoctor.reviews || 0} reviews)
                </p>
              )}
              <button
                onClick={() => navigate(`/appointments/${selectedDoctor._id}`)}
                className="mt-4 w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
              >
                Book Appointment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Doctor;
