document.addEventListener('DOMContentLoaded', () => {
    const kaomojis = document.querySelectorAll('.kaomoji');
    const toast = document.getElementById('toast');

    kaomojis.forEach(item => {
        item.addEventListener('click', () => {
            const text = item.innerText;
            navigator.clipboard.writeText(text).then(() => {
                showToast();
            }).catch(err => {
                console.error('Ошибка копирования:', err);
            });
        });
    });

    function showToast() {
        toast.style.display = 'block';
        setTimeout(() => {
            toast.style.display = 'none';
        }, 2000);
    }
});