# DevTinder APIs

 ## authRouter
- POST /signup
- POST /login
- POST /logout

## profileRouter
- GET /profile/view
- PATCH /profile/edit
- PATCH /profile/password

## connectionRequestRouter
-POST /request/send/interested/:userId
-POST /request/send/ignored/:userId

-POST /request/send/status/:userId //one api for both


-POST /request/review/accepted/:requestId
-POST /request/review/rejected/:requestId

 ## userRouter
-GET /user/  connections
-GET user/requests
-GET /user /feed -Gets you the profile of the users


Status : ignore,interested,accepted,rejected






