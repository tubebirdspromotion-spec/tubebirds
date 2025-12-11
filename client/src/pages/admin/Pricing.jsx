import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FaPlus, FaEdit, FaTrash, FaSpinner, FaSearch, FaRupeeSign } from 'react-icons/fa'
import toast from 'react-hot-toast'
import api from '../../services/api'

const Pricing = () => {
  const [pricingPlans, setPricingPlans] = useState([])
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingPlan, setEditingPlan] = useState(null)
  const [showPriceModal, setShowPriceModal] = useState(false)
  const [editingPrice, setEditingPrice] = useState(null)
  const [priceFormData, setPriceFormData] = useState({
    originalPrice: '',
    discount: '',
    price: ''
  })
  const [formData, setFormData] = useState({
    serviceId: '',
    name: '',
    slug: '',
    category: 'views',
    originalPrice: '',
    discount: 0,
    price: '',
    quantity: '',
    deliveryTime: '',
    startTime: '',
    retentionRate: '',
    description: '',
    features: [],
    tier: 'basic',
    isPopular: false,
    isActive: true
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [pricingRes, servicesRes] = await Promise.all([
        api.get('/pricing'),
        api.get('/services')
      ])
      setPricingPlans(pricingRes.data.data.plans || [])
      setServices(servicesRes.data.data.services || [])
    } catch (error) {
      toast.error('Failed to fetch data')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingPlan) {
        await api.put(`/pricing/${editingPlan.id}`, formData)
        toast.success('Pricing plan updated')
      } else {
        await api.post('/pricing', formData)
        toast.success('Pricing plan created')
      }
      fetchData()
      handleCloseModal()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed')
    }
  }

  const handleEdit = (plan) => {
    setEditingPlan(plan)
    setFormData(plan)
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this pricing plan?')) return
    try {
      await api.delete(`/pricing/${id}`)
      toast.success('Pricing plan deleted')
      fetchData()
    } catch (error) {
      toast.error('Failed to delete')
    }
  }

  const handleEditPrice = (plan) => {
    setEditingPrice(plan)
    setPriceFormData({
      originalPrice: plan.originalPrice || '',
      discount: plan.discount || 0,
      price: plan.price || ''
    })
    setShowPriceModal(true)
  }

  const handleUpdatePrice = async (e) => {
    e.preventDefault()
    try {
      await api.patch(`/pricing/${editingPrice.id}/prices`, priceFormData)
      toast.success('Prices updated successfully')
      fetchData()
      setShowPriceModal(false)
      setEditingPrice(null)
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update prices')
    }
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingPlan(null)
    setFormData({ serviceId: '', name: '', slug: '', category: 'views', originalPrice: '', discount: 0, price: '', quantity: '', deliveryTime: '', startTime: '', retentionRate: '', description: '', features: [], tier: 'basic', isPopular: false, isActive: true })
  }

  const filteredPlans = pricingPlans.filter(plan => plan.name?.toLowerCase().includes(searchTerm.toLowerCase()))

  if (loading) return <div className="flex items-center justify-center min-h-[400px]"><FaSpinner className="animate-spin text-4xl text-red-600" /></div>

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">Manage Pricing</h2>
          <p className="text-gray-600 mt-1">Manage pricing plans for services</p>
        </div>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700">
          <FaPlus /> Add Plan
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="mb-4">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Search plans..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500" />
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPlans.map((plan) => (
            <motion.div key={plan.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="border rounded-xl p-6 hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold">{plan.name}</h3>
                  <p className="text-sm text-gray-600">{plan.category}</p>
                  <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">{plan.tier}</span>
                </div>
                {plan.isPopular && <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs font-semibold rounded">Popular</span>}
              </div>
              <div className="mb-4">
                <div className="space-y-1">
                  {plan.originalPrice && plan.discount > 0 && (
                    <div className="text-sm text-gray-500">
                      <span className="line-through">₹{parseFloat(plan.originalPrice).toFixed(2)}</span>
                      <span className="ml-2 text-green-600 font-semibold">{plan.discount}% OFF</span>
                    </div>
                  )}
                  <div className="text-3xl font-bold text-red-600 flex items-center"><FaRupeeSign className="text-2xl" />{parseFloat(plan.price).toFixed(2)}</div>
                </div>
                <p className="text-gray-600 mt-2">{plan.quantity}</p>
                <p className="text-sm text-gray-500">{plan.deliveryTime}</p>
              </div>
              <div className="space-y-2">
                <button onClick={() => handleEditPrice(plan)} className="w-full py-2 text-green-600 bg-green-50 rounded-lg hover:bg-green-100 font-semibold">
                  <FaRupeeSign className="inline" /> Edit Prices
                </button>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(plan)} className="flex-1 py-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100">
                    <FaEdit className="inline" /> Edit
                  </button>
                  <button onClick={() => handleDelete(plan.id)} className="flex-1 py-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100">
                    <FaTrash className="inline" /> Delete
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-white rounded-xl max-w-2xl w-full p-6">
            <h3 className="text-2xl font-bold mb-4">{editingPlan ? 'Edit Plan' : 'Add Plan'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Service</label>
                <select required value={formData.serviceId} onChange={(e) => setFormData({...formData, serviceId: e.target.value})} className="w-full px-4 py-2 border rounded-lg">
                  <option value="">Select Service</option>
                  {services.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Plan Name</label>
                  <input type="text" required value={formData.planName} onChange={(e) => setFormData({...formData, planName: e.target.value})} className="w-full px-4 py-2 border rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Quantity</label>
                  <input type="text" required value={formData.quantity} onChange={(e) => setFormData({...formData, quantity: e.target.value})} placeholder="e.g., 1000 Views" className="w-full px-4 py-2 border rounded-lg" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Price (₹)</label>
                  <input type="number" required value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} className="w-full px-4 py-2 border rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Delivery Time</label>
                  <input type="text" required value={formData.deliveryTime} onChange={(e) => setFormData({...formData, deliveryTime: e.target.value})} placeholder="e.g., 2-3 days" className="w-full px-4 py-2 border rounded-lg" />
                </div>
              </div>
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={formData.isPopular} onChange={(e) => setFormData({...formData, isPopular: e.target.checked})} className="rounded" />
                  <span>Popular Plan</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={formData.isActive} onChange={(e) => setFormData({...formData, isActive: e.target.checked})} className="rounded" />
                  <span>Active</span>
                </label>
              </div>
              <div className="flex gap-4 pt-4">
                <button type="submit" className="flex-1 bg-red-600 text-white py-3 rounded-lg hover:bg-red-700">Save</button>
                <button type="button" onClick={handleCloseModal} className="flex-1 bg-gray-200 py-3 rounded-lg hover:bg-gray-300">Cancel</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Quick Price Update Modal */}
      {showPriceModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-2xl font-bold mb-4">Update Prices</h3>
            <p className="text-gray-600 mb-4">Plan: <span className="font-semibold">{editingPrice?.name}</span></p>
            <form onSubmit={handleUpdatePrice} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Original Price (₹)</label>
                <input 
                  type="number" 
                  step="0.01"
                  value={priceFormData.originalPrice} 
                  onChange={(e) => setPriceFormData({...priceFormData, originalPrice: e.target.value})} 
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500"
                  placeholder="Enter original price"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Discount (%)</label>
                <input 
                  type="number" 
                  min="0"
                  max="100"
                  value={priceFormData.discount} 
                  onChange={(e) => setPriceFormData({...priceFormData, discount: e.target.value})} 
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500"
                  placeholder="0-100"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Final Price (₹)</label>
                <input 
                  type="number" 
                  step="0.01"
                  value={priceFormData.price} 
                  onChange={(e) => setPriceFormData({...priceFormData, price: e.target.value})} 
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500"
                  placeholder="Enter final price"
                />
              </div>
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> You can update any combination of these fields. Leave blank to keep existing value.
                </p>
              </div>
              <div className="flex gap-4 pt-4">
                <button type="submit" className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 font-semibold">
                  Update Prices
                </button>
                <button type="button" onClick={() => setShowPriceModal(false)} className="flex-1 bg-gray-200 py-3 rounded-lg hover:bg-gray-300">
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default Pricing
