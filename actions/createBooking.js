const createBooking = async (data, successCallback, failedCallback) => {
  const { start, end, room, remarks } = data
  try {
    const response = await fetch('/api/createBooking', {
      method: 'POST',
      body: JSON.stringify({ start, end, room, remarks }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
    if (response.ok) {
      successCallback()
      return
    }
    const err = await response.json()
    failedCallback(err)
  } catch (err) {
    failedCallback(err)
  }
}

export default createBooking
