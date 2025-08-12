document.addEventListener("DOMContentLoaded", () => {
  let selectedTransport = null;
  let selectedFuel = null;

  const transportOptions = ["Mobil", "motor", "bus"];
  const fuelOptions = ["listrik", "bensin", "solar"];

  const hasilOutput = document.querySelector(".hasil");
  const dampakOutput = document.querySelector(".dampak");
  const inputJarak = document.querySelector("input");
  const hitungButton = document.querySelector("button");

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

  function getDampak(total) {
    if (total < 1) {
      return `
        Sangat Rendah – Transportasi sangat ramah lingkungan.
        <br><b>Manfaat:</b> Emisi minim, membantu memperlambat pemanasan global, kualitas udara terjaga.
        <br><b>Kerugian:</b> Mungkin membutuhkan biaya awal tinggi (misal: kendaraan listrik).
      `;
    } else if (total < 5) {
      return `
        Rendah – Dampak terhadap lingkungan masih terkendali.
        <br><b>Manfaat:</b> Kontribusi positif dalam pengurangan jejak karbon, efisiensi bahan bakar.
        <br><b>Kerugian:</b> Masih menghasilkan emisi walau kecil, bisa bertambah jika penggunaan sering.
      `;
    } else if (total < 15) {
      return `
        Sedang – Perlu mempertimbangkan opsi yang lebih ramah lingkungan.
        <br><b>Manfaat:</b> Akses transportasi mudah, cepat, dan nyaman.
        <br><b>Kerugian:</b> Berkontribusi pada polusi udara dan peningkatan efek rumah kaca.
      `;
    } else if (total < 30) {
      return `
        Tinggi – Emisi yang dihasilkan cukup besar.
        <br><b>Manfaat:</b> Cocok untuk jarak jauh dan kenyamanan.
        <br><b>Kerugian:</b> Memburuknya kualitas udara, risiko gangguan kesehatan, kontribusi besar ke perubahan iklim.
      `;
    } else {
      return `
        Sangat Tinggi – Dampak lingkungan signifikan.
        <br><b>Manfaat:</b> Kemudahan mobilitas tinggi.
        <br><b>Kerugian:</b> Pemanasan global, peningkatan bencana iklim, membebani kesehatan masyarakat dan ekosistem.
      `;
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
    dampakOutput.innerHTML = getDampak(total);
  });
});
