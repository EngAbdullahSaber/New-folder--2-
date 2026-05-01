// src/libs/error.ts

import { toast } from 'react-toastify'

export function handleError(error: any) {
  let errorMessage = 'حدث خطأ ما' // Default message

  if (error.response) {
    // Server responded with a status other than 200
    errorMessage = error.response.data.message || errorMessage // Use custom message if available
    console.error('Error Response:', error.response.data)
    toast.error(errorMessage, { position: 'top-center' }) // Show error message to the user
  } else if (error.request) {
    // Request was made, but no response
    errorMessage = error.request.statusText || errorMessage
    toast.error(errorMessage, { position: 'top-center' }) // Show error message to the user
    console.error('Error Request:', error.request)
  } else {
    // Some other error (e.g., in setting up the request)
    errorMessage = error.message || errorMessage
    toast.error(errorMessage, { position: 'top-center' }) // Show error message to the user
    console.error('Error:', error.message)
  }

  // Now, throw the full error object so it can be handled by the calling function
  throw error // Propagate the full error object
}
