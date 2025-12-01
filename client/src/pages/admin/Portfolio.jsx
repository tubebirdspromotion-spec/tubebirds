import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FaPlus, FaEdit, FaTrash, FaSpinner, FaSearch, FaYoutube, FaExternalLinkAlt } from 'react-icons/fa'
import toast from 'react-hot-toast'
import api from '../../services/api'

const Portfolio = () => {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [showModal, setShowModal] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [formData, setFormData] = useState({
    channelName: '',
    channelUrl: '',
    thumbnailUrl: '',
    type: 'views',
    beforeMetric: '',
    afterMetric: '',
    description: '',
    order: 0,
    isActive: true
  })

  useEffect(() => {
    fetchPortfolio()
  }, [])

  const fetchPortfolio = async () => {
    try {
      setLoading(true)
      const response = await api.get('/portfolio')
      setItems(response.data.data.items)
    } catch (error) {
      toast.error('Failed to fetch portfolio')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingItem) {
        await api.put(`/portfolio/${editingItem.id}`, formData)
        toast.success('Portfolio item updated')
      } else {
        await api.post('/portfolio', formData)
        toast.success('Portfolio item created')
      }
      fetchPortfolio()
      handleCloseModal()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed')
    }
  }

  const handleEdit = (item) => {
    setEditingItem(item)
    setFormData(item)
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this portfolio item?')) return
    try {
      await api.delete(`/portfolio/${id}`)
      toast.success('Portfolio item deleted')
      fetchPortfolio()
    } catch (error) {
      toast.error('Failed to delete')
    }
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingItem(null)
    setFormData({ channelName: '', channelUrl: '', thumbnailUrl: '', type: 'views', beforeMetric: '', afterMetric: '', description: '', order: 0, isActive: true })
  }

  const filteredItems = items.filter(item => {
    const matchesSearch = item.channelName?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === 'all' || item.type === filterType
    return matchesSearch && matchesType
  })

  if (loading) return <div className="flex items-center justify-center min-h-[400px]"><FaSpinner className="animate-spin text-4xl text-red-600" /></div>

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">Manage Portfolio</h2>
          <p className="text-gray-600 mt-1">Showcase successful campaigns</p>
        </div>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700">
          <FaPlus /> Add Portfolio Item
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Search channels..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500" />
          </div>
          <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500">
            <option value="all">All Types</option>
            <option value="views">Views</option>
            <option value="subscribers">Subscribers</option>
            <option value="likes">Likes</option>
            <option value="comments">Comments</option>
          </select>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <motion.div key={item.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="border rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-video bg-gray-200 relative">
                {item.thumbnailUrl ? (
                  <img src={item.thumbnailUrl} alt={item.channelName} className="w-full h-full object-cover" />
                ) : (
                  <div className="flex items-center justify-center h-full"><FaYoutube className="text-6xl text-gray-400" /></div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-bold text-lg mb-2">{item.channelName}</h3>
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-semibold">{item.type.toUpperCase()}</span>
                  <span>{item.beforeMetric} → {item.afterMetric}</span>
                </div>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{item.description}</p>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(item)} className="flex-1 py-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 text-sm font-medium">
                    <FaEdit className="inline" /> Edit
                  </button>
                  <button onClick={() => handleDelete(item.id)} className="flex-1 py-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 text-sm font-medium">
                    <FaTrash className="inline" /> Delete
                  </button>
                  {item.channelUrl && (
                    <a href={item.channelUrl} target="_blank" rel="noopener noreferrer" className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                      <FaExternalLinkAlt />
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-white rounded-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-bold mb-4">{editingItem ? 'Edit Portfolio Item' : 'Add Portfolio Item'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Channel Name</label>
                <input type="text" required value={formData.channelName} onChange={(e) => setFormData({...formData, channelName: e.target.value})} className="w-full px-4 py-2 border rounded-lg" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Channel URL</label>
                  <input type="url" value={formData.channelUrl} onChange={(e) => setFormData({...formData, channelUrl: e.target.value})} className="w-full px-4 py-2 border rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Thumbnail URL</label>
                  <input type="url" value={formData.thumbnailUrl} onChange={(e) => setFormData({...formData, thumbnailUrl: e.target.value})} className="w-full px-4 py-2 border rounded-lg" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Type</label>
                  <select required value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})} className="w-full px-4 py-2 border rounded-lg">
                    <option value="views">Views</option>
                    <option value="subscribers">Subscribers</option>
                    <option value="likes">Likes</option>
                    <option value="comments">Comments</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Before</label>
                  <input type="text" required value={formData.beforeMetric} onChange={(e) => setFormData({...formData, beforeMetric: e.target.value})} placeholder="e.g., 10K" className="w-full px-4 py-2 border rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">After</label>
                  <input type="text" required value={formData.afterMetric} onChange={(e) => setFormData({...formData, afterMetric: e.target.value})} placeholder="e.g., 100K" className="w-full px-4 py-2 border rounded-lg" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Description</label>
                <textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} rows={3} className="w-full px-4 py-2 border rounded-lg" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Display Order</label>
                  <input type="number" value={formData.order} onChange={(e) => setFormData({...formData, order: parseInt(e.target.value)})} className="w-full px-4 py-2 border rounded-lg" />
                </div>
                <div className="flex items-center">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" checked={formData.isActive} onChange={(e) => setFormData({...formData, isActive: e.target.checked})} className="rounded" />
                    <span>Active</span>
                  </label>
                </div>
              </div>
              <div className="flex gap-4 pt-4">
                <button type="submit" className="flex-1 bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 font-semibold">Save</button>
                <button type="button" onClick={handleCloseModal} className="flex-1 bg-gray-200 py-3 rounded-lg hover:bg-gray-300 font-semibold">Cancel</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default Portfolio
