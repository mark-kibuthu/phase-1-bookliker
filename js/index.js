document.addEventListener('DOMContentLoaded', () => {
	const listPanel = document.getElementById('list');
	const showPanel = document.getElementById('show-panel');
	let currentUser = { id: 1, username: "pouros" }; 

	
	fetch('http://localhost:3000/books')
		.then(response => response.json())
		.then(books => {
			books.forEach(book => {
				const li = document.createElement('li');
				li.textContent = book.title;
				li.addEventListener('click', () => showBookDetails(book));
				listPanel.appendChild(li);
			});
		})
		.catch(error => console.error('Error fetching books:', error));

	function showBookDetails(book) {
		const { id, title, subtitle, description, author, img_url, users } = book;

		const hasLiked = users.some(user => user.id === currentUser.id);

		
		const html = `
			<h2>${title}</h2>
			${subtitle ? `<h3>${subtitle}</h3>` : ''}
			<img src="${img_url}" alt="${title}" style="max-width: 100%; max-height: 300px;">
			<p><strong>Author:</strong> ${author}</p>
			<div id="likedBy">
				Liked by: ${users.map(user => user.username).join(', ')}
			</div>
			<button id="likeButton">${hasLiked ? 'Unlike' : 'Like'}</button>
			<p>${description}</p>
		`;

		
		showPanel.innerHTML = html;

		
		const likeButton = document.getElementById('likeButton');
		likeButton.addEventListener('click', () => toggleLike(book));
	}

	
	function toggleLike(book) {
		const { id, users } = book;
		const hasLiked = users.some(user => user.id === currentUser.id);

		if (hasLiked) {
			
			const updatedUsers = users.filter(user => user.id !== currentUser.id);
			updateBookUsers(id, updatedUsers);
		} else {
			
			const updatedUsers = [...users, currentUser];
			updateBookUsers(id, updatedUsers);
		}
	}

	
	function updateBookUsers(bookId, updatedUsers) {
		fetch(`http://localhost:3000/books/${bookId}`, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ users: updatedUsers }),
		})
			.then(response => response.json())
			.then(updatedBook => {
				
				const likedByDiv = document.getElementById('likedBy');
				likedByDiv.textContent = `Liked by: ${updatedBook.users.map(user => user.username).join(', ')}`;
				
				
				const likeButton = document.getElementById('likeButton');
				const hasLiked = updatedBook.users.some(user => user.id === currentUser.id);
				likeButton.textContent = hasLiked ? 'Unlike' : 'Like';
			})
			.catch(error => console.error('Error updating book users:', error));
	}
});
