const deleteBooking = async (id: string, successCallback, failedCallback) => {
  try {
    const response = await fetch("/api/deleteBooking", {
      method: "DELETE",
      body: JSON.stringify({ id }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.ok) {
      successCallback();
      return;
    }
    const err = await response.json();
    failedCallback(err);
  } catch (err) {
    failedCallback(err);
  }
};
export default deleteBooking;
