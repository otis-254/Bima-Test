import { createServer } from 'http'
import { parse } from 'url'
import next from 'next'

// Set Node.js memory limit
const memoryLimit = process.env.NODE_OPTIONS || '--max-old-space-size=512'
console.log('Memory limit set to:', memoryLimit)

// Set port and environment
const port = parseInt(process.env.PORT || '3000', 10)
const dev = process.env.NODE_ENV !== 'production'
console.log('Environment:', process.env.NODE_ENV)
console.log('Port:', port)

const app = next({ dev })
const handle = app.getRequestHandler()

// Add error handling
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err)
})

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err)
})

app.prepare().then(() => {
  console.log('Next.js app prepared successfully')
  
  createServer((req, res) => {
    console.log('Incoming request:', req.url)
    const parsedUrl = parse(req.url, true)
    handle(req, res, parsedUrl)
  }).listen(port, (err) => {
    if (err) {
      console.error('Failed to start server:', err)
      throw err
    }
    console.log(`> Server is running on http://localhost:${port}`)
  })
}).catch((err) => {
  console.error('Failed to prepare Next.js app:', err)
  process.exit(1)
})