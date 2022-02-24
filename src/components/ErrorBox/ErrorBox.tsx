import React, { useContext } from "react"

import ReviewsContext from "../ReviewsProvider"

const ErrorBox = () => {
  const { errorHelperMessage } = useContext(ReviewsContext)
  if (!errorHelperMessage) {
    return null
  }
  return (
    <div className="py-2">
      <div className="alert alert-danger">{errorHelperMessage}</div>
    </div>
  )
}

export default ErrorBox
