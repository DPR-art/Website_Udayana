const sectorData = {
  energi: {
    title: "Sektor Energi (kt) CO2",
    subSector: 2,
    data: [
      { name: "Minyak & Gas Bumi", displayValue: 50, realValue: 14846.26, color: "bg-blue-500" },
      { name: "Industri Batu Bara", displayValue: 11, realValue: 3381.11, color: "bg-blue-400" }
    ]
  },
  ippu: {
    title: "Sektor IPPU (kt) CO2",
    subSector: 5,
    data: [
      { name: "Lainnya", displayValue: 1, realValue: 153.93, color: "bg-purple-500" },
      { name: "Industri Non-Energi", displayValue: 10, realValue: 4552.61, color: "bg-purple-400" },
      { name: "Industri Logam", displayValue: 19, realValue: 11490.91, color: "bg-purple-300" },
      { name: "Industri Kimia", displayValue: 20, realValue: 12248.88, color: "bg-purple-400" },
      { name: "Industri Mineral", displayValue: 50, realValue: 31407.91, color: "bg-purple-600" }
    ]
  },
  pertanian: {
    title: "Sektor Pertanian (kt) CO2",
    subSector: 5,
    data: [
      { name: "Budidaya Padi", displayValue: 15, realValue: 26621.53, color: "bg-yellow-500" },
      { name: "N2O dari Tanah Dikelola", displayValue: 50, realValue: 35645.60, color: "bg-yellow-400" },
      { name: "Urea", displayValue: 8, realValue: 5642.59, color: "bg-yellow-300" },
      { name: "Pengapuran", displayValue: 3, realValue: 2140.45, color: "bg-yellow-400" },
      { name: "Pembakaran Biomassa", displayValue: 2, realValue: 1957.01, color: "bg-yellow-500" },
      { name: "Ternak", displayValue: 14, realValue: 20010.46, color: "bg-yellow-600" }
    ]
  },
  kehutanan: {
    title: "Sektor Kehutanan (kt) CO2",
    subSector: 3,
    data: [
      { name: "Kebakaran Gambut", displayValue: 10, realValue: 86154.02, color: "bg-amber-700" },
      { name: "Dekomposisi Gambut", displayValue: 50, realValue: 443402.79, color: "bg-amber-800" },
      { name: "Biomassa", displayValue: 0, realValue: -232544.40, color: "bg-amber-600" } // nilai negatif → dibikin 0
    ]
  },
  limbah: {
    title: "Sektor Limbah (kt) CO2",
    subSector: 5,
    data: [
      { name: "Limbah Cair Industri", displayValue: 50, realValue: 65522.09, color: "bg-green-500" },
      { name: "Limbah Cair Domestik", displayValue: 19, realValue: 25559.81, color: "bg-green-400" },
      { name: "Pembakaran", displayValue: 4, realValue: 5510.65, color: "bg-green-300" },
      { name: "Pengolahan Biologis", displayValue: 0, realValue: 1.04, color: "bg-green-200" },
      { name: "Limbah Padat", displayValue: 30, realValue: 39702.69, color: "bg-green-400" }
    ]
  },
  total: {
    title: "Total Emisi (kt CO₂e)",
    subSector: 5,
    data: [
      { name: "Energi", displayValue: 4, realValue: 18227.37, color: "bg-blue-500" },
      { name: "IPPU", displayValue: 10, realValue: 59854.23, color: "bg-purple-500" },
      { name: "Pertanian", displayValue: 15, realValue: 92017.65, color: "bg-yellow-500" },
      { name: "Kehutanan", displayValue: 50, realValue: 443402.79, color: "bg-amber-800" },
      { name: "Limbah", displayValue: 16, realValue: 136296.27, color: "bg-green-500" }
    ],
  }
};


 function renderChart(dataArray) {
  const container = document.getElementById('bar-container');
  container.innerHTML = '';
  const maxHeight = 320;
  const maxValue = 50;

  dataArray.forEach((item, index) => {
    const calculatedHeight = (item.displayValue / maxValue) * maxHeight;

    const barWrapper = document.createElement('div');
    barWrapper.className = 'flex flex-col items-center w-[50px] sm:w-[100px] md:w-[120px]';

    const bar = document.createElement('div');
    bar.className = `${item.color} transition-all duration-1000 ease-out relative w-full`;
    bar.style.height = '0px';

    setTimeout(() => {
      bar.style.height = `${calculatedHeight}px`;

      // Tooltip value asli
      const valueLabel = document.createElement('div');
      valueLabel.className = 'absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-semibold text-gray-700 bg-white px-1 rounded';
      valueLabel.textContent = formatNumber(item.realValue);
      bar.appendChild(valueLabel);
    }, index * 200);

    bar.addEventListener('mouseenter', function () {
      this.style.transform = 'scaleY(1.05)';
      this.style.transformOrigin = 'bottom';
      this.style.opacity = '0.8';
    });
    bar.addEventListener('mouseleave', function () {
      this.style.transform = 'scaleY(1)';
      this.style.opacity = '1';
    });

    const label = document.createElement('div');
    label.className = 'mt-4 text-center';
    label.innerHTML = `<div class="text-xs text-gray-600 h-4 font-medium">${item.name}</div>`;

    barWrapper.appendChild(bar);
    barWrapper.appendChild(label);
    container.appendChild(barWrapper);
  });
}


    function updateChart(sectorKey) {
      const sector = sectorData[sectorKey] || sectorData.limbah;
      renderChart(sector.data);

      document.querySelectorAll('.sector-btn').forEach(btn => {
        btn.classList.remove('bg-green-200', 'text-green-800', 'font-bold', 'border-2', 'border-green-400');
        btn.classList.add('bg-green-100', 'text-green-700', 'font-medium', 'border', 'border-green-300');
      });

      const activeBtn = document.querySelector(`[data-sector="${sectorKey}"]`);
      if (activeBtn) {
        activeBtn.classList.remove('bg-green-100', 'text-green-700', 'font-medium', 'border', 'border-green-300');
        activeBtn.classList.add('bg-green-200', 'text-green-800', 'font-bold', 'border-2', 'border-green-400');
      }

      const total = sector.data.reduce((sum, item) => sum + item.realValue, 0);
      document.getElementById("total-emissions").textContent = formatNumber(total);

      document.getElementById("sub-sector").textContent = sector.subSector;

      const highest = sector.data.reduce((max, item) => 
        item.realValue > max.realValue ? item : max
      );
      document.getElementById('highest-sector').textContent = highest.name;
    }

    function formatNumber(value) {
      return new Intl.NumberFormat("id-ID", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(value);
    }


    window.addEventListener('load', () => {
      renderChart(sectorData.total.data);
    });

    document.querySelectorAll('.sector-btn').forEach(btn => {
      btn.addEventListener('click', function () {
        const sector = this.getAttribute('data-sector');
        updateChart(sector);
      });
    });