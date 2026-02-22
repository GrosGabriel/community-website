import { Hono } from "@hono/hono";
import { cors } from "@hono/hono/cors";
import * as communityController from "./controllers/communityController.js";
import * as postController from "./controllers/postController.js";
import * as commentController from "./controllers/commentController.js";
import * as authController from "./controllers/authController.js";
import * as middlewares from "./middlewares.js";



const app = new Hono();

app.use(
    "*",
    cors(),
);


//HomePage
app.get("/api/homepage", postController.findRecent);

//communities
app.get("/api/communities", communityController.findAll);
app.get("/api/communities/:communityId", communityController.findOne);
app.post("/api/communities", middlewares.authenticate, communityController.create);
app.delete("/api/communities/:communityId", middlewares.authenticate, communityController.deleteOne);

//posts
app.get("/api/communities/:communityId/posts", postController.findAll); 
app.get("/api/communities/:communityId/posts/:postId", postController.findOne); 
app.post("/api/communities/:communityId/posts", middlewares.authenticate, postController.create); 
app.delete("/api/communities/:communityId/posts/:postId", middlewares.authenticate, postController.deleteOne); 

//comments
app.get("/api/communities/:communityId/posts/:postId/comments", commentController.findAll); 
app.post("/api/communities/:communityId/posts/:postId/comments", middlewares.authenticate, commentController.create); 
app.delete("/api/communities/:communityId/posts/:postId/comments/:commentId", middlewares.authenticate, commentController.deleteOne);


//votes
app.post("/api/communities/:communityId/posts/:postId/upvote", middlewares.authenticate, postController.upVotePost);
app.post("/api/communities/:communityId/posts/:postId/downvote", middlewares.authenticate, postController.downVotePost);
app.post("/api/communities/:communityId/posts/:postId/comments/:commentId/upvote", middlewares.authenticate, commentController.upVoteComment);
app.post("/api/communities/:communityId/posts/:postId/comments/:commentId/downvote", middlewares.authenticate, commentController.downVoteComment);



//auth
app.post("/api/auth/register", authController.register);
app.post("/api/auth/login", authController.login);

export default app;


