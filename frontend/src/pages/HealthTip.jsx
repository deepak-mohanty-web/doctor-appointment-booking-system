import { useEffect, useState } from "react";

function HealthTips() {
  const [tips, setTips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://odphp.health.gov/myhealthfinder/api/v3/topicsearch.json")
      .then((response) => response.json())
      .then((data) => {
        if (data && data.Result && data.Result.Topics) {
          setTips(data.Result.Topics);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching health tips:", error);
        setLoading(false);
      });
  }, []);

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Health Tips</h2>
      {loading ? (
        <p>Loading health tips...</p>
      ) : (
        <div className="space-y-4">
          {tips.map((tip) => (
            <div key={tip.Id} className="p-4 border rounded-lg shadow">
              <h3 className="text-lg font-semibold">{tip.Title}</h3>
              <div dangerouslySetInnerHTML={{ __html: tip.Text }} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default HealthTips;
