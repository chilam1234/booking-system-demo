interface Booking {
  id: string;
  data: {
    start: string;
    end: string;
    room: string;
    remarks: string;
    userId: string;
    username: string;
  };
}

export default Booking;
