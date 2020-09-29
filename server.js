const express = require("express");

const server = express();

server.use(express.json());

server.get("/", (request, response) => {
    response.status(200).json({hello: "Node 34"})
})

let users = [
    {
    id: 1,
    name: "Jane Doe",
    bio: "Not Tarzan's Wife, another Jane",
    }
]

let nextId = 2;

server.get("/api/users", (request, response) => {
    response.status(200).json({data: users})
    if (request.body === undefined) {
        response.status(500).json({errorMessage: "There was an error while saving the user to the database"});
    }
})

server.get("/api/users/:id", (request, response) => {
    const id = Number(request.params.id);
    const user = users.find(user => user.id === id);
    const data = request.body;
    if(user) {
        response.status(200).json({data: user})
    } else {
        response.status(404).json({message: "the user with the specified ID does not exist"})
    }
    if(data === undefined) {
        response.status(500).json({errorMessage: "the user information could not be retrieved"})
    }
})

server.post("/api/users", (request, response) => {
    const data = request.body;

    users.push({id: nextId++, ...data})

    if (data.name === undefined || data.body === undefined) {
        response.status(400).json({errorMessage: "Please provide name and bio for the user."})
    } else {
        users.push({ id: nextId++, ...data })
        response.status(201).json({ data: users })
    }
})

server.delete("/api/users/:id", (request, response) => {
    const id = Number(request.params.id);
    const found = users.find(user => user.id === id)
    users = users.filter(user => user.id !== id);

    if (found) {
        response.status(200).json({ data: users });
    } else {
        response.status(404).json({message: "the user with the specified ID does not exist"});
    }

    if (users.id === id) {
        response.status(500).json({errorMessage: "The user could not be removed"})
    }

    response.status(200).json({ data: users })
})

server.put("/api/users/:id", (request, response) => {
    const id = Number(request.params.id);
    const changes = request.body;
    const found = users.find(user => user.id === id);

    if(found) {
        Object.assign(found, changes);
        response.status(200).json({ data: users });
    } else {
        response.status(500).json({ errorMessage: "The user information could not be modified." })
    }

    if(changes.name === undefined || changes.bio === undefined) {
        response.status(400).json({ errorMessage: "Please provide name and bio for the user"})
    }
    if (changes.id !== id) {
        response.status(404).json({ message: "The user with the specified ID does not exist."  })
    }
})

const port = 3000;
server.listen(port, () => console.log("server running..."))