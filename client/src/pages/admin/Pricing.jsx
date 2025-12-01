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
  const [formData, setFormData] = useState({
    serviceId: '',
    planName: '',
    quantity: '',
    price: '',
    deliveryTime: '',
    features: [],
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
      setPricingPlans(pricingRes.data.data.pricingPlans)
      setServices(servicesRes.data.data.services)
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

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingPlan(null)
    setFormData({ serviceId: '', planName: '', quantity: '', price: '', deliveryTime: '', features: [], isPopular: false, isActive: true })
  }

  const filteredPlans = pricingPlans.filter(plan => plan.planName?.toLowerCase().includes(searchTerm.toLowerCase()))

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
                  <h3 className="text-xl font-bold">{plan.planName}</h3>
                  <p className="text-sm text-gray-600">{plan.service?.name}</p>
                </div>
                {plan.isPopular && <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs font-semibold rounded">Popular</span>}
              </div>
              <div className="mb-4">
                <div className="text-3xl font-bold text-red-600 flex items-center"><FaRupeeSign className="text-2xl" />{parseFloat(plan.price).toFixed(2)}</div>
                <p className="text-gray-600">{plan.quantity}</p>
                <p className="text-sm text-gray-500">{plan.deliveryTime}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleEdit(plan)} className="flex-1 py-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100">
                  <FaEdit className="inline" /> Edit
                </button>
                <button onClick={() => handleDelete(plan.id)} className="flex-1 py-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100">
                  <FaTrash className="inline" /> Delete
                </button>
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
    </div>
  )
}

export default Pricing
