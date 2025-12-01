import { useEffect, useState } from 'react'
import { FaEye, FaTrash, FaCheck, FaClock, FaTimes, FaPhone, FaEnvelope } from 'react-icons/fa'
import api from '../../services/api'
import toast from 'react-hot-toast'

const Consultations = () => {
  const [consultations, setConsultations] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [selectedConsultation, setSelectedConsultation] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [notes, setNotes] = useState('')

  useEffect(() => {
    fetchConsultations()
  }, [filter])

  const fetchConsultations = async () => {
    try {
      setLoading(true)
      const endpoint = filter === 'all' ? '/consultations' : `/consultations?status=${filter}`
      const response = await api.get(endpoint)
      setConsultations(response.data.data.consultations)
    } catch (error) {
      toast.error('Failed to fetch consultations')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await api.patch(`/consultations/${id}`, { status: newStatus })
      toast.success('Status updated successfully')
      fetchConsultations()
    } catch (error) {
      toast.error('Failed to update status')
      console.error(error)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this consultation request?')) return
    
    try {
      await api.delete(`/consultations/${id}`)
      toast.success('Consultation deleted successfully')
      fetchConsultations()
    } catch (error) {
      toast.error('Failed to delete consultation')
      console.error(error)
    }
  }

  const handleViewDetails = (consultation) => {
    setSelectedConsultation(consultation)
    setNotes(consultation.notes || '')
    setShowModal(true)
  }

  const handleSaveNotes = async () => {
    try {
      await api.patch(`/consultations/${selectedConsultation.id}`, { notes })
      toast.success('Notes saved successfully')
      setShowModal(false)
      fetchConsultations()
    } catch (error) {
      toast.error('Failed to save notes')
      console.error(error)
    }
  }

  const getStatusBadge = (status) => {
    const badges = {
      pending: 'bg-yellow-100 text-yellow-800',
      contacted: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    }
    return badges[status] || badges.pending
  }

  const filteredConsultations = consultations

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
        <h2 className="text-3xl font-bold">Consultation Requests</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg ${filter === 'all' ? 'bg-red-600 text-white' : 'bg-gray-200'}`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-4 py-2 rounded-lg ${filter === 'pending' ? 'bg-yellow-600 text-white' : 'bg-gray-200'}`}
          >
            Pending
          </button>
          <button
            onClick={() => setFilter('contacted')}
            className={`px-4 py-2 rounded-lg ${filter === 'contacted' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            Contacted
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-4 py-2 rounded-lg ${filter === 'completed' ? 'bg-green-600 text-white' : 'bg-gray-200'}`}
          >
            Completed
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Service
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredConsultations.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                    No consultation requests found
                  </td>
                </tr>
              ) : (
                filteredConsultations.map((consultation) => (
                  <tr key={consultation.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(consultation.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{consultation.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 flex items-center gap-2">
                        <FaPhone className="text-green-600" />
                        <a href={`tel:${consultation.phone}`} className="hover:text-red-600">
                          {consultation.phone}
                        </a>
                      </div>
                      <div className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                        <FaEnvelope className="text-blue-600" />
                        <a href={`mailto:${consultation.email}`} className="hover:text-red-600">
                          {consultation.email}
                        </a>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {consultation.service || 'Not specified'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(consultation.status)}`}>
                        {consultation.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleViewDetails(consultation)}
                          className="text-blue-600 hover:text-blue-900"
                          title="View Details"
                        >
                          <FaEye />
                        </button>
                        {consultation.status === 'pending' && (
                          <button
                            onClick={() => handleStatusUpdate(consultation.id, 'contacted')}
                            className="text-green-600 hover:text-green-900"
                            title="Mark as Contacted"
                          >
                            <FaCheck />
                          </button>
                        )}
                        {consultation.status === 'contacted' && (
                          <button
                            onClick={() => handleStatusUpdate(consultation.id, 'completed')}
                            className="text-green-600 hover:text-green-900"
                            title="Mark as Completed"
                          >
                            <FaCheck />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(consultation.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for viewing details */}
      {showModal && selectedConsultation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-2xl font-bold">Consultation Details</h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FaTimes size={24} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="font-semibold text-gray-700">Name:</label>
                  <p className="text-gray-900">{selectedConsultation.name}</p>
                </div>

                <div>
                  <label className="font-semibold text-gray-700">Email:</label>
                  <p className="text-gray-900">
                    <a href={`mailto:${selectedConsultation.email}`} className="text-blue-600 hover:underline">
                      {selectedConsultation.email}
                    </a>
                  </p>
                </div>

                <div>
                  <label className="font-semibold text-gray-700">Phone:</label>
                  <p className="text-gray-900">
                    <a href={`tel:${selectedConsultation.phone}`} className="text-green-600 hover:underline">
                      {selectedConsultation.phone}
                    </a>
                  </p>
                </div>

                <div>
                  <label className="font-semibold text-gray-700">Service Interested:</label>
                  <p className="text-gray-900">{selectedConsultation.service || 'Not specified'}</p>
                </div>

                <div>
                  <label className="font-semibold text-gray-700">Message:</label>
                  <p className="text-gray-900 whitespace-pre-wrap">{selectedConsultation.message || 'No message provided'}</p>
                </div>

                <div>
                  <label className="font-semibold text-gray-700">Status:</label>
                  <div className="mt-2 flex gap-2">
                    <button
                      onClick={() => handleStatusUpdate(selectedConsultation.id, 'pending')}
                      className={`px-4 py-2 rounded ${selectedConsultation.status === 'pending' ? 'bg-yellow-600 text-white' : 'bg-gray-200'}`}
                    >
                      Pending
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(selectedConsultation.id, 'contacted')}
                      className={`px-4 py-2 rounded ${selectedConsultation.status === 'contacted' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                    >
                      Contacted
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(selectedConsultation.id, 'completed')}
                      className={`px-4 py-2 rounded ${selectedConsultation.status === 'completed' ? 'bg-green-600 text-white' : 'bg-gray-200'}`}
                    >
                      Completed
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(selectedConsultation.id, 'cancelled')}
                      className={`px-4 py-2 rounded ${selectedConsultation.status === 'cancelled' ? 'bg-red-600 text-white' : 'bg-gray-200'}`}
                    >
                      Cancelled
                    </button>
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-gray-700">Admin Notes:</label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full mt-2 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    rows="4"
                    placeholder="Add notes about this consultation..."
                  />
                </div>

                <div className="flex justify-end gap-3 mt-6">
                  <button
                    onClick={() => setShowModal(false)}
                    className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Close
                  </button>
                  <button
                    onClick={handleSaveNotes}
                    className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    Save Notes
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Consultations
