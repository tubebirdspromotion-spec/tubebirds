import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FaEnvelope, FaPhone, FaUser, FaSpinner, FaSearch, FaFilter, FaCheckCircle, FaClock, FaTimesCircle, FaEnvelopeOpen } from 'react-icons/fa'
import toast from 'react-hot-toast'
import api from '../../services/api'

const Contacts = () => {
  const [contacts, setContacts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [selectedContact, setSelectedContact] = useState(null)
  const [showDetailModal, setShowDetailModal] = useState(false)

  useEffect(() => {
    fetchContacts()
  }, [])

  const fetchContacts = async () => {
    try {
      setLoading(true)
      const response = await api.get('/contact')
      setContacts(response.data.data.contacts)
    } catch (error) {
      toast.error('Failed to fetch contacts')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateStatus = async (id, status) => {
    try {
      await api.put(`/contact/${id}`, { status })
      toast.success('Status updated')
      fetchContacts()
      if (selectedContact?.id === id) {
        setSelectedContact({ ...selectedContact, status })
      }
    } catch (error) {
      toast.error('Failed to update status')
    }
  }

  const handleViewDetails = async (contact) => {
    try {
      const response = await api.get(`/contact/${contact.id}`)
      setSelectedContact(response.data.data.contact)
      setShowDetailModal(true)
      fetchContacts() // Refresh to update read status
    } catch (error) {
      toast.error('Failed to load contact details')
    }
  }

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      replied: 'bg-green-100 text-green-800',
      closed: 'bg-gray-100 text-gray-800'
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  const getStatusIcon = (status) => {
    const icons = {
      pending: <FaClock />,
      replied: <FaCheckCircle />,
      closed: <FaTimesCircle />
    }
    return icons[status] || <FaClock />
  }

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = contact.name?.toLowerCase().includes(searchTerm.toLowerCase()) || contact.email?.toLowerCase().includes(searchTerm.toLowerCase()) || contact.subject?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || contact.status === filterStatus
    return matchesSearch && matchesStatus
  })

  if (loading) return <div className="flex items-center justify-center min-h-[400px]"><FaSpinner className="animate-spin text-4xl text-red-600" /></div>

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold">Manage Contacts</h2>
        <p className="text-gray-600 mt-1">View and respond to customer inquiries</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Search contacts..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500" />
          </div>
          <div className="relative">
            <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 appearance-none">
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="replied">Replied</option>
              <option value="closed">Closed</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 pt-4 border-t">
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">{contacts.filter(c => c.status === 'pending').length}</div>
            <div className="text-sm text-gray-600">Pending</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{contacts.filter(c => c.status === 'replied').length}</div>
            <div className="text-sm text-gray-600">Replied</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-600">{contacts.filter(c => c.status === 'closed').length}</div>
            <div className="text-sm text-gray-600">Closed</div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Contact</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Subject</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Date</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filteredContacts.map((contact) => (
              <motion.tr key={contact.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`hover:bg-gray-50 ${!contact.isRead ? 'bg-blue-50' : ''}`}>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    {!contact.isRead && <FaEnvelopeOpen className="text-blue-600" />}
                    <div>
                      <div className="font-semibold text-gray-900 flex items-center gap-2">
                        <FaUser className="text-gray-400 text-sm" />
                        {contact.name}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <FaEnvelope className="text-gray-400 text-xs" />
                        {contact.email}
                      </div>
                      {contact.phone && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <FaPhone className="text-gray-400 text-xs" />
                          {contact.phone}
                        </div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-900">{contact.subject}</div>
                  <div className="text-sm text-gray-500 line-clamp-1">{contact.message}</div>
                </td>
                <td className="px-6 py-4">
                  <select value={contact.status} onChange={(e) => handleUpdateStatus(contact.id, e.target.value)} className={`px-3 py-1 rounded-full text-xs font-semibold border-0 ${getStatusColor(contact.status)}`}>
                    <option value="pending">Pending</option>
                    <option value="replied">Replied</option>
                    <option value="closed">Closed</option>
                  </select>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {new Date(contact.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </td>
                <td className="px-6 py-4">
                  <button onClick={() => handleViewDetails(contact)} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium">View</button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {showDetailModal && selectedContact && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-white rounded-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-2xl font-bold">Contact Details</h3>
              <button onClick={() => setShowDetailModal(false)} className="text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-gray-700">Name</label>
                <p className="text-gray-900">{selectedContact.name}</p>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700">Email</label>
                <p className="text-gray-900">{selectedContact.email}</p>
              </div>
              {selectedContact.phone && (
                <div>
                  <label className="text-sm font-semibold text-gray-700">Phone</label>
                  <p className="text-gray-900">{selectedContact.phone}</p>
                </div>
              )}
              <div>
                <label className="text-sm font-semibold text-gray-700">Subject</label>
                <p className="text-gray-900">{selectedContact.subject}</p>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700">Message</label>
                <p className="text-gray-900 whitespace-pre-wrap bg-gray-50 p-4 rounded-lg">{selectedContact.message}</p>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700">Status</label>
                <select value={selectedContact.status} onChange={(e) => handleUpdateStatus(selectedContact.id, e.target.value)} className={`w-full px-4 py-2 rounded-lg font-semibold ${getStatusColor(selectedContact.status)}`}>
                  <option value="pending">Pending</option>
                  <option value="replied">Replied</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
              <div className="text-sm text-gray-500 pt-4 border-t">
                Received on {new Date(selectedContact.createdAt).toLocaleString('en-IN')}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default Contacts
