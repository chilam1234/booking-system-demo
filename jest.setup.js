import '@testing-library/jest-dom/extend-expect'
import 'whatwg-fetch'
import { server } from './mocks/server.js'

beforeAll(() => {
  console.log('mock server starting')
  server.listen()
})
afterEach(() => {
  server.resetHandlers()
})
afterAll(() => {
  console.log('mock server closing')
  server.close()
})
