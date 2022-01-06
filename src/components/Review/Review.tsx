import React, { useState, useEffect, useContext } from "react"
import { Stack } from '@strapi/design-system/Stack';
import { Textarea } from '@strapi/design-system/Textarea';
import { Button } from '@strapi/design-system/Button';
import { Box } from "@strapi/design-system/Box"
import { Typography } from '@strapi/design-system/Typography';
import ReactStarsRating from 'react-awesome-stars-rating';

import ReviewsContext, { IReview } from "../ReviewsProvider"
import { ISOToFull } from "../../lib"

export interface ReviewProps {
  data: IReview
}

const Review = ({ data }: ReviewProps) => {
  const { user } = useContext(ReviewsContext)
  return (
    <Box paddingBottom={2}>
      <Box paddingBottom={2}>
        <Stack horizontal size={2}>
          <Typography fontWeight="bold">
            {data.author ? data.author.username : "User"}
          </Typography>
          <Typography>
            {"\t"} on {ISOToFull(data.createdAt)}
          </Typography>
        </Stack>
        <ReactStarsRating
          isEdit={false}
          isHalf={true}
          value={data.score}
          isArrowSubmit={false}
        />
      </Box>
      {
        data.comment && 
        <Box background="neutral0" borderColor="neutral200" hasRadius={true} padding={6}>
          <Typography>
            {data.comment}
          </Typography>
        </Box>
      }
    </Box>
  )
}

export default Review
