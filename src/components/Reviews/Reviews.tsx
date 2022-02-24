import React, { useContext, useState, useEffect } from "react"
import ReactStarsRating from 'react-awesome-stars-rating';

import Review from "../Review"
import ReviewsContext from "../ReviewsProvider"

const Reviews = () => {
  const {
    reviewsCount,
    reviews,
    userReview,
    loadMore,
    loadingReviews,
    averageScore
  } = useContext(ReviewsContext)
  const [loadingMore, setLoadingMore] = useState(false)
  const [reviewsJSX, setReviewsJSX] = useState<React.ReactNode[] | null>(null)
  const [userReviewJSX, setUserReviewJSX] = useState<React.ReactNode>(null)
  useEffect(() => {
    setReviewsJSX(reviews.map(review => {
      return (
        <Review data={review} key={review.id} />
      )
    }))
  }, [reviews])
  useEffect(() => {
    if (userReview) {
      setUserReviewJSX(
        <div className="d-flex flex-column">
          <p className="fw-bold mb-1">Your review:</p>
          <Review data={userReview} />
        </div>
      )
    }
  }, [userReview])
  const loadMoreReviews = async () => {
    setLoadingMore(true)
    await loadMore()
    setLoadingMore(false)
  }
  return (
    <div>
      {
        loadingReviews ?
          <p className="small fs-6">
            Loading reviews...
          </p>
        :
          (reviews.length > 0 || userReview) ?
            <div className="d-flex flex-column">
              <div className="mb-3">
                <div>
                  <p className="mb-0 small">
                    Average rating: {averageScore}/5 ({reviewsCount} review{reviewsCount === 1 ? "" : "s"})
                  </p>
                </div>
                <ReactStarsRating
                  isEdit={false}
                  isHalf={true}
                  value={averageScore}
                  isArrowSubmit={false}
                  size={28}
                />
              </div>
              <div>
                {userReviewJSX}
                {reviewsJSX}
              </div>
              {
                (
                  (reviews.length > 0) &&
                  (reviews.length < reviewsCount)
                ) &&
                <button
                  className="btn btn-primary"
                  onClick={loadMoreReviews}
                  disabled={loadingMore ? true : undefined}
                >Load more reviews</button>
              }
            </div>
          : <p className="small fs-6">There are no reviews</p>
      }
    </div>
  )
}

export default Reviews