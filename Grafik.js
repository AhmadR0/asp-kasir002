const ctx = document.getElementById('lineChart').getContext('2d');

const data = {
  labels: ['8 AM', '10 AM', '12 PM', '2 PM', '4 PM', '6 PM', '8 PM', '10 PM', '12 AM', '2 AM', '4 AM', '6 AM'],
  datasets: [
    {
      label: 'Asp 1',
      data: [100, 120, 150, 80, 280, 230, 250, 220, 120, 50, 80, 110],
      borderColor: 'blue',
      fill: false,
    },
    {
      label: 'Asp 2',
      data: [100, 90, 130, 70, 180, 160, 230, 20, 100, 40, 70, 90],
      borderColor: 'red',
      fill: false,
    },
    {
      label: 'Asp 3',
      data: [120, 140, 170, 100, 220, 200, 270, 150, 140, 70, 100, 120],
      borderColor: 'green',
      fill: false,
    },
  ]
};

const options = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    x: {
      display: true,
      title: {
        display: true,
        text: 'Waktu'
      }
    },
    y: {
      display: true,
      title: {
        display: true,
        text: 'Pendapatan'
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
  }
};

const lineChart = new Chart(ctx, {
  type: 'line',
  data: data,
  options: options
});
