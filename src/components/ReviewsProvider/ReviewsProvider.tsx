import React, { useState, useEffect, createContext, useContext, FC } from "react"

export interface IAuthor {
  username: string,
  email: string,
  id: number
}
export interface IReview {
  id: number,
  createdAt: string,
  comment: string | null,
  author: IAuthor | null,
  score: number,
}
export interface IReviewsData {
  reviewsCount: number,
  averageScore: number,
  userReview: IReview | null,
  reviews: IReview[]
}
export interface IUser {
  id: number,
  token: string,
  username: string,
  email: string
}

interface ICheckUserData {
  review: IReview | null;
}

interface ICoreContext {
  reviewsCount: number,
  reviews: IReview[],
  userReview: IReview | null,
  averageScore: number,
  loadingReviews: boolean,
  canPostReview: boolean,
  errorHelperMessage: string | null,
  setContentID: (contentID: string) => void,
  setCanPostReview: (canPostReview: boolean) => void,
  loadMore: () => Promise<void>,
  apiURL: string,
  user: IUser | null,
  setUser: (user: IUser| null) => void,
  postReview: (content: string, score: number) => Promise<boolean>
}
export interface IConfigContext {
  setUser: (user: IUser| null) => void,
  setContentID: (contentID: string) => void,
  setCanPostReview: (canPostReview: boolean) => void
}

const defaultContext: ICoreContext = {
  reviewsCount: 0,
  reviews: ([] as IReview[]),
  userReview: null,
  averageScore: 0,
  loadingReviews: true,
  canPostReview: false,
  errorHelperMessage: null,
  setContentID: (contentID: string) => {},
  setCanPostReview: (canPostReview: boolean) => {},
  loadMore: async () => { return new Promise<void>(resolve => resolve()) },
  apiURL: "",
  user: null,
  setUser: (user: IUser | null) => {},
  postReview: (content: string, score: number) => { return new Promise<boolean>(resolve => resolve(true)) }
}

const defaultConfig: IConfigContext = {
  setUser: (user: IUser | null) => {},
  setContentID: (contentID: string) => {},
  setCanPostReview: (canPostReview: boolean) => {}
}

const CoreContext = createContext(defaultContext)
export const ConfigContext = createContext(defaultConfig)

interface ConfigProviderProps {
  children: React.ReactNode
}

const ConfigProvider: FC<ConfigProviderProps> = (props: ConfigProviderProps) => {
  const { setUser, setContentID, setCanPostReview } = useContext(CoreContext)
  return (
    <ConfigContext.Provider value={
      {setUser, setContentID, setCanPostReview}
    }>
      {props.children}
    </ConfigContext.Provider>
  )
}

export interface ProviderProps {
  children: React.ReactNode,
  contentID?: string,
  apiURL: string
}

export const ReviewsProvider: FC<ProviderProps> = (props: ProviderProps) => {
  const [reviewsData, setReviewsData] = useState<IReviewsData>({
    reviewsCount: 0,
    reviews: [] as IReview[],
    averageScore: 0,
    userReview: null
  })
  const [user, setUser] = useState<IUser | null>(null)
  const [canPostReview, setCanPostReview] = useState<boolean>(false)
  const [loadingReviews, setLoadingReviews] = useState(true)
  const [errorHelperMessage, setErrorHelperMessage] = useState<string | null>(null)
  const [contentID, setContentID] = useState<string>(props.contentID || "")
  useEffect(() => {
    const fetchReviews = async () => {
      const url = `${props.apiURL}/api/ratings/reviews/${contentID}`
      const options: RequestInit = {}
      if (user) {
        options.headers = {
          Authorization: `Bearer ${user.token}`
        }
      }
      try {
        const res = await fetch(url, options)
        const data: IReviewsData = await res.json()
        if (!res.ok) {
          throw data
        }
        setReviewsData(data)
        setErrorHelperMessage(null)
      } catch(err) {
        console.log(err)
        setErrorHelperMessage("Something went wrong. Please see console")
      } finally {
        setLoadingReviews(false)
      }
    }
    if (contentID) {
      fetchReviews()
    }
  }, [contentID])
  useEffect(() => {
    const checkUserPostedReview = async () => {
      if (!user || !contentID) {
        return
      }
      const url = `${props.apiURL}/api/ratings/reviews/${contentID}/user-review`
      const options: RequestInit = {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      }
      try {
        const res = await fetch(url, options)
        const data: ICheckUserData = await res.json()
        if (!res.ok) {
          throw data
        }
        setReviewsData((prev: IReviewsData) => {
          let newReviewList = prev.reviews.filter(r => {
            return (data.review !== null) && (r.id !== data.review.id)
          })
          return {
            ...prev,
            reviews: newReviewList,
            userReview: data.review
          }
        })
        setErrorHelperMessage(null)
      } catch(err) {
        console.log(err)
        setErrorHelperMessage("Something went wrong. Please see console")
      }
    }
    checkUserPostedReview()
  }, [user])
  const loadMore = async () => {
    const start = reviewsData.reviews.length
    const url = `${props.apiURL}/api/ratings/reviews/${contentID}?start=${start}&ignoreCount=1`
    try {
      const res = await fetch(url)
      const data: IReviewsData = await res.json()
      if (!res.ok) {
        throw data
      }
      setReviewsData({
        ...reviewsData,
        reviews: reviewsData.reviews.concat(data.reviews)
      })
      setErrorHelperMessage(null)
    } catch (err) {
      console.log(err)
      setErrorHelperMessage("Something went wrong. Please see console")
    }
  }
  const addUserReview = (comment: string, score: number, reviewID: number) => {
    const newReview: IReview = {
      id: reviewID,
      comment,
      score,
      createdAt: (new Date()).toISOString(),
      author: user
    }
    // Update average rating
    const oldTotalScore = reviewsData.averageScore * reviewsData.reviewsCount
    const newAvg = (oldTotalScore + score) / (reviewsData.reviewsCount + 1)
    setReviewsData({
      ...reviewsData,
      averageScore: newAvg,
      reviewsCount: reviewsData.reviewsCount + 1,
      userReview: newReview
    })
  }
  const postReview = async (comment: string, score: number) => {
    if (!user || !user.token || !canPostReview) {
      return false
    }
    try {
      if (!contentID) {
        throw new Error("No content ID")
      }
      const url = `${props.apiURL}/api/ratings/reviews/${contentID}`
      const res = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-type": "application/json"
        },
        body: JSON.stringify({score, comment})
      })
      const data = await res.json()
      if (!data.id) {
        throw data
      }
      // Add comment.
      addUserReview(comment, score, data.id)
      setErrorHelperMessage(null)
      return true
    } catch(err) {
      console.log(err)
      setErrorHelperMessage("Something went wrong")
      return false
    }
  }
  return (
    <CoreContext.Provider value={
      {
        ...reviewsData,
        apiURL: props.apiURL,
        setContentID,
        setCanPostReview,
        canPostReview,
        loadingReviews,
        errorHelperMessage,
        loadMore,
        postReview,
        user,
        setUser
      }
    }>
      <ConfigProvider>
        {props.children}
      </ConfigProvider>
    </CoreContext.Provider>
  )
}

export default CoreContext
