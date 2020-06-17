const express = require("express");
const { uuid, isUuid} = require('uuidv4');
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];
let likes = 0;

app.get("/repositories", (request, response) => {
    return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const {title,url,techs} = request.body;

  const repository = {
    id: uuid(),
     title,
     url,
     techs, 
     likes :likes
    };

  repositories.push(repository);

  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const {id} = request.params;
  const {title,url,techs} = request.body;
  const repositoryIndex = repositories.findIndex(repository => repository.id == id);

  if(repositoryIndex < 0){
    return response.status(400).json('Invalid repository id');
  }

  const repo = {
    id: id,
    title: title,
    url: url,
    techs: techs,
    likes: repositories[repositoryIndex].likes
  }

  repositories[repositoryIndex] = repo;

  return response.json(repo);
  
});

app.delete("/repositories/:id", (request, response) => {
  const {id} = request.params;
  
  const repositoryIndex = repositories.findIndex(repository => repository.id == id);

  if(repositoryIndex < 0){
    return response.status(400).json({error : "Repository not found"});
  }
  repositories.splice(repositoryIndex,1);

  return response.send(204);
});

app.post("/repositories/:id/like", (request, response) => {
  const {id} = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id == id);

  if(repositoryIndex < 0){
    return response.status(400).json({error : "Repository not found"});
  }

  repositories[repositoryIndex].likes += 1;

  return response.json(repositories[repositoryIndex]);
});

module.exports = app;
