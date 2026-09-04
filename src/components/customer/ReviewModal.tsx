import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { X, Star, CheckCircle2, AlertCircle } from 'lucide-react';

export const ReviewModal: React.FC = () => {
  const {
    isReviewModalOpen,
    setIsReviewModalOpen,
    targetAppointmentForReview,
    setTargetAppointmentForReview,
    submitReview
  } = useApp();

  const { currentUser } = useAuth();

  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isReviewModalOpen || !targetAppointmentForReview) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) {
      setErrorMessage('Please provide your feedback comment.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    const res = submitReview({
      customer_id: currentUser?.id || targetAppointmentForReview.customer_id,
      customer_name: currentUser?.full_name || targetAppointmentForReview.customer_name,
      customer_avatar:
        currentUser?.avatar_url ||
        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&h=100&q=80',
      salon_id: targetAppointmentForReview.salon_id,
      appointment_id: targetAppointmentForReview.id,
      rating,
      comment
    });

    setIsSubmitting(false);

    if (res.success) {
      setIsReviewModalOpen(false);
      setTargetAppointmentForReview(null);
      setComment('');
      setRating(5);
    } else {
      setErrorMessage(res.error || 'Failed to submit review.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white border border-neutral-200 rounded-sm shadow-2xl w-full max-w-lg overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between bg-neutral-50">
          <div>
            <h2 className="text-sm font-semibold text-neutral-950">Leave a Verified Review</h2>
            <p className="text-[11px] text-neutral-500">
              For {targetAppointmentForReview.service_name} at {targetAppointmentForReview.salon_name}
            </p>
          </div>
          <button
            onClick={() => {
              setIsReviewModalOpen(false);
              setTargetAppointmentForReview(null);
            }}
            className="text-neutral-400 hover:text-neutral-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-neutral-900 text-xs">
          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-sm flex items-start gap-2 text-red-700">
              <AlertCircle className="w-4 h-4 flex-none mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Star Selector */}
          <div>
            <label className="text-[10px] uppercase font-mono text-neutral-400 block mb-2 font-bold">
              Your Overall Rating
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="p-1 text-neutral-300 hover:text-amber-400 focus:outline-none transition-colors"
                >
                  <Star
                    className={`w-6 h-6 ${
                      star <= rating ? 'fill-amber-400 text-amber-400' : 'text-neutral-300'
                    }`}
                  />
                </button>
              ))}
              <span className="text-xs font-mono font-bold text-neutral-700 ml-2">
                {rating}.0 / 5.0
              </span>
            </div>
          </div>

          {/* Comments */}
          <div>
            <label className="text-[10px] uppercase font-mono text-neutral-400 block mb-1 font-bold">
              Review Details & Styling Outcome
            </label>
            <textarea
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="How was the styling, punctuality, and studio experience?"
              className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-sm text-xs focus:outline-none focus:border-neutral-900 focus:bg-white resize-none"
            />
          </div>

          <div className="flex items-center gap-2 text-[11px] text-emerald-700 bg-emerald-50 border border-emerald-200 p-2.5 rounded-sm">
            <CheckCircle2 className="w-4 h-4 flex-none" />
            <span>This review will carry a Verified Client badge tied to Appointment #{targetAppointmentForReview.id}.</span>
          </div>

          {/* Buttons */}
          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => {
                setIsReviewModalOpen(false);
                setTargetAppointmentForReview(null);
              }}
              className="px-4 py-2 border border-neutral-200 rounded-sm text-neutral-600 hover:bg-neutral-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 bg-neutral-950 text-white font-medium rounded-sm hover:bg-neutral-800 transition-colors"
            >
              {isSubmitting ? 'Posting...' : 'Publish Verified Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
