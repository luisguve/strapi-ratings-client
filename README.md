# Strapi Ratings Client

Display reviews from the [Strapi Ratings plugin](https://npmjs.com/package/strapi-plugin-ratings) easily, with components built from [Bootstrap](https://getbootstrap.com).

This component library fully supports Typescript.

## Installation

This library requires **react ^17.0.2**, **react-dom ^17.0.2** and **react-router-dom ^5.2.0**.

    npm install strapi-ratings-client --save

## Usage

This library exports three main components: `ReviewsProvider`, `Reviews` and `ReviewForm`

The `ReviewsProvider` component must wrap all the other components.

For example, this could be your index.js or main.js file:

```ts
import React from 'react'
import ReactDOM from 'react-dom'
 
import {
  ReviewsProvider,
  Reviews,
  ReviewForm
} from "strapi-ratings-client"
 
const STRAPI = "http://localhost:1337" // The address of your strapi backend instance
 
ReactDOM.render(
  <React.StrictMode>
    <ReviewsProvider apiURL={STRAPI}>
      <App />
    </ReviewsProvider>
  </React.StrictMode>,
  document.getElementById('root')
)
```

`apiURL` is the URL of your running Strapi application and this property is *required*.

Then you can place the `Reviews` component anywhere in your app to load and render the reviews and `ReviewForm` to render a input for posting reviews.

Here's how the interface looks like:

![Comment sample](https://raw.githubusercontent.com/luisguve/strapi-ratings-client/main/review.png)

Updating the parameters for fetching and posting reviews is done through a `React.Context`:
```ts
import { ReviewsConfigContext } from "strapi-ratings-client"
```

`ReviewsConfigContext` returns two functions: `setUser` and `setContentID`

`setContentID` loads the reviews for a given content. It receives a single parameter of type `string` and must be something that can be URLized i.e. no spaces.

`setUser` sets the user credentials for posting reviews. It receives a single parameter of type `IUser`, which is a *Typescript interface*:

```ts
interface IUser {
  username: string,
  email: string,
  id: string,
  token: string
}
```

There's one more component that this library exports: `ErrorBox`

```ts
import { ErrorBox } from "strapi-ratings-client"
```

All it does is display error messages when fetching or posting reviews fail.

![Comment error](https://raw.githubusercontent.com/luisguve/strapi-ratings-client/main/error.PNG)

## Full example

For a full implementation of this library in a `React` project, check out [this repo](https://github.com/luisguve/strapi-ratings-client-example)