# API LIST

## authRouters

- POST /signup - SIGNUP
- POST /login - LOGIN
- POST /logout - LOGOUT
- POST /forgot-password - FORGOT PASSWORD

## userRouters

- GET /user/:userId/profile - SHOW PROFILE
- PATCH /user/:userId/edit-profile - EDIT PROFILE
- PATCH /user/:userId/edit-password - EDIT PASSWORD

## swipes&MatchRouters

- GET /user/:userId/swipes - SHOW USERS TO SWIPE
- POST /user/:userId/like - LIKE A PERSON
- POST /user/:userId/dislike - DISLIKE A PERSON
- GET /user/:userId/matches - SHOW ALL THE MATCHES
- POST /user/:userId/accept-match - ACCEPT A MATCH
- DELETE /user/:userId/reject-match - REJECT A MATCH

## messageRoutes

- GET /user/:userId/messages - SHOW ALL THE MESSAGES
- GET /user/:userId/:matchId/message - SHOW ALL THE MESSAGE OF MATCH PERSON
- POST /user/:userId/:matchId/message - SEND MESSAGE TO A MATCH
- DELETE /user/:userId/:matchId/message - DELETE MESSAGE FROM MATCH PERSON
