import { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  onSnapshot,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { useAuth } from "../../context/AuthContext";
import { db } from "../../firebase";

import "./Bookings.css";
import { Toaster, toast } from "sonner";

export default function Bookings() {
  const { user, authLoading } = useAuth();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmBooking, setConfirmBooking] = useState(null);

  useEffect(() => {
    if (authLoading) return;

    if (!user || !user.srn) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, "bookings"),
      where("srn", "==", user.srn)
    );

    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setBookings(data);
      setLoading(false);
    });

    return () => unsub();
  }, [user, authLoading]);

  if (loading) {
    return <div className="bookings-loading">Loading bookings…</div>;
  }

  const now = new Date();

  const getBookingDateTime = (b) => {
    const [start] = b.time.split(" - ");
    return new Date(`${b.date} ${start}`);
  };

  const upcoming = bookings.filter(
    (b) => getBookingDateTime(b) > now
  );

  const past = bookings.filter(
    (b) => getBookingDateTime(b) <= now
  );

  const handleCancel = async (booking) => {
    const deletePromise = deleteDoc(doc(db, "bookings", booking.id));

    toast.promise(deletePromise, {
      loading: "Cancelling booking...",
      success: "✅ Booking cancelled",
      error: "❌ Failed to cancel booking",
    });

    try {
      await deletePromise;
      setConfirmBooking(null);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bookings-layout">
      <Toaster richColors position="top-center" />
      <h1 className="page-title">My Bookings</h1>

      {/* Upcoming */}
      <section className="bookings-section">
        <h2>Upcoming</h2>
        {upcoming.length === 0 ? (
          <p className="empty-text">No upcoming bookings</p>
        ) : (
          <div className="bookings-list">
            {upcoming.map((b) => (
              <BookingCard
                key={b.id}
                booking={b}
                isExpired={false}
                onCancel={() => setConfirmBooking(b)}
              />
            ))}
          </div>
        )}
      </section>

      {/* Past */}
      <section className="bookings-section">
        <h2>Past</h2>
        {past.length === 0 ? (
          <p className="empty-text">No past bookings</p>
        ) : (
          <div className="bookings-list">
            {past.map((b) => (
              <BookingCard
                key={b.id}
                booking={b}
                isExpired={true}
              />
            ))}
          </div>
        )}
      </section>

      {/* CONFIRM MODAL */}
      {confirmBooking && (
        <>
          <div
            className="confirm-overlay"
            onClick={() => setConfirmBooking(null)}
          />

          <div className="confirm-modal">
            <h3>Cancel Booking?</h3>
            <p>
              {confirmBooking.courtName} <br />
              {confirmBooking.date} — {confirmBooking.time}
            </p>

            <div className="confirm-actions">
              <button
                className="confirm-no"
                onClick={() => setConfirmBooking(null)}
              >
                Keep Booking
              </button>

              <button
                className="confirm-yes"
                onClick={() => handleCancel(confirmBooking)}
              >
                Yes, Cancel
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function BookingCard({ booking, isExpired, onCancel }) {
  return (
    <div className={`booking-card ${isExpired ? "expired" : "upcoming"}`}>
      <div>
        <h3 className="court-name">{booking.courtName}</h3>

        <p className="booking-date">
          {new Date(booking.date).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
        </p>

        <p className="booking-time">{booking.time}</p>
      </div>

      <div className="booking-actions">
        <span className={`status ${isExpired ? "done" : "active"}`}>
          {isExpired ? "Expired" : "Upcoming"}
        </span>

        {!isExpired && (
          <button className="cancel-btn" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}
