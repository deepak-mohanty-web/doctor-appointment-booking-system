import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function Success() {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    // Automatically redirect after 10 seconds
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    const redirect = setTimeout(() => {
      navigate("/");
    }, 10000);

    return () => {
      clearInterval(timer);
      clearTimeout(redirect);
    };
  }, [navigate]);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-2xl mx-auto animate-fadeIn">
        <div className="bg-white shadow-xl rounded-xl overflow-hidden">
          {/* Success Header */}
          <div className="bg-primary bg-opacity-10 px-6 py-4 border-b border-primary border-opacity-20">
            <div className="flex items-center justify-center py-6">
              {/* Animated Success Checkmark */}
              <div className="relative w-32 h-32">
                {/* Outer circle with animation */}
                <div className="absolute inset-0 rounded-full border-4 border-green-500 animate-pulse"></div>

                {/* Inner circle with success animation */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg className="w-32 h-32" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                    {/* Background circle */}
                    <circle cx="50" cy="50" r="40" fill="#4CAF50" className="animate-scaleIn"/>

                    {/* Checkmark */}
                    <path
                      d="M30 50L45 65L70 35"
                      fill="none"
                      stroke="white"
                      strokeWidth="6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="animate-drawCheck"
                      strokeDasharray="75"
                      strokeDashoffset="75"
                    />

                    {/* Circular burst effect */}
                    <circle cx="50" cy="50" r="45" fill="none" stroke="#4CAF50" strokeWidth="2" className="animate-circleBurst" />
                  </svg>
                </div>

                {/* Optional particle effects */}
                <div className="absolute top-0 left-1/2 w-2 h-2 bg-green-300 rounded-full animate-particle1"></div>
                <div className="absolute top-1/4 right-0 w-2 h-2 bg-green-300 rounded-full animate-particle2"></div>
                <div className="absolute bottom-0 left-1/4 w-2 h-2 bg-green-300 rounded-full animate-particle3"></div>
                <div className="absolute bottom-1/4 right-1/4 w-2 h-2 bg-green-300 rounded-full animate-particle4"></div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-8">
            <h2 className="text-center text-3xl font-extrabold text-gray-900 mb-2 animate-slideUp">
              Appointment Request Confirmed
            </h2>
            <p className="text-center text-lg text-gray-600 mb-8 animate-slideUp animation-delay-100">
              Thank you for booking with us. We will be in touch shortly to confirm your details.
            </p>

            {/* Information Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-100 animate-fadeIn animation-delay-200">
                <div className="flex items-start">
                  <div className="flex-shrink-0 animate-bounce">
                    <svg className="h-6 w-6 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-blue-800">Check Your Email</h3>
                    <p className="mt-1 text-sm text-blue-600">
                      We have sent a confirmation email with your appointment details
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 rounded-lg p-4 border border-green-100 animate-fadeIn animation-delay-300">
                <div className="flex items-start">
                  <div className="flex-shrink-0 animate-pulse">
                    <svg className="h-6 w-6 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-green-800">Next Steps</h3>
                    <p className="mt-1 text-sm text-green-600">
                      Our team will review your request and confirm availability
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div className="bg-gray-50 rounded-lg p-4 mb-8 animate-fadeIn animation-delay-400">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-gray-800">Need Assistance?</h3>
                  <p className="mt-1 text-sm text-gray-600">
                    If you need to modify or cancel your appointment, please contact our customer support team at <span className="font-medium">support@example.com</span> or call <span className="font-medium">(555) 123-4567</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fadeIn animation-delay-500">
              <button
                onClick={() => navigate("/")}
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-200 hover:scale-105"
              >
                Return Home
              </button>

              <button
                onClick={() => navigate("/my-appointments")}
                className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-200 hover:scale-105"
              >
                View My Appointments
              </button>
            </div>

            {/* Countdown */}
            <div className="mt-8 text-center animate-fadeIn animation-delay-600">
              <p className="text-sm text-gray-500">
                Redirecting to home in <span className="font-medium">{countdown}</span> seconds...
              </p>
              <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5">
                <div
                  className="bg-primary rounded-full h-1.5 transition-all duration-1000 ease-linear"
                  style={{ width: `${countdown * 10}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Add custom animations
const style = document.createElement('style');
style.innerHTML = `
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes slideUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes drawCheck {
    from { stroke-dashoffset: 75; }
    to { stroke-dashoffset: 0; }
  }

  @keyframes scaleIn {
    0% { transform: scale(0); opacity: 0; }
    50% { transform: scale(1.1); opacity: 1; }
    100% { transform: scale(1); opacity: 1; }
  }

  @keyframes circleBurst {
    0% { opacity: 1; r: 40; }
    100% { opacity: 0; r: 55; }
  }

  @keyframes particle1 {
    0% { transform: translate(0, 0); opacity: 1; }
    100% { transform: translate(-20px, -30px); opacity: 0; }
  }

  @keyframes particle2 {
    0% { transform: translate(0, 0); opacity: 1; }
    100% { transform: translate(20px, -20px); opacity: 0; }
  }

  @keyframes particle3 {
    0% { transform: translate(0, 0); opacity: 1; }
    100% { transform: translate(-15px, 30px); opacity: 0; }
  }

  @keyframes particle4 {
    0% { transform: translate(0, 0); opacity: 1; }
    100% { transform: translate(25px, 25px); opacity: 0; }
  }

  .animate-fadeIn {
    animation: fadeIn 0.5s ease-out forwards;
  }

  .animate-slideUp {
    animation: slideUp 0.7s ease-out forwards;
  }

  .animate-drawCheck {
    animation: drawCheck 1s ease-in-out forwards 0.3s;
  }

  .animate-scaleIn {
    animation: scaleIn 0.5s ease-out forwards;
  }

  .animate-circleBurst {
    animation: circleBurst 1s ease-out forwards;
  }

  .animate-particle1 {
    animation: particle1 1.5s ease-out forwards 0.2s;
  }

  .animate-particle2 {
    animation: particle2 1.7s ease-out forwards 0.1s;
  }

  .animate-particle3 {
    animation: particle3 1.3s ease-out forwards 0.3s;
  }

  .animate-particle4 {
    animation: particle4 1.6s ease-out forwards 0.2s;
  }

  .animation-delay-100 {
    animation-delay: 0.1s;
  }

  .animation-delay-200 {
    animation-delay: 0.2s;
  }

  .animation-delay-300 {
    animation-delay: 0.3s;
  }

  .animation-delay-400 {
    animation-delay: 0.4s;
  }

  .animation-delay-500 {
    animation-delay: 0.5s;
  }

  .animation-delay-600 {
    animation-delay: 0.6s;
  }
`;
document.head.appendChild(style);

export default Success;
