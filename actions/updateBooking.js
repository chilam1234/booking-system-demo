const updateBooking = async ({ data, id }, successCallback, failedCallback) => {
  const { start, end, room, remarks } = data
  try {
    const response = await fetch('/api/updateBooking', {
      method: 'PUT',
      body: JSON.stringify({ id, start, end, room, remarks }),
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

export default updateBooking
