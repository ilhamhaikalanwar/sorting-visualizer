// --- Fungsi Utilitas ---
function swap(arr, i, j) {
    [arr[i], arr[j]] = [arr[j], arr[i]];
}

function formatArray(arr, highlights = {}) {
    return arr.map((val, index) => {
        let className = '';
        if (highlights.min === index) { 
            className = 'highlight-min';
        } else if (highlights.pivot === index) { 
            className = 'highlight-pivot';
        } else if (highlights.swapA === index || highlights.swapB === index) { 
            className = 'highlight-swap';
        }
        return `<span class="${className}">${val}</span>`;
    }).join(', ');
}

function appendStep(containerId, description, arrayState, highlights = {}) {
    const outputDiv = document.getElementById(containerId);
    const stepDiv = document.createElement('div');
    stepDiv.className = 'step';

    const arrayHTML = formatArray(arrayState, highlights);

    stepDiv.innerHTML = `
        <strong>${description}</strong>
        <div class="array">${arrayHTML}</div>
    `;
    outputDiv.appendChild(stepDiv);
}

// --- Logika Sorting ---

// Selection Sort (Ascending)
function simulateSelectionSort(data, containerId) {
    const arr = [...data];
    const n = arr.length;
    
    appendStep(containerId, 'Data Awal', arr);
    
    for (let i = 0; i < n - 1; i++) {
        let minIndex = i;
        for (let j = i + 1; j < n; j++) {
            if (arr[j] < arr[minIndex]) {
                minIndex = j;
            }
        }
        
        if (minIndex !== i) {
            appendStep(
                containerId, 
                `Iterasi ${i + 1}: Minimum (${arr[minIndex]}) ditemukan. Tukar dengan posisi ${i} (${arr[i]}).`, 
                arr, 
                { min: minIndex, swapA: i, swapB: minIndex }
            );
            swap(arr, i, minIndex);
        } else {
             appendStep(
                containerId, 
                `Iterasi ${i + 1}: Elemen di posisi ${i} (${arr[i]}) sudah minimum. Tidak ada pertukaran.`, 
                arr, 
                { min: i }
            );
        }
    }

    appendStep(containerId, '*** DATA AKHIR TERURUT (ASCENDING) ***', arr);
}

// Quick Sort (Ascending)
function partitionAscending(arr, low, high) {
    const pivot = arr[high];
    let i = low - 1;
    for (let j = low; j < high; j++) {
        // Cari elemen yang LEBIH KECIL dari pivot
        if (arr[j] < pivot) { 
            i++;
            swap(arr, i, j);
        }
    }
    swap(arr, i + 1, high);
    return i + 1;
}

// Quick Sort (Descending - Sama seperti sebelumnya)
function partitionDescending(arr, low, high) {
    const pivot = arr[high];
    let i = low - 1;
    for (let j = low; j < high; j++) {
        // Cari elemen yang LEBIH BESAR dari pivot
        if (arr[j] > pivot) { 
            i++;
            swap(arr, i, j);
        }
    }
    swap(arr, i + 1, high);
    return i + 1;
}

// Wrapper rekursif Quick Sort untuk logging
function quickSortRecursive(arr, low, high, containerId, partitionFunc, direction) {
    if (low < high) {
        const prePartitionArr = [...arr]; 
        
        // Melakukan Partisi
        const pivotIndex = partitionFunc(arr, low, high);
        
        // Log Partisi (Hasil)
        appendStep(
            containerId, 
            `PARTISI: Pivot ${prePartitionArr[high]} membagi array [${low}-${high}] menjadi: Kiri [${low}-${pivotIndex-1}], Kanan [${pivotIndex+1}-${high}].`,
            [...arr],
            { pivot: pivotIndex }
        );

        // Rekursi
        quickSortRecursive(arr, low, pivotIndex - 1, containerId, partitionFunc, direction);
        quickSortRecursive(arr, pivotIndex + 1, high, containerId, partitionFunc, direction);
    } else if (low === high) {
         appendStep(
            containerId, 
            `Basis: Sub-array tunggal pada posisi ${low} (${arr[low]}). Sudah terurut.`, 
            arr,
            { swapA: low }
        );
    }
}

// --- Fungsi Utama (Controller) ---
function runSimulation() {
    const inputDataText = document.getElementById('input-data').value;
    const sortType = document.getElementById('sort-type-select').value;
    const outputDiv = document.getElementById('output-section');

    // 1. Parsing Input Data
    const dataArray = inputDataText
        .split(',')
        .map(s => parseInt(s.trim())) // Ubah string ke integer
        .filter(n => !isNaN(n));      // Buang nilai yang tidak valid (NaN)

    // Validasi
    if (dataArray.length === 0) {
        outputDiv.innerHTML = '<p style="color:red;">Mohon masukkan angka yang valid, dipisahkan koma.</p>';
        return;
    }

    // Kosongkan output sebelumnya
    outputDiv.innerHTML = '';
    
    let sortName = '';
    let partitionFunction = null;
    let direction = '';

    // 2. Tentukan Algoritma dan Parameter
    if (sortType === 'selection') {
        sortName = 'Selection Sort';
        direction = 'Ascending (Kecil ke Besar)';
        
        outputDiv.innerHTML += `<h2>Simulasi Selection Sort</h2><p>Data: ${dataArray.join(', ')} | Target: ${direction}</p>`;
        simulateSelectionSort(dataArray, 'output-section');
        return;

    } else if (sortType === 'quick-desc') {
        sortName = 'Quick Sort (Descending)';
        direction = 'Besar ke Kecil';
        partitionFunction = partitionDescending;

    } else if (sortType === 'quick-asc') {
        sortName = 'Quick Sort (Ascending)';
        direction = 'Kecil ke Besar';
        partitionFunction = partitionAscending;
    }

    // 3. Jalankan Quick Sort
    outputDiv.innerHTML += `<h2>Simulasi ${sortName}</h2><p>Data: ${dataArray.join(', ')} | Target: ${direction}</p>`;
    
    // Quick Sort dijalankan pada salinan dataArray
    const arrToSort = [...dataArray];
    const n = arrToSort.length;
    
    appendStep('output-section', 'Data Awal', arrToSort);
    
    quickSortRecursive(arrToSort, 0, n - 1, 'output-section', partitionFunction, direction);
    
    appendStep('output-section', `*** DATA AKHIR TERURUT (${direction.toUpperCase()}) ***`, arrToSort);
}

// Peringatan: Untuk Quick Sort, log partisi yang disajikan mungkin terlihat padat 
// karena setiap rekursi langsung dicatat.