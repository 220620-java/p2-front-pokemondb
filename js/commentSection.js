                        const commentContainer = document.getElementById('allComments');
						document.getElementById('addComments').addEventListener('click', function (ev) {
						addComment(ev);
						});
						let commentId = 0;
						
						async function addComment(ev) {
							let url = "http://localhost:8080/pokemon-comment";

							let commentText;
							let username = "pastComments.username";
							const textBox = document.createElement('div');
							const userbox= document.createElement('div');
							const likeButton = document.createElement('button');
							likeButton.innerHTML = 'Like';
							likeButton.className = 'likeComment';
							const deleteButton = document.createElement('button');
							deleteButton.innerHTML = 'Delete';
							deleteButton.className = 'deleteComment';
							const wrapDiv = document.createElement('div');
							wrapDiv.className = "wrapper";
							wrapDiv.style.marginLeft = 0;
							commentText = document.getElementById('newComment').value;
							document.getElementById('newComment').value = '';
							textBox.innerHTML = commentText;
							textBox.style.padding = 3;
							userbox.innerHTML = "username";
							userbox.style.borderBottom = 3;
							userbox.style.borderBottom = "#fff solid 3px";
							userbox.style.padding = 3;
							wrapDiv.append(userbox, textBox, likeButton, deleteButton);

							
							commentContainer.appendChild(wrapDiv);
							fetch(url).then(function(response) {
                                if (response.ok) {
                                    return response;
                                } else {
                                    let error = new Error(response.statusText())
                                    error.response = response
                                    throw error 
                                }
                                
                            });
        }