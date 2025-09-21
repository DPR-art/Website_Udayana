document.addEventListener("DOMContentLoaded", () => {
  let selectedTransport = null;
  let selectedFuel = null;

  const transportOptions = ["Mobil", "motor", "bus"];
  const fuelOptions = ["listrik", "bensin", "solar"];

  const hasilOutput = document.querySelector(".hasil");
  const dampakOutput = document.querySelector(".dampak");
  const inputJarak = document.querySelector("input");
  const hitungButton = document.querySelector("#hitung");

  function highlightSelected(optionList, selectedId) {
    optionList.forEach((id) => {
      const el = document.getElementById(id);
      if (el) {
        el.classList.toggle("ring-4", id === selectedId);
        el.classList.toggle("ring-[#B6F500]", id === selectedId);
      }
    });
  }

  transportOptions.forEach((id) => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener("click", () => {
        selectedTransport = id.toLowerCase();
        highlightSelected(transportOptions, id);
      });
    }
  });

  fuelOptions.forEach((id) => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener("click", () => {
        selectedFuel = id.toLowerCase();
        highlightSelected(fuelOptions, id);
      });
    }
  });

  const emisiData = {
    mobil: { bensin: 0.21, solar: 0.25, listrik: 0.05 },
    motor: { bensin: 0.10, solar: 0.12, listrik: 0.03 },
    bus:   { bensin: 0.30, solar: 0.35, listrik: 0.10 },
  };

  function getDampak(total, fuel) {
    if (total < 1) {
      if (fuel === "listrik") {
        return `
          Sangat Rendah – Kendaraan listrik dengan jarak sangat pendek hampir tidak menimbulkan emisi langsung. 
          <br><b>Manfaat:</b> Sangat ramah lingkungan, kualitas udara di sekitar tetap bersih, serta membantu menurunkan jejak karbon secara signifikan. 
          <br><b>Kerugian:</b> Walau hampir nol, emisi tidak langsung tetap muncul jika sumber listrik masih dari pembangkit berbahan fosil seperti batu bara.
        `;
      } else if (fuel === "bensin") {
        return `
          Sangat Rendah – Jarak pendek dengan bensin menghasilkan emisi kecil, namun tetap ada gas CO₂ dari proses pembakaran. 
          <br><b>Manfaat:</b> Praktis, cepat, dan mudah digunakan untuk mobilitas sehari-hari. 
          <br><b>Kerugian:</b> Meski jumlahnya minim, akumulasi emisi dari penggunaan berulang tetap berkontribusi pada polusi udara.
        `;
      } else if (fuel === "solar") {
        return `
          Sangat Rendah – Kendaraan berbahan bakar solar dengan jarak singkat hanya sedikit menambah emisi. 
          <br><b>Manfaat:</b> Efisien untuk kendaraan besar meskipun dipakai jarak pendek. 
          <br><b>Kerugian:</b> Tetap ada polusi partikulat (asap hitam) yang dapat memengaruhi kualitas udara lokal.
        `;
      }
    } else if (total < 5) {
      if (fuel === "listrik") {
        return `
          Rendah – Kendaraan listrik tetap menghasilkan emisi rendah, terutama jika listrik berasal dari energi terbarukan. 
          <br><b>Manfaat:</b> Lebih bersih dibanding kendaraan bensin/solar, mendukung gaya hidup ramah lingkungan. 
          <br><b>Kerugian:</b> Jika listrik masih berbasis fosil, maka emisi tidak bisa dihindari sepenuhnya.
        `;
      } else if (fuel === "bensin") {
        return `
          Rendah – Kendaraan bensin pada jarak ini masih tergolong efisien, tapi tetap memberi jejak karbon. 
          <br><b>Manfaat:</b> Memberi kenyamanan, fleksibilitas, dan mudah diakses oleh masyarakat luas. 
          <br><b>Kerugian:</b> Walau kecil, emisi CO₂ akan menumpuk bila penggunaan dilakukan berulang kali.
        `;
      } else if (fuel === "solar") {
        return `
          Rendah – Kendaraan solar relatif hemat namun tetap menghasilkan polusi khas. 
          <br><b>Manfaat:</b> Cocok untuk angkutan penumpang atau barang dalam skala lebih besar. 
          <br><b>Kerugian:</b> Asap hitam dari solar dapat berdampak buruk bagi kesehatan pernapasan masyarakat.
        `;
      }
    } else if (total < 15) {
      if (fuel === "listrik") {
        return `
          Sedang – Kendaraan listrik pada level ini mulai menambah emisi lebih banyak, terutama bila digunakan intensif. 
          <br><b>Manfaat:</b> Tetap lebih ramah lingkungan dibanding kendaraan fosil dan mendukung pengurangan polusi perkotaan. 
          <br><b>Kerugian:</b> Jejak karbon tetap ada, terutama bila sumber listrik masih berasal dari energi tak terbarukan.
        `;
      } else if (fuel === "bensin") {
        return `
          Sedang – Emisi bensin semakin terasa dan nyata pada jarak ini. 
          <br><b>Manfaat:</b> Memberi mobilitas cepat, nyaman, dan fleksibel. 
          <br><b>Kerugian:</b> Kontribusi signifikan pada polusi udara, memperburuk efek rumah kaca, serta mengganggu kualitas kesehatan.
        `;
      } else if (fuel === "solar") {
        return `
          Sedang – Kendaraan solar menghasilkan emisi dan polusi yang cukup mengganggu. 
          <br><b>Manfaat:</b> Efektif untuk mengangkut penumpang atau logistik dalam jumlah besar. 
          <br><b>Kerugian:</b> Peningkatan asap hitam dan gas rumah kaca memperburuk kualitas udara di daerah padat.
        `;
      }
    } else if (total < 30) {
      if (fuel === "listrik") {
        return `
          Tinggi – Kendaraan listrik dalam pemakaian jarak jauh menghasilkan emisi signifikan. 
          <br><b>Manfaat:</b> Kapasitas angkut besar dan tetap lebih bersih dibanding bahan bakar fosil. 
          <br><b>Kerugian:</b> Jika sumber listrik dominan fosil, dampaknya tetap besar terhadap perubahan iklim.
        `;
      } else if (fuel === "bensin") {
        return `
          Tinggi – Emisi dari bensin cukup besar dan berdampak nyata pada lingkungan. 
          <br><b>Manfaat:</b> Nyaman digunakan untuk perjalanan jauh, fleksibel, dan cepat. 
          <br><b>Kerugian:</b> Memburuknya kualitas udara, risiko kesehatan meningkat, serta kontribusi besar pada pemanasan global.
        `;
      } else if (fuel === "solar") {
        return `
          Tinggi – Solar pada level ini berdampak serius pada lingkungan. 
          <br><b>Manfaat:</b> Penting untuk transportasi massal atau logistik jarak jauh. 
          <br><b>Kerugian:</b> Asap hitam pekat dan gas rumah kaca memperparah polusi udara dan iklim.
        `;
      }
    } else {
      if (fuel === "listrik") {
        return `
          Sangat Tinggi – Kendaraan listrik dengan konsumsi sangat besar tetap memberi dampak signifikan. 
          <br><b>Manfaat:</b> Mendukung mobilitas skala luas dengan lebih bersih dibanding fosil. 
          <br><b>Kerugian:</b> Jika listrik masih fosil, emisi besar dapat memperburuk krisis iklim global.
        `;
      } else if (fuel === "bensin") {
        return `
          Sangat Tinggi – Kendaraan bensin menghasilkan emisi dalam jumlah sangat besar. 
          <br><b>Manfaat:</b> Mobilitas cepat dan luas, cocok untuk berbagai kebutuhan transportasi. 
          <br><b>Kerugian:</b> Dampak lingkungan sangat besar, meningkatkan pemanasan global, polusi udara, dan risiko kesehatan serius.
        `;
      } else if (fuel === "solar") {
        return `
          Sangat Tinggi – Kendaraan solar adalah salah satu penyumbang polusi terburuk di level ini. 
          <br><b>Manfaat:</b> Efektif untuk transportasi massal dan logistik berat dalam skala besar. 
          <br><b>Kerugian:</b> Emisi gas rumah kaca, asap hitam, dan polusi udara yang parah merusak kesehatan dan memperparah perubahan iklim.
        `;
      }
    }
  }



  hitungButton.addEventListener("click", () => {
    const jarak = parseFloat(inputJarak.value);

    if (!selectedTransport || !selectedFuel || isNaN(jarak) || jarak <= 0) {
      alert("Pastikan semua pilihan dan jarak tempuh (positif) telah diisi!");
      return;
    }

    const faktor = emisiData[selectedTransport]?.[selectedFuel];
    if (faktor === undefined) {
      hasilOutput.textContent = "Data emisi tidak ditemukan.";
      dampakOutput.innerHTML = "";
      return;
    }

    const total = jarak * faktor;
    hasilOutput.textContent = `${total.toFixed(2)} kg CO₂`;
    dampakOutput.innerHTML = getDampak(total, selectedFuel);
  });
});
