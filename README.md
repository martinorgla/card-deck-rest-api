# Card deck REST API (NodeJS/Express/MongoDB)
Author: Martin Orgla

### Building & Running the application
`docker-compose up --build` - Exposes port 3210

### Usage
Application introduces three endpoints

endpoint | description | example curl command
--- | --- | ---
/create | Create new deck of cards | `curl --request POST 'localhost:3210/create' --data-urlencode 'type=full' --data-urlencode 'shuffled=true'`
/open | Open deck | `curl --request POST 'localhost:3210/open' --data-urlencode 'deckId=a7f93e53-b691-4ee3-a658-879d9bf7ad91'`
/draw | Draw card(s) from deck | `curl --request POST 'localhost:3210/draw' --data-urlencode 'deckId=a7f93e53-b691-4ee3-a658-879d9bf7ad91' --data-urlencode 'count=1'`

### Testing
For running unit & integration tests execute
```bash
docker-compose -f docker-compose.yml -f docker-compose.test.yml up --build --exit-code-from tests
```

### Comments
* First time using Express & MongoDB