document.querySelectorAll('tr').forEach(row => {
    row.addEventListener('mouseenter', () => {
        row.style.backgroundColor = '#f1f8ff';
    });
    row.addEventListener('mouseleave', () => {
        row.style.backgroundColor = 'transparent';
    });
});

console.log("Сборка для 2K гейминга загружена!");

document.addEventListener('DOMContentLoaded', () => {
    const calculate = () => {
        let pcSum = 0;
        let periSum = 0;

        document.querySelectorAll('#pc-components .price').forEach(el => {
            pcSum += parseInt(el.getAttribute('data-price')) || 0;
        });

            document.querySelectorAll('.peri-list .price').forEach(el => {
            periSum += parseInt(el.getAttribute('data-price')) || 0;
        });

        document.getElementById('pc-total').innerText = pcSum.toLocaleString() + ' грн';
        document.getElementById('peri-total').innerText = periSum.toLocaleString() + ' грн';
        document.getElementById('grand-total').innerText = (pcSum + periSum).toLocaleString() + ' грн';
    };

    calculate();
});