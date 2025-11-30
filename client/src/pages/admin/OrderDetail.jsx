import { useParams } from 'react-router-dom'

const OrderDetail = () => {
  const { id } = useParams()
  
  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Order Management</h2>
      <p className="text-gray-600">Order {id} management coming soon...</p>
    </div>
  )
}

export default OrderDetail
