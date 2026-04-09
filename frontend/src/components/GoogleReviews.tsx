import { JSX, useEffect, useState } from "react";
import { googleReviewsApi, GoogleReview } from "../services/api";
import "../style/GoogleReviews.css";

const GOOGLE_LOGO = (
  <svg viewBox="0 0 24 24" className="gr-google-logo" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

function StarRating({ rating }: { rating: number }): JSX.Element {
  return (
    <div className="gr-stars">
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          className={`gr-star ${i <= Math.round(rating) ? "gr-star--filled" : "gr-star--empty"}`}
        >
          ★
        </span>
      ))}
    </div>
  );
}

function GoogleReviews(): JSX.Element | null {
  const [data, setData] = useState<{ reviews: GoogleReview[]; rating: number; totalRatings: number } | null>(null);

  useEffect(() => {
    googleReviewsApi.get()
      .then((res) => {
        const d = res.data as { reviews: GoogleReview[]; rating: number; totalRatings: number };
        if (d?.rating > 0 || d?.reviews?.length) setData(d);
      })
      .catch(() => {});
  }, []);

  if (!data) return null;

  return (
    <section className="gr-section">
      <div className="gr-inner">
        <div className="gr-header">
          <h2 className="gr-heading">What Our Customers Say</h2>
          <div className="gr-divider" />
          <div className="gr-overall">
            <StarRating rating={data.rating} />
            <span className="gr-overall-score">{data.rating.toFixed(1)}</span>
            <span className="gr-overall-count">({data.totalRatings} reviews)</span>
            <div className="gr-powered">
              {GOOGLE_LOGO}
              <span>Google Reviews</span>
            </div>
          </div>
        </div>

        {data.reviews.length > 0 ? (
          <div className="gr-grid">
            {data.reviews.map((review, i) => (
              <div key={i} className="gr-card">
                <div className="gr-card-top">
                  <img
                    src={review.profile_photo_url}
                    alt={review.author_name}
                    className="gr-avatar"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                  <div className="gr-author-info">
                    <p className="gr-author-name">{review.author_name}</p>
                    <p className="gr-time">{review.relative_time_description}</p>
                  </div>
                </div>
                <StarRating rating={review.rating} />
                {review.text && <p className="gr-text">{review.text}</p>}
              </div>
            ))}
          </div>
        ) : (
          <p className="gr-no-reviews">Be the first to leave a written review!</p>
        )}

        <a
          className="gr-cta"
          href={`https://search.google.com/local/reviews?placeid=${encodeURIComponent("")}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          Read all reviews on Google →
        </a>
      </div>
    </section>
  );
}

export default GoogleReviews;
