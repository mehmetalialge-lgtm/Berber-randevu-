const form = document.getElementById("randevuForm");
const liste = document.getElementById("randevuListesi");

let randevular = JSON.parse(localStorage.getItem("randevular")) || [];

function kaydet() {
    localStorage.setItem("randevular", JSON.stringify(randevular));
}

function listele() {
    if (!liste) return;

    liste.innerHTML = "";

    randevular.sort((a, b) =>
        (a.tarih + a.saat).localeCompare(b.tarih + b.saat)
    );

    randevular.forEach((r, index) => {
        const kart = document.createElement("div");
        kart.className = "randevu";

        kart.innerHTML = `
            <strong>${guvenli(r.isim)}</strong><br>
            📞 ${guvenli(r.telefon || "Telefon girilmedi")}<br>
            ✂️ Berber: ${guvenli(r.berber)}<br>
            📅 ${guvenli(r.tarih)}<br>
            🕒 ${guvenli(r.saat)}<br>
            💰 ${Number(r.ucret) || 0} TL
        `;

        const sil = document.createElement("button");
        sil.textContent = "Randevuyu Sil";
        sil.className = "sil";

        sil.onclick = () => {
            if (confirm("Bu randevuyu silmek istiyor musun?")) {
                randevular.splice(index, 1);
                kaydet();
                listele();
                kazancHesapla();
            }
        };

        kart.appendChild(sil);
        liste.appendChild(kart);
    });

    kazancHesapla();
}

function guvenli(metin) {
    const div = document.createElement("div");
    div.textContent = String(metin ?? "");
    return div.innerHTML;
}

if (form) {
    form.addEventListener("submit", function (e) {
        e.preventDefault();

        const isim = document.getElementById("isim").value.trim();
        const telefon = document.getElementById("telefon").value.trim();
        const berber = document.getElementById("berber").value;
        const tarih = document.getElementById("tarih").value;
        const saat = document.getElementById("saat").value;
        const ucret = Number(document.getElementById("ucret").value) || 0;

        if (!isim || !berber || !tarih || !saat) {
            alert("Lütfen gerekli alanları doldur.");
            return;
        }

        const dolu = randevular.some(r =>
            r.berber === berber &&
            r.tarih === tarih &&
            r.saat === saat
        );

        if (dolu) {
            alert("Bu berberin o saatte başka bir randevusu var!");
            return;
        }

        randevular.push({
            isim,
            telefon,
            berber,
            tarih,
            saat,
            ucret
        });

        kaydet();
        listele();
        form.reset();

        alert("Randevu başarıyla kaydedildi!");
    });
}

function kazancHesapla() {
    const alan = document.getElementById("gunlukKazanc");
    if (!alan) return;

    const bugun = new Date().toLocaleDateString("en-CA");

    const toplam = randevular
        .filter(r => r.tarih === bugun)
        .reduce((toplam, r) => toplam + (Number(r.ucret) || 0), 0);

    alan.textContent = toplam + " TL";
}

listele();