import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, MapPin, Star, Phone, MessageCircle, Mail, Navigation, Clock, CheckCircle } from 'lucide-react';
import { apiGetFuelFriendDetails, apiGetFuelFriendReviews, apiAddReview } from '../services/api';
import { useAppContext } from '../context/AppContext';
import AnimatedPage from '../components/AnimatedPage';
import TapEffectButton from '../components/TapEffectButton';

const formatTimeAgo = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

  if (diffInHours < 1) return 'Just now';
  if (diffInHours < 24) return `${diffInHours}h ago`;

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays}d ago`;

  return date.toLocaleDateString();
};

interface FuelFriend {
  id: string;
  fullName: string;
  location: string;
  deliveryFee: number;
  rating: number;
  totalReviews: number;
  profilePhoto: string;
  about: string;
}

interface Review {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  userName: string;
  userAvatar: string;
}

const FuelFriendDetailsScreen = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAppContext();
  const [fuelFriend, setFuelFriend] = useState<FuelFriend | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [newReview, setNewReview] = useState({ rating: 0, comment: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchFuelFriendData = async () => {
      if (!id) return;

      setIsLoading(true);
      try {
        // First check if fuel friend data is passed from StationDetailsScreen
        if (location.state?.fuelFriend) {
          console.log('Using fuel friend data from StationDetailsScreen:', location.state.fuelFriend);
          setFuelFriend(location.state.fuelFriend);

          // Still try to fetch reviews from API
          try {
            const reviewsData = await apiGetFuelFriendReviews(id);
            setReviews(reviewsData);
          } catch (reviewErr) {
            console.warn('Failed to fetch reviews, using fallback:', reviewErr);
            setReviews(getFallbackReviews());
          }
          return;
        }

        // Try to fetch from API
        const [friendData, reviewsData] = await Promise.all([
          apiGetFuelFriendDetails(id),
          apiGetFuelFriendReviews(id)
        ]);
        setFuelFriend(friendData);
        setReviews(reviewsData);
      } catch (err: any) {
        console.error('Error fetching fuel friend data:', err);
        setError(err.message);

        // Use fallback data if API fails
        console.warn('Using fallback fuel friend data');
        const fallbackFriend = getFallbackFuelFriend(id);
        const fallbackReviews = getFallbackReviews();

        setFuelFriend(fallbackFriend);
        setReviews(fallbackReviews);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFuelFriendData();
  }, [id, location.state]);

  // Fallback fuel friend data
  const getFallbackFuelFriend = (friendId: string) => {
    const fuelFriends = [
      {
        id: 'friend-uk-1',
        fullName: 'James Mitchell',
        location: '0.5 miles away',
        deliveryFee: 4.99,
        rating: 4.8,
        totalReviews: 156,
        profilePhoto: '/2.png',
        about: 'Experienced fuel delivery professional with over 5 years of service. Specializes in quick and efficient fuel delivery with excellent customer service. Always on time and very professional.'
      },
      {
        id: 'friend-uk-2',
        fullName: 'Emma Thompson',
        location: '0.3 miles away',
        deliveryFee: 5.49,
        rating: 4.9,
        totalReviews: 203,
        profilePhoto: '/2.png',
        about: 'Friendly and reliable fuel delivery expert. Known for her attention to detail and exceptional customer service. Always ensures safe and clean fuel delivery.'
      },
      {
        id: 'friend-us-1',
        fullName: 'David Johnson',
        location: '0.5 miles away',
        deliveryFee: 5.99,
        rating: 4.8,
        totalReviews: 156,
        profilePhoto: '/2.png',
        about: 'Experienced fuel delivery professional with over 5 years of service. Specializes in quick and efficient fuel delivery with excellent customer service. Always on time and very professional.'
      },
      {
        id: 'friend-us-2',
        fullName: 'Jennifer Smith',
        location: '0.3 miles away',
        deliveryFee: 6.99,
        rating: 4.9,
        totalReviews: 203,
        profilePhoto: '/2.png',
        about: 'Friendly and reliable fuel delivery expert. Known for her attention to detail and exceptional customer service. Always ensures safe and clean fuel delivery.'
      }
    ];

    // Find the friend by ID or return the first one
    return fuelFriends.find(friend => friend.id === friendId) || fuelFriends[0];
  };

  // Fallback reviews data
  const getFallbackReviews = () => {
    return [
      {
        id: 'review-1',
        rating: 5,
        comment: 'Excellent service! Very professional and quick delivery.',
        createdAt: '2024-01-15T10:30:00Z',
        userName: 'John D.',
        userAvatar: '/avatar.png'
      },
      {
        id: 'review-2',
        rating: 5,
        comment: 'Great experience! Friendly and efficient service.',
        createdAt: '2024-01-14T14:20:00Z',
        userName: 'Sarah M.',
        userAvatar: '/avatar-female.png'
      },
      {
        id: 'review-3',
        rating: 4,
        comment: 'Good service, arrived on time as promised.',
        createdAt: '2024-01-13T09:15:00Z',
        userName: 'Mike R.',
        userAvatar: '/avatar-male.png'
      },
      {
        id: 'review-4',
        rating: 5,
        comment: 'Outstanding service! Very professional and courteous.',
        createdAt: '2024-01-12T16:45:00Z',
        userName: 'Emily S.',
        userAvatar: '/avatar-female-2.png'
      },
      {
        id: 'review-5',
        rating: 4,
        comment: 'Reliable and quick. Would recommend!',
        createdAt: '2024-01-11T11:30:00Z',
        userName: 'David L.',
        userAvatar: '/avatar.png'
      }
    ];
  };

  const getRatingDistribution = () => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach(review => {
      distribution[review.rating as keyof typeof distribution]++;
    });

    const total = reviews.length || 1;
    return Object.entries(distribution).reverse().map(([rating, count]) => ({
      rating: parseInt(rating),
      percentage: Math.round((count / total) * 100)
    }));
  };

  const handleSubmitReview = async () => {
    if (!newReview.rating || !newReview.comment.trim() || !user?.id) return;

    setIsSubmitting(true);
    try {
      await apiAddReview({
        customerId: user.id,
        fuelFriendId: id!,
        rating: newReview.rating,
        comment: newReview.comment
      });

      // Refresh reviews
      const updatedReviews = await apiGetFuelFriendReviews(id!);
      setReviews(updatedReviews);
      setNewReview({ rating: 0, comment: '' });
    } catch (err: any) {
      console.error('Failed to submit review:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <AnimatedPage>
        <div className="bg-white min-h-screen pb-24">
          {/* Header Skeleton */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="w-6 h-6 bg-gray-300 rounded animate-pulse"></div>
            <div className="w-24 h-5 bg-gray-300 rounded animate-pulse"></div>
            <div className="w-6"></div>
          </div>

          {/* Profile Section Skeleton */}
          <div className="px-4 py-6 text-center">
            <div className="w-24 h-24 bg-gray-300 rounded-full mx-auto mb-4 animate-pulse"></div>
            <div className="w-32 h-6 bg-gray-300 rounded mx-auto mb-2 animate-pulse"></div>
            <div className="w-40 h-4 bg-gray-300 rounded mx-auto mb-2 animate-pulse"></div>
            <div className="w-28 h-4 bg-gray-300 rounded mx-auto animate-pulse"></div>
          </div>

          {/* About Section Skeleton */}
          <div className="px-4 mb-6">
            <div className="w-16 h-5 bg-gray-300 rounded mb-3 animate-pulse"></div>
            <div className="space-y-2">
              <div className="w-full h-3 bg-gray-300 rounded animate-pulse"></div>
              <div className="w-5/6 h-3 bg-gray-300 rounded animate-pulse"></div>
              <div className="w-4/5 h-3 bg-gray-300 rounded animate-pulse"></div>
            </div>
          </div>

          {/* Rating Section Skeleton */}
          <div className="px-4 mb-6">
            <div className="w-40 h-5 bg-gray-300 rounded mb-4 animate-pulse"></div>
            <div className="flex items-start space-x-6 mb-6">
              <div className="text-center">
                <div className="w-12 h-8 bg-gray-300 rounded mb-2 animate-pulse"></div>
                <div className="w-16 h-3 bg-gray-300 rounded mb-1 animate-pulse"></div>
                <div className="w-20 h-3 bg-gray-300 rounded animate-pulse"></div>
              </div>
              <div className="flex-1 space-y-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-gray-300 rounded animate-pulse"></div>
                    <div className="w-3 h-3 bg-gray-300 rounded animate-pulse"></div>
                    <div className="flex-1 h-2 bg-gray-300 rounded animate-pulse"></div>
                    <div className="w-8 h-3 bg-gray-300 rounded animate-pulse"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </AnimatedPage>
    );
  }

  if (error || !fuelFriend) {
    return (
      <AnimatedPage>
        <div className="flex justify-center items-center min-h-screen">
          <p className="text-red-500">{error || 'Fuel friend not found'}</p>
        </div>
      </AnimatedPage>
    );
  }

  const ratingDistribution = getRatingDistribution();

  return (
    <AnimatedPage>
      <div className="bg-white min-h-screen pb-24">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <TapEffectButton
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <ArrowLeft className="w-5 h-5" />
          </TapEffectButton>
          <h1 className="text-lg font-semibold">Fuel friend</h1>
          <div className="w-9"></div>
        </div>

        {/* Profile Section */}
        <div className="px-4 py-6 text-center">
          <div className="relative inline-block mb-4">
            <img
              src={fuelFriend.profilePhoto || '/fuel friend.png'}
              alt={fuelFriend.fullName}
              className="w-24 h-24 rounded-full object-cover mx-auto"
              onError={(e) => {
                e.currentTarget.src = '/fuel friend.png';
              }}
            />
            <div className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
          </div>

          <h2 className="text-xl font-semibold text-gray-900 mb-2">{fuelFriend.fullName}</h2>

          <div className="flex items-center justify-center space-x-4 mb-2">
            <span className="text-lg font-semibold">${fuelFriend.deliveryFee}</span>
            <div className="flex items-center">
              <Star className="w-4 h-4 text-yellow-500 fill-current mr-1" />
              <span className="font-medium">{fuelFriend.rating}</span>
              <span className="text-gray-600 ml-1">({fuelFriend.totalReviews})</span>
            </div>
          </div>

          <div className="flex items-center justify-center text-gray-600">
            <MapPin className="w-4 h-4 mr-1 text-red-500" />
            <span>{fuelFriend.location}</span>
          </div>
        </div>

        {/* About Section */}
        <div className="px-4 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">About</h3>
          <p className="text-gray-700 text-sm leading-relaxed">
            {fuelFriend.about || 'No description available.'}
          </p>
        </div>

        {/* Rating and Reviews Section */}
        <div className="px-4 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Rating and Reviews</h3>

          {/* Rating Overview */}
          <div className="flex items-start space-x-6 mb-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900">{fuelFriend.rating}</div>
              <div className="flex items-center justify-center mb-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-4 h-4 ${star <= Math.floor(fuelFriend.rating)
                        ? 'text-yellow-500 fill-current'
                        : 'text-gray-300'
                      }`}
                  />
                ))}
              </div>
              <div className="text-sm text-gray-600">{fuelFriend.totalReviews} All ratings</div>
            </div>

            <div className="flex-1">
              {ratingDistribution.map(({ rating, percentage }) => (
                <div key={rating} className="flex items-center space-x-2 mb-1">
                  <span className="text-sm w-2">{rating}</span>
                  <Star className="w-3 h-3 text-yellow-500 fill-current" />
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-yellow-500 h-2 rounded-full"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600 w-8">{percentage}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Add Review */}
          <div className="border border-gray-200 rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium">Add review</span>
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-5 h-5 cursor-pointer ${star <= newReview.rating ? 'text-yellow-500 fill-current' : 'text-gray-300'
                      }`}
                    onClick={() => setNewReview(prev => ({ ...prev, rating: star }))}
                  />
                ))}
              </div>
            </div>
            <input
              type="text"
              placeholder="Your review here"
              value={newReview.comment}
              onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
              className="w-full text-sm text-gray-600 bg-transparent border-none outline-none mb-3"
            />
            <div className="flex justify-end">
              <button
                onClick={handleSubmitReview}
                disabled={!newReview.rating || !newReview.comment.trim() || isSubmitting}
                className="bg-green-500 text-white px-6 py-2 rounded-full text-sm font-medium disabled:bg-gray-300"
              >
                {isSubmitting ? 'Adding...' : 'Add'}
              </button>
            </div>
          </div>

          {/* Reviews List */}
          <div className="space-y-4">
            {reviews.slice(0, 2).map((review) => (
              <div key={review.id} className="border-b border-gray-100 pb-4">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="font-medium">{review.userName}</span>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-3 h-3 ${star <= review.rating
                            ? 'text-yellow-500 fill-current'
                            : 'text-gray-300'
                          }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">{formatTimeAgo(review.createdAt)}</span>
                </div>
                <p className="text-sm text-gray-700">{review.comment}</p>
              </div>
            ))}
          </div>

          {reviews.length > 2 && (
            <button className="text-gray-600 text-sm mt-4">Read More</button>
          )}
        </div>

        {/* Contact Buttons */}
        <div className="px-4 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact</h3>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => {
                // Simulate calling the fuel friend
                alert(`Calling ${fuelFriend.fullName}...`);
              }}
              className="flex items-center justify-center space-x-2 bg-green-500 text-white py-3 rounded-full font-medium"
            >
              <Phone size={20} />
              <span>Call</span>
            </button>

            <button
              onClick={() => {
                // Simulate messaging the fuel friend
                alert(`Messaging ${fuelFriend.fullName}...`);
              }}
              className="flex items-center justify-center space-x-2 bg-gray-100 text-gray-800 py-3 rounded-full font-medium"
            >
              <MessageCircle size={20} />
              <span>Message</span>
            </button>
          </div>
        </div>

        {/* Additional Contact Options */}
        <div className="px-4 mb-6">
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => {
                // Simulate getting directions
                alert(`Getting directions to ${fuelFriend.fullName}...`);
              }}
              className="flex flex-col items-center justify-center p-3 bg-gray-50 rounded-xl"
            >
              <Navigation size={24} className="text-gray-600 mb-1" />
              <span className="text-xs text-gray-700">Directions</span>
            </button>

            <button
              onClick={() => {
                // Simulate checking availability
                alert(`${fuelFriend.fullName} is available now!`);
              }}
              className="flex flex-col items-center justify-center p-3 bg-gray-50 rounded-xl"
            >
              <Clock size={24} className="text-gray-600 mb-1" />
              <span className="text-xs text-gray-700">Availability</span>
            </button>

            <button
              onClick={() => {
                // Simulate verifying
                alert(`${fuelFriend.fullName} is verified!`);
              }}
              className="flex flex-col items-center justify-center p-3 bg-gray-50 rounded-xl"
            >
              <CheckCircle size={24} className="text-green-500 mb-1" />
              <span className="text-xs text-gray-700">Verified</span>
            </button>
          </div>
        </div>

        {/* Select Button */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200">
          <button
            onClick={() => {
              // Default to navigating back if no specific station flow is detected
              if (location.state?.stationId) {
                navigate(`/station/${location.state.stationId}`, {
                  state: {
                    selectedFuelFriend: fuelFriend,
                    cartItems: location.state.cartItems,
                    station: location.state.station
                  }
                });
              } else {
                navigate(-1);
              }
            }}
            className="w-full bg-green-500 text-white py-4 rounded-full text-lg font-semibold"
          >
            Select Fuel friend
          </button>
        </div>
      </div>
    </AnimatedPage>
  );
};

export default FuelFriendDetailsScreen;