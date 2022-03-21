import React, { useState, useEffect, useContext } from "react"
import ReactStarsRating from 'react-awesome-stars-rating';

import ReviewsContext, { IReview } from "../ReviewsProvider"
import { ISOToFull } from "../../lib"

export interface ReviewProps {
  data: IReview
}

const Review = ({ data }: ReviewProps) => {
  const { user } = useContext(ReviewsContext)
  return (
    <div className="pb-1 d-flex flex-column align-items-start">
      <div className="pb-1">
        <div className="d-flex">
          <p className="fw-bold mb-0">
            {data.author ? data.author.username : "User"}
          </p>
          <p className="ms-2 mb-0">
            {"\t"} on {ISOToFull(data.createdAt)}
          </p>
        </div>
        <ReactStarsRating
          isEdit={false}
          isHalf={true}
          value={data.score}
          isArrowSubmit={false}
          size={22}
        />
      </div>
      {
        data.comment && (
          <div className="p-3 border rounded">
            <p className="mb-0">
              {data.comment}
            </p>
          </div>
        )
      }
    </div>
  )
}

export default Review
