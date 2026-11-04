const tickets = ["https://apps.ticketmatic.com/widgets/theaterhotel_de_oranjerie/addtickets?event=12790&skinid=10004&flow=return&returnurl=https%3A%2F%2Fwww.theaterroermond.nl%2Fticketmatic%3Fevent%3D12790&l=nl&accesskey=ca94b7b885326c32b2a66b38&signature=0a3dfd13b96761f6a3cb27258baddc53010ebdf8ad7315afe9c854a5d24be5c3", "https://apps.ticketmatic.com/widgets/theaterhotel_de_oranjerie/addtickets?event=12791&skinid=10004&flow=return&returnurl=https%3A%2F%2Fwww.theaterroermond.nl%2Fticketmatic%3Fevent%3D12791&l=nl&accesskey=ca94b7b885326c32b2a66b38&signature=daa3cbda6772cc6fed70fc61e49a3d4f85769185745c08e613bf6544e7f43e20"];
const shared = [
 ['19.30', '', 'Kolsche dans op de plenk.'],
 ['20.00', 'Berry Knapen', 'Al veur het 17e jaor te gas bie Lachenderwies.'],
 ['20.20', '', ''],
 ['20.35', 'Maikel Sonnemans', 'Buut oet Herte.'],
 ['21.00', 'Poos', 'Tied veur ein pauzedrenkske.'],
 ['21.30', '', ''],
 ['21.50', '', ''],
 ['22.10', 'Träcksäck', 'Tren van Enkevort (Rowwen Hèze) en Bart Storcken, laif mit de Big Band van Hub Boesten.'],
 ['22.40', 'Vastelaovend in Remunj', 'Mit koor en orkes o.l.v. Hub Boesten.'],
 ['Nao aafloup', 'Afterparty', 'Laif meziek nao het pregram.']
];
function showDay(day) {
 const friday = day === 'friday';
 const rows = shared.map(row => [...row]);
 rows[0][1] = friday ? 'Tanzgruppe Kölsche Greesberger' : 'Tanzcorps die Fifos';
 rows[2][1] = friday ? 'Josef-Emil Blokwurst' : 'De Aadprinse van D’n Uul';
 rows[2][2] = friday ? 'Komieke goochelaer.' : 'Op de zaoterdaagaovend.';
 rows[5][1] = friday ? 'Twan van Oers' : 'Oma Parksjtad';
 rows[6][1] = friday ? 'Erik Mulder' : 'Andy Marcelissen';
 const list = document.getElementById('lineup'); list.replaceChildren();
 for (const [time, name, description] of rows) {
  const li=document.createElement('li');if(time==='21.00')li.className='pause';
  const clock=document.createElement('time');clock.textContent=time;
  if(/^\d{2}\.\d{2}$/.test(time))clock.dateTime=`2027-01-${friday?'15':'16'}T${time.replace('.',':')}:00+01:00`;
  const body=document.createElement('div'),heading=document.createElement('h4'),text=document.createElement('p');
  heading.textContent=name;text.textContent=description;body.append(heading);if(description)body.append(text);li.append(clock,body);list.append(li);
 }
 document.getElementById('day-title').textContent=friday?'Vriedaag 15 januari.':'Zaoterdaag 16 januari.';
 const link=document.getElementById('program-ticket');link.textContent=friday?'Kaarte veur vriedaag ↗':'Kaarte veur zaoterdaag ↗';link.href=tickets[friday?0:1];
 for(const id of ['friday','saturday']){const button=document.getElementById(id);button.setAttribute('aria-pressed',String(id===day));button.classList.toggle('selected',id===day);}
}
document.getElementById('friday-ticket').href=tickets[0];
document.getElementById('saturday-ticket').href=tickets[1];
for(const day of ['friday','saturday'])document.getElementById(day).addEventListener('click',()=>showDay(day));
showDay('friday');


// Local archive photos: no external image requests or paid services.
const heroPhotos = [
 {file:'buut-podium.jpg', title:'BUUT OP DE PLENK', year:2022, alt:'Een buutereedner in een rood jasje wijst lachend het publiek in, tijdens Lachenderwies 2022.'},
 {file:'buut-kostuum.jpg', title:'DE BUUT', year:2023, alt:'Een buutereedner in kleurrijk kostuum aan de microfoon, Lachenderwies 2023.'},
 {file:'dansgroep.jpg', title:'DE DANS', year:2022, alt:'Een dansgroep in rode kostuums op het podium tijdens Lachenderwies 2022.'},
 {file:'show.jpg', title:'DE SHOW', year:2022, alt:'Showdans onder gekleurde podiumlichten tijdens Lachenderwies 2022.'},
 {file:'buut-zonnebril.jpg', title:'AAN DE MICROFOON', year:2023, alt:'Een buutereedner met zonnebril aan de microfoon tijdens Lachenderwies 2023.'},
 {file:'theaterzaal.jpg', title:'IN DE ORANJERIE', year:2023, alt:'Een breed zicht op de verlichte theaterzaal en het podium van Lachenderwies 2023.'},
 {file:'acrobatiek.jpg', title:'HOOG BOVEN DE PLENK', year:2023, alt:'Een acrobatische danser boven de dansgroep op het podium tijdens Lachenderwies 2023.'},
 {file:'buut-hoed.jpg', title:'IN DE BUUT', year:2023, alt:'Een buutereedner met hoed, bril en blauw jasje aan de microfoon tijdens Lachenderwies 2023.'}
];
const heroImage = document.querySelector('.poster-image img');
const pauseButton = document.getElementById('hero-pause');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let photoIndex = 0, photoTimer, photoRequest = 0, paused = reducedMotion.matches;
function updatePauseButton() {
 pauseButton.textContent = paused ? 'Afspelen' : 'Pauzeer';
 pauseButton.setAttribute('aria-pressed', String(paused));
}
async function showPhoto(index) {
 const request = ++photoRequest;
 const nextIndex = (index + heroPhotos.length) % heroPhotos.length;
 const photo = heroPhotos[nextIndex];
 const preload = new Image(); preload.src = '/assets/' + photo.file;
 try { await preload.decode(); } catch { return; }
 if (request !== photoRequest) return;
 photoIndex = nextIndex;
 heroImage.src = preload.src; heroImage.alt = photo.alt;
 document.getElementById('hero-count').textContent = (photoIndex + 1) + ' / ' + heroPhotos.length;
}
function schedulePhotos() {
 clearInterval(photoTimer);
 if (!paused && !document.hidden) photoTimer = setInterval(() => showPhoto(photoIndex + 1), 6000);
}
for (const [id, step] of [['hero-prev', -1], ['hero-next', 1]]) {
 document.getElementById(id).addEventListener('click', () => { showPhoto(photoIndex + step); schedulePhotos(); });
}
pauseButton.addEventListener('click', () => { paused = !paused; updatePauseButton(); schedulePhotos(); });
document.addEventListener('visibilitychange', schedulePhotos);
reducedMotion.addEventListener('change', () => { paused = reducedMotion.matches; updatePauseButton(); schedulePhotos(); });
document.querySelector('.hero-controls').hidden = false;
updatePauseButton(); schedulePhotos();
