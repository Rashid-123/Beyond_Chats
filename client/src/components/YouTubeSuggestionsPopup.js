import { useState, useEffect } from 'react';
import { X, Play, Loader } from 'lucide-react';

export default function YouTubeSuggestionsPopup({ sessionId, isOpen, onClose }) {
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [videoDetails, setVideoDetails] = useState({});

   
    useEffect(() => {
        if (isOpen) {
            fetchSuggestions();
        }
    }, [isOpen]);

    const fetchSuggestions = async () => {
        setLoading(true);
        setError(null);
        setSuggestions([]);
        setVideoDetails({});

        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/suggestion/youtube/${sessionId}`
            );
            const data = await res.json();
            if (data.success) {
                setSuggestions(data.suggestions);
             
                fetchVideoDetails(data.suggestions);
            } else {
                setError('Failed to fetch suggestions');
            }
        } catch (err) {
            setError('Error fetching suggestions: ' + err.message);
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    };

    const getVideoId = (url) => {
        const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
        return match ? match[1] : null;
    };

    const getThumbnailUrl = (videoId) => {
        // YouTube thumbnail URLs - using maxresdefault which is highest quality
        return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
    };

    const fetchVideoDetails = async (suggestions) => {
        const details = {};
        
        for (const suggestion of suggestions) {
            const videoId = getVideoId(suggestion.url);
            if (videoId) {
                details[suggestion._id] = {
                    thumbnail: getThumbnailUrl(videoId),
                    videoId: videoId,
                };
            }
        }
        
        setVideoDetails(details);
    };

    const handleOpen = () => {
        fetchSuggestions();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed  inset-0 bg-black/10 backdrop-blur-xs bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200">
                    <h2 className="text-2xl font-bold text-gray-800">
                        YouTube Suggestions
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <X className="w-6 h-6 text-gray-600" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center h-64 gap-3">
                            <Loader className="w-8 h-8 text-red-600 animate-spin" />
                            <p className="text-gray-600">Loading suggestions...</p>
                        </div>
                    ) : error ? (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
                            {error}
                        </div>
                    ) : suggestions.length > 0 ? (
                        <div className="grid gap-4">
                            {suggestions.map((suggestion, idx) => {
                                const details = videoDetails[suggestion._id];
                                
                                return (
                                    <a
                                        key={idx}
                                        href={suggestion.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="group flex gap-4 p-3 rounded-lg hover:bg-gray-50 transition-all duration-200 border border-transparent hover:border-gray-200"
                                    >
                                        {/* Thumbnail */}
                                        {details?.thumbnail && (
                                            <div className="relative flex-shrink-0 w-40 h-24 rounded-lg overflow-hidden bg-gray-100">
                                                <img
                                                    src={details.thumbnail}
                                                    alt={suggestion.title}
                                                    className="w-full h-full object-cover group-hover:brightness-75 transition-all duration-200"
                                                />
                                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black bg-opacity-30">
                                                    <Play className="w-8 h-8 text-white fill-white" />
                                                </div>
                                            </div>
                                        )}

                                        {/* Content */}
                                        <div className="flex-1 min-w-0 py-2">
                                            <h3 className="font-semibold text-gray-800 group-hover:text-red-600 transition-colors line-clamp-2">
                                                {suggestion.title}
                                            </h3>

                                            <p className="text-xs text-gray-500 mt-1">
                                                youtube.com
                                            </p>
                                        </div>
                                    </a>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-64 text-gray-400">
                            <p>No suggestions yet. Click Load Suggestions to begin.</p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                {!loading && suggestions.length === 0 && !error && (
                    <div className="p-6 border-t border-gray-200 flex gap-3">
                        <button
                            onClick={onClose}
                            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg transition-colors"
                        >
                            Close
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}