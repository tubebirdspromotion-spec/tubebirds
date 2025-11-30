import { useParams } from 'react-router-dom'

const ServiceDetail = () => {
  const { slug } = useParams()

  return (
    <div className="min-h-screen py-16">
      <div className="container-custom">
        <h1 className="text-4xl font-bold mb-8">Service: {slug}</h1>
        <p className="text-gray-600">Service detail page coming soon...</p>
      </div>
    </div>
  )
}

export default ServiceDetail
