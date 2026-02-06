# mock current data booking
BOOKINGS = [
    {"id": "1", "date": "2026-02-05", "time": "19:00", "people": 2},
    {"id": "2", "date": "2026-02-05", "time": "19:00", "people": 6}
]


def get_bookings_for_slot(date: str, time: str):
    return [b for b in BOOKINGS if b["date"] == date and b["time"] == time]
