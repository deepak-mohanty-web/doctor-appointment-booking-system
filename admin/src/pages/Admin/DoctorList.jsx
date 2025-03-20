import { useContext, useEffect, useState } from "react";
import { AdminContext } from "../../context/AdminContext";

function DoctorList() {
  const { doctors, getAllDoctor, aToken, changeAvailabilty } =
    useContext(AdminContext);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (aToken) {
      getAllDoctor();
    }
  }, [aToken, getAllDoctor]);

  // Filter doctors based on search input
  const filteredDoctors = doctors.filter(
    (item) =>
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.speciality.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="m-5 max-h-[90vh] overflow-y-scroll">
      <h1 className="text-lg font-medium">All Doctors</h1>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search doctors..."
        className="border p-2 mt-3 rounded-md w-full"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="w-full flex flex-wrap gap-4 pt-5 gap-y-6">
        {filteredDoctors.map((item, index) => (
          <div
            className="border border-indigo-200 rounded-xl max-w-56 overflow-hidden cursor-pointer"
            key={index}
          >
            <img
              className="bg-indigo-50 hover:bg-primary transition-all duration-500"
              src={item.image}
              alt=""
            />
            <div className="p-4">
              <p className="text-neutral-800 text-lg font-medium">
                {item.name}
              </p>
              <p className="text-sm text-neutral-600">{item.speciality}</p>
              <div className="mt-2 flex items-center gap-2">
                <input
                  onChange={() => changeAvailabilty(item._id)}
                  type="checkbox"
                  checked={item.available}
                />
                <label htmlFor="">Available</label>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DoctorList;
