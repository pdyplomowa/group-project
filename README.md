# group-project

Project implements matchmaking. App written in JavaScript, that uses vuejs and expressjs libraries.

## Models ##

#### Client ####
 - id: string
 - matchId: string
 - isQueued: boolean
 
#### Resources ####
 - clients: Client[]
 - queueSize: number

## API Endpoints ## 

```
GET /resources
```
**Description:** Returns all resources.

-------------------------

```
DELETE /resources
```
**Description:** Clears all resources and set it to default value. Returns all resources.

-------------------------

```
POST /clients
```
**Body:** { id: string }  
**Description:** Adds new client with given id. Returns all resources.

-------------------------

```
DELETE /clients/:id
``` 
**Description:** Removes client with given id. Returns all resources.

-------------------------

```
PUT /queue/client/:id
``` 
**Description:** Adds client with given id to the queue. Returns all resources.

-------------------------

```
PUT /queue/size/:size
``` 
**Description:** Changes size of the queue required to create new match. Returns all resources.

-------------------------

```
PUT /queue/leave/:id
``` 
**Description:** Client with given id leaves from queue. Returns all resources.

-------------------------

```
PUT /match/leave/:id
``` 
**Description:** Client with given id leaves from match. Returns all resources.
