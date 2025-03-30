document.addEventListener('DOMContentLoaded', async function () {
    // Lấy danh sách thể loại từ API
    try {
        const response = await fetch('http://localhost:3000/api/cards');
        if (!response.ok) throw new Error('Lỗi khi lấy dữ liệu từ API');
        const cards = await response.json();

        // Lấy danh sách thể loại duy nhất (loại bỏ trùng lặp)
        const genres = [...new Set(cards.map(card => card.genre_name).filter(genre => genre))]; // Sử dụng genre_name

        // Hiển thị thể loại trong dropdown
        const genreDropdown = document.getElementById('genreDropdownMenu');
        if (genreDropdown) {

            genres.forEach(genre => {
                const li = document.createElement('li');
                const a = document.createElement('a');
                a.className = 'dropdown-item';
                a.href = `#`;
                a.textContent = genre;
                a.addEventListener('click', function (e) {
                    e.preventDefault();
                    filterComicsByGenre(genre); // Truyền genre_name
                });
                li.appendChild(a);
                genreDropdown.appendChild(li);
            });

            // Thêm mục "Tất cả" để hiển thị toàn bộ truyện
            // const allLi = document.createElement('li');
            // const allA = document.createElement('a');
            // allA.className = 'dropdown-item';
            // allA.href = '#';
            // allA.textContent = 'Tất cả';
            // allA.addEventListener('click', function (e) {
            //     e.preventDefault();
            //     displayAllCards(); // Hiển thị lại tất cả truyện
            // });
            // allLi.appendChild(allA);
            // genreDropdown.insertBefore(allLi, genreDropdown.firstChild);
        }
    } catch (error) {
        console.error('Lỗi khi lấy danh sách thể loại:', error);
    }
});

// Hàm lọc truyện theo thể loại (sử dụng genre_name)
function filterComicsByGenre(genre) {
    const filteredCards = cardData.filter(card => card.genre_name === genre); // Sử dụng genre_name để lọc
    const cardContainer = document.querySelector('.row.row-cols-1.row-cols-md-6.g-4');
    if (!cardContainer) return;

    cardContainer.innerHTML = ''; // Xóa nội dung cũ

    filteredCards.forEach(data => {
        const colDiv = document.createElement('div');
        colDiv.className = 'col';

        const cardDiv = document.createElement('div');
        cardDiv.className = 'card';

        const img = document.createElement('img');
        img.className = 'card-img-top';
        img.src = data.image || 'https://via.placeholder.com/150?text=No+Image';
        img.alt = data.title;

        const cardBody = document.createElement('div');
        cardBody.className = 'card-body';

        const cardTitle = document.createElement('h5');
        cardTitle.className = 'card-title';
        cardTitle.textContent = data.title;

        const cardText = document.createElement('p');
        cardText.className = 'card-text';
        cardText.textContent = data.content || 'Chưa có nội dung.';

        cardBody.appendChild(cardTitle);
        cardBody.appendChild(cardText);

        cardDiv.appendChild(img);
        cardDiv.appendChild(cardBody);

        cardDiv.style.cursor = 'pointer';
        cardDiv.setAttribute('data-comic-id', data.id);
        cardDiv.addEventListener('click', function () {
            openCardModal(data);
        });

        colDiv.appendChild(cardDiv);
        cardContainer.appendChild(colDiv);
    });
}