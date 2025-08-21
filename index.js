import express from "express";
import { read } from "fs";
import { readFile, writeFile, appendFile } from 'fs/promises';


const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));


async function blogSave(author, blogCap, blogText){
   
    try{
        
        let exData = await readFile("blogPost/data.json", "utf-8");
        let blogArray = exData ? JSON.parse(exData) : [];

        // новый объект
        const blogBody = {
          author: author,
          blogCaption: blogCap,
          blogText: blogText,
          };

        // добавляем его в массив
        blogArray.push(blogBody);

        // сохраняем
        await writeFile("blogPost/data.json", JSON.stringify(blogArray, null, 2), "utf-8");

        console.log("Blog saved ✅");


    } catch(err){
        console.log(err);
    }






}

async function existBlogs(){
  let data = await readFile("blogPost/data.json", "utf-8");
  let blogArray = data ? JSON.parse(data) : []; 

  return blogArray;

}

async function deleteBlog(blogName){

  let data = await existBlogs();

  data = data.filter(e => e.blogCaption !== blogName);
  

  await writeFile("blogPost/data.json", JSON.stringify(data, null, 2), "utf-8");


}

async function editBlog(oldE, newE, option) {
    let data = await existBlogs(); // data — это массив объектов

    let updated = false; // чтобы проверить, было ли изменение

    data.forEach(element => {
        if (option === "title" && element.blogCaption === oldE) {
            element.blogCaption = newE;
            updated = true;
        }
        else if (option === "author" && element.author === oldE) {
            element.author = newE;
            updated = true;
        }
        else if (option === "text" && element.blogText === oldE) {
            element.blogText = newE;
            updated = true;
        }
    });

    if (updated) {
        await writeFile("blogPost/data.json", JSON.stringify(data, null, 2), "utf-8");
        console.log("✅ Blog updated successfully");
    } else {
        console.log("⚠️ Nothing was updated. Check your old value.");
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
  
    let exData = await readFile("blogPost/data.json", "utf-8");
    let blogArray = exData ? JSON.parse(exData) : [];
    res.render("myblog.ejs", { blogs: blogArray });

})

app.get("/edit", (req, res) => {
  res.render("edit.ejs");
})

app.post("/edit", async (req,res) => {
  let option = req.body.editOption;
  let oldEdit = req.body.oldEdit;
  let newEdit = req.body.newEdit;

  await editBlog(oldEdit, newEdit, option)
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
