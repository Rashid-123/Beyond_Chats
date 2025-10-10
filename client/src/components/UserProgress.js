// 'use client';

// import { useAuth } from "@clerk/nextjs";
// import axios from "axios";
// import { useEffect, useState } from "react";
// import ProgressCard from "./ProgressCard";

// export default function UserProgress() {
//   const { getToken } = useAuth();
//   const [progress, setProgress] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchProgress = async () => {
//       try {
//         setLoading(true);
//         const token = await getToken();
//         const response = await axios.get("http://localhost:5000/api/progress", {
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         setProgress(response.data.progress);
//       } catch (err) {
//         console.error("Error fetching progress:", err);
//         setError("Failed to load user progress");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProgress();
//   }, [getToken]);

//   if (loading) return <p className="text-center text-gray-600 mt-10">Loading progress...</p>;
//   if (error) return <p className="text-center text-red-500 mt-10">{error}</p>;
//   if (!progress) return <p className="text-center text-gray-500 mt-10">No progress data available.</p>;

//   return (
//     <div className="min-h-[40vh] p-6">
//       <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">
//         My Quiz Progress
//       </h1>
//       <ProgressCard progress={progress} />
//     </div>
//   );
// }




'use client';

import { useAuth } from "@clerk/nextjs";
import axios from "axios";
import { useEffect, useState } from "react";
import ProgressCard from "./ProgressCard";

export default function UserProgress() {
  const { getToken } = useAuth();
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        setLoading(true);
        const token = await getToken();
        const response = await axios.get("http://localhost:5000/api/progress", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setProgress(response.data.progress);
      } catch (err) {
        console.error("Error fetching progress:", err);
        setError("Failed to load user progress");
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, [getToken]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        {/* <div className="w-12 h-12 border-4 rounded-full animate-spin mb-4" 
             style={{ borderColor: 'var(--color-button-1)', borderTopColor: 'transparent' }}></div>
        <p className="text-3 text-sm">Loading progress...</p> */}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-2 border-2 border-1 rounded-xl p-8 text-center max-w-md mx-auto">
        <div className="text-4xl mb-4">⚠️</div>
        <p className="text-error font-medium">{error}</p>
      </div>
    );
  }

  if (!progress) {
    return (
      <div className="bg-2 border-2 border-dashed border-1 rounded-xl p-8 text-center max-w-md mx-auto">
        <div className="text-4xl mb-4">📊</div>
        <p className="text-3">No progress data available.</p>
      </div>
    );
  }

  return (
    <div className="mb-12 sm:mb-16">
      <div className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-1 mb-2">
          Your Progress
        </h2>
        <p className="text-3 text-sm sm:text-base">
          Track your learning journey and quiz performance
        </p>
      </div>
      <ProgressCard progress={progress} />
    </div>
  );
}