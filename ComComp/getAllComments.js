let URL = "http://localhost:8080/pokemon-comment";
let USER = "http://localhost:8080/user/";

const commentContainer = document.getElementById('allComments');
document.getElementById('addComments').addEventListener('click', function (ev) {
    addComment(ev);});

async function addComment(_ev) {
    const textBox = document.createElement('div');
    const likeButton = document.createElement('button');
    likeButton.innerHTML = 'Like';
    likeButton.className = 'likeComment';
    const deleteButton = document.createElement('button');
    deleteButton.innerHTML = 'Delete';
    deleteButton.className = 'deleteComment';
    const reportButton = document.createElement('button');
    reportButton.innerHTML = 'Report';
    reportButton.className = 'reportComment';
    const wrapDiv = document.createElement('div');
    wrapDiv.className = 'wrapper';
    wrapDiv.style.marginLeft = 0;
    const commentBox = document.createElement('div');
    commentBox.className = 'commentBox';
    commentBox.style.marginLeft = 0;
    let commentText = document.getElementById('newComment').value;
    document.getElementById('newComment').value = '';
    textBox.innerHTML = commentText;
    let node = {user_id:'10', pokemon_id:'1', comment_content:commentText, is_flagged: false, likes:0, reports:0};
    let resp = storeComment(node);
    reportButton.id = resp.id;
    likeButton.addEventListener('click', _like_ev => likeComment(node, _like_ev) && likeButton.removeEventListener);
    deleteButton.addEventListener('click', _delete_ev => deleteComment(node, _delete_ev));
    reportButton.addEventListener('click', _report_ev => reportComment(node, _report_ev));
    wrapDiv.append(textBox)
    commentBox.append(wrapDiv, likeButton, deleteButton, reportButton);
    wrapDiv.id = 'comment';
    commentContainer.appendChild(commentBox);
}

async function getAll() {
    commentContainer.innerHTML = null;
    const response = await fetch(URL)
    const data = await response.text();
    const nodes = JSON.parse(data);
    console.log(nodes);
    for (let node of nodes) {
        let commentText = node.comment_content;
        const userResponse = await fetch(USER + node.user_id);
        const userData = await userResponse.text();
        let usertransfer = JSON.parse(userData);
        let username = usertransfer.username;
        const textBox = document.createElement('div');
        const likeButton = document.createElement('button');
        likeButton.innerHTML = 'Like';
        likeButton.className = 'likeComment';
        const deleteButton = document.createElement('button');
        deleteButton.innerHTML = 'Delete';
        deleteButton.className = 'deleteComment';
        const reportButton = document.createElement('button');
        reportButton.innerHTML = 'Report';
        reportButton.className = 'reportComment';
        reportButton.id = node.id;
        deleteButton.addEventListener('click', _delete_ev => deleteComment(node));
        likeButton.addEventListener('click', _like_ev => likeComment(node) && likeButton.removeEventListener);
        reportButton.addEventListener('click', _report_ev => reportComment(node, _report_ev));
        const wrapDiv = document.createElement('div');
        wrapDiv.className = 'wrapper';
        wrapDiv.style.marginLeft = 0;
        const commentBox = document.createElement('div');
        commentBox.className = 'commentBox';
        commentBox.style.marginLeft = 0;
        textBox.innerHTML = commentText;
        wrapDiv.append(textBox);
        commentBox.append(username, wrapDiv, likeButton, deleteButton, reportButton);
        commentContainer.appendChild(commentBox);
    }
}

async function storeComment(json) {
    const request = await fetch(URL, {
        method:'POST',
        headers: { 
            'Content-Type':'application/json',
        },
       
        body: JSON.stringify(json)
    });
    const response = request.body;
    console.log(json);
    if (request.ok) {
        console.log('GOOD');
        return (JSON.stringify(response));
    } else {
        console.log('BAD');
    }
}

async function likeComment(json, _like_ev) {
    json.likes += 1;
    const request = await fetch(URL, {
        method:'PUT',
        headers: { 
            'Content-Type':'application/json',
        },
    
        body: JSON.stringify(json)
    });
    console.log(json);
    if (request.ok) {
        console.log('GOOD');
    } else {
        console.log('BAD');
    }
}

async function reportComment(json, _report_ev) {
    if (!json.is_flagged) {
        json.is_flagged = true;
    }
    json.reports += 1;
    const request = await fetch(URL, {
        method:'PUT',
        headers: { 
            'Content-Type':'application/json',
        },
    
        body: JSON.stringify(json)
    });
    console.log(json);
    if (request.ok) {
        console.log('GOOD');
    } else {
        console.log('BAD');
    }
}

async function deleteComment(json, _delete_ev) {
    const request = await fetch(URL, {
        method:'Delete',
        headers: { 
            'Content-Type':'application/json',
        },
       
        body: JSON.stringify(json)
    });
    console.log(json);
    if (request.ok) {
        console.log('GOOD');
        getAll();
        
    } else {
        console.log('BAD');
    }
}

getAll();