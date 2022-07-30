# Strapi Ratings Client

Display reviews from the [Strapi Ratings plugin](https://npmjs.com/package/@coolstrapiplugins/strapi-plugin-ratings) easily, with components styled with [Bootstrap](https://getbootstrap.com).

This component library fully supports Typescript.

## Installation

This library requires **react ^17.0.2**, **react-dom ^17.0.2** **bootstrap ^5.1.3** and **@popperjs/core^2.11.2**.

    npm install @coolstrapiplugins/strapi-ratings-client --save

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
} from "@coolstrapiplugins/strapi-ratings-client"
 
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

You can place the `Reviews` component anywhere in your app to load and render the reviews and `ReviewForm` to render a input for posting reviews.

The only requirement is that the component that renders `Reviews` and `ReviewForm` *must* be nested into the provider. In the example above, `App` can render `Reviews` and `ReviewForm`, but if the `ReviewsProvider` is rendered in `App`, this component would not be able to render `Reviews` and `ReviewForm`.

Here's how the interface looks like:

![Comment sample](https://raw.githubusercontent.com/coolstrapiplugins/strapi-ratings-client/main/review.png)

Updating the parameters for fetching and posting reviews is done through a `React.Context`:
```ts
import { ReviewsConfigContext } from "@coolstrapiplugins/strapi-ratings-client"
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

There are two more components that this library exports: `ReviewStats` and `ErrorBox`

```ts
import { ErrorBox, ReviewStats } from "@coolstrapiplugins/strapi-ratings-client"
```

`ReviewStats` displays the average score as well as the number of total reviews for a given content. This component requires a `slug: string` and `apiURL: string`. This component also doesn't need to be nested inside of `ReviewsProvider`.

![Review Stats](https://raw.githubusercontent.com/coolstrapiplugins/strapi-ratings-client/main/stats.PNG)

`ErrorBox` displays an error message when fetching or posting reviews fail.

![Comment error](https://raw.githubusercontent.com/coolstrapiplugins/strapi-ratings-client/main/error.PNG)

## Full example

For a full implementation of this library in a `React` project, check out [this repo](https://github.com/coolstrapiplugins/strapi-ratings-client-example)