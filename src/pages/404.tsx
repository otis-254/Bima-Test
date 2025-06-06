import { NextPage } from 'next'

const Custom404: NextPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
        <h2 className="text-2xl font-bold text-primary mb-4">404 - Page Not Found</h2>
        <p className="text-gray-600 mb-4">Sorry, the page you are looking for does not exist.</p>
        <a
          href="/"
          className="inline-block bg-primary text-white px-4 py-2 rounded hover:bg-primary/90 transition-colors"
        >
          Return Home
        </a>
      </div>
    </div>
  )
}

export default Custom404 