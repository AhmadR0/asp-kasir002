// Ambil referensi ke elemen <canvas> dan tentukan konteksnya
const ctx = document.getElementById('lineChart').getContext('2d');

// Data untuk grafik garis
const data = {
  // Jarak antar label 2 jam (12 data dalam sehari)
  labels: ['8 AM', '10 AM', '12 PM', '2 PM', '4 PM', '6 PM', '8 PM', '10 PM', '12 AM', '2 AM', '4 AM', '6 AM'],
  datasets: [{
    label: 'Pendapatan Penjualan',
    data: [100, 120, 150, 80, 200, 180, 250, 220, 120, 50, 80, 110],
    borderColor: 'blue',
    fill: false,
  }]
};

// Konfigurasi opsi grafik
const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: 'Waktu',
          position: 'bottom' // Keterangan label sumbu x diletakkan di bawah grafik
        }
      },
      y: {
        display: true,
        title: {
          display: true,
          text: 'Pendapatan',
          position: 'left' // Keterangan label sumbu y diletakkan di kiri grafik
        }
      }
    },
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
        labels: {
          boxWidth: 10,
          padding: 10,
          usePointStyle: true,
          generateLabels: function (chart) {
            const data = chart.data;
            if (data.labels.length && data.datasets.length) {
              return data.datasets.map((dataset, i) => ({
                text: dataset.label,
                fillStyle: dataset.borderColor,
                hidden: !chart.isDatasetVisible(i),
                lineCap: 'round',
                lineDash: dataset.borderDash,
                lineDashOffset: dataset.borderDashOffset,
                lineJoin: 'round',
                lineWidth: dataset.borderWidth,
                strokeStyle: dataset.borderColor,
                pointStyle: 'line',
              }));
            }
            return [];
          },
        },
      },
      // Add other custom plugins here
    }
  };
  
  // Buat objek grafik dengan menggunakan data dan opsi
  const lineChart = new Chart(ctx, {
    type: 'line',
    data: data,
    options: options
  });
  