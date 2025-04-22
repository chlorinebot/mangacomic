// chapters.js
let originalChapters = [];
const ITEMS_PER_PAGE = 5; // Số lượng chương mỗi trang
let currentPage = 1; // Trang hiện tại

export async function showChapters(cardId) {
    console.log('showChapters được gọi với cardId:', cardId);
    try {
        // Đóng các modal khác nếu có
        const openModals = document.querySelectorAll('.modal.show');
        openModals.forEach(modal => {
            const modalInstance = bootstrap.Modal.getInstance(modal);
            if (modalInstance) {
                modalInstance.hide();
            }
        });

        const token = localStorage.getItem('token');
        const response = await fetch('/api/chapters', {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        console.log('Phản hồi từ API /api/chapters:', response);
        if (!response.ok) {
            throw new Error('Lỗi khi lấy danh sách chương: ' + response.statusText);
        }
        const chapters = await response.json();
        console.log('Dữ liệu chương:', chapters);
        originalChapters = chapters[cardId] || []; // Lưu trữ danh sách chương gốc
        currentPage = 1; // Reset về trang đầu tiên
        renderChapters(originalChapters, cardId);

        // Tính số chương lớn nhất hiện có của truyện
        let defaultChapterNumber = 1; // Giá trị mặc định ban đầu
        if (originalChapters.length > 0) {
            const chapterNumbers = originalChapters.map(ch => parseInt(ch.chapterNumber)).filter(num => !isNaN(num));
            if (chapterNumbers.length > 0) {
                const maxChapterNumber = Math.max(...chapterNumbers);
                defaultChapterNumber = maxChapterNumber + 1; // Tăng dần từ số lớn nhất
            }
        }

        // Thiết lập giá trị mặc định cho form thêm chương inline
        document.getElementById('addChapterCardId').value = cardId;
        
        // Ẩn các form inline nếu đang hiển thị
        document.getElementById('inlineEditChapterForm').style.display = 'none';
        document.getElementById('inlineAddChapterForm').style.display = 'none';

        document.getElementById('chapterModalTitle').textContent = `Chương của truyện ID: ${cardId}`;
        const chapterModal = document.getElementById('chapterModal');
        if (!chapterModal) {
            throw new Error('Không tìm thấy modal chapterModal trong DOM');
        }
        if (typeof bootstrap === 'undefined') {
            throw new Error('Bootstrap không được tải đúng cách');
        }
        
        // Thêm data-comic-id vào modal để sử dụng sau này
        chapterModal.setAttribute('data-comic-id', cardId);
        
        console.log('Mở modal chapterModal');
        const modalInstance = new bootstrap.Modal(chapterModal);
        modalInstance.show();
        console.log('Modal đã được gọi để hiển thị');
    } catch (error) {
        console.error('Lỗi trong showChapters:', error);
        alert('Đã xảy ra lỗi khi hiển thị danh sách chương: ' + error.message);
    }
}

export function renderChapters(chapterList, cardId) {
    const chapterBody = document.getElementById('chapterTableBody');
    const paginationContainer = document.getElementById('chapterPagination');
    if (!chapterBody || !paginationContainer) {
        console.error('Không tìm thấy phần tử chapterTableBody hoặc chapterPagination trong DOM');
        return;
    }

    // Tính toán dữ liệu phân trang
    const totalItems = chapterList.length;
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;

    // Lấy dữ liệu cho trang hiện tại
    const currentPageData = chapterList.slice(startIndex, endIndex);

    // Hiển thị dữ liệu
    if (currentPageData.length === 0) {
        chapterBody.innerHTML = '<tr><td colspan="6" class="text-center">Không có chương nào</td></tr>';
    } else {
        chapterBody.innerHTML = '';
        currentPageData.forEach(chapter => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${chapter.chapterNumber}</td>
                <td>${chapter.chapterTitle || 'Không có tiêu đề'}</td>
                <td>${chapter.content ? (chapter.content.length > 50 ? chapter.content.substring(0, 50) + '...' : chapter.content) : 'Không có nội dung'}</td>
                <td>${chapter.imageFolder || 'Không có'}</td>
                <td>${chapter.imageCount || 0}</td>
                <td>
                    <button class="btn btn-warning btn-sm edit-chapter-btn" 
                        data-id="${chapter.id || ''}"
                        data-number="${chapter.chapterNumber}"
                        data-title="${chapter.chapterTitle || ''}"
                        data-content="${chapter.content || ''}"
                        data-image-folder="${chapter.imageFolder || ''}"
                        data-image-count="${chapter.imageCount || 0}">
                        <i class="fas fa-edit"></i> Sửa
                    </button>
                    <button class="btn btn-danger btn-sm" onclick="window.deleteChapter('${cardId}', '${chapter.chapterNumber}', this)">
                        <i class="fas fa-trash"></i> Xóa
                    </button>
                </td>
            `;
            chapterBody.appendChild(row);
        });
    }

    // Hiển thị phân trang
    renderPagination(paginationContainer, totalPages, currentPage, (page) => {
        currentPage = page;
        renderChapters(chapterList, cardId);
    });
    
    // Cập nhật sự kiện cho các nút sửa chương
    updateChapterEditButtons();
}

function renderPagination(container, totalPages, currentPage, onPageChange) {
    container.innerHTML = '';
    if (totalPages <= 1) return; // Không cần phân trang nếu chỉ có 1 trang

    const ul = document.createElement('ul');
    ul.className = 'pagination';

    // Nút Previous
    const prevLi = document.createElement('li');
    prevLi.className = `page-item ${currentPage === 1 ? 'disabled' : ''}`;
    prevLi.innerHTML = `<a class="page-link" href="#">Previous</a>`;
    prevLi.addEventListener('click', (e) => {
        e.preventDefault();
        if (currentPage > 1) {
            onPageChange(currentPage - 1);
        }
    });
    ul.appendChild(prevLi);

    // Các trang số
    for (let i = 1; i <= totalPages; i++) {
        const li = document.createElement('li');
        li.className = `page-item ${i === currentPage ? 'active' : ''}`;
        li.innerHTML = `<a class="page-link" href="#">${i}</a>`;
        li.addEventListener('click', (e) => {
            e.preventDefault();
            onPageChange(i);
        });
        ul.appendChild(li);
    }

    // Nút Next
    const nextLi = document.createElement('li');
    nextLi.className = `page-item ${currentPage === totalPages ? 'disabled' : ''}`;
    nextLi.innerHTML = `<a class="page-link" href="#">Next</a>`;
    nextLi.addEventListener('click', (e) => {
        e.preventDefault();
        if (currentPage < totalPages) {
            onPageChange(currentPage + 1);
        }
    });
    ul.appendChild(nextLi);

    container.appendChild(ul);
}

export async function deleteChapter(cardId, chapterNumber, button) {
    console.log('deleteChapter được gọi:', cardId, chapterNumber);
    if (confirm('Bạn có chắc chắn muốn xóa chương này?')) {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`/api/chapters?card_id=${cardId}&chapter_number=${chapterNumber}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            console.log('Phản hồi từ API /api/chapters:', response);
            if (response.ok) {
                button.closest('tr').remove();
                console.log('Chương đã được xóa thành công');
                // Cập nhật danh sách chương gốc
                originalChapters = originalChapters.filter(ch => ch.chapterNumber != chapterNumber);
                renderChapters(originalChapters, cardId);
            } else {
                const errorData = await response.json();
                console.error('Lỗi khi xóa chương:', errorData);
                throw new Error(errorData.error || 'Lỗi khi xóa chương');
            }
        } catch (error) {
            console.error('Lỗi trong deleteChapter:', error);
            alert('Lỗi khi xóa chương: ' + error.message);
        }
    }
}

export async function editChapter(cardId, chapterNumber) {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/chapters', {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Lỗi khi lấy danh sách chương');
        }
        const chapters = await response.json();
        const chapter = (chapters[cardId] || []).find(ch => ch.chapterNumber == chapterNumber);
        if (chapter) {
            // Hiển thị dữ liệu trong form sửa inline thay vì mở modal
            showEditChapterForm({
                id: chapter.id || '',
                number: chapter.chapterNumber,
                title: chapter.chapterTitle || '',
                content: chapter.content || '',
                image_folder: chapter.imageFolder || '',
                image_count: chapter.imageCount || 0
            });
        }
    } catch (error) {
        console.error('Lỗi trong editChapter:', error);
        alert('Lỗi khi chỉnh sửa chương: ' + error.message);
    }
}

export function searchChapters(cardId) {
    const searchTerm = document.getElementById('chapterSearch').value.trim().toLowerCase();
    let filteredChapters = [];

    if (searchTerm === '') {
        filteredChapters = originalChapters; // Hiển thị tất cả nếu không có từ khóa
    } else {
        // Lọc các chương khớp với từ khóa (theo chapterNumber hoặc chapterTitle)
        filteredChapters = originalChapters.filter(chapter => {
            const chapterNumber = chapter.chapterNumber.toString().toLowerCase();
            const chapterTitle = chapter.chapterTitle ? chapter.chapterTitle.toLowerCase() : '';
            return chapterNumber.includes(searchTerm) || chapterTitle.includes(searchTerm);
        });

        // Sắp xếp: các mục khớp với từ khóa lên đầu
        filteredChapters.sort((a, b) => {
            const aNumber = a.chapterNumber.toString().toLowerCase();
            const bNumber = b.chapterNumber.toString().toLowerCase();
            const aTitle = a.chapterTitle ? a.chapterTitle.toLowerCase() : '';
            const bTitle = b.chapterTitle ? b.chapterTitle.toLowerCase() : '';
            const aMatch = aNumber.includes(searchTerm) || aTitle.includes(searchTerm);
            const bMatch = bNumber.includes(searchTerm) || bTitle.includes(searchTerm);
            if (aMatch && !bMatch) return -1;
            if (!aMatch && bMatch) return 1;
            return 0;
        });
    }

    currentPage = 1; // Reset về trang đầu tiên khi tìm kiếm
    renderChapters(filteredChapters, cardId); // Hiển thị danh sách đã lọc
}

function updateChapterEditButtons() {
    const editButtons = document.querySelectorAll('.edit-chapter-btn');
    editButtons.forEach(button => {
        button.addEventListener('click', () => {
            const chapterId = button.getAttribute('data-id');
            const chapterNumber = button.getAttribute('data-number');
            const chapterTitle = button.getAttribute('data-title');
            const chapterContent = button.getAttribute('data-content');
            const chapterImageFolder = button.getAttribute('data-image-folder');
            const chapterImageCount = button.getAttribute('data-image-count');
            // Hiển thị dữ liệu trong form sửa inline
            showEditChapterForm({
                id: chapterId,
                number: chapterNumber,
                title: chapterTitle,
                content: chapterContent,
                image_folder: chapterImageFolder,
                image_count: chapterImageCount
            });
        });
    });
}

function showEditChapterForm(chapterData) {
    // Ẩn form thêm chương nếu đang hiển thị
    document.getElementById('inlineAddChapterForm').style.display = 'none';
    
    // Hiển thị form sửa
    const form = document.getElementById('inlineEditChapterForm');
    form.style.display = 'block';
    
    // Điền dữ liệu vào form
    document.getElementById('editChapterId').value = chapterData.id || '';
    document.getElementById('editChapterNumber').value = chapterData.number || '';
    document.getElementById('editChapterTitle').value = chapterData.title || '';
    document.getElementById('editChapterContent').value = chapterData.content || '';
    document.getElementById('editChapterImageFolder').value = chapterData.image_folder || '';
    document.getElementById('editChapterImageCount').value = chapterData.image_count || '';
}

// Thêm hàm hiển thị form thêm chương
function showAddChapterForm() {
    // Ẩn form sửa chương nếu đang hiển thị
    document.getElementById('inlineEditChapterForm').style.display = 'none';
    
    // Lấy ID truyện từ modal
    const comicId = document.querySelector('#chapterModal').getAttribute('data-comic-id');
    if (comicId) {
        document.getElementById('addChapterCardId').value = comicId;
    }
    
    // Tính số chương mặc định (số lớn nhất + 1)
    let defaultChapterNumber = 1;
    if (originalChapters.length > 0) {
        const chapterNumbers = originalChapters.map(ch => parseInt(ch.chapterNumber)).filter(num => !isNaN(num));
        if (chapterNumbers.length > 0) {
            defaultChapterNumber = Math.max(...chapterNumbers) + 1;
        }
    }
    
    // Điền giá trị mặc định
    document.getElementById('addChapterNumber').value = defaultChapterNumber;
    document.getElementById('addChapterTitle').value = '';
    document.getElementById('addChapterContent').value = '';
    document.getElementById('addChapterImageFolder').value = '';
    document.getElementById('addChapterImageCount').value = 0;
    
    // Hiển thị form
    document.getElementById('inlineAddChapterForm').style.display = 'block';
}

// Thêm các hàm vào window để có thể gọi từ HTML
window.showEditChapterForm = showEditChapterForm;
window.showAddChapterForm = showAddChapterForm;

// Xử lý form submit
document.addEventListener('DOMContentLoaded', function() {
    // Form thêm chương
    const addChapterForm = document.getElementById('addChapterFormInline');
    if (addChapterForm) {
        addChapterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const comicId = document.getElementById('addChapterCardId').value;
            const chapterData = {
                card_id: comicId,
                number: document.getElementById('addChapterNumber').value,
                title: document.getElementById('addChapterTitle').value,
                content: document.getElementById('addChapterContent').value,
                image_folder: document.getElementById('addChapterImageFolder').value,
                image_count: document.getElementById('addChapterImageCount').value
            };
            
            // Gửi API request
            addChapterAPI(chapterData);
        });
    }
    
    // Form sửa chương
    const editChapterForm = document.getElementById('editChapterForm');
    if (editChapterForm) {
        editChapterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const chapterId = document.getElementById('editChapterId').value;
            const chapterData = {
                number: document.getElementById('editChapterNumber').value,
                title: document.getElementById('editChapterTitle').value,
                content: document.getElementById('editChapterContent').value,
                image_folder: document.getElementById('editChapterImageFolder').value,
                image_count: document.getElementById('editChapterImageCount').value
            };
            
            // Gửi API request
            updateChapterAPI(chapterId, chapterData);
        });
    }
});

// Hàm gọi API thêm chương
async function addChapterAPI(chapterData) {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/chapters', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(chapterData)
        });
        
        if (response.ok) {
            // Thêm thành công, cập nhật danh sách và ẩn form
            alert('Thêm chương thành công!');
            document.getElementById('inlineAddChapterForm').style.display = 'none';
            // Tải lại danh sách chương
            showChapters(chapterData.card_id);
        } else {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Lỗi khi thêm chương');
        }
    } catch (error) {
        console.error('Lỗi khi thêm chương:', error);
        alert('Lỗi khi thêm chương: ' + error.message);
    }
}

// Hàm gọi API cập nhật chương
async function updateChapterAPI(chapterId, chapterData) {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`/api/chapters/${chapterId}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(chapterData)
        });
        
        if (response.ok) {
            // Cập nhật thành công, cập nhật danh sách và ẩn form
            alert('Cập nhật chương thành công!');
            document.getElementById('inlineEditChapterForm').style.display = 'none';
            // Tải lại danh sách chương
            const comicId = document.querySelector('#chapterModal').getAttribute('data-comic-id');
            showChapters(comicId);
        } else {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Lỗi khi cập nhật chương');
        }
    } catch (error) {
        console.error('Lỗi khi cập nhật chương:', error);
        alert('Lỗi khi cập nhật chương: ' + error.message);
    }
}