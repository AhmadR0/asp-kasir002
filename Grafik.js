const ctx = document.getElementById('lineChart').getContext('2d');

const data = {
  labels: ['8 AM', '10 AM', '12 PM', '2 PM', '4 PM', '6 PM', '8 PM', '10 PM', '12 AM'],
  datasets: [
    {
      label: 'Asp 1',
      data: [100, 120, 150, 80, 280, 230, 250, 220, 120],
      borderColor: 'blue',
      fill: false,
    },
    {
      label: 'Asp 2',
      data: [100, 90, 130, 70, 180, 160, 230, 70, 90],
      borderColor: 'red',
      fill: false,
    },
    {
      label: 'Asp 3',
      data: [120, 140, 170, 100, 150, 140, 70, 100, 120],
      borderColor: 'green',
      fill: false,
    },
    {
      label: 'Asp 4',
      data: [60, 270, 200, 70, 60, 90, 200, 180, 160],
      borderColor: 'yellow',
      fill: false,
    },
    {
      label: 'Asp 5',
      data: [200, 120, 40, 170, 100, 190, 250, 200, 10],
      borderColor: 'black',
      fill: false,
    }
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

const monthlyIncomeCtx = document.getElementById('monthlyIncomeChart').getContext('2d');

const monthlyIncomeData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
        {
            label: 'Asp 1',
            data: [5000, 6000, 5500, 7000, 8000, 7500, 9000, 9500, 8200, 7000, 6500, 6800],
            borderColor: 'orange',
            fill: false,
          },
          {
            label: 'Asp 2',
            data: [6000, 5000, 4500, 6500, 7500, 7000, 8000, 8500, 7300, 6000, 5500, 5800],
            borderColor: 'purple',
            fill: false,
          },
    ]
  };
  

const monthlyIncomeOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    x: {
      display: true,
      title: {
        display: true,
        text: 'Bulan'
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

const monthlyIncomeChart = new Chart(monthlyIncomeCtx, {
  type: 'line',
  data: monthlyIncomeData,
  options: monthlyIncomeOptions
});

const ctxTahunan = document.getElementById('laporanTahunan').getContext('2d');

const dataTahunan = {
  labels: ['2023', '2024', '2025', '2026', '2027'],
  datasets: [
    {
      label: 'Pendapatan 2023-2027',
      data: [100, null, null, null, null], // Data hanya ada untuk tahun 2023, tahun-tahun berikutnya diatur menjadi null
      borderColor: 'blue',
      fill: false,
    },
  ]
};

const optionsTahunan = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    x: {
      display: true,
      title: {
        display: true,
        text: 'Tahun'
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

const laporanTahunan = new Chart(ctxTahunan, {
  type: 'line',
  data: dataTahunan,
  options: optionsTahunan
});
