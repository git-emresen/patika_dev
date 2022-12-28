const yargs = require('yargs')

let postsArray = ["post1", "post2", "post3"]

function showPosts(postsArr) {
    return new Promise((resolve, reject) => {
        if (postsArr.length > 0) {
            resolve(postsArr)
        }
        else {
            reject("Add some post first")
        }
    })
}

function addPost() {
    let newPost = yargs.argv._[0];
    if (newPost) {
        postsArray.push(newPost)
    }
    else {
        console.log("Please type a post: Usage: node [app] new_post")
    }

    showPosts(postsArray).then(
        result => console.log(result)
    )
}

addPost()