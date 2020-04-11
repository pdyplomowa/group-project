
const express = require('express')
const randomstring = require("randomstring");
const app = express()
const port = process.env.PORT || 3000;

function getDefaultResources() {
  return {
    clients: [],
    queueSize: 5
  }
};

// client
// -----------------
// id: string
// matchId: string
// isQueued: boolean

let resources = getDefaultResources();

app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use('/', express.static(__dirname + '/public'))

app.get('/resources', (req, res) => {
  return res.json(resources);
});

app.delete('/resources', (req, res) => {
  resources = getDefaultResources();
  return res.json(resources)
})

app.post('/clients', (req, res) => {
  const newClientId = req.body.id;
  const newClient = { id: newClientId, matchId: null, isQueued: false };
  if (!resources.clients.map(client => client.id).includes(newClientId)) {
    resources.clients.push(newClient)
  }
  return res.json(resources)
});

app.delete('/clients/:id', (req, res) => {
  const clientId = req.params.id;
  const index = resources.clients.map(c => c.id).indexOf(clientId);
  if (index > -1) {
    resources.clients.splice(index, 1);
  }
  return res.json(resources);
})

app.put('/queue/client/:id', (req, res) => {
  const clientId = req.params.id;
  const client = resources.clients.find(client => client.id === clientId);
  if (client && !client.matchId && !client.isQueued) {
    client.isQueued = true;
  }
  releaseQueue();
  return res.json(resources)
})

app.put('/queue/size/:size', (req, res) => {
  const size = parseInt(req.params.size);
  if (Number.isInteger(size) && size >= 1) {
    resources.queueSize = size;
    releaseQueue();
  }
  return res.json(resources)
})

app.put('/queue/leave/:id', (req, res) => {
  const clientId = req.params.id;
  const client = resources.clients.find(client => client.id === clientId);
  if (client && client.isQueued) {
    client.isQueued = false;
    releaseQueue();
  }
  res.json(resources)
})

app.put('/match/leave/:id', (req, res) => {
  const clientId = req.params.id;
  const client = resources.clients.find(client => client.id === clientId);
  if (client && client.matchId) {
    client.matchId = null;
  }
  return res.json(resources);
});

function releaseQueue() {
  const queueClients = resources.clients.filter(client => client.isQueued);
  if (queueClients.length >= resources.queueSize) {
    let matchId;
    do {
      matchId = randomstring.generate();
    } while (resources.clients.map(c => c.matchId).includes(matchId));
    queueClients.forEach(c => {
      c.isQueued = false
      c.matchId = matchId
    });
  }
}

app.listen(port, () => console.log(`App listening at :${port}`))