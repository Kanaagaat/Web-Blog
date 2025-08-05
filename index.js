import express from "express";
import fs from "fs"



function fileCreate(name, dataName ,data){

    const article ={
        author: name, 
        caption: dataName,
        textInfo: data
    };

    const jsonData = JSON.stringify(article, null, 2); // The 'null, 2' arguments add pretty-printing (indentation)

    fs.writeFile(`blogPost/${name}.json`, jsonData, 'utf8', (err) => {
        if(err){
            throw err;
            return;
        }

        console.log("File written succesfully");
    })

}

function postCreate(){
    const testFolder = 'blogPost';

    const posts =   fs.readdir(testFolder);
    console.log(posts);






};
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
    console.log(req.body);
    var authorName = req.body.name;
    var authorBlogName = req.body.blogName;
    var authorText = req.body.text;

    fileCreate(authorName, authorBlogName, authorText);
    postCreate();
    res.render("myBlog.ejs", {
        name: req.body.name,
        blogName: req.body.blogName,
        text:  req.body.text,

    });
});

app.get("/myBlog", (req, res) => {

    var data =  postCreate();
    // fs.readFile(`blogPost/${blogFiles[1]}`, function(err, data) { 
    //     if (err) throw err; 

    //     const books = JSON.parse(data); 
    //     console.log(books); 
    // }); 
    

    res.render("myBlog.ejs", {
        name: authorName,
        blogName: authorBlogName,
        text: authorText,

    });
})

app.listen(port, ()=> {
    console.log(`Server is runing on port ${port}`);
});


// Features
// 1. Post Creation: Users should be able to create new posts.

// 2. Post Viewing: The home page should allow the user to view all their posts.

// 3. Post Update/Delete: Users should be edit and delete posts as needed.

// 3. Styling: The application should be well-styled and responsive, ensuring a good user experience on both desktop and mobile devices.