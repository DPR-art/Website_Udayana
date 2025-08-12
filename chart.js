const sectorData = {
      limbah: {
        title: "Sektor Limbah (kt) CO2",
        data: [
          { name: "Cair Industri", value: 46, color: "bg-green-500" },
          { name: "Cair Domestik", value: 19, color: "bg-green-400" },
          { name: "Pembakaran", value: 4, color: "bg-green-300" },
          { name: "Padat", value: 30, color: "bg-green-400" }
        ]
      },
      total: {
        title: "Sektor Limbah (kt) CO2",
        data: [
          { name: "Cair Industri", value: 50, color: "bg-green-500" },
          { name: "Cair Domestik", value: 19, color: "bg-green-400" },
          { name: "Pembakaran", value: 4, color: "bg-green-300" },
          { name: "Padat", value: 30, color: "bg-green-400" }
        ]
      },
      energi: {
        title: "Sektor Energi (kt) CO2",
        data: [
          { name: "Pembangkit Listrik", value: 35, color: "bg-blue-500" },
          { name: "Transportasi", value: 28, color: "bg-blue-400" },
          { name: "Industri", value: 22, color: "bg-blue-300" },
          { name: "Rumah Tangga", value: 15, color: "bg-blue-400" }
        ]
      },
      pertanian: {
        title: "Sektor Pertanian (kt) CO2",
        data: [
          { name: "Ternak", value: 25, color: "bg-yellow-500" },
          { name: "Sawah", value: 18, color: "bg-yellow-400" },
          { name: "Pupuk", value: 12, color: "bg-yellow-300" },
          { name: "Pembakaran", value: 8, color: "bg-yellow-400" }
        ]
      },
      kehutanan: {
        title: "Sektor Kehutanan (kt) CO2",
        data: [
          { name: "Deforestasi", value: 40, color: "bg-amber-800" },
          { name: "Degradasi", value: 22, color: "bg-amber-700" },
          { name: "Kebakaran", value: 18, color: "bg-amber-600" },
          { name: "Konversi Lahan", value: 12, color: "bg-amber-500" }
        ]
      }
    };

    function renderChart(dataArray) {
      const container = document.getElementById('bar-container');
      container.innerHTML = '';
      const maxHeight = 320;
      const maxValue = 50;

      dataArray.forEach((item, index) => {
        const calculatedHeight = (item.value / maxValue) * maxHeight;

        const barWrapper = document.createElement('div');
        barWrapper.className = 'flex flex-col items-center';
        barWrapper.classList.add('w-[50px]', 'sm:w-[100px]', 'md:w-[120px]');

        const bar = document.createElement('div');
        bar.className = `${item.color} transition-all duration-1000 ease-out`;
        bar.setAttribute('data-height', item.value);
        bar.style.height = '0px';
        bar.classList.add('w-full');
        bar.style.position = 'relative';

        setTimeout(() => {
          bar.style.height = `${calculatedHeight}px`;
          const valueLabel = document.createElement('div');
          valueLabel.className = 'absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-semibold text-gray-700 bg-white px-1 rounded';
          valueLabel.textContent = item.value;
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

      const total = sector.data.reduce((sum, item) => sum + item.value, 0);
      document.getElementById('total-emissions').textContent = total;

      const highest = sector.data.reduce((max, item) => item.value > max.value ? item : max);
      document.getElementById('highest-sector').textContent = highest.name;
    }

    window.addEventListener('load', () => {
      renderChart(sectorData.limbah.data);
    });

    document.querySelectorAll('.sector-btn').forEach(btn => {
      btn.addEventListener('click', function () {
        const sector = this.getAttribute('data-sector');
        updateChart(sector);
      });
    });