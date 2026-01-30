import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Star } from 'lucide-react';
import { apiGetStationReviews } from '../services/api';
import AnimatedPage from '../components/AnimatedPage';
import TapEffectButton from '../components/TapEffectButton';

interface Review {
  id: string;
  userName: string;
  rating: number;
  createdAt: string;
  comment: string;
  userAvatar: string;
}

const StationReviewsScreen = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const data = await apiGetStationReviews(id);
        setReviews(data.map((review: any) => ({
          id: review.id,
          userName: review.userName || 'Anonymous',
          rating: review.rating,
          createdAt: formatDate(review.createdAt),
          comment: review.comment || '',
          userAvatar: review.userAvatar || '/avatar.png'
        })));
      } catch (error: any) {
        console.error('Failed to fetch reviews:', error);
        if (error.message?.includes('not found')) {
          alert('Station not found');
          navigate("/home");
        } else {
          alert('Failed to load reviews. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [id]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 30) return `${diffDays} days ago`;
    if (diffDays < 60) return '1 month ago';
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < rating ? 'text-yellow-500 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <AnimatedPage>
      <div className="min-h-screen bg-white">
        {/* Header */}
        <header className="p-4 flex items-center sticky top-0 bg-white z-10 shadow-sm border-b border-gray-100">
          <TapEffectButton 
            onClick={() => navigate("/home")} 
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <img src="/Back.png" alt="Back" className="w-5 h-5" />
          </TapEffectButton>
          <h2 className="text-xl font-bold text-center flex-grow -ml-10 text-[#3F4249]">
            Reviews
          </h2>
        </header>

        {/* Station Info Header */}
        <div className="relative">
          <div className="h-32 bg-gradient-to-r from-orange-400 to-pink-400 relative overflow-hidden">
            <img 
              src="/image-card-1.png" 
              alt="Station" 
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Station Logo */}
          <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
            <div className="w-16 h-16 bg-white rounded-full p-2 shadow-lg">
              <img 
                src="/brand1.png" 
                alt="Station Logo" 
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>

        {/* Station Name */}
        <div className="px-4 pt-12 pb-6 text-center">
          <h1 className="text-xl font-semibold text-gray-900 mb-2">Petro Tennessee</h1>
          <p className="text-gray-600 text-sm">📍 Abcd Canada</p>
        </div>

        {/* Reviews Section */}
        <div className="px-4">
          <h3 className="text-lg font-semibold text-[#3F4249] mb-4">Reviews</h3>
          
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="w-8 h-8 border-4 border-[#3AC36C] border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.length > 0 ? reviews.map((review) => (
                <div key={review.id} className="bg-white border border-gray-100 rounded-lg p-4 shadow-sm">
                  <div className="flex items-start space-x-3">
                    <img 
                      src={review.userAvatar} 
                      alt={review.userName}
                      className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
                      onError={(e) => {
                        e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Ccircle cx='20' cy='20' r='20' fill='%23e5e7eb'/%3E%3Cpath d='M20 10a6 6 0 1 0 0 12 6 6 0 0 0 0-12zM12 30a8 8 0 0 1 16 0H12z' fill='%23999'/%3E%3C/svg%3E";
                      }}
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-[#3F4249]">{review.userName}</h4>
                        <span className="text-xs text-gray-500">{review.createdAt}</span>
                      </div>
                      
                      <div className="flex items-center mb-3">
                        {renderStars(review.rating)}
                      </div>
                      
                      {review.comment && (
                        <p className="text-gray-700 text-sm leading-relaxed">
                          {review.comment}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No reviews yet</p>
                </div>
              )}
            </div>
          )}

          {/* Read More Button */}
          <div className="mt-6 mb-8 text-center">
            <button className="text-[#3AC36C] font-medium text-sm hover:underline">
              Read More
            </button>
          </div>
        </div>
      </div>
    </AnimatedPage>
  );
};

export default StationReviewsScreen;