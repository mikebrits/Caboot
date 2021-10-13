# Welcome to Caboot!

A multiplayer quiz game that simulates Kahoot. This was made in like 2 weeks after hours.

## What it does
- Provides authentication for people who want to create Quizzes (account approval is a manual process)
- Authenticated users can CRUD Quizzes
- Updating a quiz involves creating multi choice questions
- These can be dragged and dropped to rearrange
- Once a quiz is made, it can be published and started
- A link is generated. This can be sent to players. Players do not need to be logged in.
- Players can generate a name. Arguably the funnest part of the game.
- Once a player has joined, the admin can see a lobby of users, and can kick inactive users.
- Admin can then start each question and see when a person has answered. 
- A leaderboard is shown at the end of each question. The faster one answers a question, the better the score.
- When a game ends, a leader is announced.

## Tech
- Nextjs... Probably didn't need it, but ssr gives a nice clean divide between player and admin.
- React
- Material UI
- Firebase for realtime and data
- Firebase for auth
- I have used Puppeteer for some stress testing. I didn't get very far, but it was cool to see 20 bots play the game with me as the game master.

## What it doesn't do
- Does not perform well at scale... I had like 55 people try it out and it failed wonderfully. One of the worst days of my life... But it works well in smaller groups.
- It isn't fully tested. This started out as a simple idea and then got out of hand. 
- Needs a lot of polish. 
