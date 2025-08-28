import express from "express";
import { read } from "fs";
import { readFile, writeFile, appendFile } from 'fs/promises';
import { Client } from 'pg'

const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));


const client = new Client({
  user: "postgres",
  host: "localhost",
  database: "blogdb",
  password: "1234",
  port: "5432",
});

await client.connect();



async function blogSave(author, blogCap, blogText){
   
    try{
        
        await client.query(
          "INSERT INTO blogs (author, blog_caption, blog_text) VALUES ($1, $2, $3)",
          [author, blogCap, blogText]);
        console.log("Blog Saved");


    } catch(err){
        console.log(err);
    }


}

async function existBlogs(){
  const result = await client.query("SELECT * FROM blogs ORDER BY id DESC");

  return result.rows;

}

async function deleteBlog(id){

  await client.query("DELETE FROM blogs WHERE id = $1", [id]);

}



async function editBlog(id, newE, option) {
   
  let column;
  
  if (option === "title") column = "blog_caption";
  else if (option === "author") column = "author";
  else if (option === "text") column = "blog_text";

  const result  = client.query(`UPDATE blogs SET ${column} = $1 WHERE id = $2`, [newE, id]);


  if(result.rowCount > 0){
    console.log("Blog Updated");
  }
  else{
    console.log("Nothing was updated");
  }
  
    
}


app.get("/", (req, res) => {
  res.render("home.ejs");
})

app.get("/posts", (req, res) => {
  res.render("posts.ejs");
})

app.post("/posts", async (req,res) => {
    
    res.render("posted.ejs",{
      name: req.body.name,
      blogName: req.body.blogName,
      text: req.body.text,
    });
   await blogSave(req.body.name,req.body.blogName,req.body.text)
    

   
})


app.get("/myblog", async (req, res) => {
  
    const blogs = await existBlogs();
    console.log(blogs);
    res.render("myblog.ejs", {blogs});

})

app.get("/edit", (req, res) => {
  res.render("edit.ejs");
})

app.post("/edit", async (req,res) => {
  let option = req.body.editOption;
  let id = req.body.id;
  let newEdit = req.body.newEdit;

  await editBlog(id, newEdit, option)
  res.render("success.ejs")


  console.log(req.body);

})

app.get("/delete", (req,res) => {
  res.render("delete.ejs");
})

app.post("/delete", async (req,res) => {
  console.log(req.body)
  await deleteBlog(req.body.deleteEdit)
  res.render("success.ejs");
})

app.listen(port, () => {
  console.log(`🚀 Server is running on http://localhost:${port}`);
});
