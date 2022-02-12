import React, { useEffect, useState } from "react"
import styled from "styled-components"
import ReactStarsRating from 'react-awesome-stars-rating';

interface IStats {
  averageScore: number;
  reviewsCount: number | null;
}
const defaultStatsState: IStats = {
  averageScore: 5,
  reviewsCount: null
}

interface ReviewStatsProps {
  slug: string;
  apiURL: string;
}
const HorizontalStack = styled.div`
  display:flex;
`
const MarginRightDiv = styled.div`
  margin-right: 5px;
`

const ReviewStats = (props: ReviewStatsProps) => {
  const { apiURL, slug } = props
  const [stats, setStats] = useState<IStats>(defaultStatsState)
  useEffect(() => {
    const fetchStats = async () => {
      const url = `${apiURL}/api/ratings/reviews/${slug}/stats`
      try {
        const data_res = await fetch(url)
        const data = await data_res.json()
        if (!data_res.ok) {
          throw data
        }
        setStats(data)
      } catch(err) {
        console.log("Error fetching reviews stats")
        console.log(err)
        setStats({
          averageScore: 5,
          reviewsCount: 0
        })
      }
    }
    fetchStats()
  }, [])
  return (
    <div>
      <HorizontalStack>
        <MarginRightDiv>
          <ReactStarsRating
            isEdit={false}
            isHalf={true}
            value={stats.averageScore}
            isArrowSubmit={false}
            size={28}
          />
        </MarginRightDiv>
        <p style={{margin: 0}}>
          {
            (stats.reviewsCount === null) ?
              "loading reviews"
            : "("+stats.reviewsCount + (stats.reviewsCount > 1 ? " reviews" : " review")+")"
          }
        </p>
      </HorizontalStack>
    </div>
  )
}

export default ReviewStats