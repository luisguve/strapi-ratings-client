import React, { useState, useContext } from "react"
import ReactStarsRating from 'react-awesome-stars-rating';

import ReviewsContext from "../ReviewsProvider"

export interface ReviewFormProps {
  label?: string
}

const ReviewForm = (props: ReviewFormProps) => {
  const { user, userReview, postReview, canPostReview } = useContext(ReviewsContext)
  const [comment, setComment] = useState("")
  const [score, setScore] = useState(5)
  const [sending, setSending] = useState(false)
  const handleInputComment = (e: React.FormEvent<HTMLTextAreaElement>) => {
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
  if (!user) {
    return (
      <div className="py-2">
        <p className="fs-4 mb-0">Login to post a review</p>
      </div>
    )
  }
  if (!canPostReview) {
    return (
      <div className="py-2">
        <p className="fs-4 mb-0">Purchase this item to post a review</p>
      </div>
    )
  }
  if (userReview !== null) {
    return null
  }
  return (
    <form onSubmit={handleSubmit}>
      <div className="py-3">
        <p className="fs-4">{props.label || "Post a review"}</p>
        <div className="d-flex flex-column mb-1">
          <div>
            <p className="fw-bold small mb-1">Your score: {score}/5</p>
          </div>
          <ReactStarsRating
            isEdit={true}
            isHalf={false}
            value={score}
            size={22}
            onChange={handleInputScore}
          />
        </div>
        <div className="d-flex flex-column mb-1">
          <label>
            <p className="fw-bold small mb-1">Optional comment</p>
            <textarea
              className="form-control"
              rows={3}
              onChange={handleInputComment}
              placeholder="Type a comment here (optional)"
              name="content"
              value={comment}
            ></textarea>
          </label>
        </div>
        <div className="pt-1">
          <button
            className="btn btn-primary"
            type="submit"
            disabled={((score < 1) || sending) ? true : undefined}
          >Submit</button>
        </div>
      </div>
    </form>
  )
}

export default ReviewForm