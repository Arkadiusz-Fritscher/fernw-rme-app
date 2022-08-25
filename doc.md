# Auth

On first visit, before Vue app instance is instantiated, the boot/cookie.js checks if Cookie or Session Storage with user's jwt token exists.
If so, the getUser method in pinia user-store fetch's the user data from the Strapi backend and store the result in the store state.
