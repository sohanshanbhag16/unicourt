import { useState, useEffect } from "react";
import "./Courts.css";

import {
  collection,
  onSnapshot,
  query,
  where,
  setDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../firebase";

import { useAuth } from "../../context/AuthContext";
import { Toaster, toast } from "sonner";

/* =======================
   DATE CONSTANTS
======================= */
const baseToday = new Date();
const tomorrow = new Date(baseToday.getTime() + 86400000);

const daysOfWeek = [
  "Sunday","Monday","Tuesday","Wednesday",
  "Thursday","Friday","Saturday"
];

const formatDate = (date) => date.toISOString().split("T")[0];

/* =======================
   TIME SECTIONS
======================= */
const TIME_SECTIONS = {
  Morning: { start: 6, end: 12 },
  Afternoon: { start: 12, end: 17 },
  Evening: { start: 17, end: 22 },
};

const formatTime = (hour) => `${hour}:00`;

/* =======================
   SLOT GENERATOR (WITH PAST CHECK)
======================= */
const generateSlots = (start, end, bookedSlots, selectedDate) => {
  const slots = [];
  const now = new Date();

  for (let h = start; h < end; h++) {
    const time = `${formatTime(h)} - ${formatTime(h + 1)}`;
    const isBooked = bookedSlots.includes(time);

    // 🔥 CHECK IF SLOT IS IN THE PAST
    const slotDateTime = new Date(selectedDate);
    slotDateTime.setHours(h, 0, 0, 0);

    const isPast =
      formatDate(selectedDate) === formatDate(now) &&
      slotDateTime <= now;

    slots.push({
      time,
      status: isBooked || isPast ? "Booked" : "Available",
      isPast,
    });
  }

  return slots;
};

export default function Courts() {
  const user = useAuth().user;

  const [selectedSport, setSelectedSport] = useState("All");
  const [activeCourt, setActiveCourt] = useState(null);
  const [isClosing, setIsClosing] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);

  const [courts, setCourts] = useState([]);
  const [loadingCourts, setLoadingCourts] = useState(true);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [selectedDate, setSelectedDate] = useState(baseToday);

  /* =======================
     LOCK SCROLL
  ======================= */
  useEffect(() => {
    document.body.style.overflow = activeCourt ? "hidden" : "";
    return () => (document.body.style.overflow = "");
  }, [activeCourt]);

  /* =======================
     FETCH COURTS
  ======================= */
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "courts"), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        courtId: doc.id,
        ...doc.data(),
      }));
      setCourts(data);
      setLoadingCourts(false);
    });

    return () => unsub();
  }, []);

  /* =======================
     FETCH BOOKINGS
  ======================= */
  useEffect(() => {
    if (!activeCourt) return;

    const q = query(
      collection(db, "bookings"),
      where("courtId", "==", activeCourt.courtId),
      where("date", "==", formatDate(selectedDate))
    );

    const unsub = onSnapshot(q, (snapshot) => {
      const slots = snapshot.docs.map((doc) => doc.data().time);
      setBookedSlots(slots);
    });

    return () => unsub();
  }, [activeCourt, selectedDate]);

  const filteredCourts =
    selectedSport === "All"
      ? courts
      : courts.filter((c) => c.sport === selectedSport);

  const closePanel = () => {
    setIsClosing(true);
    setTimeout(() => {
      setActiveCourt(null);
      setBookedSlots([]);
      setSelectedSlot(null);
      setIsClosing(false);
    }, 250);
  };

  /* =======================
     BOOK SLOT
  ======================= */
  const bookSlot = async () => {
    if (!selectedSlot || !activeCourt) return;

    const bookingId = `${activeCourt.courtId}_${formatDate(
      selectedDate
    )}_${selectedSlot}`;

    const bookingPromise = setDoc(doc(db, "bookings", bookingId), {
      courtId: activeCourt.courtId,
      courtName: activeCourt.name,
      date: formatDate(selectedDate),
      time: selectedSlot,
      createdAt: serverTimestamp(),
      srn: user.srn,
      name: user.name,
    });

    toast.promise(bookingPromise, {
      loading: "Booking court...",
      success: "✅ Booking successful!",
      error: "❌ Slot already booked or error occurred",
    });

    try {
      await bookingPromise;
      closePanel();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="courts-layout">
      <Toaster richColors position="top-center" />

      <main className="courts-main">
        <h1 className="page-title">Available Courts</h1>

        {loadingCourts && <p>Loading courts...</p>}

        <div className="courts-grid">
          {filteredCourts.map((court) => (
            <div key={court.courtId} className="court-card">
              <span className="sport-badge">{court.sport}</span>
              <h3>{court.name}</h3>
              <p className="court-location">{court.location}</p>

              <button
                className="book-btn"
                onClick={() => {
                  setSelectedSlot(null);
                  setActiveCourt(court);
                }}
              >
                View Slots →
              </button>
            </div>
          ))}
        </div>
      </main>

      {activeCourt && (
        <>
          <div className="panel-overlay" onClick={closePanel} />

          <div className={`booking-panel ${isClosing ? "slide-out" : ""}`}>
            <div className="panel-header">
              <h2>{activeCourt.name}</h2>
              <button className="panel-close" onClick={closePanel}>
                ✕
              </button>
            </div>

            {/* DATE STRIP */}
            <div className="date-strip">
              {[baseToday, tomorrow].map((date) => (
                <button
                  key={formatDate(date)}
                  className={`date-pill ${
                    formatDate(selectedDate) === formatDate(date)
                      ? "active"
                      : ""
                  }`}
                  onClick={() => setSelectedDate(date)}
                >
                  <span>{daysOfWeek[date.getDay()]}</span>
                  <br />
                  <strong>{date.getDate()}</strong>
                </button>
              ))}
            </div>

            {/* SLOTS */}
            <div className="slots-grid">
              {Object.entries(TIME_SECTIONS).map(([section, hours]) => (
                <div key={section} className="time-section">
                  <h3 className="time-title">{section}</h3>

                  <div className="time-slots">
                    {generateSlots(
                      hours.start,
                      hours.end,
                      bookedSlots,
                      selectedDate
                    ).map((slot, i) => (
                      <button
                        key={i}
                        className={`slot-button ${
                          slot.status === "Booked"
                            ? "booked"
                            : selectedSlot === slot.time
                            ? "selected"
                            : "available"
                        }`}
                        disabled={slot.status === "Booked"}
                        onClick={() =>
                          setSelectedSlot((prev) =>
                            prev === slot.time ? null : slot.time
                          )
                        }
                      >
                        {slot.time}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {selectedSlot && (
              <div style={{ marginTop: 32, textAlign: "right" }}>
                <button className="book-btn" onClick={bookSlot}>
                  Book Slot
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
