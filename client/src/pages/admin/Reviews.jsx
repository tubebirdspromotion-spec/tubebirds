import { useEffect, useState } from 'react'
import { FaEdit, FaTrash, FaStar, FaEye, FaCheck, FaTimes } from 'react-icons/fa'
import api from '../../services/api'
import toast from 'react-hot-toast'

const Reviews = () => {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [showModal, setShowModal] = useState(false)
  const [selectedReview, setSelectedReview] = useState(null)
  const [formData, setFormData] = useState({
    userName: '',
    userTitle: '',
    rating: 5,
    comment: '',
    featured: false
  })
  const [editMode, setEditMode] = useState(false)

  useEffect(() => {
    fetchReviews()
  }, [])

  const fetchReviews = async () => {
    try {
      setLoading(true)
      const response = await api.get('/reviews')
      setReviews(response.data.data.reviews)
    } catch (error) {
      toast.error('Failed to fetch reviews')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editMode) {
        await api.put(`/reviews/${selectedReview.id}`, formData)
        toast.success('Review updated successfully')
      } else {
        await api.post('/reviews', formData)
        toast.success('Review created successfully')
      }
      setShowModal(false)
      resetForm()
      fetchReviews()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed')
      console.error(error)
    }
  }

  const handleEdit = (review) => {
    setSelectedReview(review)
    setFormData({
      userName: review.userName,
      userTitle: review.userTitle,
      rating: review.rating,
      comment: review.comment,
      featured: review.featured
    })
    setEditMode(true)
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return
    
    try {
      await api.delete(`/reviews/${id}`)
      toast.success('Review deleted successfully')
      fetchReviews()
    } catch (error) {
      toast.error('Failed to delete review')
      console.error(error)
    }
  }

  const toggleFeatured = async (id, currentStatus) => {
    try {
      await api.put(`/reviews/${id}`, { featured: !currentStatus })
      toast.success('Review updated successfully')
      fetchReviews()
    } catch (error) {
      toast.error('Failed to update review')
      console.error(error)
    }
  }

  const resetForm = () => {
    setFormData({
      userName: '',
      userTitle: '',
      rating: 5,
      comment: '',
      featured: false
    })
    setEditMode(false)
    setSelectedReview(null)
  }

  const openCreateModal = () => {
    resetForm()
    setShowModal(true)
  }

  const filteredReviews = filter === 'all' 
    ? reviews 
    : reviews.filter(review => filter === 'featured' ? review.featured : !review.featured)

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <FaStar
        key={index}
        className={index < rating ? 'text-yellow-400' : 'text-gray-300'}
      />
    ))
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Customer Reviews</h2>
        <div className="flex gap-3">
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg ${filter === 'all' ? 'bg-red-600 text-white' : 'bg-gray-200'}`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('featured')}
              className={`px-4 py-2 rounded-lg ${filter === 'featured' ? 'bg-yellow-600 text-white' : 'bg-gray-200'}`}
            >
              Featured
            </button>
            <button
              onClick={() => setFilter('regular')}
              className={`px-4 py-2 rounded-lg ${filter === 'regular' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            >
              Regular
            </button>
          </div>
          <button
            onClick={openCreateModal}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            + Add Review
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredReviews.length === 0 ? (
          <div className="col-span-full text-center py-12 text-gray-500">
            No reviews found
          </div>
        ) : (
          filteredReviews.map((review) => (
            <div
              key={review.id}
              className={`bg-white rounded-lg shadow-lg p-6 relative ${review.featured ? 'ring-2 ring-yellow-400' : ''}`}
            >
              {review.featured && (
                <div className="absolute top-2 right-2 bg-yellow-400 text-white px-3 py-1 rounded-full text-xs font-bold">
                  Featured
                </div>
              )}
              
              <div className="flex items-center gap-1 mb-3">
                {renderStars(review.rating)}
              </div>

              <p className="text-gray-700 mb-4 line-clamp-4">{review.comment}</p>

              <div className="border-t pt-4">
                <p className="font-semibold text-gray-900">{review.userName}</p>
                <p className="text-sm text-gray-600">{review.userTitle}</p>
              </div>

              <div className="flex justify-end gap-2 mt-4 pt-4 border-t">
                <button
                  onClick={() => toggleFeatured(review.id, review.featured)}
                  className={`p-2 rounded ${review.featured ? 'text-yellow-600 hover:bg-yellow-50' : 'text-gray-600 hover:bg-gray-50'}`}
                  title={review.featured ? 'Remove from Featured' : 'Mark as Featured'}
                >
                  <FaStar />
                </button>
                <button
                  onClick={() => handleEdit(review)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                  title="Edit"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => handleDelete(review.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded"
                  title="Delete"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal for Create/Edit */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-2xl font-bold">
                  {editMode ? 'Edit Review' : 'Add New Review'}
                </h3>
                <button
                  onClick={() => {
                    setShowModal(false)
                    resetForm()
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FaTimes size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Customer Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.userName}
                    onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title/Designation *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.userTitle}
                    onChange={(e) => setFormData({ ...formData, userTitle: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="YouTuber, Content Creator"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rating *
                  </label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <button
                        key={rating}
                        type="button"
                        onClick={() => setFormData({ ...formData, rating })}
                        className="text-3xl focus:outline-none"
                      >
                        <FaStar
                          className={rating <= formData.rating ? 'text-yellow-400' : 'text-gray-300'}
                        />
                      </button>
                    ))}
                    <span className="ml-2 text-gray-600">({formData.rating} stars)</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Review Comment *
                  </label>
                  <textarea
                    required
                    value={formData.comment}
                    onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    rows="4"
                    placeholder="Write the review..."
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="w-4 h-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                  />
                  <label htmlFor="featured" className="text-sm font-medium text-gray-700">
                    Mark as Featured (will be displayed prominently)
                  </label>
                </div>

                <div className="flex justify-end gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false)
                      resetForm()
                    }}
                    className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    {editMode ? 'Update Review' : 'Create Review'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Reviews
