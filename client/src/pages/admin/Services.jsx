import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaToggleOn, 
  FaToggleOff,
  FaSpinner,
  FaYoutube,
  FaSearch
} from 'react-icons/fa'
import toast from 'react-hot-toast'
import api from '../../services/api'

const Services = () => {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingService, setEditingService] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    shortDescription: '',
    icon: 'FaYoutube',
    order: 0,
    isActive: true
  })

  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async () => {
    try {
      setLoading(true)
      const response = await api.get('/services')
      setServices(response.data.data.services)
    } catch (error) {
      toast.error('Failed to fetch services')
      console.error('Error fetching services:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingService) {
        await api.put(`/services/${editingService.id}`, formData)
        toast.success('Service updated successfully')
      } else {
        await api.post('/services', formData)
        toast.success('Service created successfully')
      }
      fetchServices()
      handleCloseModal()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed')
    }
  }

  const handleEdit = (service) => {
    setEditingService(service)
    setFormData(service)
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this service?')) return
    try {
      await api.delete(`/services/${id}`)
      toast.success('Service deleted successfully')
      fetchServices()
    } catch (error) {
      toast.error('Failed to delete service')
    }
  }

  const handleToggleActive = async (service) => {
    try {
      await api.put(`/services/${service.id}`, { ...service, isActive: !service.isActive })
      toast.success(`Service ${!service.isActive ? 'activated' : 'deactivated'}`)
      fetchServices()
    } catch (error) {
      toast.error('Failed to update service status')
    }
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingService(null)
    setFormData({
      name: '',
      slug: '',
      description: '',
      shortDescription: '',
      icon: 'FaYoutube',
      order: 0,
      isActive: true
    })
  }

  const filteredServices = services.filter(service =>
    service.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.description?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <FaSpinner className="animate-spin text-4xl text-red-600" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Manage Services</h2>
          <p className="text-gray-600 mt-1">Create and manage YouTube growth services</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
        >
          <FaPlus /> Add Service
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="mb-4">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search services..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Order</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Service</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Description</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredServices.map((service) => (
                <motion.tr key={service.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-gray-900 font-semibold">{service.order}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                        <FaYoutube className="text-red-600" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">{service.name}</div>
                        <div className="text-sm text-gray-500">{service.slug}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 max-w-md">
                    <p className="text-sm text-gray-600 line-clamp-2">{service.shortDescription}</p>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleToggleActive(service)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${service.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}
                    >
                      {service.isActive ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button onClick={() => handleEdit(service)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                        <FaEdit />
                      </button>
                      <button onClick={() => handleDelete(service.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-2xl font-bold mb-4">{editingService ? 'Edit Service' : 'Add New Service'}</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Service Name</label>
                    <input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Slug</label>
                    <input type="text" required value={formData.slug} onChange={(e) => setFormData({...formData, slug: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Short Description</label>
                  <input type="text" required value={formData.shortDescription} onChange={(e) => setFormData({...formData, shortDescription: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                  <textarea required value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} rows={4} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Order</label>
                    <input type="number" required value={formData.order} onChange={(e) => setFormData({...formData, order: parseInt(e.target.value)})} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
                    <select value={formData.isActive} onChange={(e) => setFormData({...formData, isActive: e.target.value === 'true'})} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500">
                      <option value="true">Active</option>
                      <option value="false">Inactive</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-4 pt-4">
                  <button type="submit" className="flex-1 bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 font-semibold">Save</button>
                  <button type="button" onClick={handleCloseModal} className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 font-semibold">Cancel</button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default Services
