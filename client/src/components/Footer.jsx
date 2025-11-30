import { Link } from 'react-router-dom'
import { FaYoutube, FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container-custom py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {/* Company Info */}
          <div className="text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start space-x-2 mb-4">
              <FaYoutube className="text-2xl sm:text-3xl text-red-600" />
              <span className="text-xl sm:text-2xl font-bold text-white">TubeBirds</span>
            </div>
            <p className="text-xs sm:text-sm mb-4 px-4 sm:px-0">
              India's leading YouTube promotion agency. We help content creators grow their channels organically with proven strategies.
            </p>
            <div className="flex justify-center sm:justify-start space-x-4">
              <a href="#" className="hover:text-primary-400 transition-colors">
                <FaFacebook className="text-lg sm:text-xl" />
              </a>
              <a href="#" className="hover:text-primary-400 transition-colors">
                <FaTwitter className="text-lg sm:text-xl" />
              </a>
              <a href="#" className="hover:text-primary-400 transition-colors">
                <FaInstagram className="text-lg sm:text-xl" />
              </a>
              <a href="#" className="hover:text-primary-400 transition-colors">
                <FaLinkedin className="text-lg sm:text-xl" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="text-center sm:text-left">
            <h3 className="text-white font-bold mb-3 sm:mb-4 text-sm sm:text-base">Quick Links</h3>
            <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
              <li><Link to="/" className="hover:text-primary-400 transition-colors">Home</Link></li>
              <li><Link to="/about" className="hover:text-primary-400 transition-colors">About Us</Link></li>
              <li><Link to="/pricing" className="hover:text-primary-400 transition-colors">Pricing</Link></li>
              <li><Link to="/portfolio" className="hover:text-primary-400 transition-colors">Portfolio</Link></li>
              <li><Link to="/contact" className="hover:text-primary-400 transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div className="text-center sm:text-left">
            <h3 className="text-white font-bold mb-3 sm:mb-4 text-sm sm:text-base">Our Services</h3>
            <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
              <li><Link to="/services/youtube-video-promotion" className="hover:text-primary-400 transition-colors">YouTube Promotion</Link></li>
              <li><Link to="/services/youtube-video-seo" className="hover:text-primary-400 transition-colors">Video SEO</Link></li>
              <li><Link to="/services/youtube-video-monetisation" className="hover:text-primary-400 transition-colors">Monetization</Link></li>
              <li><Link to="/services/google-ads-services" className="hover:text-primary-400 transition-colors">Google Ads</Link></li>
              <li><Link to="/services/website-development-services" className="hover:text-primary-400 transition-colors">Web Development</Link></li>
              <li><Link to="/services/website-seo-services" className="hover:text-primary-400 transition-colors">Website SEO</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="text-center sm:text-left">
            <h3 className="text-white font-bold mb-3 sm:mb-4 text-sm sm:text-base">Contact Us</h3>
            <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
              <li className="flex items-start justify-center sm:justify-start">
                <FaMapMarkerAlt className="mr-2 mt-1 text-primary-400 flex-shrink-0" />
                <span>123 Business Street, Mumbai, Maharashtra, India</span>
              </li>
              <li className="flex items-center justify-center sm:justify-start">
                <FaPhone className="mr-2 text-primary-400 flex-shrink-0" />
                <a href="tel:+919876543210" className="hover:text-primary-400 transition-colors">
                  +91 98765 43210
                </a>
              </li>
              <li className="flex items-center justify-center sm:justify-start">
                <FaEnvelope className="mr-2 text-primary-400 flex-shrink-0" />
                <a href="mailto:info@tubebirds.com" className="hover:text-primary-400 transition-colors break-all">
                  info@tubebirds.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-6 sm:mt-8 pt-6 sm:pt-8 text-center text-xs sm:text-sm">
          <p>&copy; {currentYear} TubeBirds. All rights reserved.</p>
          <div className="mt-2 flex flex-wrap justify-center gap-2 sm:gap-4">
            <Link to="/privacy-policy" className="hover:text-primary-400 transition-colors">Privacy Policy</Link>
            <Link to="/terms-of-service" className="hover:text-primary-400 transition-colors">Terms of Service</Link>
            <Link to="/refund-policy" className="hover:text-primary-400 transition-colors">Refund Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
