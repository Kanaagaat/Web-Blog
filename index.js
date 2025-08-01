import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));


app.get(('/'), (req, res) => {
    res.render("home.ejs");
});
app.get(('/posts'), (req, res) => {
    res.render("posts.ejs");
});


app.post("/posts", (req, res) => {
    console.log(req.body)
});

app.listen(port, ()=> {
    console.log(`Server is runing on port ${port}`);
});


// Features
// 1. Post Creation: Users should be able to create new posts.

// 2. Post Viewing: The home page should allow the user to view all their posts.

// 3. Post Update/Delete: Users should be edit and delete posts as needed.

// 3. Styling: The application should be well-styled and responsive, ensuring a good user experience on both desktop and mobile devices.