// test-api.js

const axios = require('axios')

const API_URL = 'https://hmsapi.daleelalzowar.sa/api/login'

const testLogin = async () => {
  console.log('🔍 Testing API Login...')
  console.log('URL:', API_URL)

  const credentials = {
    id: '53204',
    password: 'Yusuf-daleel@123'
  }

  console.log('Credentials:', credentials)
  console.log('─'.repeat(50))

  try {
    console.log('📤 Sending request...')

    const response = await axios.post(API_URL, credentials, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      timeout: 10000 // 10 seconds timeout
    })

    console.log('\n✅ SUCCESS!')
    console.log('Status:', response.status)
    console.log('Status Text:', response.statusText)
    console.log('─'.repeat(50))
    console.log('Response Headers:')
    console.log(JSON.stringify(response.headers, null, 2))
    console.log('─'.repeat(50))
    console.log('Response Data:')
    console.log(JSON.stringify(response.data, null, 2))

    // Extract token if exists
    if (response.data?.access_token) {
      console.log('─'.repeat(50))
      console.log('🔑 Access Token:', response.data.access_token)
    }
  } catch (error) {
    console.log('\n❌ ERROR!')

    if (error.response) {
      // Server responded with error
      console.log('Status:', error.response.status)
      console.log('Status Text:', error.response.statusText)
      console.log('─'.repeat(50))
      console.log('Error Response Data:')
      console.log(JSON.stringify(error.response.data, null, 2))
      console.log('─'.repeat(50))
      console.log('Error Response Headers:')
      console.log(JSON.stringify(error.response.headers, null, 2))
    } else if (error.request) {
      // Request was made but no response
      console.log('No response received from server')
      console.log('Error:', error.message)
    } else {
      // Error in setting up request
      console.log('Error:', error.message)
    }

    console.log('─'.repeat(50))
    console.log('Full Error:')
    console.log(error)
  }
}

// Run the test
testLogin()
