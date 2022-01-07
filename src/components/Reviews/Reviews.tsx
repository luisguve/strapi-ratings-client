import React, { useContext, useState, useEffect } from "react"
import { Stack } from "@strapi/design-system/Stack"
import { Box } from "@strapi/design-system/Box"
import { Typography } from "@strapi/design-system/Typography"
import { Button } from "@strapi/design-system/Button"
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
  const [userReviewJSX, setUserReviewJSX] = useState<React.ReactNode | null>(null)
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
        <Box>
          <Stack size={2}>
            <Typography variant="beta">Your review:</Typography>
            <Review data={userReview} />
          </Stack>
        </Box>
      )
    }
  }, [userReview])
  const loadMoreReviews = async () => {
    setLoadingMore(true)
    await loadMore()
    setLoadingMore(false)
  }
  return (
    <Box>
      {
        loadingReviews ?
          <Typography variant="beta">
            Loading Reviews...
          </Typography>
        :
          (reviews.length > 0 || userReview) ?
            <Stack size={3}>
              <Box>
                <Box>
                  <Typography variant="beta">
                    Average rating: {averageScore}/5 ({reviewsCount} {reviewsCount > 1 ? "reviews" : "review"})
                  </Typography>
                </Box>
                <ReactStarsRating
                  isEdit={false}
                  isHalf={true}
                  value={averageScore}
                  isArrowSubmit={false}
                  size={28}
                />
              </Box>
              <Box>
                {userReviewJSX}
                {reviewsJSX}
              </Box>
              {
                (
                  (reviews.length > 0) &&
                  (reviews.length < reviewsCount)
                ) &&
                <Button
                  variant="secondary"
                  onClick={loadMoreReviews}
                  loading={loadingMore ? true : false}
                >Load more reviews</Button>
              }
            </Stack>
          : <Typography variant="beta">There are no reviews</Typography>
      }
    </Box>
  )
}

export default Reviews