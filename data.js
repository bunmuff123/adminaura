/* ===================== PinkAura Admin — shared data layer =====================
   Semua halaman (dashboard, input-barang, view-barang, laporan-*) memuat file
   ini supaya data produk & aktivitas konsisten walau berpindah halaman.
   Data disimpan di localStorage (bertahan di browser yang sama).
================================================================================ */

const STORAGE_KEY  = 'pinkaura_products';
const ACTIVITY_KEY = 'pinkaura_activity';
const AUTH_KEY      = 'pinkaura_auth';

function seedIfEmpty(){
  if(!localStorage.getItem(STORAGE_KEY)){
    const initial = [
      {id:1, nama:"Dress Midi Aura", kategori:"Dress", harga:249000, stok:18, terjual:238, icon:"👗"},
      {id:2, nama:"Outer Blazer Plum", kategori:"Outer / Jaket", harga:319000, stok:9, terjual:301, icon:"🧥"},
      {id:3, nama:"Rok Plisket Elegan", kategori:"Bawahan", harga:159000, stok:32, terjual:120, icon:"👘"},
      {id:4, nama:"Blouse Satin Cream", kategori:"Atasan", harga:189000, stok:5, terjual:87, icon:"👚"},
      {id:5, nama:"Gaun Pesta Merah", kategori:"Dress", harga:459000, stok:4, terjual:64, icon:"👗"},
    ];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
  }
  if(!localStorage.getItem(ACTIVITY_KEY)){
    const initialActivity = [
      {text:"Admin login ke sistem", tag:"Login"},
      {text:"Stok 'Blouse Satin Cream' hampir habis", tag:"Peringatan"},
      {text:"Produk 'Outer Blazer Plum' terjual 3 unit", tag:"Penjualan"},
    ];
    localStorage.setItem(ACTIVITY_KEY, JSON.stringify(initialActivity));
  }
}

function getProducts(){ seedIfEmpty(); return JSON.parse(localStorage.getItem(STORAGE_KEY)); }
function saveProducts(arr){ localStorage.setItem(STORAGE_KEY, JSON.stringify(arr)); }
function nextProductId(){ const p = getProducts(); return p.length ? Math.max(...p.map(x=>x.id))+1 : 1; }

function getActivity(){ seedIfEmpty(); return JSON.parse(localStorage.getItem(ACTIVITY_KEY)); }
function logActivity(text, tag){
  const act = getActivity();
  act.unshift({text, tag});
  localStorage.setItem(ACTIVITY_KEY, JSON.stringify(act.slice(0,12)));
}

function rupiah(n){ return 'Rp ' + Number(n).toLocaleString('id-ID'); }

/* ---------- data laporan (contoh statis, bisa disambungkan ke transaksi asli nanti) ---------- */
const laporanData = {
  harian: {labels:["Sen","Sel","Rab","Kam","Jum","Sab","Min"], values:[820000,1040000,760000,1290000,1510000,1980000,1120000]},
  bulan:  {labels:["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Agu"], values:[18200000,21400000,19800000,24500000,27100000,25300000,29800000,22600000]},
  tahun:  {labels:["2021","2022","2023","2024","2025"], values:[142000000,178000000,205000000,241000000,268000000]},
};

/* ---------- auth ---------- */
function isLoggedIn(){ return sessionStorage.getItem(AUTH_KEY) === '1'; }
function requireAuth(){ if(!isLoggedIn()){ window.location.href = 'index.html'; } }
function attemptLogin(u, p){
  if(u === 'admin' && p === 'admin123'){
    sessionStorage.setItem(AUTH_KEY, '1');
    return true;
  }
  return false;
}
function doLogout(){
  sessionStorage.removeItem(AUTH_KEY);
  window.location.href = 'index.html';
}

/* ---------- toast ---------- */
let toastTimer;
function showToast(msg){
  const t = document.getElementById('toast');
  if(!t) return;
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(()=>t.classList.remove('show'), 2600);
}

/* ---------- animated counters (dashboard) ---------- */
function animateCount(el, target, isCurrency){
  const duration = 700;
  const t0 = performance.now();
  function step(t){
    const progress = Math.min((t - t0) / duration, 1);
    const val = Math.floor(progress * target);
    el.textContent = isCurrency ? rupiah(val) : val.toLocaleString('id-ID');
    if(progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}
