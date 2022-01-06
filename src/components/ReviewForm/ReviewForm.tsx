import React, { useState, useContext } from "react"
import { Textarea } from '@strapi/design-system/Textarea';
import { Button } from '@strapi/design-system/Button';
import { Box } from "@strapi/design-system/Box"
import { Typography } from '@strapi/design-system/Typography';
import ReactStarsRating from 'react-awesome-stars-rating';

import ReviewsContext from "../ReviewsProvider"

export interface ReviewFormProps {
  label?: string
}

const ReviewForm = (props: ReviewFormProps) => {
  const { user, userReview, postReview } = useContext(ReviewsContext)
  const [comment, setComment] = useState("")
  const [score, setScore] = useState(5)
  const [sending, setSending] = useState(false)
  const handleInputComment = (e: React.FormEvent<HTMLInputElement>) => {
    setComment(e.currentTarget.value)
  }
  const handleInputScore = (newScore: number) => {
    setScore(newScore)
  }
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSending(true)
    const successful = await postReview(comment, score)
    setSending(false)
  }
  return (
    <>
      {
        !user?
          <Box paddingTop={3} paddingBottom={3}>
            <Typography variant="beta">Login to post a review</Typography>
          </Box>
        : userReview?
            null
          :
          <form onSubmit={handleSubmit}>
            <Box paddingTop={3} paddingBottom={3}>
              <Typography variant="beta">{props.label || "Post a review"}</Typography>
              <Box paddingBottom={2}>
                <Typography variant="omega">Your score: {score}/5</Typography>
                <ReactStarsRating
                  isEdit={true}
                  isHalf={false}
                  value={score}
                  onChange={handleInputScore}
                />
              </Box>
              <Textarea
                placeholder="Type a comment here (optional)"
                label="Optional comment"
                name="content"
                onChange={handleInputComment}
              >
                {comment}
              </Textarea>
              <Box paddingTop={2}>
                <Button
                  type="submit"
                  loading={sending ? true : undefined}
                  disabled={score < 1 ? true : false}
                >Submit</Button>
              </Box>
            </Box>
          </form>
      }
    </>
  )
}

export default ReviewForm